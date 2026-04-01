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
    <View style={styles.screen}>
      <Header title="Compose Message" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.label}>Recipient</Text>
          <View style={styles.recipientChip}>
            <Text style={styles.recipientText}>{recipient}</Text>
          </View>

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Enter subject"
            placeholderTextColor="#94A3B8"
            multiline
            blurOnSubmit={false}
            autoCorrect={true}
            autoCapitalize="sentences"
            keyboardType="default"
            textAlignVertical="top"
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={body}
            onChangeText={setBody}
            placeholder="Write your message..."
            placeholderTextColor="#94A3B8"
            multiline
            blurOnSubmit={false}
            autoCorrect={true}
            autoCapitalize="sentences"
            keyboardType="default"
            textAlignVertical="top"
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ComposeMessage;

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
    backgroundColor: '#FFFFFF',
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
    marginBottom: 8,
    color: '#64748B',
    marginTop: 12,
  },
  recipientChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F7FF',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  recipientText: {
    color: '#006747',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#0F172A',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  messageInput: {
    minHeight: 130,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
  },
  sendButton: {
    backgroundColor: '#006747',
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#1F2937',
    fontWeight: '700',
    fontSize: 16,
  },
});

