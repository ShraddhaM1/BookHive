// app/ViewProfile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useIsFocused } from '@react-navigation/native';

export default function ViewProfile() {
  const isFocused = useIsFocused(); // 👈 magic for refreshing on focus
  const [profile, setProfile] = useState({
    name: '',
    state: '',
    city: '',
    pincode: '',
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || 'N/A',
          state: data.state || 'N/A',
          city: data.city || 'N/A',
          pincode: data.pincode || 'N/A',
        });
      } else {
        setProfile({ name: 'N/A', state: 'N/A', city: 'N/A', pincode: 'N/A' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchProfile(); // 👈 fetch again every time the page comes into view
    }
  }, [isFocused]);

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>👤 Your Profile</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profile.name}</Text>

            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{profile.state}</Text>

            <Text style={styles.label}>City:</Text>
            <Text style={styles.value}>{profile.city}</Text>

            <Text style={styles.label}>Pincode:</Text>
            <Text style={styles.value}>{profile.pincode}</Text>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#613f91bb',
    padding: 24,
    borderRadius: 20,
    width: '100%',
  },
  label: {
    color: '#eee',
    fontWeight: '600',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
});
