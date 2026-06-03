import { supabase } from './supabase';

export const procesarRecarga = async (
  usuarioId: string,
  tarjetaId: string,
  monto: number,
  metodoPago: string
) => {

  // 1. Insertar con estado PENDIENTE
  const { data: recarga, error: errorInsert } = await supabase
    .from('recargas')
    .insert({
      usuario_id: usuarioId,
      tarjeta_id: tarjetaId,
      monto,
      metodo_pago: metodoPago,
      estado: 'PENDIENTE'
    })
    .select()
    .single();

  if (errorInsert) throw errorInsert;

  // 2. Simular aprobación del banco (2 segundos)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 3. Actualizar a APROBADA
  await supabase
    .from('recargas')
    .update({ estado: 'APROBADA' })
    .eq('id', recarga.id);

  // 4. Sumar saldo a la tarjeta
  const { data: tarjeta } = await supabase
    .from('tarjetas')
    .select('saldo')
    .eq('id', tarjetaId)
    .single();

  await supabase
    .from('tarjetas')
    .update({ saldo: (tarjeta?.saldo ?? 0) + monto })
    .eq('id', tarjetaId);

  // 5. Actualizar a SINCRONIZADA
  const { data: final, error: errorFinal } = await supabase
    .from('recargas')
    .update({ estado: 'SINCRONIZADA' })
    .eq('id', recarga.id)
    .select()
    .single();

  if (errorFinal) throw errorFinal;
  return final;
};