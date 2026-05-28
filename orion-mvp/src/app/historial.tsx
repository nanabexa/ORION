import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { recargas } from '../datos';

export default function HistorialScreen() {
  const router = useRouter();

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
              <Text style={styles.resumenValor}>3</Text>
              <Text style={styles.resumenLabel}>Recargas</Text>
            </View>
            <View style={styles.resumenDivider} />
            <View style={styles.resumenItem}>
              <Text style={styles.resumenValor}>B/.35.00</Text>
              <Text style={styles.resumenLabel}>Total recargado</Text>
            </View>
            <View style={styles.resumenDivider} />
            <View style={styles.resumenItem}>
              <Text style={styles.resumenValor}>Mayo</Text>
              <Text style={styles.resumenLabel}>Este mes</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>Todas las recargas</Text>

          {recargas.map((recarga) => (
            <View key={recarga.id} style={styles.txRow}>
              <View style={styles.txLeft}>
                <View style={styles.txDot}>
                  <Text style={styles.txDotText}>↑</Text>
                </View>
                <View>
                  <Text style={styles.txInfo}>Recarga digital</Text>
                  <Text style={styles.txDate}>{recarga.fecha}</Text>
                  <View style={styles.txBadge}>
                    <Text style={styles.txBadgeText}>✦ {recarga.estado}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.txAmount}>+B/.{recarga.monto.toFixed(2)}</Text>
            </View>
          ))}

        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/vincular')}
        >
          <Text style={styles.navItemIcon}>🎫</Text>
          <Text style={styles.navItemText}>Mis tarjetas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navItemIcon}>📋</Text>
          <Text style={[styles.navItemText, styles.navItemActive]}>Historial</Text>
          <View style={styles.navDot} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/perfil' as any)}
        >
          <Text style={styles.navItemIcon}>👤</Text>
          <Text style={styles.navItemText}>Perfil</Text>
        </TouchableOpacity>
      </View>

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
  resumenCard: {
    backgroundColor: '#141830', borderRadius: 14, padding: 16,
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'center', marginBottom: 24, borderWidth: 0.5, borderColor: '#1E2A50',
  },
  resumenItem: { alignItems: 'center' },
  resumenValor: { fontSize: 18, fontWeight: '900', color: '#C8D400' },
  resumenLabel: { fontSize: 9, color: '#8899AA', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
  resumenDivider: { width: 0.5, height: 30, backgroundColor: '#1E2A50' },
  sectionLabel: {
    fontSize: 10, color: '#C8D400', fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12,
  },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#141830',
  },
  txLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  txDot: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#0F1A35', alignItems: 'center', justifyContent: 'center',
  },
  txDotText: { color: '#0066CC', fontSize: 14, fontWeight: '700' },
  txInfo: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  txDate: { fontSize: 10, color: '#8899AA', marginTop: 2 },
  txBadge: {
    backgroundColor: 'rgba(200,212,0,0.1)', borderWidth: 0.5, borderColor: '#C8D400',
    borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, alignSelf: 'flex-start',
  },
  txBadgeText: { fontSize: 9, color: '#C8D400' },
  txAmount: { fontSize: 14, fontWeight: '700', color: '#C8D400' },
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