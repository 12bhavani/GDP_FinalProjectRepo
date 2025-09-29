// src/screens/LoginPage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header';

import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert('Please enter email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await signInWithEmailAndPassword(auth, trimmedEmail, password);

      if (trimmedEmail === 'admin@gmail.com') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.replace('Home');
      }
    } catch (error: any) {
      const code = error?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found'
      ) {
        Alert.alert('Invalid email or password');
      } else if (code === 'auth/too-many-requests') {
        Alert.alert('Too many attempts. Try again later.');
      } else if (code === 'auth/network-request-failed') {
        Alert.alert('Network error. Check your connection.');
      } else {
        Alert.alert(error?.message || 'Login failed');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const onSignUp = () => navigation.navigate('SignUp');

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <Header title="Login" />
      <View style={[styles.container, { marginTop: -300 }]}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          style={[styles.input, { marginTop: 16 }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, submitting && { opacity: 0.6 }]}
          onPress={onLogin}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={onSignUp} disabled={submitting}>
          <Text style={styles.linkText}>Don&apos;t have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { padding: 20, justifyContent: 'center', flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#006747',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#000', fontWeight: '600', fontSize: 16 },
  linkButton: { marginTop: 20, alignItems: 'center' },
  linkText: { color: '#007AFF' },
});
