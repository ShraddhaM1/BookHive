// app/LogoutConfirmScreen.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { auth } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function LogoutConfirmScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/SignUpScreen'); // Redirect to SignUp after logout
    } catch (error) {
      console.log('Logout error:', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Do you want to log out?</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonSmall} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSmall} onPress={handleLogout}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4b3b79',
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
  },
  buttonSmall: {
    backgroundColor: '#6b5b95',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
