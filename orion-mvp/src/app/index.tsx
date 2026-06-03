import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleLogin = async () => {
    if (!correo || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password,
    });
    setCargando(false);

    if (error) {
      Alert.alert('Error', 'Correo o contraseña incorrectos');
    } else {
      router.push('/saldo' as any);
    }
  };

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

      <TouchableOpacity style={styles.btnGoogle}>
        <Text style={styles.btnGoogleIcon}>🔵</Text>
        <Text style={styles.btnGoogleText}>Continuar con Google</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>o</Text>
        <View style={styles.dividerLine} />
      </View>

      <Text style={styles.label}>Correo</Text>
      <TextInput
        style={styles.input}
        value={correo}
        onChangeText={setCorreo}
        placeholder="usuario@email.com"
        placeholderTextColor="#8899AA"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#8899AA"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleLogin}
        disabled={cargando}
      >
        <Text style={styles.btnPrimaryText}>
          {cargando ? 'Cargando...' : 'Iniciar sesión →'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/registro' as any)}>
        <Text style={styles.loginLink}>
          ¿No tienes cuenta? <Text style={styles.loginLinkAccent}>Regístrate</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0A0E1F', padding: 24,
  },
  hero: {
    height: 140, marginHorizontal: -24,
    backgroundColor: '#0A0E1F', overflow: 'hidden', position: 'relative',
  },
  stars: { position: 'absolute', width: '100%', height: '100%' },
  star: {
    position: 'absolute', width: 3, height: 3,
    borderRadius: 2, backgroundColor: '#C8D400', opacity: 0.6,
  },
  shootingStar: {
    position: 'absolute', top: 60, left: 40,
    width: 120, height: 1.5, backgroundColor: '#C8D400',
    opacity: 0.8, transform: [{ rotate: '-25deg' }],
  },
  logoArea: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  logo: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: 4 },
  logoAccent: { color: '#C8D400' },
  logoSub: {
    fontSize: 10, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3, marginTop: 4, textTransform: 'uppercase',
  },
  btnGoogle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: '#141830', borderWidth: 0.5,
    borderColor: '#1E2A50', borderRadius: 10, padding: 13,
  },
  btnGoogleIcon: { fontSize: 18 },
  btnGoogleText: { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },
  divider: {
    flexDirection: 'row', alignItems: 'center',
    gap: 8, marginVertical: 16,
  },
  dividerLine: { flex: 1, height: 0.5, backgroundColor: '#1E2A50' },
  dividerText: { fontSize: 11, color: '#8899AA' },
  label: {
    fontSize: 10, color: '#C8D400', fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6, marginTop: 12,
  },
  input: {
    backgroundColor: '#141830', borderWidth: 0.5,
    borderColor: '#1E2A50', borderRadius: 10, padding: 13,
    fontSize: 13, color: '#FFFFFF',
  },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 20, marginBottom: 14,
  },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  loginLink: {
    textAlign: 'center', fontSize: 13, color: '#8899AA',
  },
  loginLinkAccent: { color: '#C8D400' },
});