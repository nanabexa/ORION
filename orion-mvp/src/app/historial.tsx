import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import BottomNav from '@/components/BottomNav';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function HistorialScreen() {
  const router = useRouter();
  const [recargas, setRecargas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useFocusEffect(
    useCallback(() => {
      cargarHistorial();
    }, [])
  );


  const cargarHistorial = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/');
      return;
    }

    const { data, error } = await supabase
      .from('recargas').select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecargas(data);
      setTotal(data.filter(r => r.estado === 'SINCRONIZADA').reduce((acc, r) => acc + r.monto, 0));
    }
  };

  const colorBadge = (estado: string) => {
    if (estado === 'SINCRONIZADA') return { bg: 'rgba(29,158,117,0.1)', border: colors.success, text: colors.success };
    if (estado === 'APROBADA') return { bg: 'rgba(200,212,0,0.1)', border: colors.accent, text: colors.accent };
    return { bg: 'rgba(136,153,170,0.1)', border: colors.textMuted, text: colors.textMuted };
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>HISTORIAL</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>

          <View style={styles.resumenCard}>
            <View style={styles.resumenItem}>
              <Text style={styles.resumenValor}>{recargas.filter(r => r.estado === 'SINCRONIZADA').length}</Text>
              <Text style={styles.resumenLabel}>Recargas</Text>
            </View>
            <View style={styles.resumenDivider} />
            <View style={styles.resumenItem}>
              <Text style={styles.resumenValor}>B/.{total.toFixed(2)}</Text>
              <Text style={styles.resumenLabel}>Total recargado</Text>
            </View>
            <View style={styles.resumenDivider} />
            <View style={styles.resumenItem}>
              <Text style={styles.resumenValor}>
                {new Date().toLocaleString('es', { month: 'long' })}
              </Text>
              <Text style={styles.resumenLabel}>Este mes</Text>
            </View>
          </View>

          <Text style={common.sectionLabel}>Todas las recargas</Text>

          {recargas.length === 0 && (
            <Text style={styles.sinRecargas}>No hay recargas aún</Text>
          )}

          {recargas.map((recarga) => {
            const badge = colorBadge(recarga.estado);
            return (
              <View key={recarga.id} style={styles.txRow}>
                <View style={styles.txLeft}>
                  <View style={styles.txDot}>
                    <Text style={styles.txDotText}>↑</Text>
                  </View>
                  <View>
                    <Text style={styles.txInfo}>Recarga digital</Text>
                    <Text style={styles.txDate}>{new Date(recarga.created_at).toLocaleDateString('es')}</Text>
                    <View style={[styles.txBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                      <Text style={[styles.txBadgeText, { color: badge.text }]}>✦ {recarga.estado}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.txAmount}>+B/.{recarga.monto.toFixed(2)}</Text>
              </View>
            );
          })}

        </View>
      </ScrollView>
      <BottomNav activa="historial" />
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
  resumenCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', marginBottom: 24, borderWidth: 0.5, borderColor: colors.border,
  },
  resumenItem: { alignItems: 'center' },
  resumenValor: { fontSize: 18, fontWeight: '900', color: colors.accent },
  resumenLabel: { fontSize: 9, color: colors.textMuted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  resumenDivider: { width: 0.5, height: 30, backgroundColor: colors.border },
  sinRecargas: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 20 },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  txLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  txDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.cardDeep, alignItems: 'center', justifyContent: 'center',
  },
  txDotText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  txInfo: { fontSize: 13, color: colors.text, fontWeight: '500' },
  txDate: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  txBadge: {
    borderWidth: 0.5, borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-start',
  },
  txBadgeText: { fontSize: 9 },
  txAmount: { fontSize: 14, fontWeight: '700', color: colors.accent },
});