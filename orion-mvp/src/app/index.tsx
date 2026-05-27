
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>

      <View style={styles.hero}>
        <View style={styles.stars}>
          <View style={[styles.star, { top: 30, left: 40 }]} />
          <View style={[styles.star, { top: 15, left: 90 }]} />
          <View style={[styles.star, { top: 25, left: 160 }]} />
          <View style={[styles.star, { top: 40, right: 40 }]} />
          <View style={[styles.star, { top: 10, right: 60 }]} />
        </View>
        <View style={styles.shootingStar} />
      </View>

      <View style={styles.logoArea}>
        <Text style={styles.logo}>
          ORI<Text style={styles.logoAccent}>ON</Text>
        </Text>
        <Text style={styles.logoSub}>recarga digital</Text>
      </View>

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        placeholder="usuario@email.com"
        placeholderTextColor="#3A4466"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        placeholderTextColor="#3A4466"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => router.push('./saldo')}
      >
        <Text style={styles.btnPrimaryText}>Iniciar sesión →</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.btnSecondary}>
        <Text style={styles.btnSecondaryText}>Crear cuenta nueva</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1F',
    padding: 24,
  },
  hero: {
    height: 160,
    marginHorizontal: -24,
    backgroundColor: '#0A0E1F',
    overflow: 'hidden',
    position: 'relative',
  },
  stars: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#C8D400',
    opacity: 0.6,
  },
  shootingStar: {
    position: 'absolute',
    top: 60,
    left: 40,
    width: 120,
    height: 1.5,
    backgroundColor: '#C8D400',
    opacity: 0.8,
    transform: [{ rotate: '-25deg' }],
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  logoAccent: {
    color: '#C8D400',
  },
  logoSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 10,
    color: '#C8D400',
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#141830',
    borderWidth: 0.5,
    borderColor: '#1E2A50',
    borderRadius: 10,
    padding: 13,
    fontSize: 13,
    color: '#FFFFFF',
  },
  btnPrimary: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#1E2A50',
  },
  dividerText: {
    fontSize: 11,
    color: '#3A4466',
  },
  btnSecondary: {
    borderWidth: 0.5,
    borderColor: '#1E2A50',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#C8D400',
    fontSize: 13,
  },
});