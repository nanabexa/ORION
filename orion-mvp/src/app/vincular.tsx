import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { vincularTarjeta } from '../../lib/tarjetas';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

type TipoTarjeta = 'rapipass' | 'metro' | null;

export default function VincularScreen() {
  const router = useRouter();
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState<TipoTarjeta>(null);
  const [cargando, setCargando] = useState(false);

  const formatearNumero = (texto: string) => {
    const max = tipo === 'metro' ? 10 : 8;
    const limpio = texto.replace(/\D/g, '').slice(0, max);
    const grupos = limpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : limpio;
  };

  const handleCambio = (texto: string) => setNumero(formatearNumero(texto));

  const digitosRequeridos = tipo === 'metro' ? 10 : 8;
  const numeroCompleto = numero.replace(/\s/g, '').length === digitosRequeridos;
  const listo = numeroCompleto && tipo !== null;

  const colorTarjeta = tipo === 'rapipass' ? colors.rapipass : tipo === 'metro' ? colors.metro : colors.card;
  const nombreTarjeta = tipo === 'rapipass'
    ? 'RapiPass · Terminal + MetroBus + Metro'
    : tipo === 'metro'
      ? 'Metro + MetroBus · Ciudad de Panamá'
      : 'Selecciona tu tipo de tarjeta';

  const handleVincular = async () => {
    if (!listo) return;
    setCargando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No hay sesión activa');
        setCargando(false);
        return;
      }

      const numeroLimpio = numero.replace(/\s/g, '');

      const { data: tarjetaValida, error: errorValidacion } = await supabase
        .from('tarjetas_validas')
        .select('numero, tipo')
        .eq('numero', numeroLimpio)
        .eq('activa', true)
        .single();

      if (!tarjetaValida) {
        Alert.alert('Tarjeta no encontrada', 'El número ingresado no está registrado en el sistema.');
        setCargando(false);
        return;
      }

      if (tarjetaValida.tipo !== tipo) {
        Alert.alert('Tipo incorrecto', `Este número corresponde a una tarjeta ${tarjetaValida.tipo === 'metro' ? 'Metro + MetroBus' : 'RapiPass'}.`);
        setCargando(false);
        return;
      }

      await vincularTarjeta(user.id, numeroLimpio);
      Alert.alert('¡Listo!', 'Tarjeta vinculada correctamente', [
        { text: 'OK', onPress: () => router.push('/tarjetas' as any) }
      ]);

    } catch (error: any) {
      Alert.alert('Error', error?.message || JSON.stringify(error));
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={{ width: 24 }} />
          <Text style={styles.navTitle}>MIS TARJETAS</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
        >
          <View style={styles.screen}>

            <View style={[styles.cardPreview, { backgroundColor: colorTarjeta }]}>
              <View style={styles.cardGlow} />
              <View style={styles.cardChip} />
              <Text style={styles.cardNumber}>
                {numero.length > 0 ? numero.padEnd(19, '•').slice(0, 19) : '•••• •••• •••• ••••'}
              </Text>
              <Text style={styles.cardLabel}>Tarjeta de transporte</Text>
              <Text style={styles.cardSub}>{nombreTarjeta}</Text>
            </View>

            <Text style={common.sectionLabel}>Tipo de tarjeta</Text>
            <View style={styles.tiposWrap}>
              {[
                { id: 'metro', nombre: 'Metro + MetroBus', desc: 'Ciudad de Panamá' },
                { id: 'rapipass', nombre: 'RapiPass', desc: 'Terminal + MetroBus + Metro' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.tipoOpt, tipo === item.id && styles.tipoOptActive]}
                  onPress={() => setTipo(item.id as TipoTarjeta)}
                >
                  <View style={[styles.tipoRadio, tipo === item.id && styles.tipoRadioActive]}>
                    {tipo === item.id && <View style={styles.tipoRadioInner} />}
                  </View>
                  <View style={styles.tipoTextWrap}>
                    <Text style={styles.tipoNombre}>{item.nombre}</Text>
                    <Text style={styles.tipoDesc}>{item.desc}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={common.sectionLabel}>Número de tarjeta</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={numero}
                onChangeText={handleCambio}
                placeholder="0000 0000"
                placeholderTextColor="#4A5A7A"
                keyboardType="numeric"
                maxLength={tipo === 'metro' ? 13 : 9}
              />
            </View>

            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                El número de 8 o 10 dígitos está en tu tarjeta de transporte.
              </Text>
            </View>

            <TouchableOpacity
              style={[common.btnPrimary, !listo && common.btnDisabled]}
              onPress={handleVincular}
              disabled={!listo || cargando}
            >
              <Text style={common.btnPrimaryText}>
                {cargando ? 'Vinculando...' : 'Vincular tarjeta →'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 18, paddingTop: 48, borderBottomWidth: 0.5, borderBottomColor: colors.borderLight,
  },
  navTitle: { fontWeight: '900', fontSize: 13, color: colors.text, letterSpacing: 3 },
  screen: { padding: 20 },
  cardPreview: {
    borderRadius: 14, padding: 20, marginBottom: 24,
    position: 'relative', overflow: 'hidden', minHeight: 140,
  },
  cardGlow: {
    position: 'absolute', top: -20, right: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(200,212,0,0.08)',
  },
  cardChip: {
    width: 28, height: 20, backgroundColor: colors.accent,
    borderRadius: 4, marginBottom: 16, opacity: 0.8,
  },
  cardNumber: {
    fontFamily: 'monospace', fontSize: 16, fontWeight: '700',
    color: colors.text, letterSpacing: 2, marginBottom: 12,
  },
  cardLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 },
  cardSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  tiposWrap: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tipoOpt: {
    flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 10, padding: 12, minHeight: 70,
  },
  tipoOptActive: { borderColor: colors.primary, backgroundColor: colors.overlay },
  tipoRadio: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  tipoRadioActive: { borderColor: colors.primary },
  tipoRadioInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  tipoTextWrap: { flex: 1 },
  tipoNombre: { fontSize: 11, color: colors.text, fontWeight: '600', flexWrap: 'wrap' },
  tipoDesc: { fontSize: 9, color: colors.textMuted, marginTop: 2, flexWrap: 'wrap' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.primary,
    borderRadius: 10, padding: 13, marginBottom: 14,
  },
  input: { flex: 1, fontSize: 18, color: colors.text, letterSpacing: 2 },
  hintBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 8, padding: 12, marginBottom: 24,
  },
  hintText: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
});