// src/screens/SignUpScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { db, auth } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    const trimmedEmail = email.trim().toLowerCase();

    if (!name || !trimmedEmail || !phone || !password) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    if (!trimmedEmail.endsWith('@gmail.com')) {
      Alert.alert('Please enter a valid Gmail address.');
      return;
    }
    if (phone.length !== 10) {
      Alert.alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email: trimmedEmail,
        phone,
        role: 'student',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('User registered successfully. Please login.');
      navigation.replace('Login');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('The email address is invalid!');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Password is too weak!');
      } else {
        Alert.alert(error.message || 'Registration failed.');
      }
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = text.replace(/[^0-9]/g, '');
    if (formatted.length <= 10) setPhone(formatted);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header title="Sign Up" />
      <View style={styles.container}>
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.input}
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          maxLength={10}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={onRegister} style={styles.register}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { padding: 16, justifyContent: 'center', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
    height: 50,
  },
  register: {
    width: '90%',
    backgroundColor: '#006747',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerText: { fontSize: 16, color: '#000', fontWeight: '600' },
});
