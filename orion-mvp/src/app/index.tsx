import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function LoginScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  const validarCorreo = (texto: string) => {
    if (!texto) return 'El correo es requerido';
    if (!texto.includes('@') || !texto.includes('.')) return 'Correo no válido';
    return '';
  };

  const validarPassword = (texto: string) => {
  if (!texto) return 'La contraseña es requerida';
  if (texto.length < 6) return 'Contraseña muy corta';
  return '';
};

  const handleLogin = async () => {
    const errCorreo = validarCorreo(correo);
    const errPass = validarPassword(password);
    setErrorCorreo(errCorreo);
    setErrorPassword(errPass);
    if (errCorreo || errPass) return;

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

      <TouchableOpacity style={common.btnGoogle}>
        <Text style={styles.btnGoogleIcon}>🔵</Text>
        <Text style={styles.btnGoogleText}>Continuar con Google</Text>
      </TouchableOpacity>

      <View style={common.divider}>
        <View style={common.dividerLine} />
        <Text style={common.dividerText}>o</Text>
        <View style={common.dividerLine} />
      </View>

      <Text style={common.label}>Correo</Text>
      <TextInput
        style={[common.input, errorCorreo ? common.inputError : null]}
        value={correo}
        onChangeText={(texto) => { setCorreo(texto); setErrorCorreo(''); }}
        placeholder="usuario@email.com"
        placeholderTextColor={colors.textMuted}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errorCorreo ? <Text style={common.errorText}>{errorCorreo}</Text> : null}

      <Text style={common.label}>Contraseña</Text>
      <View style={[common.inputWrap, errorPassword ? common.inputError : null]}>
        <TextInput
          style={common.inputFlex}
          value={password}
          onChangeText={(texto) => { setPassword(texto); setErrorPassword(''); }}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!verPassword}
        />
        <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
          <Text style={common.eyeIcon}>{verPassword ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>
      {errorPassword ? <Text style={common.errorText}>{errorPassword}</Text> : null}

      <TouchableOpacity
        style={[common.btnPrimary, styles.btnMargin, cargando && common.btnDisabled]}
        onPress={handleLogin}
        disabled={cargando}
      >
        <Text style={common.btnPrimaryText}>
          {cargando ? 'Cargando...' : 'Iniciar sesión →'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/registro' as any)}>
        <Text style={common.link}>
          ¿No tienes cuenta? <Text style={common.linkAccent}>Regístrate</Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  hero: {
    height: 140,
    marginHorizontal: -24,
    backgroundColor: colors.background,
    overflow: 'hidden',
    position: 'relative',
  },
  stars: { position: 'absolute', width: '100%', height: '100%' },
  star: {
    position: 'absolute', width: 3, height: 3,
    borderRadius: 2, backgroundColor: colors.accent, opacity: 0.6,
  },
  shootingStar: {
    position: 'absolute', top: 60, left: 40,
    width: 120, height: 1.5, backgroundColor: colors.accent,
    opacity: 0.8, transform: [{ rotate: '-25deg' }],
  },
  logoArea: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  logo: { fontSize: 36, fontWeight: '900', color: colors.text, letterSpacing: 4 },
  logoAccent: { color: colors.accent },
  logoSub: {
    fontSize: 10, color: 'rgba(255,255,255,0.35)',
    letterSpacing: 3, marginTop: 4, textTransform: 'uppercase',
  },
  btnGoogleIcon: { fontSize: 18 },
  btnGoogleText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  btnMargin: { marginTop: 20, marginBottom: 14 },
});