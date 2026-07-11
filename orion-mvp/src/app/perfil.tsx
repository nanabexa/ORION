import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import BottomNav from '@/components/BottomNav';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });
  const [confirmarLogout, setConfirmarLogout] = useState(false);

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
  );

  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/');
      return;
    }

    const { data } = await supabase
      .from('usuarios')
      .select('nombre, email')
      .eq('id', user.id)
      .single();

    if (data) setUsuario(data);
  };

  const ejecutarCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace('/');
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
                {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <Text style={styles.nombre}>{usuario.nombre || 'Usuario'}</Text>
            <Text style={styles.email}>{usuario.email}</Text>
          </View>

          <Text style={common.sectionLabel}>Mi cuenta</Text>

          {[
            { icon: '💳', label: 'Mis tarjetas', ruta: '/tarjetas' },
            { icon: '📋', label: 'Historial de recargas', ruta: '/historial' },
            { icon: '🔔', label: 'Notificaciones', ruta: null },
            { icon: '🔒', label: 'Seguridad', ruta: null },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuRow, !item.ruta && styles.menuRowDisabled]}
              onPress={() => item.ruta && router.push(item.ruta as any)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={[styles.menuLabel, !item.ruta && styles.menuLabelDisabled]}>
                  {item.label}
                </Text>
              </View>
              <Text style={styles.menuArrow}>{item.ruta ? '→' : ''}</Text>
            </TouchableOpacity>
          ))}

          <Text style={common.sectionLabel}>Soporte</Text>

          {[
            { icon: '❓', label: 'Preguntas frecuentes' },
            { icon: '📞', label: 'Contactar soporte' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={[styles.menuRow, styles.menuRowDisabled]}>
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={[styles.menuLabel, styles.menuLabelDisabled]}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}></Text>
            </TouchableOpacity>
          ))}

          {!confirmarLogout ? (
            <TouchableOpacity style={styles.btnCerrar} onPress={() => setConfirmarLogout(true)}>
              <Text style={styles.btnCerrarText}>Cerrar sesión</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.confirmBox}>
              <Text style={styles.confirmText}>¿Estás seguro que quieres cerrar sesión?</Text>
              <View style={styles.confirmBtns}>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => setConfirmarLogout(false)}>
                  <Text style={styles.btnCancelarText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  testID="confirmar-logout"
                  style={styles.btnConfirmar}
                  onPress={ejecutarCerrarSesion}
                >
                  <Text style={styles.btnConfirmarText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        </View>
      </ScrollView>
      <BottomNav activa="perfil" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  navBack: { fontSize: 22, color: colors.textMuted },
  navTitle: { fontWeight: '900', fontSize: 13, color: colors.text, letterSpacing: 3 },
  screen: { padding: 18 },
  avatarArea: { alignItems: 'center', paddingVertical: 24 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.primaryCard, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '900', color: colors.accent },
  nombre: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  email: { fontSize: 12, color: colors.textMuted },
  menuRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  menuRowDisabled: { opacity: 0.5 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center',
  },
  menuIconText: { fontSize: 16 },
  menuLabel: { fontSize: 13, color: colors.text },
  menuLabelDisabled: { color: colors.textMuted },
  menuArrow: { fontSize: 16, color: '#3A4466' },
  btnCerrar: {
    borderWidth: 0.5, borderColor: colors.error, borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 24,
  },
  btnCerrarText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  confirmBox: {
    borderWidth: 0.5, borderColor: colors.error, borderRadius: 10,
    padding: 16, marginTop: 24,
  },
  confirmText: { color: colors.text, fontSize: 13, textAlign: 'center', marginBottom: 12 },
  confirmBtns: { flexDirection: 'row', gap: 10 },
  btnCancelar: {
    flex: 1, borderWidth: 0.5, borderColor: colors.border, borderRadius: 8,
    padding: 12, alignItems: 'center',
  },
  btnCancelarText: { color: colors.textMuted, fontSize: 13 },
  btnConfirmar: {
    flex: 1, backgroundColor: colors.error, borderRadius: 8,
    padding: 12, alignItems: 'center',
  },
  btnConfirmarText: { color: colors.text, fontSize: 13, fontWeight: '600' },
});