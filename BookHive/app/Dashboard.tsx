// app/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import BookCard from '../components/BookCard';
import { getAuth } from 'firebase/auth';

export default function Dashboard() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [books, setBooks] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState<string>('Fetching...');
  const [userName, setUserName] = useState<string>('User');
  const [city, setCity] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');

  const fetchBooks = async (genreFilter?: string) => {
    try {
      let booksRef = collection(db, 'books');
      let querySnapshot;

      if (genreFilter) {
        const q = query(booksRef, where('genre', '==', genreFilter));
        querySnapshot = await getDocs(q);
        setSelectedGenre(genreFilter);
      } else {
        querySnapshot = await getDocs(booksRef);
        setSelectedGenre('');
      }

      const booksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBooks(booksList);
    } catch (error) {
      console.error('Error fetching books:', error);
      Alert.alert('Error fetching books', error.message || 'Check Firestore rules.');
    }
  };

  const fetchUserDetails = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLocation('User not signed in');
        return;
      }

      const uid = user.uid;

      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name || 'User');
        setCity(userData.city || '');
        setPincode(userData.pincode || '');
      }
    } catch (err) {
      console.error('Error fetching user info:', err);
      setLocation('Error fetching location');
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cart'), snapshot => {
      setCartCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, []);

  const getBackgroundImage = () => {
    switch (selectedGenre) {
      case 'Horror':
        return require('../assets/images/horror_background.jpeg');
      case 'Romance':
        return require('../assets/images/romance_background.jpeg');
      case 'Academic':
        return require('../assets/images/academic_background.jpeg');
      case 'Story':
        return require('../assets/images/story_background.jpeg');
      case 'Novel':
        return require('../assets/images/classic_background.jpeg');
      default:
        return require('../assets/images/welcome_screen.jpeg');
    }
  };

  return (
    <ImageBackground
      source={getBackgroundImage()}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <TouchableOpacity style={styles.settings} onPress={() => router.push('/SettingsPage')}>
        <Ionicons name="settings-outline" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.profile} onPress={() => router.push('/ProfilePage')}>
        <Ionicons name="person-circle-outline" size={28} color="black" />
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search books..."
          placeholderTextColor="#555"
          style={styles.searchInput}
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        <TouchableOpacity>
          <Ionicons name="mic-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.location}>
        {userName} : {city && pincode ? `${city} - ${pincode}` : 'No location found'}
      </Text>

      {selectedGenre !== '' && (
        <Text style={styles.genreLabel}>Currently Viewing: {selectedGenre} Books</Text>
      )}

      <ScrollView style={styles.booksSection}>
        {books
          .filter(book =>
            book.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchText.toLowerCase())
          )
          .map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        {books.filter(book =>
          book.title?.toLowerCase().includes(searchText.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchText.toLowerCase())
        ).length === 0 && (
          <Text style={styles.noResults}>We’ll get your book as fast as we could 😊</Text>
        )}
      </ScrollView>

      <View style={styles.contentWrapper}>
        {showMenu && (
          <View style={styles.menuList}>
            <TouchableOpacity onPress={() => { fetchBooks('Academic'); setShowMenu(false); }}>
              <Text style={styles.menuItem}>📘 Academic Books</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fetchBooks('Story'); setShowMenu(false); }}>
              <Text style={styles.menuItem}>📖 Story Books</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fetchBooks('Novel'); setShowMenu(false); }}>
              <Text style={styles.menuItem}>📗 Novels</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fetchBooks('Horror'); setShowMenu(false); }}>
              <Text style={styles.menuItem}>👻 Horror</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fetchBooks('Romance'); setShowMenu(false); }}>
              <Text style={styles.menuItem}>❤️ Romance</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { fetchBooks(); setShowMenu(false); }}>
              <Text style={styles.menuItem}>🔄 Show All</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity>
            <Ionicons name="home" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
            <Ionicons name="menu" size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/CartPage')} style={{ position: 'relative' }}>
            <Ionicons name="cart-outline" size={30} color="black" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/ChatScreen')} style={{ position: 'relative' }}>
            <Ionicons name="chatbox-outline" size={30} color="black" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
  },
  settings: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
  },
  profile: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 10,
  },
  searchContainer: {
    marginTop: 50,
    flexDirection: 'row',
    backgroundColor: '#ffffffcc',
    marginHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    gap: 10,
    zIndex: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  location: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#d0f0f3',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  genreLabel: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 5,
    color: '#444',
  },
  booksSection: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  contentWrapper: {
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  menuList: {
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 20,
    marginBottom: 10,
    elevation: 5,
  },
  menuItem: {
    fontSize: 18,
    color: '#333',
    paddingVertical: 8,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffffdd',
    borderRadius: 20,
    paddingVertical: 0,
    paddingHorizontal: 30,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
