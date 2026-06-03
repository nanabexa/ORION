import { supabase } from './supabase'

export async function crearRecarga(tarjetaId: number, monto: number) {
  const { data, error } = await supabase
    .from('recargas')
    .insert({
      tarjeta_id: tarjetaId,
      monto,
      estado: 'PENDIENTE',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function aprobarRecarga(recargaId: number) {
  const { data: recarga, error: fetchError } = await supabase
    .from('recargas')
    .select('tarjeta_id, monto')
    .eq('id', recargaId)
    .single()

  if (fetchError) throw fetchError

  const { error: recargaError } = await supabase
    .from('recargas')
    .update({ estado: 'APROBADA' })
    .eq('id', recargaId)

  if (recargaError) throw recargaError

  const { error: saldoError } = await supabase.rpc('sumar_saldo', {
    p_tarjeta_id: recarga.tarjeta_id,
    p_monto: recarga.monto,
  })

  if (saldoError) throw saldoError
}

export async function sincronizarRecarga(recargaId: number) {
  const { error } = await supabase
    .from('recargas')
    .update({ estado: 'SINCRONIZADA' })
    .eq('id', recargaId)

  if (error) throw error
}

export async function rechazarRecarga(recargaId: number) {
  const { error } = await supabase
    .from('recargas')
    .update({ estado: 'RECHAZADA' })
    .eq('id', recargaId)

  if (error) throw error
}