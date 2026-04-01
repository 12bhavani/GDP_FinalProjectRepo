// src/screens/AdminNewMessage.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { db, auth } from '../../firebase/config';
import { addDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

const adminEmail = 'admin@gmail.com';

const AdminNewMessage: React.FC = () => {
  const navigation = useNavigation<any>();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    const sender = auth.currentUser;
    let senderUid = sender?.uid || '';
    let senderEmail = (sender?.email || '').trim().toLowerCase();

    if (!recipientEmail || !subject || !body) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      if (!senderUid) {
        // Hardcoded admin login path can skip Firebase auth, so resolve admin UID by email.
        const adminQuery = query(
          collection(db, 'users'),
          where('email', '==', adminEmail),
          limit(1)
        );
        const adminSnap = await getDocs(adminQuery);

        if (adminSnap.empty) {
          Alert.alert('Error', 'Admin profile not found in database.');
          setLoading(false);
          return;
        }

        senderUid = adminSnap.docs[0].id;
        senderEmail = adminEmail;
      }

      const usersSnap = await getDocs(collection(db, 'users'));
      let recipientUid: string | null = null;

      usersSnap.forEach(docSnap => {
        const data = docSnap.data();

        // 🔥 Automatically detect email field name
        const storedEmail =
          data.email ||
          data.userEmail ||
          data.emailAddress ||
          data.username ||
          null;

        if (
          storedEmail &&
          storedEmail.toLowerCase() === recipientEmail.toLowerCase()
        ) {
          recipientUid = docSnap.id;
        }
      });

      if (!recipientUid) {
        Alert.alert('User not found', 'No user with this email exists.');
        setLoading(false);
        return;
      }

      // Save message in admin → sentMessages
      await addDoc(collection(db, 'users', senderUid, 'sentMessages'), {
        from: senderEmail,
        to: recipientEmail,
        subject,
        body,
        date: new Date().toISOString(),
        isRead: false,
      });

      // Save message in recipient → messages
      await addDoc(collection(db, 'users', recipientUid, 'messages'), {
        from: senderEmail,
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
    <View style={styles.screen}>
      <Header title="Compose a New Message" />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>Recipient Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipient Email"
            value={recipientEmail}
            onChangeText={setRecipientEmail}
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Subject"
            value={subject}
            onChangeText={setSubject}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Message Body"
            value={body}
            onChangeText={setBody}
            placeholderTextColor="#94A3B8"
            multiline
          />
        </View>

        <View style={styles.actionsRow}>
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
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminNewMessage;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  label: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#0F172A',
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  sendButton: {
    flex: 1,
    backgroundColor: '#006747',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '700',
  },
});
