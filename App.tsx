import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginPage';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarSchedule';
import Fillform from './src/screens/FillForm';
import ProfilePage from './src/screens/ProfilePage';
import AdminDashboard from './src/screens/AdminDashboard';
import ManageSlots from './src/screens/ManageSlots';
import ViewAppointments from './src/screens/ViewAppointments';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,              // hide native headers
          animation: 'slide_from_right',  // ✅ smooth transition
          gestureEnabled: true,           // ✅ enable swipe back
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="ManageSlots" component={ManageSlots} />
        <Stack.Screen name="ViewAppointments" component={ViewAppointments} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="Form" component={Fillform} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
