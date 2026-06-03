import { supabase } from './supabase'

export async function vincularTarjeta(userId: string, numeroTarjeta: string) {
  const { data, error } = await supabase
    .from('tarjetas')
    .insert({
      user_id: userId,
      numero: numeroTarjeta,
      activa: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getTarjetas(userId: string) {
  const { data, error } = await supabase
    .from('tarjetas')
    .select('*')
    .eq('user_id', userId)
    .eq('activa', true)

  if (error) throw error
  return data
}

export async function consultarSaldo(tarjetaId: number) {
  const { data, error } = await supabase
    .from('tarjetas')
    .select('saldo')
    .eq('id', tarjetaId)
    .single()

  if (error) throw error
  return data.saldo
}