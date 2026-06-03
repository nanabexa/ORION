import { supabase } from './supabase';

export const simularPago = async (monto: number, metodo: string) => {
  // Reglas del simulador MVP
  if (monto <= 0) {
    return { aprobado: false, mensaje: 'Monto inválido', transaccionId: '' };
  }

  if (monto > 100) {
    return { aprobado: false, mensaje: 'Límite MVP excedido', transaccionId: '' };
  }

  // Simular delay del banco (2 segundos)
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    aprobado: true,
    mensaje: 'Pago aprobado',
    transaccionId: crypto.randomUUID()
  };
};