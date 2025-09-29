// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const user = auth.currentUser;
  const uid = user?.uid || '';

  const [userData, setUserData] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;
      try {
        const userRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [uid]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  // ✅ Menu Options (logout included as a card)
  const menuOptions = [
    { label: 'Profile', screen: 'Profile', icon: 'person-outline' },
    { label: 'Schedule an Appointment', screen: 'Calendar', icon: 'calendar-outline' },
    { label: 'Appointment History', screen: 'AppointmentHistory', icon: 'time-outline' },
    { label: 'Health Reports', screen: 'HealthReports', icon: 'document-text-outline' },
    { label: 'Messages', screen: 'Messages', icon: 'chatbubble-ellipses-outline' },
    { label: 'Contact', screen: 'Contact', icon: 'call-outline' },
    { label: 'Therapy Assistance Online', screen: 'TherapyAssistanceOnline', icon: 'videocam-outline' },
    { label: 'Chatbot', screen: 'Chatbot', icon: 'help-circle-outline' },
    { label: 'Logout', action: 'logout', icon: 'log-out-outline' }, // 👈 consistent with others
  ];

  // ✅ Handle press
  const handlePress = async (item: any) => {
    if (item.action === 'logout') {
      try {
        await signOut(auth);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (err) {
        console.error('Logout failed:', err);
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
      return;
    }

    if (item.external) {
      Linking.openURL(item.external);
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Custom green header */}
      <Header title="Home" />

      <ScrollView contentContainerStyle={styles.body}>
        {/* ✅ Welcome Section */}
        <Text style={styles.welcome}>
          Welcome, {userData.name || user?.email || 'User'} 👋
        </Text>
        <Text style={styles.lastLogin}>
          Last login: {new Date().toLocaleString()}
        </Text>

        {/* ✅ Menu Grid */}
        <View style={styles.grid}>
          {menuOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handlePress(item)}
            >
              <Ionicons name={item.icon} size={28} color="#006747" />
              <Text style={styles.cardText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20 },
  welcome: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    color: '#006747',
  },
  lastLogin: { fontSize: 14, marginBottom: 20, color: '#555' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
  width: '47%',
  backgroundColor: '#E6F7FF',
  paddingVertical: 20,  // ↓ was 30
  marginBottom: 15,
  borderRadius: 10,
  alignItems: 'center',
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#006747',
    textAlign: 'center',
  },
});
