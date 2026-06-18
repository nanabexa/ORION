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

    const recuperarPassword = async () => {
        console.log('1 - boton presionado, correo:', correo);

        if (!correo) {
            Alert.alert('Error', 'Ingrese su correo');
            return;
        }

        setCargando(true);
        console.log('2 - llamando a supabase');

        const { error } = await supabase.auth.resetPasswordForEmail(
            correo,
            {
                redirectTo: 'orionmvp://reset-password'
            }
        );

        console.log('3 - respuesta error:', error);
        setCargando(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert(
                'Correo enviado',
                'Revisa tu bandeja de entrada para restablecer tu contraseña.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }
    };

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
                style={[common.btnPrimary, { marginTop: 20 }]}
                onPress={recuperarPassword}
                disabled={cargando}
            >
                <Text style={common.btnPrimaryText}>
                    {cargando ? 'Enviando...' : 'Enviar enlace'}
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