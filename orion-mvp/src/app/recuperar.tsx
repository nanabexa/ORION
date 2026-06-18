import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors } from '../theme/colors';
import { common } from '../theme/components';

export default function RecuperarScreen() {
    const router = useRouter();

    const [correo, setCorreo] = useState('');
    const [cargando, setCargando] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const iniciarCooldown = () => {
        setCooldown(30);
        const interval = setInterval(() => {
            setCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const recuperarPassword = async () => {
        if (!correo) {
            Alert.alert('Error', 'Ingrese su correo');
            return;
        }

        setCargando(true);

        const { error } = await supabase.auth.resetPasswordForEmail(
            correo,
            {
                redirectTo: 'orionmvp://auth/reset'
            }
        );

        setCargando(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert(
                'Correo enviado',
                'Revisa tu bandeja de entrada para restablecer tu contraseña.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
            iniciarCooldown();
        }
    };

    const deshabilitado = cargando || cooldown > 0;

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Recuperar contraseña</Text>

            <Text style={common.label}>Correo electrónico</Text>

            <TextInput
                style={common.input}
                value={correo}
                onChangeText={setCorreo}
                placeholder="usuario@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textMuted}
            />

            <TouchableOpacity
                style={[common.btnPrimary, { marginTop: 20 }, deshabilitado && common.btnDisabled]}
                onPress={recuperarPassword}
                disabled={deshabilitado}
            >
                <Text style={common.btnPrimaryText}>
                    {cargando ? 'Enviando...' : cooldown > 0 ? `Espera ${cooldown}s` : 'Enviar enlace'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => router.back()}
            >
                <Text style={common.link}>Volver al inicio de sesión</Text>
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
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 30,
        textAlign: 'center',
    },
});