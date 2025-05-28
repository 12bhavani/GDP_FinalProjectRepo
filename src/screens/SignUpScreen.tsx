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
import auth from '@react-native-firebase/auth';
import { db } from '../../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Header from '../components/Header'; 

type LoginScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Please enter a valid Gmail address.');
      return;
    }

    if (phone.length !== 10) {
      Alert.alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const { uid } = userCredential.user;

      await auth().currentUser?.updateProfile({ displayName: name });

      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        phone,
        role: 'student',
        createdAt: new Date().toISOString(),
      });

      Alert.alert('User registered successfully. Please login.');
      navigation.replace('Login');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('That email address is already in use!');
      } else {
        Alert.alert('Registration failed', error.message);
      }
    }
  };

  // Phone number input handler to accept only 10 digits
  const handlePhoneChange = (text: string) => {
    const formattedPhone = text.replace(/[^0-9]/g, ''); 
    if (formattedPhone.length <= 10) {
      setPhone(formattedPhone); 
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Header title="Sign Up" /> 

      <View style={styles.container}>
        <TextInput
          placeholder="Full Name"
          style={styles.inputBox}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          style={styles.inputBox}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Phone Number"
          style={styles.inputBox}
          value={phone}
          onChangeText={handlePhoneChange}
          keyboardType="phone-pad"
          maxLength={10} 
        />
        <TextInput
          placeholder="Password"
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity onPress={onRegister} style={styles.register}>
          <Text style={styles.registerTitle}>Register</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
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
  registerTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
});
