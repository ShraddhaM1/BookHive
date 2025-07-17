import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

interface BookDetailsParams {
  title?: string;
  author?: string;
  image?: string;
  price?: string;
  rent?: string;
  rating?: string;
  description?: string;
  genre?: string;
}

export default function BookDetails() {
  const {
    title = 'Unknown Title',
    author = 'Unknown Author',
    image = 'https://via.placeholder.com/300x400?text=No+Image',
    price = '399',
    rent = '199',
    rating = '4.5',
    description = 'No description available.',
    genre = 'Unknown',
  } = useLocalSearchParams() as BookDetailsParams;

  const handleAddToCart = async (mode: 'buy' | 'rent') => {
    try {
      await addDoc(collection(db, 'cart'), {
        title,
        author,
        price: Number(price),
        rent: Number(rent),
        mode,
        genre,
        imageUrl: image,
        quantity: 1,
      });
      Alert.alert('Success ✅', `${title} added to cart for ${mode}!`);
    } catch (error) {
      console.error('❌ Failed to add to cart:', error);
      Alert.alert('Error', 'Something went wrong while adding to cart.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f6f6' }}>
      <ScrollView style={styles.container}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.author}>by {author}</Text>
          <Text style={styles.genre}>Genre: {genre}</Text>
          <Text style={styles.price}>Buy: ₹{price}</Text>
          <Text style={styles.rent}>Rent: ₹{rent}</Text>
          <Text style={styles.rating}>⭐ {rating}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.buyBtn} onPress={() => handleAddToCart('buy')}>
              <Text style={styles.cartBtnText}>Buy 🛒</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rentBtn} onPress={() => handleAddToCart('rent')}>
              <Text style={styles.cartBtnText}>Rent 📚</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'cover',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  content: {
    marginTop: -15,
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  genre: {
    fontSize: 16,
    color: '#008080',
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#009900',
    marginBottom: 2,
  },
  rent: {
    fontSize: 16,
    color: '#ff6600',
    marginBottom: 6,
  },
  rating: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444',
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  buyBtn: {
    backgroundColor: '#613f91',
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  rentBtn: {
    backgroundColor: '#F29C9C',
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cartBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
