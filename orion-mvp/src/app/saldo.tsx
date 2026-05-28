import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { usuario, saldo as saldoData, recargas } from '../datos';
import BottomNav from '@/components/BottomNav';

export default function SaldoScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>ORION</Text>
        <Text style={styles.navIcon}>🔔</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <View style={styles.cardGlow} />
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>
            <Text style={styles.balanceCurrency}>B/. </Text>
            {saldoData.disponible.toFixed(2)}
          </Text>
          <Text style={styles.cardNumber}>Tarjeta •••• {usuario.tarjeta}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>✦ {saldoData.estado}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/recarga')}
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
                <Text style={styles.txDate}>{recarga.fecha} · {recarga.estado}</Text>
              </View>
            </View>
            <Text style={styles.txAmount}>+B/.{recarga.monto.toFixed(2)}</Text>
          </View>
        ))}
      </ScrollView>
        <BottomNav activa="inicio" />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E1F' },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  navTitle: { fontWeight: '900', fontSize: 16, color: '#FFFFFF', letterSpacing: 3 },
  navIcon: { fontSize: 18 },
  balanceCard: {
    margin: 18, backgroundColor: '#003087', borderRadius: 14,
    padding: 20, overflow: 'hidden', position: 'relative',
  },
  cardGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(200,212,0,0.08)',
  },
  balanceLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: 1, textTransform: 'uppercase' },
  balanceAmount: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginVertical: 4 },
  balanceCurrency: { fontSize: 16, fontWeight: '400', color: 'rgba(255,255,255,0.6)' },
  cardNumber: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(200,212,0,0.15)',
    borderWidth: 0.5, borderColor: '#C8D400', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 10,
  },
  badgeText: { fontSize: 10, color: '#C8D400' },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10, padding: 14,
    alignItems: 'center', marginHorizontal: 18, marginBottom: 18,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  sectionTitle: {
    fontSize: 10, color: '#8899AA', letterSpacing: 1.5,
    textTransform: 'uppercase', marginHorizontal: 18, marginBottom: 8,
  },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 18,
    borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  txDot: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#0F1A35', alignItems: 'center', justifyContent: 'center',
  },
  txDotText: { color: '#0066CC', fontSize: 14, fontWeight: '700' },
  txInfo: { fontSize: 12, color: '#FFFFFF' },
  txDate: { fontSize: 10, color: '#8899AA', marginTop: 2 },
  txAmount: { fontSize: 13, fontWeight: '700', color: '#C8D400' },
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