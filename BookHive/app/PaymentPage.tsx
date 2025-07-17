import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useRouter } from 'expo-router';

export default function PaymentPage() {
  const [location, setLocation] = useState<string>('Fetching location...');
  const [payableAmount, setPayableAmount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLocation('User not logged in');
          return;
        }

        const docRef = doc(db, 'location', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const loc = docSnap.data();
          setLocation(`${loc.City}, ${loc.State} - ${loc.Pincode}`);
        } else {
          setLocation('No location found');
        }
      } catch (err) {
        console.error('❌ Error fetching location:', err);
        setLocation('Failed to load location');
      }
    };

    const fetchPayableAmount = async () => {
      try {
        const cartSnap = await getDocs(collection(db, 'cart'));
        let total = 0;
        cartSnap.forEach(doc => {
          const data = doc.data();
          total += (data.price ?? 0) * (data.quantity ?? 1);
        });
        setPayableAmount(total);
      } catch (err) {
        console.error('❌ Error calculating amount:', err);
        setPayableAmount(0);
      }
    };

    fetchLocation();
    fetchPayableAmount();
  }, []);

  const handleContinue = () => {
    Alert.alert('✅ Thank you!', 'Your order is being processed 🚀');
    router.replace('/Dashboard');
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.container}>
        <Text style={styles.title}>📦 Book Delivery</Text>
        <Text style={styles.label}>Delivering to:</Text>
        <Text style={styles.location}>{location}</Text>

        <Text style={styles.label}>Payable Amount:</Text>
        <Text style={styles.amount}>₹{payableAmount}</Text>

        <Text style={styles.qrText}>Scan QR to Pay:</Text>
        <Image
          source={require('../assets/images/qr_sample.png')} // ✅ make sure this image exists
          style={styles.qrImage}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>✅ Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 4,
  },
  location: {
    fontSize: 20,
    color: '#1e88e5',
    fontWeight: '600',
    marginBottom: 24,
  },
  amount: {
    fontSize: 22,
    color: '#009688',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  qrImage: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#613f91',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
