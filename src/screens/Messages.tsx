// src/screens/Messages.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/Header';

type Message = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  fromRole?: string; // optional role to show Nurse/Counselor
  toRole?: string;   // optional role to show Nurse/Counselor
};

const adminEmail = 'admin@gmail.com';

const Messages: React.FC = () => {
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Sent'>('Inbox');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  const user = auth.currentUser;
  const isAdmin = user?.email === adminEmail;

  /** FETCH MESSAGES */
  const fetchMessages = async (tab: 'Inbox' | 'Sent') => {
    if (!user) return;
    setLoading(true);

    try {
      const ref = collection(
        db,
        'users',
        user.uid,
        tab === 'Inbox' ? 'messages' : 'sentMessages'
      );
      const snap = await getDocs(ref);

      const msgs: Message[] = [];
      for (const docSnap of snap.docs) {
        const data = docSnap.data();

        let fromRole = '';
        let toRole = '';

        // Fetch sender and recipient roles
        if (data.from) {
          const usersSnap = await getDocs(collection(db, 'users'));
          usersSnap.forEach(userDoc => {
            const uData = userDoc.data();
            if (uData.email === data.from) fromRole = uData.role || '';
            if (uData.email === data.to) toRole = uData.role || '';
          });
        }

        msgs.push({
          id: docSnap.id,
          from: data.from,
          to: data.to,
          subject: data.subject,
          body: data.body,
          date: data.date,
          isRead: data.isRead,
          fromRole,
          toRole,
        });
      }

      // Sort by newest first
      msgs.sort((a, b) => (a.date > b.date ? -1 : 1));
      setMessages(msgs);
    } catch (err) {
      console.log(err);
      Alert.alert('Failed to fetch messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(activeTab);
  }, [activeTab]);

  /** MARK AS READ */
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

  /** HEADER */
  const Header = React.memo(() => (
    <>
      <View style={styles.tabContainer}>
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
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => fetchMessages(activeTab)}>
          <Text style={styles.actionText}>Refresh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          onPress={() =>
            isAdmin
              ? navigation.navigate('AdminNewMessage')
              : navigation.navigate('SelectCommunicationOption')
          }
        >
          <Text style={[styles.actionText, { color: '#fff' }]}>New Message</Text>
        </TouchableOpacity>
      </View>
      {/* Reply box removed */}
    </>
  ));

  /** MESSAGE ROW */
  const renderItem = ({ item }: { item: Message }) => {
    const isExpanded = expandedMessageId === item.id;
    return (
      <View style={styles.messageCard}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>
          {activeTab === 'Inbox'
            ? item.fromRole || item.from
            : item.from}
        </Text>
        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>
          {activeTab === 'Sent'
            ? item.toRole || item.to
            : item.to}
        </Text>
        <Text style={styles.label}>Subject:</Text>
        <Text style={styles.value}>{item.subject}</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => {
              if (!item.isRead && activeTab === 'Inbox') markAsRead(item.id);
              setExpandedMessageId(isExpanded ? null : item.id);
            }}
          >
            <Text style={styles.readButtonText}>
              {isExpanded ? 'Hide' : 'Read'}
            </Text>
          </TouchableOpacity>
          {/* Reply button removed */}
        </View>
        {isExpanded && (
          <View style={styles.messageBodyContainer}>
            <Text style={styles.bodyText}>{item.body}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Secure Messages" />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          ListHeaderComponent={Header}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: { flexDirection: 'row', marginBottom: 5 },
  tabButton: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6, marginRight: 10 },
  activeTab: { backgroundColor: '#e6f0ff', borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 18, color: '#007AFF' },
  activeTabText: { fontWeight: 'bold', textDecorationLine: 'underline' },
  messageCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  value: { fontSize: 15, marginBottom: 6, color: '#000' },
  readButton: { backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  readButtonText: { color: '#fff', fontWeight: '600' },
  messageBodyContainer: { backgroundColor: '#eef4ff', borderRadius: 8, padding: 10 },
  bodyText: { fontSize: 15, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 10 },
  actionContainer: { flexDirection: 'row', marginVertical: 8 },
  actionButton: { backgroundColor: '#f4f4f4', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 10 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#000' },
 });
