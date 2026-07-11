import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import BottomNav from '@/components/BottomNav';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function SaldoScreen() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<any>(null);
  const [recargas, setRecargas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const cargarDatos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace('/');
      return;
    }

    const { data: listaTarjetas } = await supabase
      .from('tarjetas').select('*')
      .eq('usuario_id', user.id).eq('activa', true);

    if (listaTarjetas && listaTarjetas.length > 0) {
      const tarjetasConSaldo = await Promise.all(
        listaTarjetas.map(async (t) => {
          const { data: tarjetaValida } = await supabase
            .from('tarjetas_validas')
            .select('saldo')
            .eq('numero', t.numero_tarjeta)
            .maybeSingle();
          return { ...t, saldo: tarjetaValida?.saldo ?? 0 };
        })
      );

      setTarjetas(tarjetasConSaldo);
      setTarjetaSeleccionada(tarjetasConSaldo[0]);
      await cargarRecargas(user.id, tarjetasConSaldo[0].id);
    }
  };

  const cargarRecargas = async (userId: string, tarjetaId: string) => {
    const { data: historial } = await supabase
      .from('recargas').select('*')
      .eq('usuario_id', userId).eq('tarjeta_id', tarjetaId)
      .order('created_at', { ascending: false }).limit(5);

    if (historial) setRecargas(historial);
  };

  const seleccionarTarjeta = async (t: any) => {
    setTarjetaSeleccionada(t);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await cargarRecargas(user.id, t.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>ORION</Text>
        <Text style={styles.navIcon}>🔔</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {tarjetas.length > 1 && (
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            style={styles.selectorWrap} contentContainerStyle={styles.selectorContent}
          >
            {tarjetas.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.selectorItem, tarjetaSeleccionada?.id === t.id && styles.selectorItemActive]}
                onPress={() => seleccionarTarjeta(t)}
              >
                <Text style={[styles.selectorText, tarjetaSeleccionada?.id === t.id && styles.selectorTextActive]}>
                  {t.numero_tarjeta}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.balanceCard}>
          <View style={styles.cardGlow} />
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>
            <Text style={styles.balanceCurrency}>B/. </Text>
            {tarjetaSeleccionada ? tarjetaSeleccionada.saldo.toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.cardNumber}>
            Tarjeta {tarjetaSeleccionada ? tarjetaSeleccionada.numero_tarjeta : '--------'}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              ✦ {tarjetaSeleccionada ? 'Activa' : 'Sin tarjeta'}
            </Text>
          </View>
        </View>

        {!tarjetaSeleccionada && (
          <TouchableOpacity style={styles.btnVincular} onPress={() => router.push('/vincular' as any)}>
            <Text style={styles.btnVincularText}>+ Vincular tarjeta →</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btnPrimary, !tarjetaSeleccionada && styles.btnDisabled]}
          onPress={() => router.push('/recarga')}
          disabled={!tarjetaSeleccionada}
        >
          <Text style={styles.btnPrimaryText}>+ Recargar tarjeta →</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Últimas recargas</Text>

        {recargas.map((recarga) => (
          <View key={recarga.id} style={styles.txRow}>
            <View style={styles.txLeft}>
              <View style={styles.txDot}>
                <Text style={styles.txDotText}>↑</Text>
              </View>
              <View>
                <Text style={styles.txInfo}>Recarga digital</Text>
                <Text style={styles.txDate}>
                  {new Date(recarga.created_at).toLocaleDateString('es')} · {recarga.estado}
                </Text>
              </View>
            </View>
            <Text style={styles.txAmount}>+B/.{recarga.monto.toFixed(2)}</Text>
          </View>
        ))}

        {recargas.length === 0 && (
          <Text style={styles.sinRecargas}>No hay recargas aún</Text>
        )}

      </ScrollView>
      <BottomNav activa="inicio" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  navTitle: { fontWeight: '900', fontSize: 16, color: colors.text, letterSpacing: 3 },
  navIcon: { fontSize: 18 },
  selectorWrap: { marginTop: 14, marginBottom: 4 },
  selectorContent: { paddingHorizontal: 18, gap: 8 },
  selectorItem: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: colors.card, borderRadius: 20,
    borderWidth: 0.5, borderColor: colors.border,
  },
  selectorItemActive: { borderColor: colors.primary, backgroundColor: colors.overlay },
  selectorText: { fontSize: 12, color: colors.textMuted },
  selectorTextActive: { color: colors.text, fontWeight: '600' },
  balanceCard: {
    margin: 18, backgroundColor: colors.primaryCard, borderRadius: 14,
    padding: 20, overflow: 'hidden', position: 'relative',
  },
  cardGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(200,212,0,0.08)',
  },
  balanceLabel: { fontSize: 10, color: colors.textCard, letterSpacing: 1, textTransform: 'uppercase' },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: colors.text, marginVertical: 4 },
  balanceCurrency: { fontSize: 16, fontWeight: '400', color: colors.textCard },
  cardNumber: { fontSize: 11, color: colors.textFaint, marginTop: 8 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(200,212,0,0.15)',
    borderWidth: 0.5, borderColor: colors.accent, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 10,
  },
  badgeText: { fontSize: 10, color: colors.accent },
  btnVincular: {
    borderWidth: 0.5, borderColor: colors.accent, borderRadius: 10, padding: 14,
    alignItems: 'center', marginHorizontal: 18, marginBottom: 10,
  },
  btnVincularText: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  btnPrimary: {
    backgroundColor: colors.primary, borderRadius: 10, padding: 14,
    alignItems: 'center', marginHorizontal: 18, marginBottom: 18,
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  sectionTitle: {
    fontSize: 10, color: colors.textMuted, letterSpacing: 1.5,
    textTransform: 'uppercase', marginHorizontal: 18, marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 18,
    borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  txDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: colors.cardDeep, alignItems: 'center', justifyContent: 'center',
  },
  txDotText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  txInfo: { fontSize: 12, color: colors.text },
  txDate: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  txAmount: { fontSize: 13, fontWeight: '700', color: colors.accent },
  sinRecargas: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 20 },
});