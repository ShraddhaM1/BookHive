// app/AdminPage.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth'; // ⭐ Import auth also

export default function AdminPage() {
  const router = useRouter();

  const goToUploadBook = () => {
    router.push('/UploadBook');
  };

  const goToDeleteBook = () => {
    router.push('/DeleteBook');
  };

  const goToUploadedBooks = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not signed in!');
        return;
      }

      const booksRef = collection(db, 'books');
      const q = query(booksRef, where('uploadedBy', '==', user.uid)); // ⭐ Filter only this user's books
      const snapshot = await getDocs(q);

      const totalBooks = snapshot.size; // 📚 Number of books uploaded by this user
      Alert.alert('Uploaded Books 📚', `You have uploaded ${totalBooks} books!`);
    } catch (error) {
      console.error('Error fetching uploaded books:', error);
      Alert.alert('Error fetching uploaded books');
    }
  };

  const goToAccounts = () => {
    Alert.alert('Accounts Section', 'Coming Soon...');
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.title}>Manage Your Books 📚</Text>

      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.gridButton} onPress={goToUploadBook}>
            <Text style={styles.buttonText}>Upload Books</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={goToDeleteBook}>
            <Text style={styles.buttonText}>Delete Books</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.gridButton} onPress={goToUploadedBooks}>
            <Text style={styles.buttonText}>Uploaded Books</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridButton} onPress={goToAccounts}>
            <Text style={styles.buttonText}>Accounts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5a189a',
    textAlign: 'center',
    marginBottom: 20,
  },
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  gridButton: {
    backgroundColor: '#6a0dad',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: '40%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
