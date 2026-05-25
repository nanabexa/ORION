import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>ORION</Text>
      <Text style={styles.subtitulo}>Sistema de recarga digital</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  subtitulo: {
    fontSize: 16,
    color: '#8899AA',
    marginTop: 8,
  },
});