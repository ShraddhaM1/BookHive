// app/WelcomeScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      imageStyle={{ opacity: 0.85 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>Welcome to BookHive 📚</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/SignUpScreen')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center' },
  overlay: {
    padding: 30,
    backgroundColor: '#ffffffcc',
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  header: { fontSize: 26, fontWeight: 'bold', color: '#333', marginBottom: 30 },
  button: {
    backgroundColor: '#F29C9C',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 14,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
