//src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { auth, db } from '../../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';
import { formatDateToMDY } from '../utils/dateFormat';

type EditableField = 'name' | 'phone';
type SlotStatus = 'booked' | 'confirmed' | 'declined';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const [userData, setUserData] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [userSlots, setUserSlots] = useState<{ date: string; slot: string; status: SlotStatus }[]>([]);

  const email = user?.email || '';
  const uid = user?.uid || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) {
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }

      const slotsRef = collection(db, 'slots');
      const snap = await getDocs(slotsRef);
      const appointments: { date: string; slot: string; status: SlotStatus }[] = [];

      for (const d of snap.docs) {
        const date = d.id;
        const data = d.data();
        for (const [key, value] of Object.entries(data)) {
          if (key.endsWith('_user') && value === email) {
            const slotName = key.replace('_user', '');
            const detailDoc = await getDoc(doc(db, 'slots', date, 'details', `${slotName}_${date}`));
            const detailStatus = detailDoc.exists() ? detailDoc.data()?.status : undefined;
            const status: SlotStatus =
              detailStatus === 'confirmed' || detailStatus === 'declined' ? detailStatus : 'booked';
            appointments.push({ date, slot: slotName, status });
          }
        }
      }

      setUserSlots(appointments);
      setLoading(false);
    };

    fetchData();
  }, [uid, email]);

  const startEdit = (field: EditableField) => {
    setEditingField(field);
    setEditedValue(userData[field] || '');
  };

  const resetEdit = () => {
    setEditingField(null);
    setEditedValue('');
  };

  const saveEdit = async () => {
    if (!uid || !editingField) return;

    const trimmedValue = editedValue.trim();
    if (!trimmedValue) {
      Alert.alert('Invalid input', 'Please enter a valid value before saving.');
      return;
    }

    try {
      await updateDoc(doc(db, 'users', uid), { [editingField]: trimmedValue });
      setUserData(prev => ({ ...prev, [editingField]: trimmedValue }));
      resetEdit();
    } catch {
      Alert.alert('Error updating profile');
    }
  };

  const cancelAppointment = async (date: string, slot: string) => {
    try {
      await updateDoc(doc(db, 'slots', date), { [slot]: 'available', [`${slot}_user`]: '' });
      await deleteDoc(doc(db, 'slots', date, 'details', `${slot}_${date}`));
      setUserSlots(prev => prev.filter(s => !(s.date === date && s.slot === slot)));
      Alert.alert('Appointment canceled successfully.');
    } catch {
      Alert.alert('Failed to cancel appointment. Please try again.');
    }
  };

  const formatStatus = (status: SlotStatus) => {
    if (status === 'confirmed') return 'Confirmed';
    if (status === 'declined') return 'Declined';
    return 'Booked';
  };

  const getStatusBadgeStyle = (status: SlotStatus) => {
    if (status === 'declined') return [styles.statusBadge, styles.statusBadgeDeclined];
    if (status === 'confirmed') return [styles.statusBadge, styles.statusBadgeConfirmed];
    return [styles.statusBadge, styles.statusBadgeBooked];
  };

  const getStatusTextStyle = (status: SlotStatus) => {
    if (status === 'declined') return [styles.statusText, styles.statusTextDeclined];
    if (status === 'confirmed') return [styles.statusText, styles.statusTextConfirmed];
    return [styles.statusText, styles.statusTextBooked];
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#006747" />
          <Text style={styles.loadingText}>Loading profile details...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Name</Text>
            {editingField === 'name' ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  placeholder="Enter your name"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.editActionRow}>
                  <TouchableOpacity onPress={resetEdit} style={styles.ghostButton}>
                    <Text style={styles.ghostButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveEdit} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.valueRow}>
                <Text style={styles.fieldValue}>{userData.name || 'Not provided'}</Text>
                <TouchableOpacity onPress={() => startEdit('name')} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.valueRow}>
              <Text style={styles.fieldValue}>{user?.email || userData.email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={[styles.fieldBlock, styles.lastFieldBlock]}>
            <Text style={styles.fieldLabel}>Phone</Text>
            {editingField === 'phone' ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editedValue}
                  onChangeText={setEditedValue}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#94A3B8"
                />
                <View style={styles.editActionRow}>
                  <TouchableOpacity onPress={resetEdit} style={styles.ghostButton}>
                    <Text style={styles.ghostButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={saveEdit} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.valueRow}>
                <Text style={styles.fieldValue}>{userData.phone || 'Not provided'}</Text>
                <TouchableOpacity onPress={() => startEdit('phone')} style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booked Slots</Text>

          {userSlots.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No appointments booked yet.</Text>
            </View>
          ) : (
            userSlots.map((item, index) => (
              <View key={`${item.date}-${item.slot}-${index}`} style={styles.slotCard}>
                <View style={styles.slotTopRow}>
                  <Text style={styles.slotDate}>{formatDateToMDY(item.date)}</Text>
                  <Text style={styles.slotTime}>{item.slot}</Text>
                </View>

                <View style={styles.slotBottomRow}>
                  <View style={getStatusBadgeStyle(item.status)}>
                    <Text style={getStatusTextStyle(item.status)}>{formatStatus(item.status)}</Text>
                  </View>

                  {item.status !== 'declined' && (
                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert('Cancel Appointment', 'Do you want to cancel?', [
                          { text: 'No', style: 'cancel' },
                          { text: 'Yes', onPress: () => cancelAppointment(item.date, item.slot) },
                        ])
                      }
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#4B5563',
    fontSize: 15,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  fieldBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  lastFieldBlock: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  valueRow: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    marginRight: 10,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#006747',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editButtonText: {
    color: '#006747',
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#0F172A',
  },
  editActionRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  ghostButtonText: {
    color: '#475569',
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#006747',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  emptyStateContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    color: '#64748B',
    fontSize: 15,
  },
  slotCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotDate: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  slotTime: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  slotBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeBooked: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeConfirmed: {
    backgroundColor: '#D1FAE5',
  },
  statusBadgeDeclined: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextBooked: {
    color: '#166534',
  },
  statusTextConfirmed: {
    color: '#047857',
  },
  statusTextDeclined: {
    color: '#B91C1C',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  cancelButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
