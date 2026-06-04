import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { colors } from '../theme/colors';
import { common } from '../theme/components';


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
    if (texto.length > 50) return 'Máximo 50 caracteres';
    if (/[<>{}\[\]]/.test(texto)) return 'Nombre no válido';
    return '';
  };

  const validarCorreo = (texto: string) => {
    if (!texto) return 'El correo es requerido';
    if (!texto.includes('@') || !texto.includes('.')) return 'Correo no válido';
    if (texto.length > 254) return 'Correo demasiado largo';
    if (texto.includes(' ')) return 'El correo no puede tener espacios';
    return '';
  };

  const validarPassword = (texto: string) => {
    if (!texto) return 'La contraseña es requerida';
    if (texto.length < 8) return 'Mínimo 8 caracteres';
    if (texto.length > 32) return 'Máximo 32 caracteres';
    if (!/[A-Z]/.test(texto)) return 'Debe incluir al menos una mayúscula';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(texto)) return 'Debe incluir al menos un carácter especial';
    if (/^\s|\s$/.test(texto)) return 'No puede tener espacios al inicio o al final';
    return '';
  };

  const validarConfirmar = (texto: string) => {
    if (!texto) return 'Confirma tu contraseña';
    if (texto !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  const requisitos = [
    { label: 'Mínimo 8 caracteres', cumple: password.length >= 8 },
    { label: 'Al menos una mayúscula', cumple: /[A-Z]/.test(password) },
    { label: 'Al menos un carácter especial', cumple: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
    { label: 'Máximo 32 caracteres', cumple: password.length > 0 && password.length <= 32 },
  ];

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
        options: {
          data: { nombre: nombre }
        }
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      Alert.alert(
        '¡Cuenta creada!',
        'Te enviamos un correo de confirmación. Revisa tu bandeja de entrada antes de iniciar sesión.',
        [{ text: 'OK', onPress: () => router.push('/' as any) }]
      );

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

          <TouchableOpacity style={common.btnGoogle}>
            <Text style={styles.btnGoogleIcon}>🔵</Text>
            <Text style={styles.btnGoogleText}>Registrarse con Google</Text>
          </TouchableOpacity>

          <View style={common.divider}>
            <View style={common.dividerLine} />
            <Text style={common.dividerText}>o</Text>
            <View style={common.dividerLine} />
          </View>

          <Text style={common.label}>Nombre completo</Text>
          <TextInput
            style={[common.input, errorNombre ? common.inputError : null]}
            value={nombre}
            onChangeText={(texto) => { setNombre(texto); setErrorNombre(validarNombre(texto)); }}
            placeholder="Viviana Nieto"
            placeholderTextColor={colors.textMuted}
            maxLength={50}
          />
          {errorNombre ? <Text style={common.errorText}>{errorNombre}</Text> : null}

          <Text style={common.label}>Correo</Text>
          <TextInput
            style={[common.input, errorCorreo ? common.inputError : null]}
            value={correo}
            onChangeText={(texto) => { setCorreo(texto); setErrorCorreo(validarCorreo(texto)); }}
            placeholder="usuario@email.com"
            placeholderTextColor={colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            maxLength={254}
          />
          {errorCorreo ? <Text style={common.errorText}>{errorCorreo}</Text> : null}

          <Text style={common.label}>Contraseña</Text>
          <View style={[common.inputWrap, errorPassword ? common.inputError : null]}>
            <TextInput
              style={common.inputFlex}
              value={password}
              onChangeText={(texto) => { setPassword(texto); setErrorPassword(validarPassword(texto)); }}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!verPassword}
              maxLength={32}
            />
            <TouchableOpacity onPress={() => setVerPassword(!verPassword)}>
              <Text style={common.eyeIcon}>{verPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
          {errorPassword ? <Text style={common.errorText}>{errorPassword}</Text> : null}

          {password.length > 0 && (
            <View style={styles.checklist}>
              {requisitos.map((req, i) => (
                <View key={i} style={styles.checkItem}>
                  <Text style={req.cumple ? styles.checkOk : styles.checkPending}>
                    {req.cumple ? '✓' : '○'}
                  </Text>
                  <Text style={req.cumple ? styles.checkLabelOk : styles.checkLabelPending}>
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={common.label}>Confirmar contraseña</Text>
          <View style={[common.inputWrap, errorConfirmar ? common.inputError : null]}>
            <TextInput
              style={common.inputFlex}
              value={confirmar}
              onChangeText={(texto) => { setConfirmar(texto); setErrorConfirmar(validarConfirmar(texto)); }}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!verConfirmar}
              maxLength={32}
            />
            <TouchableOpacity onPress={() => setVerConfirmar(!verConfirmar)}>
              <Text style={common.eyeIcon}>{verConfirmar ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
          {errorConfirmar ? <Text style={common.errorText}>{errorConfirmar}</Text> : null}

          <TouchableOpacity
            style={[common.btnPrimary, styles.btnMargin, cargando && common.btnDisabled]}
            onPress={handleRegistro}
            disabled={cargando}
          >
            <Text style={common.btnPrimaryText}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()}>
            <Text style={common.link}>
              ¿Ya tienes cuenta? <Text style={common.linkAccent}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  navBack: { fontSize: 22, color: colors.textMuted },
  navTitle: { fontWeight: '900', fontSize: 13, color: colors.text, letterSpacing: 3 },
  screen: { padding: 24 },
  btnGoogleIcon: { fontSize: 18 },
  btnGoogleText: { fontSize: 14, color: colors.text, fontWeight: '500' },
  btnMargin: { marginTop: 24, marginBottom: 14 },
  checklist: {
    backgroundColor: colors.card, borderRadius: 8, padding: 12,
    marginTop: 8, marginBottom: 4, gap: 6,
  },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkOk: { fontSize: 12, color: colors.success, fontWeight: '700' },
  checkPending: { fontSize: 12, color: colors.textMuted },
  checkLabelOk: { fontSize: 11, color: colors.success },
  checkLabelPending: { fontSize: 11, color: colors.textMuted },
});