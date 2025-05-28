import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
} from 'react-native';
import Header from '../components/Header';
import { WebView } from 'react-native-webview';

const menuOptions = [
  { label: 'Profile', screen: 'Profile' },
  { label: 'Schedule an Appointment', screen: 'Calendar' },
  { label: 'Appointment History', screen: 'AppointmentHistory' },
  { label: 'Health Reports', screen: 'HealthReports' },
  { label: 'Messages', screen: 'Messages' },
  { label: 'Contact', screen: 'Contact' },
  
];

const HomeScreen = ({ navigation }: any) => {
  const [isModalVisible, setModalVisible] = React.useState(false);

  const handlePress = (screen: string) => {
    if (screen === 'Contact') {
      setModalVisible(true);
    } else {
      navigation.navigate(screen);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Function to block navigation (links inside the page)
  const handleShouldStartLoadWithRequest = (event: any) => {
    // This will intercept and stop all navigation attempts inside the WebView
    return false;
  };

  return (
    <View style={styles.container}>
      <Header title="Wellness Services" />

      {/* 🔓 Logout button in top-right */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Margin below header */}
      <View style={{ height: 10 }} />

      <ScrollView contentContainerStyle={styles.tilesContainer}>
        {menuOptions.map(({ label, screen }) => (
          <TouchableOpacity
            key={label}
            style={styles.card}
            onPress={() => handlePress(screen)}
          >
            <Text style={styles.cardText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal to show the WebView */}
      <Modal visible={isModalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: 'https://www.nwmissouri.edu/wellness/directory/index.htm' }}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            startInLoadingState={true} // Show loading indicator while the page is loading
            javaScriptEnabled={true}  // Allow JavaScript (useful if the page relies on it)
            domStorageEnabled={true}  // Enable DOM storage
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logoutButton: {
    position: 'absolute',
    top: 180,
    right: 10,
    zIndex: 10,
    backgroundColor: 'black',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  tilesContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  card: {
    width: '85%',
    height: 60,
    backgroundColor: '#006747',
    borderRadius: 12,
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',

    // Stronger iOS shadow
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 3,

    // Stronger Android shadow
    elevation: 20,

    // Optional border for contrast
    borderWidth: 0.5,
    borderColor: '#004d40',
  },

  cardText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '400',
  },
});
