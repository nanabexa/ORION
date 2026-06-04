import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import BottomNav from '@/components/BottomNav';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function PerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });

  useFocusEffect(
    useCallback(() => {
      cargarPerfil();
    }, [])
  );

  const cargarPerfil = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('usuarios')
      .select('nombre, email')
      .eq('id', user.id)
      .single();

    if (data) setUsuario(data);
  };

  const cerrarSesion = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.push('/');
          }
        }
      ]
    );
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
});