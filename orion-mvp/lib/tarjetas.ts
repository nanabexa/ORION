import { supabase } from './supabase';

export const vincularTarjeta = async (usuarioId: string, numeroTarjeta: string) => {
  const { data, error } = await supabase
    .from('tarjetas')
    .insert({
      usuario_id: usuarioId,
      numero_tarjeta: numeroTarjeta,
      saldo: 0,
      activa: true
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getTarjetas = async (usuarioId: string) => {
  const { data, error } = await supabase
    .from('tarjetas')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('activa', true);

  if (error) throw error;
  return data;
};

export const consultarSaldo = async (tarjetaId: string) => {
  const { data, error } = await supabase
    .from('tarjetas')
    .select('saldo, numero_tarjeta')
    .eq('id', tarjetaId)
    .single();

  if (error) throw error;
  return data;
};