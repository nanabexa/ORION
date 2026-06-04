import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { procesarRecarga } from '../../lib/recargas';
import { simularPago } from '../../lib/pagos';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

const detectarNFC = () => {
  if (Platform.OS === 'web') return 'sin-nfc';
  if (Platform.OS === 'ios') return 'sin-nfc';
  if (Platform.OS === 'android') return 'nfc-activo';
  return 'sin-nfc';
};

type Estado = 'formulario' | 'procesando' | 'resultado' | 'nfc-espera' | 'exitoso';
type MetodoPago = 'tarjeta' | 'yappy' | 'transferencia';
type EstadoNFC = 'nfc-activo' | 'nfc-desactivado' | 'sin-nfc';

const MONTO_MAXIMO = 50;
const MONTO_MINIMO = 1;

export default function RecargaScreen() {
  const router = useRouter();
  const [monto, setMonto] = useState('0');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('tarjeta');
  const [estado, setEstado] = useState<Estado>('formulario');
  const [estadoTracker, setEstadoTracker] = useState(0);
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<any>(null);
  const estadoNFC: EstadoNFC = detectarNFC();

  useEffect(() => {
    cargarTarjetas();
  }, []);

  const cargarTarjetas = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from('tarjetas').select('*')
      .eq('usuario_id', user.id).eq('activa', true);
    if (data && data.length > 0) {
      setTarjetas(data);
      setTarjetaSeleccionada(data[0]);
    }
  };

  const formatearMonto = () => {
    const num = parseInt(monto || '0', 10);
    return (num / 100).toFixed(2);
  };

  const montoReal = parseFloat(formatearMonto());
  const montoValido = montoReal >= MONTO_MINIMO && montoReal <= MONTO_MAXIMO;

  const confirmarRecarga = async () => {
    if (!montoValido) return;

    if (!tarjetaSeleccionada) {
      Alert.alert(
        'Sin tarjeta vinculada',
        '¿Deseas vincular una tarjeta ahora?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Vincular', onPress: () => router.push('/vincular' as any) }
        ]
      );
      return;
    }

    setEstado('procesando');
    setEstadoTracker(1);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'No hay sesión activa');
        setEstado('formulario');
        return;
      }

      setEstadoTracker(2);
      const resultadoPago = await simularPago(montoReal, metodoPago);

      if (!resultadoPago.aprobado) {
        Alert.alert('Pago rechazado', resultadoPago.mensaje);
        setEstado('formulario');
        return;
      }

      setEstadoTracker(3);
      await procesarRecarga(user.id, tarjetaSeleccionada.id, montoReal, metodoPago);

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
          <View style={[styles.resultIcon, { borderColor: colors.accent, backgroundColor: `${colors.accent}22` }]}>
            <Text style={styles.resultIconText}>📶</Text>
          </View>
          <Text style={[styles.resultTitle, { color: colors.accent }]}>¡Pago aprobado!</Text>
          <Text style={styles.resultSubtitle}>Acerca tu tarjeta a la parte trasera del teléfono</Text>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Monto aprobado</Text>
            <Text style={styles.amountValue}>B/. {formatearMonto()}</Text>
          </View>
          <View style={[styles.statusBox, { borderColor: colors.accent, backgroundColor: `${colors.accent}15` }]}>
            <Text style={styles.statusIcon}>📱</Text>
            <View style={styles.statusText}>
              <Text style={[styles.statusTitle, { color: colors.accent }]}>Mantén la tarjeta quieta</Text>
              <Text style={styles.statusDesc}>Coloca tu tarjeta RapiPass en la parte trasera por 2 segundos.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[common.btnPrimary, { backgroundColor: colors.accent }]}
            onPress={() => setEstado('resultado')}
          >
            <Text style={[common.btnPrimaryText, { color: colors.background }]}>Simular acercamiento →</Text>
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

          {tarjetas.length > 1 && (
            <>
              <Text style={common.sectionLabel}>Tarjeta a recargar</Text>
              <View style={styles.payOptions}>
                {tarjetas.map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[styles.payOpt, tarjetaSeleccionada?.id === t.id && styles.payOptActive]}
                    onPress={() => setTarjetaSeleccionada(t)}
                  >
                    <View style={[styles.radio, tarjetaSeleccionada?.id === t.id && styles.radioActive]}>
                      {tarjetaSeleccionada?.id === t.id && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.payIcon}>💳</Text>
                    <View>
                      <Text style={styles.payName}>{t.numero_tarjeta}</Text>
                      <Text style={styles.payDesc}>Saldo: B/. {t.saldo?.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Text style={common.sectionLabel}>Monto a recargar</Text>
          <View style={[styles.montoWrap, montoReal > MONTO_MAXIMO && { borderColor: colors.error }]}>
            <Text style={styles.montoCurrency}>B/.</Text>
            <TextInput
              style={styles.montoInput}
              value={formatearMonto()}
              onChangeText={(texto) => {
                const soloNumeros = texto.replace(/\D/g, '').slice(0, 5);
                setMonto(soloNumeros || '0');
              }}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
            />
          </View>
          {montoReal > MONTO_MAXIMO && (
            <Text style={common.errorText}>Límite máximo B/.{MONTO_MAXIMO}.00</Text>
          )}
          <Text style={styles.limiteText}>Mínimo B/.{MONTO_MINIMO}.00 · Máximo B/.{MONTO_MAXIMO}.00</Text>

          <Text style={common.sectionLabel}>Método de pago</Text>
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
            style={[common.btnPrimary, !montoValido && common.btnDisabled]}
            onPress={confirmarRecarga}
            disabled={!montoValido}
          >
            <Text style={common.btnPrimaryText}>Confirmar recarga →</Text>
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
      icon: '✦', titulo: '¡Recarga exitosa!', subtitulo: 'Tu saldo está activo en tu tarjeta',
      badgeTitle: 'Saldo activo en tarjeta', badgeDesc: 'Puedes usar tu tarjeta de transporte inmediatamente.',
      btnColor: colors.accent, btnText: colors.background, borderColor: colors.accent,
    },
    'nfc-desactivado': {
      icon: '⚙️', titulo: '¡Pago aprobado!', subtitulo: 'Activa el NFC para sincronizar',
      badgeTitle: 'Activa el NFC en Ajustes', badgeDesc: 'Activa el NFC en tu teléfono y acerca tu tarjeta.',
      btnColor: colors.warning, btnText: colors.background, borderColor: colors.warning,
    },
    'sin-nfc': {
      icon: '🏦', titulo: '¡Pago aprobado!', subtitulo: 'Un paso más para activar tu saldo',
      badgeTitle: 'Acércate a un kiosco', badgeDesc: 'Presenta tu tarjeta en cualquier kiosco para activar tu saldo.',
      btnColor: colors.primary, btnText: colors.text, borderColor: colors.primary,
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
              {estadoNFC === 'nfc-activo' ? 'Sincronizado ✦' : 'Pendiente sync'}
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
            style={[common.btnPrimary, { backgroundColor: config.btnColor }]}
            onPress={onVolver}
          >
            <Text style={[common.btnPrimaryText, { color: config.btnText }]}>Ir al inicio →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnHistorial} onPress={() => router.push('/historial' as any)}>
            <Text style={styles.btnHistorialText}>Ver historial</Text>
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
  screen: { padding: 18 },
  montoWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.primary,
    borderRadius: 10, padding: 12, marginBottom: 4, gap: 6,
  },
  montoCurrency: { fontSize: 18, fontWeight: '700', color: colors.accent },
  montoInput: { flex: 1, fontSize: 24, fontWeight: '700', color: colors.text },
  limiteText: { fontSize: 10, color: colors.textMuted, marginBottom: 14 },
  payOptions: { flexDirection: 'column', gap: 8, marginBottom: 18 },
  payOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 10, padding: 12,
  },
  payOptActive: { borderColor: colors.primary, backgroundColor: colors.overlay },
  radio: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioInner: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary },
  payIcon: { fontSize: 18 },
  payName: { fontSize: 13, color: colors.text, fontWeight: '500' },
  payDesc: { fontSize: 10, color: colors.textMuted, marginTop: 1 },
  tracker: { backgroundColor: colors.card, borderRadius: 12, padding: 14, marginTop: 10 },
  trackerTitle: {
    fontSize: 9, color: colors.textMuted, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 12,
  },
  trackerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 6 },
  trackerLine: { flexDirection: 'column', alignItems: 'center' },
  trackerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border, marginTop: 1 },
  trackerDotDone: { backgroundColor: colors.accent },
  trackerDotActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowRadius: 4, shadowOpacity: 1 },
  trackerConnector: { width: 1, height: 14, backgroundColor: colors.border, marginVertical: 2 },
  trackerText: { fontSize: 11, color: colors.textMuted },
  trackerTextDone: { color: colors.accent, fontWeight: '600' },
  trackerTextActive: { color: colors.text, fontWeight: '600' },
  trackerSub: { fontSize: 9, color: colors.textMuted, marginTop: 1 },
  trackerSubActive: { color: colors.primary },
  resultScreen: { padding: 24, alignItems: 'center' },
  resultIcon: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginBottom: 16, marginTop: 20,
  },
  resultIconText: { fontSize: 34 },
  resultTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6, letterSpacing: 1, textAlign: 'center' },
  resultSubtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 24, textAlign: 'center' },
  amountBox: {
    backgroundColor: colors.card, borderRadius: 12, padding: 16,
    marginBottom: 16, width: '100%', borderWidth: 0.5, borderColor: colors.border,
  },
  amountLabel: { fontSize: 9, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  amountValue: { fontSize: 28, fontWeight: '900', color: colors.text },
  amountCard: { fontSize: 10, color: colors.textMuted, marginTop: 4 },
  statusBox: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    borderRadius: 10, padding: 12, marginBottom: 20,
    width: '100%', borderWidth: 0.5,
  },
  statusIcon: { fontSize: 18, marginTop: 1 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 12, fontWeight: '700', marginBottom: 3 },
  statusDesc: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  btnHistorial: {
    borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 10, padding: 14,
    alignItems: 'center', width: '100%',
  },
  btnHistorialText: { color: colors.textMuted, fontSize: 13 },
});