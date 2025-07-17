// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <>
    <SafeAreaView style={{flex:1}}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false, // Hide header across all screens
          animation: 'slide_from_right', // Optional: nice animation
        }}
      />
      </SafeAreaView>
    </>
  );
}
