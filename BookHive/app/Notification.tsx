// app/Notification.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

interface NotificationItem {
  id: string;
  message: string;
  type: string;
  createdAt: any;
}

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const fetchedNotifications: NotificationItem[] = snapshot.docs.map(doc => ({
        id: doc.id,
        message: doc.data().message,
        type: doc.data().type,
        createdAt: doc.data().createdAt,
      }));

      setNotifications(fetchedNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationCard}>
      <Ionicons name={getIconName(item.type)} size={24} color="#333" style={styles.icon} />
      <Text style={styles.message}>{item.message}</Text>
    </View>
  );

  const getIconName = (type: string) => {
    switch (type) {
      case 'sale':
        return 'pricetag-outline';
      case 'missing_you':
        return 'heart-dislike-outline';
      case 'biography_quote':
        return 'person-circle-outline';
      case 'character_message':
        return 'book-outline';
      case 'motivation':
        return 'sparkles-outline';
      default:
        return 'notifications-outline';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Notifications</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#333" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
