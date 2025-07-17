// app/UploadBook.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from 'react-native';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function UploadBook() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState('');
  const [rent, setRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [totalRent, setTotalRent] = useState('');
  const [rating, setRating] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUploadBook = async () => {
    if (!title || !author || !description || !genre || !price || !rent || !deposit || !totalRent || !rating || !imageUrl) {
      Alert.alert('Fill all fields properly!');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('User not logged in!');
        return;
      }

      await addDoc(collection(db, 'books'), {
        title,
        author,
        description,
        genre,
        price: Number(price),
        rent: Number(rent),
        deposit: Number(deposit),
        totalRent: Number(totalRent),
        rating: Number(rating),
        imageUrl,
        createdAt: serverTimestamp(),
        uploadedBy: user.uid, // ⭐ Correctly adding UID here
      });

      Alert.alert('Success!', 'Book uploaded successfully!');
      router.back(); // Navigate back to Admin Panel
    } catch (error) {
      console.error('Error uploading book:', error);
      Alert.alert('Error uploading book');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/welcome_screen.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Upload New Book 📚</Text>

        <View style={styles.formContainer}>
          <TextInput placeholder="Title" style={styles.input} placeholderTextColor="#fff" value={title} onChangeText={setTitle} />
          <TextInput placeholder="Author" style={styles.input} placeholderTextColor="#fff" value={author} onChangeText={setAuthor} />
          <TextInput placeholder="Description" style={styles.input} placeholderTextColor="#fff" value={description} onChangeText={setDescription} />
          <TextInput placeholder="Genre (Academic, Story...)" style={styles.input} placeholderTextColor="#fff" value={genre} onChangeText={setGenre} />
          <TextInput placeholder="Price" style={styles.input} placeholderTextColor="#fff" keyboardType="numeric" value={price} onChangeText={setPrice} />
          <TextInput placeholder="Rent" style={styles.input} placeholderTextColor="#fff" keyboardType="numeric" value={rent} onChangeText={setRent} />
          <TextInput placeholder="Deposit" style={styles.input} placeholderTextColor="#fff" keyboardType="numeric" value={deposit} onChangeText={setDeposit} />
          <TextInput placeholder="Total Rent" style={styles.input} placeholderTextColor="#fff" keyboardType="numeric" value={totalRent} onChangeText={setTotalRent} />
          <TextInput placeholder="Rating" style={styles.input} placeholderTextColor="#fff" keyboardType="numeric" value={rating} onChangeText={setRating} />
          <TextInput placeholder="Image URL" style={styles.input} placeholderTextColor="#fff" value={imageUrl} onChangeText={setImageUrl} />

          <TouchableOpacity style={styles.button} onPress={handleUploadBook}>
            <Text style={styles.buttonText}>Upload Book</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  scrollContainer: { padding: 20, paddingTop: 80, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
  formContainer: { width: '100%', backgroundColor: '#ffffff33', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, marginBottom: 40 },
  input: { backgroundColor: '#7b2cbf', borderRadius: 16, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#fff', marginBottom: 12 },
  button: { backgroundColor: '#5a189a', borderRadius: 25, paddingVertical: 15, alignItems: 'center', marginTop: 10, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
