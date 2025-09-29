// src/screens/AdminDashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AdminDashboard() {
  const navigation = useNavigation<any>();

  // ✅ Admin Menu Options
  const menuOptions = [
    { label: 'Manage Available Slots', screen: 'ManageSlots', icon: 'calendar-clear-outline' },
    { label: 'View Booked Appointments', screen: 'ViewAppointments', icon: 'people-outline' },
    { label: 'Profile', screen: 'Profile', icon: 'person-outline' },
    { label: 'Contact', screen: 'Contact', icon: 'call-outline' },
    { label: 'Logout', screen: 'Login', icon: 'log-out-outline', logout: true },
  ];

  const handlePress = (item: any) => {
    if (item.logout) {
      // You can replace with a proper logout handler if you use Firebase Auth
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } else {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      {/* ✅ Custom green header */}
      <Header title="Admin Dashboard" />

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.welcome}>Welcome, Admin 👋</Text>
        <Text style={styles.subText}>Use the options below to manage the system:</Text>

        {/* ✅ Grid Menu */}
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
  subText: { fontSize: 14, marginBottom: 20, color: '#555' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#E6F7FF',
    paddingVertical: 30,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
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
