import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  activa: 'inicio' | 'tarjetas' | 'historial' | 'recargar' | 'perfil';
};

export default function BottomNav({ activa }: Props) {
  const router = useRouter();

  const items = [
    { id: 'tarjetas', icon: '🎫', label: 'Tarjetas', ruta: '/tarjetas' },
    { id: 'historial', icon: '📋', label: 'Historial', ruta: '/historial' },
    { id: 'inicio', icon: '🏠', label: 'Inicio', ruta: '/saldo' },
    { id: 'recargar', icon: '💸', label: 'Recargar', ruta: '/recarga' },
    { id: 'perfil', icon: '👤', label: 'Perfil', ruta: '/perfil' },
  ];

  return (
    <View style={styles.bottomNav}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.navItem}
          onPress={() => router.push(item.ruta as any)}
        >
          <Text style={styles.navItemIcon}>{item.icon}</Text>
          <Text style={[
            styles.navItemText,
            activa === item.id && styles.navItemActive
          ]}>
            {item.label}
          </Text>
          {activa === item.id && <View style={styles.navDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: 12, borderTopWidth: 0.5, borderTopColor: '#141830',
    backgroundColor: '#0A0E1F',
  },
  navItem: { alignItems: 'center', gap: 2 },
  navItemIcon: { fontSize: 18 },
  navItemText: { fontSize: 9, color: '#8899AA' },
  navItemActive: { color: '#0066CC' },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#0066CC', marginTop: 1 },
});