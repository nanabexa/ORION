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

  const { data: tarjetaData } = await supabase
    .from('tarjetas')
    .select('saldo')
    .eq('id', tarjetaId)
    .maybeSingle();

  await supabase
    .from('tarjetas')
    .update({ saldo: (tarjetaData?.saldo ?? 0) + monto })
    .eq('id', tarjetaId);

  const { data: final, error: errorFinal } = await supabase
    .from('recargas')
    .update({ estado: 'SINCRONIZADA' })
    .eq('id', recarga.id)
    .select()
    .maybeSingle();

  if (errorFinal) throw errorFinal;
  return final;
};