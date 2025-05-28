import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type AdminDashboardNavProp = NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;

const AdminDashboard = () => {
  const navigation = useNavigation<AdminDashboardNavProp>();
  const [menuVisible, setMenuVisible] = useState(false);

  const onOptionPress = (option: string) => {
    setMenuVisible(false);

    switch (option) {
      case 'Profile':
        navigation.navigate('Profile');
        break;

      case 'Contact':
        Alert.alert(
          'Need Help?',
          'You can reach out to us at:\n\n 660-562-1348',
          [{ text: 'OK', style: 'default' }]
        );
        break;

      case 'Logout':
        Alert.alert(
          'Confirm Logout',
          'Are you sure you want to logout?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: () => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              },
            },
          ]
        );
        break;

      default:
        break;
    }
  };

  const menuItems = [
    { label: 'Profile', icon: 'person-outline' },
    { label: 'Contact', icon: 'call-outline' },
    { label: 'Logout', icon: 'log-out-outline' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Header title="Admin Dashboard" />

      <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
        <Text style={{ fontSize: 26, fontWeight: '600' }}>⋯</Text>
      </TouchableOpacity>

      <View style={{ height: 10 }} />

      <View style={styles.dashboardContainer}>
        <TouchableOpacity
          style={styles.dashboardItem}
          onPress={() => navigation.navigate('ManageSlots')}
        >
          <Text style={styles.dashboardText}>Manage Available Slots</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardItem}
          onPress={() => navigation.navigate('ViewAppointments')}
        >
          <Text style={styles.dashboardText}>View Booked Appointments</Text>
        </TouchableOpacity>

      </View>

      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {menuItems.map(item => (
              <Pressable
                key={item.label}
                onPress={() => onOptionPress(item.label)}
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && { backgroundColor: '#e6f2ed' },
                ]}
              >
                <View style={styles.menuRow}>
                  <Ionicons name={item.icon} size={20} color="#006747" style={{ marginRight: 10 }} />
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    position: 'absolute',
    top: 140,
    right: 16,
    zIndex: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  dashboardContainer: {
    padding: 20,
    gap: 20,
  },
  dashboardItem: {
    backgroundColor: '#006747',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 6,
  },
  dashboardText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    marginTop: 70,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 8,
    width: 180,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
