import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface CartItem {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  rent?: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'cart'));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      Alert.alert('Error', 'Failed to load cart items.');
    }
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) return;
    try {
      const docRef = doc(db, 'cart', id);
      await updateDoc(docRef, { quantity: newQuantity });
      fetchCartItems();
    } catch (err) {
      console.error('Update quantity error:', err);
    }
  };

  const removeItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'cart', id));
      fetchCartItems();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalBuyAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalRentAmount = cartItems.reduce(
    (sum, item) => sum + 100 * item.quantity,
    0
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 220, paddingTop: 20 , marginTop: 30,
        }}
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>₹{item.price}</Text>
              <View style={styles.controls}>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={22} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Ionicons name="add-outline" size={22} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text style={styles.total}>Subtotal (Buy): ₹{totalBuyAmount}</Text>
        <Text style={styles.total}>Subtotal (Rent): ₹{totalRentAmount}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => router.push('/PaymentPage')}
          >
            <Text style={styles.buyText}>Proceed to Buy ({cartItems.length} items)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rentButton}
            onPress={() => router.push('/RentPage')}
          >
            <Text style={styles.rentText}>Rent This Book</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CartPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  card: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#009900',
    marginVertical: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 16,
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  buyButton: {
    backgroundColor: '#F29C9C',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  rentButton: {
    backgroundColor: '#F29C9C',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyText: {
    fontSize: 16,
    fontWeight: '600',
  },
  rentText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});