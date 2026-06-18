import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { getTarjetas } from '../../lib/tarjetas';
import BottomNav from '@/components/BottomNav';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function TarjetasScreen() {
  const router = useRouter();
  const [tarjetas, setTarjetas] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      cargarTarjetas();
    }, [])
  );

  const cargarTarjetas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const data = await getTarjetas(user.id);
    if (!data) return;

    const tarjetasConSaldo = await Promise.all(
      data.map(async (t: any) => {
        const { data: tarjetaValida } = await supabase
          .from('tarjetas_validas')
          .select('saldo')
          .eq('numero', t.numero_tarjeta)
          .maybeSingle();
        return { ...t, saldo: tarjetaValida?.saldo ?? 0 };
      })
    );

    setTarjetas(tarjetasConSaldo);
  };

  const colorTarjeta = (numero: string) => {
    return numero.startsWith('3') ? colors.rapipass : colors.metro;
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/saldo' as any)}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>MIS TARJETAS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>

          {tarjetas.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎫</Text>
              <Text style={styles.emptyTitle}>Sin tarjetas vinculadas</Text>
              <Text style={styles.emptyDesc}>
                Vincula tu tarjeta RapiPass o MetroBus para recargar desde la app.
              </Text>
              <TouchableOpacity
                style={[common.btnPrimary, styles.btnFull]}
                onPress={() => router.push('/vincular' as any)}
              >
                <Text style={common.btnPrimaryText}>Vincular tarjeta →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {tarjetas.map((tarjeta: any) => (
                <View
                  key={tarjeta.id}
                  style={[styles.tarjetaCard, { backgroundColor: colorTarjeta(tarjeta.numero_tarjeta) }]}
                >
                  <View style={styles.tarjetaChip} />
                  <Text style={styles.tarjetaNumero}>{tarjeta.numero_tarjeta}</Text>
                  <Text style={styles.tarjetaTipo}>
                    {tarjeta.numero_tarjeta.startsWith('3') ? 'RapiPass' : 'Metro + MetroBus'}
                  </Text>
                  <Text style={styles.tarjetaSaldo}>
                    Saldo: B/. {tarjeta.saldo.toFixed(2)}
                  </Text>
                </View>
              ))}
              <TouchableOpacity
                style={[common.btnSecondary]}
                onPress={() => router.push('/vincular' as any)}
              >
                <Text style={common.btnSecondaryText}>+ Agregar otra tarjeta</Text>
              </TouchableOpacity>
            </>
          )}

        </View>
      </ScrollView>

      <BottomNav activa="tarjetas" />
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
  screen: { padding: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptyDesc: {
    fontSize: 13, color: colors.textMuted, textAlign: 'center',
    lineHeight: 20, marginBottom: 32, paddingHorizontal: 20,
  },
  btnFull: { width: '100%' },
  tarjetaCard: {
    borderRadius: 14, padding: 20,
    marginBottom: 14, position: 'relative', overflow: 'hidden', minHeight: 130,
  },
  tarjetaChip: {
    width: 28, height: 20, backgroundColor: colors.accent,
    borderRadius: 4, marginBottom: 16, opacity: 0.8,
  },
  tarjetaNumero: {
    fontFamily: 'monospace', fontSize: 18, fontWeight: '700',
    color: colors.text, letterSpacing: 3, marginBottom: 6,
  },
  tarjetaTipo: {
    fontSize: 11, color: colors.textCard, marginBottom: 10, flexWrap: 'wrap',
  },
  tarjetaSaldo: {
    fontSize: 13, fontWeight: '700', color: colors.accent,
  },
});