import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { procesarRecarga } from '../../lib/recargas';
import { simularPago } from '../../lib/pagos';

const detectarNFC = () => {
  if (Platform.OS === 'web') return 'sin-nfc';
  if (Platform.OS === 'ios') return 'sin-nfc';
  if (Platform.OS === 'android') return 'nfc-activo';
  return 'sin-nfc';
};

type Estado = 'formulario' | 'procesando' | 'resultado' | 'nfc-espera' | 'exitoso';
type MetodoPago = 'tarjeta' | 'yappy' | 'transferencia';
type EstadoNFC = 'nfc-activo' | 'nfc-desactivado' | 'sin-nfc';

export default function RecargaScreen() {
  const router = useRouter();
  const [monto, setMonto] = useState('0');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');
  const [estado, setEstado] = useState<Estado>('formulario');
  const [estadoTracker, setEstadoTracker] = useState(0);
  const estadoNFC: EstadoNFC = detectarNFC();

  const formatearMonto = () => {
    const num = parseInt(monto || '0', 10);
    return (num / 100).toFixed(2);
  };

  const confirmarRecarga = async () => {
    if (parseInt(monto) <= 0) return;

    setEstado('procesando');
    setEstadoTracker(1);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No hay sesión activa');
        setEstado('formulario');
        return;
      }

      // Obtener tarjeta del usuario
      const { data: tarjetas } = await supabase
        .from('tarjetas')
        .select('id')
        .eq('usuario_id', user.id)
        .eq('activa', true)
        .limit(1);

      if (!tarjetas || tarjetas.length === 0) {
        Alert.alert('Error', 'No tienes tarjetas vinculadas');
        setEstado('formulario');
        return;
      }

      const montoReal = parseFloat(formatearMonto());

      setEstadoTracker(2);

      // Simular pago
      const resultadoPago = await simularPago(montoReal, metodoPago);

      if (!resultadoPago.aprobado) {
        Alert.alert('Pago rechazado', resultadoPago.mensaje);
        setEstado('formulario');
        return;
      }

      setEstadoTracker(3);

      // Procesar recarga real en Supabase
      await procesarRecarga(user.id, tarjetas[0].id, montoReal, metodoPago);

      if (estadoNFC === 'nfc-activo') {
        setEstado('nfc-espera');
      } else {
        setEstado('resultado');
      }

    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al procesar la recarga');
      setEstado('formulario');
    }
  };

  if (estado === 'nfc-espera') {
    return (
      <View style={styles.container}>
        <View style={styles.navbar}>
          <View style={{ width: 24 }} />
          <Text style={styles.navTitle}>SINCRONIZAR</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.resultScreen}>
          <View style={[styles.resultIcon, { borderColor: '#C8D400', backgroundColor: '#C8D40022' }]}>
            <Text style={styles.resultIconText}>📶</Text>
          </View>
          <Text style={[styles.resultTitle, { color: '#C8D400' }]}>¡Pago aprobado!</Text>
          <Text style={styles.resultSubtitle}>Acerca tu tarjeta a la parte trasera del teléfono</Text>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto aprobado</Text>
            <Text style={styles.amountValue}>B/. {formatearMonto()}</Text>
          </View>
          <View style={[styles.statusBox, { borderColor: '#C8D400', backgroundColor: '#C8D40015' }]}>
            <Text style={styles.statusIcon}>📱</Text>
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: '#C8D400' }]}>Mantén la tarjeta quieta</Text>
              <Text style={styles.statusDesc}>Coloca tu tarjeta RapiPass en la parte trasera por 2 segundos.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: '#C8D400' }]}
            onPress={() => setEstado('resultado')}
          >
            <Text style={[styles.btnPrimaryText, { color: '#0A0E1F' }]}>Simular acercamiento →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (estado === 'resultado') {
    return (
      <PantallaResultado
        monto={formatearMonto()}
        estadoNFC={estadoNFC}
        onVolver={() => router.push('/saldo' as any)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.navBack}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>NUEVA RECARGA</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.screen}>

          <Text style={styles.sectionLabel}>Monto a recargar</Text>
          <View style={styles.montoWrap}>
            <Text style={styles.montoCurrency}>B/.</Text>
            <TextInput
              style={styles.montoInput}
              value={formatearMonto()}
              onChangeText={(texto) => {
                const soloNumeros = texto.replace(/\D/g, '').slice(0, 6);
                setMonto(soloNumeros || '0');
              }}
              placeholder="0.00"
              placeholderTextColor="#8899AA"
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.sectionLabel}>Método de pago</Text>
          <View style={styles.payOptions}>
            {[
              { id: 'tarjeta', icon: '💳', name: 'Tarjeta', desc: 'Débito o crédito •••• 4242' },
              { id: 'yappy', icon: '📱', name: 'Yappy', desc: 'Pago instantáneo' },
              { id: 'transferencia', icon: '🏦', name: 'Transferencia', desc: 'Banco en línea' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.payOpt, metodoPago === item.id && styles.payOptActive]}
                onPress={() => setMetodoPago(item.id as MetodoPago)}
              >
                <View style={[styles.radio, metodoPago === item.id && styles.radioActive]}>
                  {metodoPago === item.id && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.payIcon}>{item.icon}</Text>
                <View>
                  <Text style={styles.payName}>{item.name}</Text>
                  <Text style={styles.payDesc}>{item.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btnPrimary, parseInt(monto) <= 0 && styles.btnDisabled]}
            onPress={confirmarRecarga}
            disabled={parseInt(monto) <= 0}
          >
            <Text style={styles.btnPrimaryText}>Confirmar recarga →</Text>
          </TouchableOpacity>

          {estado === 'procesando' && (
            <View style={styles.tracker}>
              <Text style={styles.trackerTitle}>Estado</Text>
              {[
                { label: 'Procesando', sub: 'Solicitud enviada' },
                { label: 'Aprobando', sub: 'Verificando pago...' },
                { label: 'Lista', sub: 'Saldo acreditado' },
              ].map((item, index) => (
                <View key={index} style={styles.trackerRow}>
                  <View style={styles.trackerLine}>
                    <View style={[
                      styles.trackerDot,
                      estadoTracker > index && styles.trackerDotDone,
                      estadoTracker === index + 1 && styles.trackerDotActive,
                    ]} />
                    {index < 2 && <View style={styles.trackerConnector} />}
                  </View>
                  <View>
                    <Text style={[
                      styles.trackerText,
                      estadoTracker > index && styles.trackerTextDone,
                      estadoTracker === index + 1 && styles.trackerTextActive,
                    ]}>{item.label}</Text>
                    <Text style={[
                      styles.trackerSub,
                      estadoTracker === index + 1 && styles.trackerSubActive,
                    ]}>{item.sub}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}

function PantallaResultado({ monto, estadoNFC, onVolver }: {
  monto: string;
  estadoNFC: EstadoNFC;
  onVolver: () => void;
}) {
  const router = useRouter();

  const config = {
    'nfc-activo': {
      icon: '✦',
      titulo: '¡Recarga exitosa!',
      subtitulo: 'Tu saldo está activo en tu tarjeta',
      badgeTitle: 'Saldo activo en tarjeta',
      badgeDesc: 'Puedes usar tu tarjeta de transporte inmediatamente.',
      btnColor: '#C8D400',
      btnText: '#0A0E1F',
      borderColor: '#C8D400',
    },
    'nfc-desactivado': {
      icon: '⚙️',
      titulo: '¡Pago aprobado!',
      subtitulo: 'Activa el NFC para sincronizar',
      badgeTitle: 'Activa el NFC en Ajustes',
      badgeDesc: 'Activa el NFC en tu teléfono y acerca tu tarjeta para sincronizar.',
      btnColor: '#EF9F27',
      btnText: '#0A0E1F',
      borderColor: '#EF9F27',
    },
    'sin-nfc': {
      icon: '🏦',
      titulo: '¡Pago aprobado!',
      subtitulo: 'Un paso más para activar tu saldo',
      badgeTitle: 'Acércate a un kiosco',
      badgeDesc: 'Presenta tu tarjeta en cualquier kiosco o validador para activar tu saldo.',
      btnColor: '#0066CC',
      btnText: '#FFFFFF',
      borderColor: '#0066CC',
    },
  }[estadoNFC];

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <View style={{ width: 24 }} />
        <Text style={styles.navTitle}>RECARGA</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.resultScreen}>
          <View style={[styles.resultIcon, { borderColor: config.borderColor, backgroundColor: `${config.borderColor}22` }]}>
            <Text style={styles.resultIconText}>{config.icon}</Text>
          </View>
          <Text style={[styles.resultTitle, { color: config.borderColor }]}>{config.titulo}</Text>
          <Text style={styles.resultSubtitle}>{config.subtitulo}</Text>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto recargado</Text>
            <Text style={styles.amountValue}>B/. {monto}</Text>
            <Text style={styles.amountCard}>
              Tarjeta •••• 4821 · {estadoNFC === 'nfc-activo' ? 'Sincronizado ✦' : 'Pendiente sync'}
            </Text>
          </View>
          <View style={[styles.statusBox, { borderColor: config.borderColor, backgroundColor: `${config.borderColor}15` }]}>
            <Text style={styles.statusIcon}>💳</Text>
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: config.borderColor }]}>{config.badgeTitle}</Text>
              <Text style={styles.statusDesc}>{config.badgeDesc}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: config.btnColor }]}
            onPress={onVolver}
          >
            <Text style={[styles.btnPrimaryText, { color: config.btnText }]}>Ir al inicio →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnHistorial}
            onPress={() => router.push('/historial' as any)}
          >
            <Text style={styles.btnHistorialText}>Ver historial</Text>
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
  screen: { padding: 18 },
  sectionLabel: {
    fontSize: 10, color: '#C8D400', fontWeight: '600',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 4,
  },
  montoWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#141830', borderWidth: 0.5, borderColor: '#0066CC',
    borderRadius: 10, padding: 12, marginBottom: 18, gap: 6,
  },
  montoCurrency: { fontSize: 18, fontWeight: '700', color: '#C8D400' },
  montoInput: { flex: 1, fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  payOptions: { flexDirection: 'column', gap: 8, marginBottom: 18 },
  payOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#141830', borderWidth: 0.5, borderColor: '#1E2A50',
    borderRadius: 10, padding: 12,
  },
  payOptActive: { borderColor: '#0066CC', backgroundColor: '#001A35' },
  radio: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: '#1E2A50',
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: '#0066CC' },
  radioInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#0066CC' },
  payIcon: { fontSize: 18 },
  payName: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  payDesc: { fontSize: 10, color: '#8899AA', marginTop: 1 },
  btnPrimary: {
    backgroundColor: '#0066CC', borderRadius: 10,
    padding: 14, alignItems: 'center', marginBottom: 10,
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  tracker: { backgroundColor: '#141830', borderRadius: 12, padding: 14 },
  trackerTitle: {
    fontSize: 9, color: '#8899AA', letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 12,
  },
  trackerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  trackerLine: { flexDirection: 'column', alignItems: 'center' },
  trackerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1E2A50', marginTop: 1 },
  trackerDotDone: { backgroundColor: '#C8D400' },
  trackerDotActive: { backgroundColor: '#0066CC', shadowColor: '#0066CC', shadowRadius: 4, shadowOpacity: 1 },
  trackerConnector: { width: 1, height: 14, backgroundColor: '#1E2A50', marginVertical: 2 },
  trackerText: { fontSize: 11, color: '#8899AA' },
  trackerTextDone: { color: '#C8D400', fontWeight: '600' },
  trackerTextActive: { color: '#FFFFFF', fontWeight: '600' },
  trackerSub: { fontSize: 9, color: '#8899AA', marginTop: 1 },
  trackerSubActive: { color: '#0066CC' },
  resultScreen: { padding: 24, alignItems: 'center' },
  resultIcon: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 20,
  },
  resultIconText: { fontSize: 34 },
  resultTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6, letterSpacing: 1, textAlign: 'center' },
  resultSubtitle: { fontSize: 13, color: '#8899AA', marginBottom: 24, textAlign: 'center' },
  amountBox: {
    backgroundColor: '#141830', borderRadius: 12, padding: 16,
    marginBottom: 16, width: '100%', borderWidth: 0.5, borderColor: '#1E2A50',
  },
  amountLabel: { fontSize: 9, color: '#8899AA', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  amountValue: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  amountCard: { fontSize: 10, color: '#8899AA', marginTop: 4 },
  statusBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    borderRadius: 10, padding: 12, marginBottom: 20,
    width: '100%', borderWidth: 0.5,
  },
  statusIcon: { fontSize: 18, marginTop: 1 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 12, fontWeight: '700', marginBottom: 3 },
  statusDesc: { fontSize: 11, color: '#8899AA', lineHeight: 16 },
  btnHistorial: {
    borderWidth: 0.5, borderColor: '#1E2A50',
    borderRadius: 10, padding: 14,
    alignItems: 'center', width: '100%',
  },
  btnHistorialText: { color: '#8899AA', fontSize: 13 },
});