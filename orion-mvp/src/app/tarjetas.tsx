import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import BottomNav from '@/components/BottomNav';

export default function TarjetasScreen() {
  const router = useRouter();

  // Simula tarjetas vinculadas — vacío para mostrar estado sin tarjetas
  const [tarjetas] = useState([
    // { id: '1', numero: '1234 5678', tipo: 'RapiPass' },
  ]);

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
                style={styles.btnPrimary}
                onPress={() => router.push('/vincular' as any)}
              >
                <Text style={styles.btnPrimaryText}>Vincular tarjeta →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {tarjetas.map((tarjeta: any) => (
                <View key={tarjeta.id} style={styles.tarjetaCard}>
                  <View style={styles.tarjetaChip} />
                  <Text style={styles.tarjetaNumero}>{tarjeta.numero}</Text>
                  <Text style={styles.tarjetaTipo}>{tarjeta.tipo}</Text>
                </View>
              ))}
              <TouchableOpacity
                style={styles.btnSecondary}
                onPress={() => router.push('/vincular' as any)}
              >
                <Text style={styles.btnSecondaryText}>+ Agregar otra tarjeta</Text>
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
  container: { flex: 1, backgroundColor: '#0A0E1F' },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  navBack: { fontSize: 22, color: '#8899AA' },
  navTitle: { fontWeight: '900', fontSize: 13, color: '#FFFFFF', letterSpacing: 3 },
  screen: { padding: 20 },
  emptyState: {
    alignItems: 'center', paddingVertical: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
  emptyDesc: {
    fontSize: 13, color: '#8899AA', textAlign: 'center',
    lineHeight: 20, marginBottom: 32, paddingHorizontal: 20,
  },
  tarjetaCard: {
    backgroundColor: '#003087', borderRadius: 14, padding: 20,
    marginBottom: 14, position: 'relative', overflow: 'hidden',
  },
  tarjetaChip: {
    width: 28, height: 20, backgroundColor: '#C8D400',
    borderRadius: 4, marginBottom: 16, opacity: 0.8,
  },
  tarjetaNumero: {
    fontFamily: 'monospace', fontSize: 16, fontWeight: '700',
    color: '#FFFFFF', letterSpacing: 2, marginBottom: 8,
  },
  tarjetaTipo: { fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center', width: '100%',
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  btnSecondary: {
    borderWidth: 0.5, borderColor: '#0066CC',
    borderRadius: 10, padding: 14, alignItems: 'center',
  },
  btnSecondaryText: { color: '#C8D400', fontSize: 13 },
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: '#141830',
  },
  navItem: { alignItems: 'center', gap: 2 },
  navItemIcon: { fontSize: 18 },
  navItemText: { fontSize: 10, color: '#8899AA' },
  navItemActive: { color: '#0066CC' },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0066CC', marginTop: 1 },
});