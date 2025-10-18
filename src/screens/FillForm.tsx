import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { RootStackParamList } from '../types/navigation';

type HealthFormScreenRouteProp = RouteProp<RootStackParamList, 'Form'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HealthFormScreen() {
  const route = useRoute<HealthFormScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { date, slot } = route.params;

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [healthIssue, setHealthIssue] = useState('');
  const [question1, setQuestion1] = useState<'yes' | 'no' | ''>('');
  const [question2, setQuestion2] = useState<'yes' | 'no' | ''>('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (!name || !age || !gender || !healthIssue || !question1 || !question2) {
      Alert.alert('Please fill all fields');
      return;
    }

    setLoading(true);

    try {
      await setDoc(
        doc(db, 'slots', date, 'details', `${slot}_${date}`),
        {
          name,
          age: Number(age),
          gender,
          healthIssue,
          question1,
          question2,
          email: user?.email || 'anonymous',
          createdAt: serverTimestamp(),
        }
      );

      await setDoc(
        doc(db, 'slots', date),
        {
          [slot]: 'booked',
          [`${slot}_user`]: user?.email || 'anonymous',
        },
        { merge: true }
      );

      Alert.alert('Form submitted and slot booked successfully!');

      // reset form
      setName('');
      setAge('');
      setGender('');
      setHealthIssue('');
      setQuestion1('');
      setQuestion2('');

      // Smooth transition to Home screen
      setTimeout(() => {
        navigation.navigate('Home');
      }, 300);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Failed to submit form. Please try again.');
    }

    setLoading(false);
  };

  const renderYesNoButtons = (
    value: 'yes' | 'no' | '',
    setValue: React.Dispatch<React.SetStateAction<'yes' | 'no' | ''>>,
    questionLabel: string
  ) => (
    <View style={styles.yesNoContainer}>
      <Text style={styles.label}>{questionLabel}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.yesNoButton, value === 'yes' && styles.selectedButton]}
          onPress={() => setValue('yes')}
        >
          <Text style={value === 'yes' ? styles.selectedButtonText : styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.yesNoButton, value === 'no' && styles.selectedButton]}
          onPress={() => setValue('no')}
        >
          <Text style={value === 'no' ? styles.selectedButtonText : styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGenderButtons = (
    value: 'Male' | 'Female' | '',
    setValue: React.Dispatch<React.SetStateAction<'Male' | 'Female' | ''>>,
    questionLabel: string
  ) => (
    <View style={styles.yesNoContainer}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.yesNoButton, gender === 'Male' && styles.selectedButton]}
          onPress={() => setGender('Male')}
        >
          <Text style={gender === 'Male' ? styles.selectedButtonText : styles.buttonText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.yesNoButton, gender === 'Female' && styles.selectedButton]}
          onPress={() => setGender('Female')}
        >
          <Text style={gender === 'Female' ? styles.selectedButtonText : styles.buttonText}>Female</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Health Form</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      {renderGenderButtons(gender, setGender, 'Gender')}

      <Text style={styles.label}>Health Issue</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Describe your health issue"
        multiline
        value={healthIssue}
        onChangeText={setHealthIssue}
      />

      {renderYesNoButtons(question1, setQuestion1, 'Do you have allergies?')}
      {renderYesNoButtons(question2, setQuestion2, 'Are you currently on medication?')}

      <Button
        title={loading ? 'Submitting...' : 'Submit'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  yesNoContainer: {
    marginTop: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 8,
  },
  yesNoButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: 'white',
  },
});
