import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import AdminDashboard from './src/screens/AdminDashboard';
import CalendarScreen from './src/screens/CalendarSchedule';
import Chatbot from './src/screens/Chatbot';
import Contact from './src/screens/Contact';
import Fillform from './src/screens/FillForm';
import Messages from './src/screens/Messages';
import ProfilePage from './src/screens/ProfilePage';
import ManageSlots from './src/screens/ManageSlots';
import SignUpScreen from './src/screens/SignUpScreen';
import ViewAppointments from './src/screens/ViewAppointments';
import SelectCommunicationOption from './src/screens/SelectCommunicationOption.tsx';
import ComposeMessage from './src/screens/ComposeMessage.tsx';
import AppointmentDetails from './src/screens/AppointmentDetails';
import AppointmentHistory from './src/screens/AppointmentHistory';
import TherapyAssistanceOnline from './src/screens/TherapyAssistanceOnline';
import MessagesTest from './src/screens/Messages';
import LoginScreen from './src/screens/LoginPage';
import HomeScreen from './src/screens/HomeScreen';
import TAO from './src/screens/TAO';

// ✅ NEW IMPORT
import HealthReports from './src/screens/HealthReports.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
  // Initialize Firebase when app mounts
  useEffect(() => {
    require('./firebase/config');
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
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
