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
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Compose New Secure Message</Text>
      <Text style={styles.label}>Recipient:</Text>
      <Text style={styles.value}>{recipient}</Text>
      <Text style={styles.label}>Subject:</Text>
      <TextInput
        style={styles.input}
        value={subject}
        onChangeText={setSubject}
        placeholder="Enter subject"
      />
      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={body}
        onChangeText={setBody}
        placeholder="Write your message..."
        multiline
      />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ComposeMessage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  label: { fontSize: 16, marginTop: 10 },
  value: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 10, marginTop: 5,
  },
  buttons: {
    flexDirection: 'row', justifyContent: 'space-around', marginTop: 30,
  },
  sendButton: {
    backgroundColor: '#007AFF', padding: 12, borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#ccc', padding: 12, borderRadius: 8,
  },
  buttonText: {
    color: 'white', fontWeight: '600',
  },
});
