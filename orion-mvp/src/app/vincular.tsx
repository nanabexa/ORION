import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { vincularTarjeta } from '../../lib/tarjetas';

type TipoTarjeta = 'rapipass' | 'metro' | null;

export default function VincularScreen() {
  const router = useRouter();
  const [numero, setNumero] = useState('');
  const [tipo, setTipo] = useState<TipoTarjeta>(null);
  const [cargando, setCargando] = useState(false);

  const formatearNumero = (texto: string) => {
    const limpio = texto.replace(/\D/g, '').slice(0, 8);
    const grupos = limpio.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : limpio;
  };

  const handleCambio = (texto: string) => {
    setNumero(formatearNumero(texto));
  };

  const numeroCompleto = numero.replace(/\s/g, '').length === 8;
  const listo = numeroCompleto && tipo !== null;

  const colorTarjeta = tipo === 'rapipass' ? '#FF6B00' : tipo === 'metro' ? '#003087' : '#141830';
  const nombreTarjeta = tipo === 'rapipass' ? 'RapiPass · Terminal + MetroBus + Metro' : tipo === 'metro' ? 'Metro + MetroBus · Ciudad de Panamá' : 'Selecciona tu tipo de tarjeta';

  const handleVincular = async () => {
    if (!listo) return;

    setCargando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No hay sesión activa');
        return;
      }

      const numeroLimpio = numero.replace(/\s/g, '');
      await vincularTarjeta(user.id, numeroLimpio);

      Alert.alert('¡Listo!', 'Tarjeta vinculada correctamente');
      router.push('/saldo');

    } catch (error) {
      Alert.alert('Error', 'No se pudo vincular la tarjeta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={{ width: 24 }} />
        <Text style={styles.navTitle}>MIS TARJETAS</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
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

          <Text style={styles.sectionLabel}>Tipo de tarjeta</Text>
          <View style={styles.tiposWrap}>

            <TouchableOpacity
              style={[styles.tipoOpt, tipo === 'metro' && styles.tipoOptActive]}
              onPress={() => setTipo('metro')}
            >
              <View style={[styles.tipoRadio, tipo === 'metro' && styles.tipoRadioActive]}>
                {tipo === 'metro' && <View style={styles.tipoRadioInner} />}
              </View>
              <Text style={styles.tipoIcon}>🚇</Text>
              <View>
                <Text style={styles.tipoNombre}>Metro + MetroBus</Text>
                <Text style={styles.tipoDesc}>Ciudad de Panamá</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tipoOpt, tipo === 'rapipass' && styles.tipoOptActive]}
              onPress={() => setTipo('rapipass')}
            >
              <View style={[styles.tipoRadio, tipo === 'rapipass' && styles.tipoRadioActive]}>
                {tipo === 'rapipass' && <View style={styles.tipoRadioInner} />}
              </View>
              <Text style={styles.tipoIcon}>🎫</Text>
              <View>
                <Text style={styles.tipoNombre}>RapiPass</Text>
                <Text style={styles.tipoDesc}>Terminal + MetroBus + Metro</Text>
              </View>
            </TouchableOpacity>

          </View>

          <Text style={styles.sectionLabel}>Número de tarjeta</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.inputIcon}>💳</Text>
            <TextInput
              style={styles.input}
              value={numero}
              onChangeText={handleCambio}
              placeholder="0000 0000"
              placeholderTextColor="#4A5A7A"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>

          <View style={styles.hintBox}>
            <Text style={styles.hintIcon}>ℹ️</Text>
            <Text style={styles.hintText}>
              El número de 8 dígitos está en tu tarjeta de transporte.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, !listo && styles.btnDisabled]}
            onPress={handleVincular}
            disabled={!listo || cargando}
          >
            <Text style={styles.btnPrimaryText}>
              {cargando ? 'Vinculando...' : 'Vincular tarjeta →'}
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
  navTitle: { fontWeight: '900', fontSize: 13, color: '#FFFFFF', letterSpacing: 3 },
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
    width: 28, height: 20, backgroundColor: '#C8D400',
    borderRadius: 4, marginBottom: 16, opacity: 0.8,
  },
  cardNumber: {
    fontFamily: 'monospace', fontSize: 16, fontWeight: '700',
    color: '#FFFFFF', letterSpacing: 2, marginBottom: 12,
  },
  cardLabel: { fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1 },
  cardSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  sectionLabel: {
    fontSize: 10, color: '#C8D400', fontWeight: '600',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
  },
  tiposWrap: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tipoOpt: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#141830', borderWidth: 0.5, borderColor: '#1E2A50',
    borderRadius: 10, padding: 12,
  },
  tipoOptActive: { borderColor: '#0066CC', backgroundColor: '#001A35' },
  tipoRadio: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: '#1E2A50',
    alignItems: 'center', justifyContent: 'center',
  },
  tipoRadioActive: { borderColor: '#0066CC' },
  tipoRadioInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0066CC' },
  tipoIcon: { fontSize: 16 },
  tipoNombre: { fontSize: 11, color: '#FFFFFF', fontWeight: '600' },
  tipoDesc: { fontSize: 9, color: '#8899AA', marginTop: 1 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#141830', borderWidth: 0.5, borderColor: '#0066CC',
    borderRadius: 10, padding: 13, marginBottom: 14,
  },
  inputIcon: { fontSize: 18 },
  input: { flex: 1, fontSize: 18, color: '#FFFFFF', letterSpacing: 2 },
  hintBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: '#141830', borderWidth: 0.5, borderColor: '#1E2A50',
    borderRadius: 8, padding: 12, marginBottom: 24,
  },
  hintIcon: { fontSize: 14, marginTop: 1 },
  hintText: { flex: 1, fontSize: 11, color: '#8899AA', lineHeight: 16 },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});