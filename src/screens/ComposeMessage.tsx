import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { doc, addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import Header from '../components/Header';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ComposeMessage'>;

type RouteProp = {
  params: {
    recipient: 'NURSE' | 'COUNSELOR';
  };
};

const ComposeMessage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { recipient } = route.params as RouteProp['params'];

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    const user = auth.currentUser;
    if (!user) return Alert.alert('Not authenticated');

    try {
      const message = {
        from: user.email || 'Anonymous',
        to: recipient,
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      };

      // Save to receiver's inbox (admin/nurse/counselor) - adjust if needed
      const recipientUid = recipient === 'NURSE' ? 'xzebPX9CCjNlRhf9HgbGzVzKlaN2' : 'xzebPX9CCjNlRhf9HgbGzVzKlaN2'; 
      await addDoc(collection(db, 'users', recipientUid, 'messages'), message);

      // Also save to sender's sent box
      await addDoc(collection(db, 'users', user.uid, 'sentMessages'), message);

      Alert.alert('Message sent!');
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert('Failed to send message');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Compose Message" />
      <View style={styles.buttons}>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      <View style={{ padding: 20 }}>
        <Text style={styles.label}>Recipient: {recipient}</Text>
        <Text style={styles.label}>Subject:</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Enter subject"
          multiline
          blurOnSubmit={false}
          autoCorrect={true}
          autoCapitalize="sentences"
          keyboardType="default"
          textAlignVertical="top"
        />
        <Text style={styles.label}>Message:</Text>
        <TextInput
          style={[styles.input, { height: 100 }]} 
          value={body}
          onChangeText={setBody}
          placeholder="Write your message..."
          multiline
          blurOnSubmit={false}
          autoCorrect={true}
          autoCapitalize="sentences"
          keyboardType="default"
          textAlignVertical="top"
        />
        
      </View>
    </View>
  );
};

export default ComposeMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 15,
    textAlign: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
    
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginTop: 5,
    backgroundColor: '#fff',
    fontSize: 16,
    textAlignVertical: 'top', // ensures multiline input starts at top
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

