import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BookCard({ book }) {
  const router = useRouter();
  const fallbackImage = 'https://via.placeholder.com/150x200?text=No+Image';
  const bookImage = book.imageUrl || book.image || fallbackImage;

  const handlePress = () => {
    router.push({
      pathname: '/BookDetails',
      params: {
        title: book.title,
        author: book.author,
        image: bookImage,
        price: String(book.price || '0'),
        rent: String(book.rent || Math.floor((book.price || 0) * 0.6)),
        rating: String(book.rating || 4.5),
        description: book.description || 'No description available.',
        genre: book.genre || 'Unknown', // ✅ new genre key passed here
      },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: bookImage }}
        style={styles.image}
        resizeMode="cover"
        onError={() => console.warn(`❌ Failed to load image for: ${book.title}`)}
      />
      <Text style={styles.title} numberOfLines={2}>
        {book.title || 'Unknown Title'}
      </Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.author ? `by ${book.author}` : 'Author Unknown'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    color: '#222',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
