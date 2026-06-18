import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const RUTAS_PUBLICAS = ['index', 'registro', 'recuperar', 'reset-password'];

export default function Layout() {
  const router = useRouter();
  const segments = useSegments();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const rutaActual = segments[segments.length - 1] || 'index';
      const esRutaPublica = RUTAS_PUBLICAS.includes(rutaActual);

      if (!session && !esRutaPublica) {
        router.replace('/');
      }
      setCargando(false);
    };

    verificarSesion();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const rutaActual = segments[segments.length - 1] || 'index';
      const esRutaPublica = RUTAS_PUBLICAS.includes(rutaActual);

      if (!session && !esRutaPublica) {
        router.replace('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}