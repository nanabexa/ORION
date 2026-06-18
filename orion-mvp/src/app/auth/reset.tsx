import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { colors } from '../../theme/colors';
import { common } from '../../theme/components';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [errorConfirmar, setErrorConfirmar] = useState('');

  const validarPassword = (texto: string) => {
    if (!texto) return 'La contraseña es requerida';
    if (texto.length < 8) return 'Mínimo 8 caracteres';
    if (texto.length > 32) return 'Máximo 32 caracteres';
    if (!/[A-Z]/.test(texto)) return 'Debe incluir al menos una mayúscula';
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(texto)) return 'Debe incluir al menos un carácter especial';
    return '';
  };

  const validarConfirmar = (texto: string) => {
    if (!texto) return 'Confirma tu contraseña';
    if (texto !== password) return 'Las contraseñas no coinciden';
    return '';
  };

  const handleActualizar = async () => {
    const errPass = validarPassword(password);
    const errConfirmar = validarConfirmar(confirmar);
    setErrorPassword(errPass);
    setErrorConfirmar(errConfirmar);

    if (errPass || errConfirmar) return;

    setCargando(true);
    const { error } = await supabase.auth.updateUser({ password });
    setCargando(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert(
      '¡Listo!',
      'Tu contraseña fue actualizada correctamente.',
      [{ text: 'OK', onPress: () => router.push('/' as any) }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nueva contraseña</Text>
      <Text style={styles.subtitulo}>Ingresa tu nueva contraseña para continuar</Text>

      <Text style={common.label}>Nueva contraseña</Text>
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

      <Text style={common.label}>Confirmar contraseña</Text>
      <View style={[common.inputWrap, errorConfirmar ? common.inputError : null]}>
        <TextInput
          style={common.inputFlex}
          value={confirmar}
          onChangeText={(texto) => { setConfirmar(texto); setErrorConfirmar(validarConfirmar(texto)); }}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          secureTextEntry={!verPassword}
          maxLength={32}
        />
      </View>
      {errorConfirmar ? <Text style={common.errorText}>{errorConfirmar}</Text> : null}

      <TouchableOpacity
        style={[common.btnPrimary, styles.btnMargin, cargando && common.btnDisabled]}
        onPress={handleActualizar}
        disabled={cargando}
      >
        <Text style={common.btnPrimaryText}>
          {cargando ? 'Actualizando...' : 'Actualizar contraseña →'}
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
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 30,
    textAlign: 'center',
  },
  btnMargin: { marginTop: 20 },
});