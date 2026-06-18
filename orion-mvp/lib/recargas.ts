import { supabase } from './supabase';

export const procesarRecarga = async (
  usuarioId: string,
  tarjetaId: string,
  monto: number,
  metodoPago: string
) => {

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
    .maybeSingle();

  if (errorInsert) throw errorInsert;
  if (!recarga) throw new Error('No se pudo crear la recarga');

  await new Promise(resolve => setTimeout(resolve, 2000));

  await supabase
    .from('recargas')
    .update({ estado: 'APROBADA' })
    .eq('id', recarga.id);

  // Obtener el número de tarjeta desde la relación usuario-tarjeta
  const { data: tarjetaRelacion } = await supabase
    .from('tarjetas')
    .select('numero_tarjeta')
    .eq('id', tarjetaId)
    .maybeSingle();

  if (!tarjetaRelacion) throw new Error('No se encontró la tarjeta');

  // Actualizar el saldo REAL en tarjetas_validas (saldo compartido)
  const { data: tarjetaValida } = await supabase
    .from('tarjetas_validas')
    .select('saldo')
    .eq('numero', tarjetaRelacion.numero_tarjeta)
    .maybeSingle();

  await supabase
    .from('tarjetas_validas')
    .update({ saldo: (tarjetaValida?.saldo ?? 0) + monto })
    .eq('numero', tarjetaRelacion.numero_tarjeta);

  const { data: final, error: errorFinal } = await supabase
    .from('recargas')
    .update({ estado: 'SINCRONIZADA' })
    .eq('id', recarga.id)
    .select()
    .maybeSingle();

  if (errorFinal) throw errorFinal;
  return final;
};