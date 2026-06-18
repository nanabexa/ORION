import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import * as Linking from 'expo-linking';

const RUTAS_PUBLICAS = ['index', 'registro', 'recuperar', 'reset'];

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
  
  useEffect(() => {
  const manejarUrl = (url: string | null) => {
    if (!url) return;
    if (url.includes('auth/reset')) {
      router.replace('/auth/reset' as any);
    }
  };

  Linking.getInitialURL().then(manejarUrl);

  const subscription = Linking.addEventListener('url', ({ url }) => {
    manejarUrl(url);
  });

  return () => subscription.remove();
}, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}