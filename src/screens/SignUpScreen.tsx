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
import { Ionicons } from '@expo/vector-icons';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <View style={styles.screen}>
      <Header title="Sign Up" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#000"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#000"
            style={styles.input}
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={10}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#000"
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(prev => !prev)}
              style={styles.eyeButton}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={onRegister} style={styles.register}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { padding: 16, paddingTop: 20, justifyContent: 'flex-start', alignItems: 'center', flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
    height: 50,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    width: '90%',
    marginTop: 20,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    height: '100%',
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
