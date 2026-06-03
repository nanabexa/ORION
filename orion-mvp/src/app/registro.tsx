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
  const [verPassword, setVerPassword] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorNombre, setErrorNombre] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');

  const validarNombre = (texto: string) => {
    if (!texto) return 'El nombre es requerido';
    if (texto.length < 3) return 'Mínimo 3 caracteres';
    return '';
  };

  const validarCorreo = (texto: string) => {
    if (!texto) return 'El correo es requerido';
    if (!texto.includes('@') || !texto.includes('.')) return 'Correo no válido';
    return '';
  };

  const validarPassword = (texto: string) => {
    if (!texto) return 'La contraseña es requerida';
    if (texto.length < 6) return 'Mínimo 6 caracteres';
    return '';
  };

  const validarConfirmar = (texto: string) => {
    if (!texto) return 'Confirma tu contraseña';
    if (texto !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleRegistro = async () => {
    const errNombre = validarNombre(nombre);
    const errCorreo = validarCorreo(correo);
    const errPass = validarPassword(password);
    const errConfirmar = validarConfirmar(confirmar);

    setErrorNombre(errNombre);
    setErrorCorreo(errCorreo);
    setErrorPassword(errPass);
    setErrorConfirmar(errConfirmar);

    if (errNombre || errCorreo || errPass || errConfirmar) return;

    setCargando(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nombre: nombre,
          correo: correo,
        });
      }

      Alert.alert(
        '¡Cuenta creada!',
        'Te enviamos un correo de confirmación. Revisa tu bandeja de entrada antes de iniciar sesión.',
        [{ text: 'OK', onPress: () => router.push('/' as any) }]
      );

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
            style={[styles.input, errorNombre ? styles.inputError : null]}
            value={nombre}
            onChangeText={(texto) => {
              setNombre(texto);
              setErrorNombre('');
            }}
            placeholder="Viviana Nieto"
            placeholderTextColor="#8899AA"
          />
          {errorNombre ? <Text style={styles.errorText}>{errorNombre}</Text> : null}

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={[styles.input, errorCorreo ? styles.inputError : null]}
            value={correo}
            onChangeText={(texto) => {
              setCorreo(texto);
              setErrorCorreo('');
            }}
            placeholder="usuario@email.com"
            placeholderTextColor="#8899AA"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errorCorreo ? <Text style={styles.errorText}>{errorCorreo}</Text> : null}

          <Text style={styles.label}>Contraseña</Text>
          <View style={[styles.inputWrap, errorPassword ? styles.inputError : null]}>
            <TextInput
              style={styles.inputFlex}
              value={password}
              onChangeText={(texto) => {
                setPassword(texto);
                setErrorPassword('');
              }}
              placeholder="••••••••"
              placeholderTextColor="#8899AA"
              secureTextEntry={!verPassword}
            />
            <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
              <Text style={styles.eyeIcon}>{verPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
          {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}

          <Text style={styles.label}>Confirmar contraseña</Text>
          <View style={[styles.inputWrap, errorConfirmar ? styles.inputError : null]}>
            <TextInput
              style={styles.inputFlex}
              value={confirmar}
              onChangeText={(texto) => {
                setConfirmar(texto);
                setErrorConfirmar('');
              }}
              placeholder="••••••••"
              placeholderTextColor="#8899AA"
              secureTextEntry={!verConfirmar}
            />
            <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)}>
              <Text style={styles.eyeIcon}>{verConfirmar ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
          {errorConfirmar ? <Text style={styles.errorText}>{errorConfirmar}</Text> : null}

          <TouchableOpacity
            style={[styles.btnPrimary, cargando && styles.btnDisabled]}
            onPress={handleRegistro}
            disabled={cargando}
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
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#141830', borderWidth: 0.5,
    borderColor: '#1E2A50', borderRadius: 10, padding: 13,
  },
  inputFlex: { flex: 1, fontSize: 13, color: '#FFFFFF' },
  inputError: { borderColor: '#FF4444' },
  errorText: { fontSize: 11, color: '#FF4444', marginTop: 4, marginBottom: 4 },
  eyeIcon: { fontSize: 16, paddingLeft: 8 },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center', marginTop: 24, marginBottom: 14,
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  loginLink: { textAlign: 'center', fontSize: 13, color: '#8899AA' },
  loginLinkAccent: { color: '#C8D400' },
});