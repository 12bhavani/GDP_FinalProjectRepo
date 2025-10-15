import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

type Props = {
  navigation: any;
};

const SelectCommunicationOption: React.FC<Props> = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState<'NURSE' | 'COUNSELOR' | null>(null);

  const onContinue = () => {
    if (!selectedOption) {
      Alert.alert('Please select an option');
      return;
    }
    // Navigate to ComposeMessage and pass the selected recipient
    navigation.navigate('ComposeMessage', { recipient: selectedOption });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Communication Option</Text>

      <TouchableOpacity
        style={[styles.optionButton, selectedOption === 'NURSE' && styles.selectedOption]}
        onPress={() => setSelectedOption('NURSE')}
      >
        <Text style={styles.optionText}>I want to send a message to the Nurse.</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionButton, selectedOption === 'COUNSELOR' && styles.selectedOption]}
        onPress={() => setSelectedOption('COUNSELOR')}
      >
        <Text style={styles.optionText}>I want to send a message to a Counselor.</Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectCommunicationOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  cancelButtonText: {
    color: '#333',
  },
});
