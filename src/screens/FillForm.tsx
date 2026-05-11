import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { RootStackParamList } from '../types/navigation';
import { formatDateToMDY } from '../utils/dateFormat';

type HealthFormScreenRouteProp = RouteProp<RootStackParamList, 'Form'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CaseType = 'emergency' | 'non-emergency' | '';

const EMERGENCY_PHONE_DISPLAY = '660.562.1348';
const EMERGENCY_PHONE_DIAL = '6605621348';

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
  const [caseType, setCaseType] = useState<CaseType>('');
  const [loading, setLoading] = useState(false);

  const user = auth.currentUser;

  const handleSubmit = async () => {
    if (caseType !== 'non-emergency') {
      Alert.alert(
        'Emergency support',
        `Please call ${EMERGENCY_PHONE_DISPLAY} immediately for emergency support.`
      );
      return;
    }

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
          caseType: 'non-emergency',
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
      setCaseType('');

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

  const handleEmergencyCall = async () => {
    try {
      await Linking.openURL(`tel:${EMERGENCY_PHONE_DIAL}`);
    } catch (error) {
      Alert.alert(
        'Call failed',
        `Unable to open your phone app. Please call ${EMERGENCY_PHONE_DISPLAY} manually.`
      );
    }
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
      <Text style={styles.metaText}>Date: {formatDateToMDY(date)} | Slot: {slot}</Text>

      <Text style={styles.label}>Case Type</Text>
      <Text style={styles.helperText}>
        Please choose emergency or non-emergency before continuing.
      </Text>

      <View style={styles.caseTypeButtonGroup}>
        <TouchableOpacity
          style={[
            styles.caseTypeButton,
            caseType === 'emergency' && styles.caseTypeButtonEmergencySelected,
          ]}
          onPress={() => setCaseType('emergency')}
        >
          <Text
            style={[
              styles.caseTypeButtonText,
              caseType === 'emergency' && styles.caseTypeButtonTextSelected,
            ]}
          >
            Emergency
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.caseTypeButton,
            caseType === 'non-emergency' && styles.caseTypeButtonNonEmergencySelected,
          ]}
          onPress={() => setCaseType('non-emergency')}
        >
          <Text
            style={[
              styles.caseTypeButtonText,
              caseType === 'non-emergency' && styles.caseTypeButtonTextSelected,
            ]}
          >
            Non-Emergency
          </Text>
        </TouchableOpacity>
      </View>

      {caseType === '' && (
        <Text style={styles.noticeText}>Select a case type to proceed.</Text>
      )}

      {caseType === 'emergency' && (
        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyTitle}>Emergency case detected</Text>
          <Text style={styles.emergencyText}>
            Please call {EMERGENCY_PHONE_DISPLAY} immediately. If the situation is life-threatening, call 911 now.
          </Text>
          <TouchableOpacity style={styles.callButton} onPress={handleEmergencyCall}>
            <Text style={styles.callButtonText}>Call {EMERGENCY_PHONE_DISPLAY}</Text>
          </TouchableOpacity>
        </View>
      )}

      {caseType === 'non-emergency' && (
        <>
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

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>{loading ? 'Submitting...' : 'Submit'}</Text>
          </TouchableOpacity>
        </>
      )}
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
    marginBottom: 10,
    textAlign: 'center',
  },
  metaText: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  helperText: {
    color: '#666',
    marginBottom: 8,
  },
  caseTypeButtonGroup: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  caseTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#006747',
    borderRadius: 6,
    marginHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  caseTypeButtonEmergencySelected: {
    backgroundColor: '#C62828',
    borderColor: '#C62828',
  },
  caseTypeButtonNonEmergencySelected: {
    backgroundColor: '#006747',
    borderColor: '#006747',
  },
  caseTypeButtonText: {
    color: '#006747',
    fontSize: 15,
    fontWeight: '700',
  },
  caseTypeButtonTextSelected: {
    color: '#fff',
  },
  noticeText: {
    marginBottom: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  emergencyBox: {
    borderWidth: 1,
    borderColor: '#C62828',
    backgroundColor: '#FFF1F1',
    borderRadius: 8,
    padding: 14,
    marginTop: 6,
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A11A1A',
    marginBottom: 8,
  },
  emergencyText: {
    color: '#7A1A1A',
    lineHeight: 20,
    marginBottom: 12,
  },
  callButton: {
    backgroundColor: '#C62828',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontWeight: '700',
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
  submitButton: {
    marginTop: 24,
    backgroundColor: '#006747',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#7EB5A2',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
