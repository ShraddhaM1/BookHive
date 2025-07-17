// app/LocationPage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function LocationPage() {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);

  const saveLocation = async () => {
    try {
      await addDoc(collection(db, 'location'), {
        State: state,
        City: city,
        Pincode: pincode,
      });
      Alert.alert('✅ Success', 'Location saved to Firebase!');
    } catch (err) {
      console.error('Error saving location:', err);
      Alert.alert('❌ Error', 'Could not save location.');
    }
  };

  const fetchLiveLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied ❌', 'Location permission is required.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);

      if (geocode.length > 0) {
        const info = geocode[0];
        setState(info.region || '');
        setCity(info.city || info.district || '');
        setPincode(info.postalCode || '');
      } else {
        Alert.alert('⚠️ Could not fetch geocode');
      }
    } catch (error) {
      console.error('Live location error:', error);
      Alert.alert('❌ Error', 'Could not fetch live location.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter state"
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />

        <Text style={styles.label}>Pincode</Text>
        <TextInput
          style={styles.input}
          value={pincode}
          onChangeText={setPincode}
          placeholder="Enter pincode"
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={fetchLiveLocation}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Getting Live Location...' : '📍 Use Live Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4caf50' }]}
          onPress={saveLocation}
        >
          <Text style={styles.buttonText}>✅ Save Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#613f91',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
