import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import Header from '../components/Header';

const ProfileScreen = () => {
  const user = auth().currentUser;
  const [userData, setUserData] = useState<{ name?: string; phone?: string; email?: string }>({});
  const [editingField, setEditingField] = useState<'name' | 'phone' | null>(null);
  const [editedValue, setEditedValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [userSlots, setUserSlots] = useState<{
    date: string;
    slot: string;
    status: 'booked' | 'confirmed' | 'declined';
  }[]>([]);

  const email = user?.email || '';
  const uid = user?.uid || '';

  useEffect(() => {
    const fetchData = async () => {
      if (!uid) return;

      const userRef = doc(db, 'users', uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(data);
      }

      const slotsRef = collection(db, 'slots');
      const snap = await getDocs(slotsRef);
      const appointments: {
        date: string;
        slot: string;
        status: 'booked' | 'confirmed' | 'declined';
      }[] = [];

      for (const docSnap of snap.docs) {
        const date = docSnap.id;
        const data = docSnap.data();

        for (const [key, value] of Object.entries(data)) {
          if (key.endsWith('_user') && value === email) {
            const slotName = key.replace('_user', '');
            const detailDoc = await getDoc(doc(db, 'slots', date, 'details', `${slotName}_${date}`));
            const status = detailDoc.exists() ? (detailDoc.data()?.status || 'booked') : 'booked';
            appointments.push({ date, slot: slotName, status });
          }
        }
      }

      setUserSlots(appointments);
      setLoading(false);
    };

    fetchData();
  }, []);

  const saveEdit = async () => {
    if (!uid || !editingField) return;
    try {
      await updateDoc(doc(db, 'users', uid), {
        [editingField]: editedValue,
      });
      setUserData(prev => ({ ...prev, [editingField]: editedValue }));
      setEditingField(null);
      setEditedValue('');
    } catch (error) {
      Alert.alert('Error updating profile');
    }
  };

  const cancelAppointment = async (date: string, slot: string) => {
    try {
      await updateDoc(doc(db, 'slots', date), {
        [slot]: 'available',
        [`${slot}_user`]: '',
      });
      await deleteDoc(doc(db, 'slots', date, 'details', `${slot}_${date}`));
      setUserSlots(prev => prev.filter(s => !(s.date === date && s.slot === slot)));
      Alert.alert('Appointment canceled successfully.');
    } catch (error) {
      Alert.alert('Failed to cancel appointment. Please try again.');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView>
        <View style={styles.fieldRow}>
          <Text style={styles.label}>Name:</Text>
          {editingField === 'name' ? (
            <>
              <TextInput
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
              />
              <TouchableOpacity onPress={saveEdit} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.value}>{userData.name || 'N/A'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingField('name');
                  setEditedValue(userData.name || '');
                }}
              >
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{auth().currentUser?.email || 'N/A'}</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Phone:</Text>
          {editingField === 'phone' ? (
            <>
              <TextInput
                style={styles.input}
                value={editedValue}
                onChangeText={setEditedValue}
                keyboardType="phone-pad"
              />
              <TouchableOpacity onPress={saveEdit} style={styles.saveBtn}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.value}>{userData.phone || 'N/A'}</Text>
              <TouchableOpacity
                onPress={() => {
                  setEditingField('phone');
                  setEditedValue(userData.phone || '');
                }}
              >
                <Text style={styles.editIcon}>✎</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <Text style={[styles.label, { marginTop: 20, marginLeft: 20 }]}>Booked Slots:</Text>

        {userSlots.length === 0 ? (
          <Text style={styles.value}>No appointments</Text>
        ) : (
          <FlatList
            data={userSlots}
            keyExtractor={(item, index) => `${item.date}-${item.slot}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.slotItem}>
                <Text style={styles.slotText}>📅 {item.date} — 🕐 {item.slot}</Text>
                <Text style={{ color: item.status === 'declined' ? 'red' : 'green' }}>
                  Status: {item.status}
                </Text>
                {item.status !== 'declined' && (
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        'Cancel Appointment',
                        'Do you want to cancel this appointment?',
                        [
                          { text: 'No', style: 'cancel' },
                          {
                            text: 'Yes',
                            onPress: () => cancelAppointment(item.date, item.slot),
                            style: 'destructive',
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                  >
                    <Text style={styles.editIcon}>❌ Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    width: 100,
  },
  value: {
    fontSize: 16,
    flex: 1,
  },
  editIcon: {
    fontSize: 18,
    color: '#007AFF',
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 16,
    flex: 1,
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 10,
  },
  saveText: {
    color: 'white',
    fontWeight: '600',
  },
  slotItem: {
    flexDirection: 'column',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 20,
  },
  slotText: {
    fontSize: 15,
    marginBottom: 4,
  },
});