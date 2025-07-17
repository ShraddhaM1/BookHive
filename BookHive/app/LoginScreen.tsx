// app/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Oops!', 'Please enter both email and password!');
      return;
    }

    try {
      // Firebase Auth Sign In
      await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful');
      router.replace('/Dashboard');
    } catch (error: any) {
      console.log('❌ Login Error:', error.code);

      if (error.code === 'auth/user-not-found') {
        Alert.alert('User Not Found 😔', 'You are not registered. Please sign up first!');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Wrong Password 🤐', 'Try again with the correct password!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email 🧐', 'Please enter a valid email address!');
      } else {
        Alert.alert('Login Failed 😣', error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
      imageStyle={{ opacity: 0.3 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to BookHive</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#333"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#333"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    elevation: 3,
  },
  button: {
    backgroundColor: '#E9C5A6',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
