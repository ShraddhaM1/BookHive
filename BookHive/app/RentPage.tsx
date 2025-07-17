// app/RentPage.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function RentPage() {
  const [location, setLocation] = useState('Fetching location...');
  const [depositAmount, setDepositAmount] = useState(0);
  const [rentAmount, setRentAmount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setLocation('User not logged in');
          return;
        }
        const locationRef = doc(db, 'location', user.uid);
        const locationSnap = await getDoc(locationRef);

        if (locationSnap.exists()) {
          const data = locationSnap.data();
          setLocation(`${data.City}, ${data.State} - ${data.Pincode}`);
        } else {
          setLocation('No location found');
        }
      } catch (err) {
        console.error('Error fetching location:', err);
        setLocation('Error fetching location');
      }
    };

    const calculateAmounts = async () => {
      try {
        const cartSnap = await getDocs(collection(db, 'cart'));
        let deposit = 0;
        let rent = 0;

        cartSnap.forEach(doc => {
          const data = doc.data();
          const quantity = data.quantity ?? 1;
          deposit += (data.rent ?? 0) * quantity;
          rent += 100 * quantity; // flat ₹100 per book
        });

        setDepositAmount(deposit);
        setRentAmount(rent);
      } catch (err) {
        console.error('Error calculating amounts:', err);
        setDepositAmount(0);
        setRentAmount(0);
      }
    };

    fetchUserLocation();
    calculateAmounts();
  }, []);

  const handleContinue = () => {
    Alert.alert('Thank you!', 'Your rented books are on the way 📦');
    router.replace('/Dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.title}>📚 Rent Books</Text>
        <Text style={styles.locationLabel}>Delivering to:</Text>
        <Text style={styles.location}>{location}</Text>

        <Text style={styles.amountLabel}>Deposit Amount:</Text>
        <Text style={styles.amount}>₹{depositAmount}</Text>

        <Text style={styles.amountLabel}>Rent (Payable):</Text>
        <Text style={styles.amount}>₹{rentAmount}</Text>

        <Text style={styles.qrLabel}>Scan QR to Pay:</Text>
        <Image
          source={require('../assets/images/qr_sample.png')}
          style={styles.qrImage}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>✅ Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  centerBox: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  locationLabel: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    marginBottom: 6,
  },
  location: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: '#1e88e5',
    marginBottom: 30,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
  },
  amount: {
    fontSize: 20,
    color: '#009688',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#444',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#613f91',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
