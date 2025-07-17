// App.tsx

import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { Slot } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// ➡️ Set behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const notificationMessages = [
  "📚 Dive into a new story today!",
  "🔥 Hot picks updated! Check now.",
  "💬 Your bookshelf misses you!",
  "🎯 New books are waiting for you!",
  "🌟 Today's Bestseller: Don't miss it!",
  "📖 Unlock a magical world now!",
  "💡 Feed your brain with a new read!",
];

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then(sendRandomNotification);
  }, []);

  async function sendRandomNotification() {
    const randomIndex = Math.floor(Math.random() * notificationMessages.length);
    const message = notificationMessages[randomIndex];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 BOOK HIVE",
        body: message,
        sound: true,  // optional for sound effect
      },
      trigger: {
        seconds: 3, // wait 3 seconds after app open
        channelId: 'default', // ✅ IMPORTANT for Android
      },
    });
  }

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission not granted to show notifications!');
        return;
      }

      // ⚡️ Create channel on Android for notifications
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } else {
      Alert.alert('Must use a physical device for Push Notifications!');
    }
  }

  return <Slot />;
}
