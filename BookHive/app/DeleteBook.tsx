// app/DeleteBook.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function DeleteBook() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]); // ⭐️ FIXED useState

  const fetchBooks = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        console.error('User not signed in');
        return;
      }

      const booksRef = collection(db, 'books');
      const q = query(booksRef, where('uploadedBy', '==', user.uid)); // ⭐️ Only fetch your uploaded books
      const snapshot = await getDocs(q);

      const booksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'books', id));
              Alert.alert('Deleted!', `${title} has been deleted.`);
              fetchBooks(); // refresh after deletion
            } catch (error) {
              console.error('Error deleting book:', error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Manage Your Books 🗑️</Text>

        {books.map((book) => (
          <View key={book.id} style={styles.bookCard}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(book.id, book.title)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}

        {books.length === 0 && (
          <Text style={styles.noBooksText}>No books available to delete!</Text>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  bookCard: {
    backgroundColor: '#ffffff33',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noBooksText: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
