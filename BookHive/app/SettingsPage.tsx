import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsPage() {
  const router = useRouter();

  const goToLogoutConfirmation = () => {
    router.push('/LogoutConfirmScreen');
  };

  const goToLocationPage = () => {
    router.push('/LocationPage');
  };

  const goToAdminPage = () => {
    router.push('/Admin');
  };

  const goToNotificationPage = () => {
    router.push('/Notification'); // ⭐️ Route to Notification.tsx
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.title}>Settings ⚙️</Text>

      <View style={styles.buttonContainer}>
        {/* 🛠️ Admin */}
        <TouchableOpacity style={styles.button} onPress={goToAdminPage}>
          <Ionicons name="settings-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>

        {/* 🔔 Notifications */}
        <TouchableOpacity style={styles.button} onPress={goToNotificationPage}>
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Notifications</Text>
        </TouchableOpacity>

        {/* 🔒 Privacy */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="lock-closed-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Privacy</Text>
        </TouchableOpacity>

        {/* ❓ Help */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="help-circle-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Help</Text>
        </TouchableOpacity>

        {/* 📍 Location */}
        <TouchableOpacity style={styles.button} onPress={goToLocationPage}>
          <Ionicons name="location-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>

        {/* 🚪 Logout */}
        <TouchableOpacity style={styles.button} onPress={goToLogoutConfirmation}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.buttonText}>LogOut</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000080',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '600',
  },
});
