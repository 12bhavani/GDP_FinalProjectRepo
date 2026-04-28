// src/screens/LoginPage.tsx
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../components/Header';
import {
    HARDCODED_ADMIN_CREDENTIALS,
    isHardcodedAdminLogin,
} from '../config/adminCredentials';
import { RootStackParamList } from '../types/navigation';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      Alert.alert('Please enter email and password.');
      return;
    }

    try {
      setSubmitting(true);

      if (isHardcodedAdminLogin(trimmedEmail, password)) {
        await AsyncStorage.setItem('HARDCODED_ADMIN_V1', 'true');
        navigation.reset({
          index: 0,
          routes: [{ name: 'AdminDashboard' }],
        });
        return;
      }

      await signInWithEmailAndPassword(auth, trimmedEmail, password);

      if (trimmedEmail === HARDCODED_ADMIN_CREDENTIALS.email) {
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
    <View style={styles.screen}>
      <Header title="Login" />
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#000"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={[styles.passwordContainer, { marginTop: 16 }] }>
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
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flexGrow: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingTop: 40, justifyContent: 'flex-start', flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
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
