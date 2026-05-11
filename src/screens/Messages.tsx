// src/screens/Messages.tsx
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { db } from '../../firebase/config';
import { collection, doc, getDocs, limit, query, updateDoc, where } from 'firebase/firestore';
import { auth } from '../../firebase/config';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/Header';
import { formatDateToMDY } from '../utils/dateFormat';

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
  const [resolvingUser, setResolvingUser] = useState(true);
  const [activeTab, setActiveTab] = useState<'Inbox' | 'Sent'>('Inbox');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);
  const [effectiveUser, setEffectiveUser] = useState<{ uid: string; email: string } | null>(null);

  const isAdmin = effectiveUser?.email === adminEmail;

  const resolveEffectiveUser = async () => {
    setResolvingUser(true);
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser?.uid) {
        setEffectiveUser({
          uid: firebaseUser.uid,
          email: (firebaseUser.email || '').trim().toLowerCase(),
        });
        return;
      }

      // Hardcoded admin login path can skip Firebase auth, so resolve admin UID by email.
      const adminQuery = query(
        collection(db, 'users'),
        where('email', '==', adminEmail),
        limit(1)
      );
      const adminSnap = await getDocs(adminQuery);

      if (!adminSnap.empty) {
        setEffectiveUser({ uid: adminSnap.docs[0].id, email: adminEmail });
      } else {
        setEffectiveUser(null);
      }
    } catch (err) {
      console.log(err);
      setEffectiveUser(null);
    } finally {
      setResolvingUser(false);
    }
  };

  /** FETCH MESSAGES */
  const fetchMessages = useCallback(async (tab: 'Inbox' | 'Sent') => {
    setLoading(true);

    if (!effectiveUser) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      const ref = collection(
        db,
        'users',
        effectiveUser.uid,
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
  }, [effectiveUser]);

  useEffect(() => {
    resolveEffectiveUser();
  }, []);

  useEffect(() => {
    if (resolvingUser) return;
    fetchMessages(activeTab);
  }, [activeTab, resolvingUser, fetchMessages]);

  const formatMessageDate = (rawDate: string) => {
    if (!rawDate) return '';
    const dt = new Date(rawDate);
    if (Number.isNaN(dt.getTime())) return rawDate;

    const formattedDate = formatDateToMDY(rawDate);
    const formattedTime = dt.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${formattedDate} ${formattedTime}`;
  };

  /** MARK AS READ */
  const markAsRead = async (id: string) => {
    if (!effectiveUser) return;
    try {
      await updateDoc(doc(db, 'users', effectiveUser.uid, 'messages', id), { isRead: true });
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isRead: true } : m))
      );
    } catch {
      Alert.alert('Failed to mark as read');
    }
  };

  /** HEADER */
  const ListHeader = () => (
    <View style={styles.headerCard}>
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
          style={[styles.actionButton, styles.newMessageButton]}
          onPress={() =>
            isAdmin
              ? navigation.navigate('AdminNewMessage')
              : navigation.navigate('SelectCommunicationOption')
          }
        >
          <Text style={[styles.actionText, styles.newMessageText]}>New Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /** MESSAGE ROW */
  const renderItem = ({ item }: { item: Message }) => {
    const isExpanded = expandedMessageId === item.id;
    return (
      <View style={styles.messageCard}>
        <Text style={styles.dateText}>{formatMessageDate(item.date)}</Text>

        <Text style={styles.label}>From</Text>
        <Text style={styles.value}>{activeTab === 'Inbox' ? item.fromRole || item.from : item.from}</Text>

        <Text style={styles.label}>To</Text>
        <Text style={styles.value}>{activeTab === 'Sent' ? item.toRole || item.to : item.to}</Text>

        <Text style={styles.label}>Subject</Text>
        <Text style={styles.value}>{item.subject}</Text>

        <View style={styles.messageActionsRow}>
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

      {loading || resolvingUser ? (
        <ActivityIndicator style={styles.loader} color="#006747" />
      ) : (
        <FlatList
          ListHeaderComponent={<ListHeader />}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No messages in {activeTab.toLowerCase()}.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginTop: 12,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEF4F1',
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#006747',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#006747',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: '#E2E8F0',
  },
  newMessageButton: {
    backgroundColor: '#006747',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  newMessageText: {
    color: '#FFFFFF',
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006747',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 3,
  },
  value: {
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  messageActionsRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 8,
  },
  readButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  readButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  messageBodyContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 10,
  },
  bodyText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 20,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#64748B',
    fontSize: 15,
  },
});
