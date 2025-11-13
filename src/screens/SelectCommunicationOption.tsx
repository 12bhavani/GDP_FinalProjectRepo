import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import { useRoute, useNavigation } from '@react-navigation/native';

type RouteParams = {
  recipient: 'NURSE' | 'COUNSELOR';
};

const adminUid = 'hardcoded_admin_uid_here'; // ⚠️ Replace with your actual admin UID

const ComposeMessage: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const { recipient } = route.params as RouteParams;

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const sendMessage = async () => {
    if (!subject || !body) {
      Alert.alert('Please fill subject and message.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('User not logged in.');
      return;
    }

    try {
      // 👇 Store in admin's inbox (admin receives every message)
      await addDoc(collection(db, 'users', adminUid, 'messages'), {
        from: user.email,
        to: recipient === 'NURSE' ? 'Nurse' : 'Counselor',
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      });

      // 👇 Store in sender's sent messages
      await addDoc(collection(db, 'users', user.uid, 'sentMessages'), {
        from: user.email,
        to: recipient === 'NURSE' ? 'Nurse' : 'Counselor',
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      });

      Alert.alert('Message sent successfully!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to send message.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>New Message</Text>

        <View style={styles.field}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.value}>
            {recipient === 'NURSE' ? 'Nurse' : 'Counselor'}
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter subject"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your message"
            value={body}
            onChangeText={setBody}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: '#ccc' }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.sendButtonText, { color: '#000' }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ComposeMessage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
