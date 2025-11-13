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

type Message = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
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

  const [replyRecipientUid, setReplyRecipientUid] = useState<string | null>(null);
  const [replyRecipientName, setReplyRecipientName] = useState<string>('');
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

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

  const sendReply = async () => {
    if (!replyRecipientUid || !replySubject || !replyBody) {
      Alert.alert('Please fill subject and message.');
      return;
    }

    try {
      // Determine role name for sender
const senderRole =
  user?.email === 'nurse@gmail.com'
    ? 'Nurse'
    : user?.email === 'counselor@gmail.com'
    ? 'Counselor'
    : user?.email === adminEmail
    ? 'Admin'
    : user?.email || 'User';

await addDoc(collection(db, 'users', user!.uid, 'sentMessages'), {
  from: senderRole,
  to: replyRecipientUid,
  subject: replySubject,
  body: replyBody,
  date: new Date().toISOString(),
  isRead: false,
});

await addDoc(collection(db, 'users', replyRecipientUid, 'messages'), {
  from: senderRole,
  to: replyRecipientUid,
  subject: replySubject,
  body: replyBody,
  date: new Date().toISOString(),
  isRead: false,
});


      Alert.alert('Message sent!');
      setReplyRecipientUid(null);
      setReplyRecipientName('');
      setReplySubject('');
      setReplyBody('');
      fetchMessages(activeTab);
    } catch (err) {
      console.log(err);
      Alert.alert('Failed to send message.');
    }
  };

  const renderHeader = () => (
    <>
      <Text style={styles.headingText}>Secure Messages</Text>

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

      {isAdmin && (
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => fetchMessages(activeTab)}
          >
            <Text style={styles.actionText}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
            onPress={() => navigation.navigate('AdminNewMessage')}
          >
            <Text style={[styles.actionText, { color: '#fff' }]}>New Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {isAdmin && replyRecipientUid && (
        <View style={styles.replyBox}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Reply to: {replyRecipientName}</Text>
          <TextInput
            placeholder="Subject"
            value={replySubject}
            onChangeText={setReplySubject}
            style={styles.input}
          />
          <TextInput
            placeholder="Message"
            value={replyBody}
            onChangeText={setReplyBody}
            style={[styles.input, { height: 80 }]}
            multiline
          />
          <Button title="Send Reply" onPress={sendReply} />
        </View>
      )}
    </>
  );

  const renderItem = ({ item }: { item: Message }) => {
    const isExpanded = expandedMessageId === item.id;

    return (
      <View style={styles.messageCard}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{item.from}</Text>

        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{item.to}</Text>

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
            <Text style={styles.readButtonText}>{isExpanded ? 'Hide' : 'Read'}</Text>
          </TouchableOpacity>

          {isAdmin && activeTab === 'Inbox' && (
            <TouchableOpacity
              style={[styles.readButton, { marginLeft: 10, backgroundColor: '#28a745' }]}
              onPress={() => {
                setReplyRecipientUid(item.from);
                setReplyRecipientName(item.from);
              }}
            >
              <Text style={styles.readButtonText}>Reply</Text>
            </TouchableOpacity>
          )}
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
      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader}
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
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  headingText: { fontSize: 26, fontWeight: '700', color: '#007AFF', marginTop: 20 },
  tabContainer: { flexDirection: 'row', marginTop: 15, marginBottom: 5 },
  tabButton: { marginRight: 20, paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6 },
  activeTab: { backgroundColor: '#e6f0ff', borderBottomWidth: 3, borderBottomColor: '#007AFF' },
  tabText: { fontSize: 18, color: '#007AFF' },
  activeTabText: { fontWeight: 'bold', textDecorationLine: 'underline' },
  messageCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 12, marginVertical: 6, borderWidth: 1, borderColor: '#ddd' },
  label: { fontSize: 15, fontWeight: 'bold', color: '#007AFF' },
  value: { fontSize: 15, marginBottom: 6, color: '#000' },
  readButton: { alignSelf: 'flex-start', backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 8 },
  readButtonText: { color: '#fff', fontWeight: '600' },
  messageBodyContainer: { backgroundColor: '#eef4ff', borderRadius: 8, padding: 10, marginTop: 10 },
  bodyText: { fontSize: 15, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 10 },
  actionContainer: { flexDirection: 'row', marginVertical: 8 },
  actionButton: { backgroundColor: '#f4f4f4', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 10 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#000' },
  replyBox: { marginVertical: 10, padding: 10, backgroundColor: '#eef4ff', borderRadius: 8 },
});
