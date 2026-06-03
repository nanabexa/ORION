import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function RegistroScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [cargando, setCargando] = useState(false);

  const listo = nombre && correo && password && confirmar && password === confirmar;

  const handleRegistro = async () => {
    if (!listo) return;

    setCargando(true);
    try {
      // 1. Crear usuario en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // 2. Guardar nombre en tabla usuarios
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nombre: nombre,
          correo: correo,
        });
      }

      router.push('/saldo' as any);

    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>REGISTRO</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>

          <TouchableOpacity style={styles.btnGoogle}>
            <Text style={styles.btnGoogleIcon}>🔵</Text>
            <Text style={styles.btnGoogleText}>Registrarse con Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Viviana Nieto"
            placeholderTextColor="#8899AA"
          />

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

          <Text style={styles.label}>Confirmar contraseña</Text>
          <TextInput
            style={[styles.input, confirmar && password !== confirmar && styles.inputError]}
            value={confirmar}
            onChangeText={setConfirmar}
            placeholder="••••••••"
            placeholderTextColor="#8899AA"
            secureTextEntry
          />
          {confirmar && password !== confirmar && (
            <Text style={styles.errorText}>Las contraseñas no coinciden</Text>
          )}

          <TouchableOpacity
            style={[styles.btnPrimary, !listo && styles.btnDisabled]}
            onPress={handleRegistro}
            disabled={!listo || cargando}
          >
            <Text style={styles.btnPrimaryText}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>
              ¿Ya tienes cuenta? <Text style={styles.loginLinkAccent}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
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
  screen: { padding: 24 },
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
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6, marginTop: 14,
  },
  input: {
    backgroundColor: '#141830', borderWidth: 0.5,
    borderColor: '#1E2A50', borderRadius: 10, padding: 13,
    fontSize: 13, color: '#FFFFFF',
  },
  inputError: { borderColor: '#FF4444' },
  errorText: { fontSize: 11, color: '#FF4444', marginTop: 4 },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 14,
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  loginLink: { textAlign: 'center', fontSize: 13, color: '#8899AA' },
  loginLinkAccent: { color: '#C8D400' },
});