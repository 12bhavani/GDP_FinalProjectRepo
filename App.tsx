import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { auth } from './firebase/config';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminNewMessage from './src/screens/AdminNewMessage';
import AppointmentDetails from './src/screens/AppointmentDetails';
import AppointmentHistory from './src/screens/AppointmentHistory';
import CalendarScreen from './src/screens/CalendarSchedule';
import Chatbot from './src/screens/Chatbot';
import ComposeMessage from './src/screens/ComposeMessage.tsx';
import Contact from './src/screens/Contact';
import Fillform from './src/screens/FillForm';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginPage';
import ManageSlots from './src/screens/ManageSlots';
import Messages from './src/screens/Messages';
import ProfilePage from './src/screens/ProfilePage';
import SelectCommunicationOption from './src/screens/SelectCommunicationOption.tsx';
import SignUpScreen from './src/screens/SignUpScreen';
import TAO from './src/screens/TAO';
import TherapyAssistanceOnline from './src/screens/TherapyAssistanceOnline';
import ViewAppointments from './src/screens/ViewAppointments';
import { RootStackParamList } from './src/types/navigation';

// ✅ NEW IMPORT
import HealthReports from './src/screens/HealthReports.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();
const ADMIN_SESSION_KEY = 'HARDCODED_ADMIN_V1';

const App = () => {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList>('Login');

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      try {
        const adminFlag = await AsyncStorage.getItem(ADMIN_SESSION_KEY);

        if (!mounted) {
          return;
        }

        if (adminFlag === 'true') {
          setInitialRouteName('AdminDashboard');
        } else if (firebaseUser) {
          setInitialRouteName('Home');
        } else {
          setInitialRouteName('Login');
        }
      } catch {
        if (mounted) {
          setInitialRouteName('Login');
        }
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (bootstrapping) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#006747" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="ManageSlots" component={ManageSlots} />
        <Stack.Screen name="ViewAppointments" component={ViewAppointments} />
        <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Form" component={Fillform} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="Contact" component={Contact} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
        <Stack.Screen name="TAO" component={TAO} />
        <Stack.Screen name="AdminNewMessage" component={AdminNewMessage} />
        <Stack.Screen name="ComposeMessage" component={ComposeMessage} />
        <Stack.Screen
          name="SelectCommunicationOption"
          component={SelectCommunicationOption}
        />
        <Stack.Screen
          name="TherapyAssistanceOnline"
          component={TherapyAssistanceOnline}
        />
        <Stack.Screen name="AppointmentHistory" component={AppointmentHistory} />
        <Stack.Screen
          name="AppointmentDetails"
          component={AppointmentDetails}
          options={{
            headerShown: false,
          }}
        />
        {/* ✅ NEWLY ADDED HEALTH REPORT SCREEN */}
        <Stack.Screen name="HealthReports" component={HealthReports} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
