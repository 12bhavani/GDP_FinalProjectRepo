// src/screens/Messages.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Messages'>;

type Message = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
};

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Sent'>('Inbox');
  const user = auth.currentUser;

  const navigation = useNavigation<NavigationProp>();

  const fetchMessages = async (tab: 'Inbox' | 'Sent') => {
    if (!user) return;
    setLoading(true);
    try {
      const ref = collection(db, 'users', user.uid, tab === 'Inbox' ? 'messages' : 'sentMessages');
      const snap = await getDocs(ref);
      const msgs: Message[] = [];
      snap.forEach(docSnap => {
        const data = docSnap.data();
        msgs.push({
          id: docSnap.id,
          from: data.from || '',
          to: data.to || '',
          subject: data.subject || '',
          body: data.body || '',
          date: data.date || '',
          isRead: data.isRead || false,
        });
      });
      msgs.sort((a, b) => (a.date > b.date ? -1 : 1));
      setMessages(msgs);
    } catch {
      Alert.alert('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(activeTab);
  }, [activeTab]);

  const markAsRead = async (id: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid, 'messages', id), { isRead: true });
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch {
      Alert.alert('Failed to mark as read');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={styles.messageCard}>
      <Text style={styles.subjectText}>
        {activeTab === 'Inbox' && (item.isRead ? '✓ ' : '• ')}
        {item.subject}
      </Text>
      <Text style={styles.metaText}>
        {activeTab === 'Inbox' ? `From: ${item.from}` : `To: ${item.to}`}
      </Text>
      <Text style={styles.metaText}>Date: {item.date}</Text>
      <Text style={styles.bodyText}>{item.body}</Text>
      {activeTab === 'Inbox' && !item.isRead && (
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => markAsRead(item.id)}
        >
          <Text style={styles.readButtonText}>Mark as Read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headingText}>Secure Message Inbox</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Inbox' && styles.activeTab]}
          onPress={() => setActiveTab('Inbox')}
        >
          <Text style={[styles.tabText, activeTab === 'Inbox' && styles.activeTabText]}>
            Inbox
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'Sent' && styles.activeTab]}
          onPress={() => setActiveTab('Sent')}
        >
          <Text style={[styles.tabText, activeTab === 'Sent' && styles.activeTabText]}>
            Sent
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SelectCommunicationOption')}
        >
          <Text style={styles.actionButtonText}>New Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => fetchMessages(activeTab)}
        >
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headingText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  messageCard: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    borderRadius: 10,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  metaText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  bodyText: {
    fontSize: 14,
    marginTop: 10,
  },
  readButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  readButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
