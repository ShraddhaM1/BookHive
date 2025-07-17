import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function UpdateProfile() {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setState(data.state || '');
        setCity(data.city || '');
        setPincode(data.pincode || '');
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    if (!name || !state || !city || !pincode) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          name: name.trim(),
          state: state.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        { merge: true }
      );

      Alert.alert('✅ Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('❌ Error updating:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrapper}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Update Profile 📝</Text>

          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#fff"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="State"
            placeholderTextColor="#fff"
            value={state}
            onChangeText={setState}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor="#fff"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            placeholderTextColor="#fff"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  wrapper: { flex: 1, justifyContent: 'center' },
  container: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 26, color: '#fff', fontWeight: 'bold', marginBottom: 30 },
  input: {
    backgroundColor: '#613f91bb',
    width: 280,
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#613f91',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: 200,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
