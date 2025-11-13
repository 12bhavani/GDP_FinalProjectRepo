// src/screens/AdminNewMessage.tsx
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
import { db, auth } from '../../firebase/config';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AdminNewMessage: React.FC = () => {
  const navigation = useNavigation<any>();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const sender = auth.currentUser;
    if (!sender) return Alert.alert('Error', 'No logged-in user.');

    if (!recipientEmail || !subject || !body) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      let recipientUid: string | null = null;

      usersSnap.forEach(docSnap => {
        const data = docSnap.data();
        if (data.email === recipientEmail) {
          recipientUid = docSnap.id;
        }
      });

      if (!recipientUid) {
        Alert.alert('User not found', 'No user with this email exists.');
        setLoading(false);
        return;
      }

      // Save message under admin → sentMessages
      await addDoc(collection(db, 'users', sender.uid, 'sentMessages'), {
        from: sender.email,
        to: recipientEmail,
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      });

      // Save message under recipient → messages
      await addDoc(collection(db, 'users', recipientUid, 'messages'), {
        from: sender.email,
        to: recipientEmail,
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      });

      Alert.alert('Success', 'Message sent successfully!');
      setRecipientEmail('');
      setSubject('');
      setBody('');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>New Message</Text>

      <TextInput
        style={styles.input}
        placeholder="Recipient Email"
        value={recipientEmail}
        onChangeText={setRecipientEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Message Body"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <TouchableOpacity
        style={[styles.sendButton, loading && { opacity: 0.6 }]}
        onPress={handleSendMessage}
        disabled={loading}
      >
        <Text style={styles.sendButtonText}>
          {loading ? 'Sending...' : 'Send Message'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AdminNewMessage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  heading: { fontSize: 24, fontWeight: '700', color: '#007AFF', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: {
    backgroundColor: '#f4f4f4',
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  backText: { fontSize: 16, color: '#333', fontWeight: '500' },
});
