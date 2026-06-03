import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import BottomNav from '@/components/BottomNav';

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nombre: '', correo: '' });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('usuarios')
      .select('nombre, correo')
      .eq('id', user.id)
      .single();

    if (data) setUsuario(data);
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>PERFIL</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>

          <View style={styles.avatarArea}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {usuario.nombre ? usuario.nombre.charAt(0) : '?'}
              </Text>
            </View>
            <Text style={styles.nombre}>{usuario.nombre}</Text>
            <Text style={styles.correo}>{usuario.correo}</Text>
          </View>

          <Text style={styles.sectionLabel}>Mi cuenta</Text>

          {[
            { icon: '💳', label: 'Mis tarjetas', ruta: '/vincular' },
            { icon: '📋', label: 'Historial de recargas', ruta: '/historial' },
            { icon: '🔔', label: 'Notificaciones', ruta: null },
            { icon: '🔒', label: 'Seguridad', ruta: null },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuRow}
              onPress={() => item.ruta && router.push(item.ruta as any)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.sectionLabel}>Soporte</Text>

          {[
            { icon: '❓', label: 'Preguntas frecuentes', ruta: null },
            { icon: '📞', label: 'Contactar soporte', ruta: null },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuRow}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.btnCerrar} onPress={cerrarSesion}>
            <Text style={styles.btnCerrarText}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <BottomNav activa="perfil" />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1F' },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  navBack: { fontSize: 22, color: '#8899AA' },
  navTitle: { fontWeight: '900', fontSize: 13, color: '#FFFFFF', letterSpacing: 3 },
  screen: { padding: 18 },
  avatarArea: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#003087', borderWidth: 2, borderColor: '#0066CC',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: '#C8D400' },
  nombre: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 },
  correo: { fontSize: 12, color: '#8899AA' },
  sectionLabel: {
    fontSize: 10, color: '#C8D400', fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 8,
  },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#141830', alignItems: 'center', justifyContent: 'center',
  },
  menuIconText: { fontSize: 16 },
  menuLabel: { fontSize: 13, color: '#FFFFFF' },
  menuArrow: { fontSize: 16, color: '#3A4466' },
  btnCerrar: {
    borderWidth: 0.5, borderColor: '#FF4444', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnCerrarText: { color: '#FF4444', fontSize: 13, fontWeight: '600' },
});