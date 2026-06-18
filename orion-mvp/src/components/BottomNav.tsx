import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  activa: 'inicio' | 'tarjetas' | 'historial' | 'recargar' | 'perfil';
};

export default function BottomNav({ activa }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = [
    { id: 'tarjetas', icon: '🎫', label: 'Tarjetas', ruta: '/tarjetas' },
    { id: 'historial', icon: '📋', label: 'Historial', ruta: '/historial' },
    { id: 'inicio', icon: '🏠', label: 'Inicio', ruta: '/saldo' },
    { id: 'recargar', icon: '💸', label: 'Recargar', ruta: '/recarga' },
    { id: 'perfil', icon: '👤', label: 'Perfil', ruta: '/perfil' },
  ];

  return (
    <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
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
    paddingTop: 12, borderTopWidth: 0.5, borderTopColor: colors.borderLight,
    backgroundColor: colors.background,
  },
  navItem: { alignItems: 'center', gap: 2 },
  navItemIcon: { fontSize: 18 },
  navItemText: { fontSize: 9, color: colors.textMuted },
  navItemActive: { color: colors.primary },
  navDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 1 },
});