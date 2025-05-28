import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../../firebase/config';
import { doc, getDoc, setDoc, deleteField, deleteDoc } from 'firebase/firestore';
import moment from 'moment';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

type SlotStatus = 'available' | 'booked';
type Mode = 'add' | 'delete';

const ManageSlots = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [slotStatuses, setSlotStatuses] = useState<Record<string, SlotStatus>>({});
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('add');

  const today = moment().format('YYYY-MM-DD');

  const isPastSlot = (date: string, time: string): boolean => {
    const now = moment();
    const slotDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD hh:mm A');
    return slotDateTime.isBefore(now);
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setSelectedSlots([]);
    setLoading(true);
    try {
      const docRef = doc(db, 'slots', date);
      const snapshot = await getDoc(docRef);

      const statuses: Record<string, SlotStatus> = {};
      if (snapshot.exists()) {
        const data = snapshot.data();
        timeSlots.forEach(slot => {
          if (data[`${slot}_user`]) {
            statuses[slot] = 'booked';
          } else if (data[slot] === 'available') {
            statuses[slot] = 'available';
          }
        });
      }
      setSlotStatuses(statuses);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch slot data');
    }
    setLoading(false);
  };

  const toggleSlotSelection = (slot: string) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(prev => prev.filter(s => s !== slot));
    } else {
      setSelectedSlots(prev => [...prev, slot]);
    }
  };

  const addSelectedSlots = async () => {
    const toAdd = selectedSlots.filter(slot => !slotStatuses[slot]);
    if (toAdd.length === 0) return Alert.alert('No new slots selected');

    const updates: Record<string, any> = {};
    toAdd.forEach(slot => {
      updates[slot] = 'available';
    });

    try {
      await setDoc(doc(db, 'slots', selectedDate), updates, { merge: true });
      Alert.alert('Success', 'Slots added');
      handleDateSelect(selectedDate);
    } catch {
      Alert.alert('Error', 'Failed to add slots');
    }
  };

  const deleteSelectedSlots = async () => {
    const toDelete = selectedSlots.filter(slot => slotStatuses[slot] === 'available');

    if (toDelete.length === 0) return Alert.alert('No deletable slots selected');

    try {
      const docRef = doc(db, 'slots', selectedDate);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) return Alert.alert('No data found');
      const data = snapshot.data();

      for (const slot of toDelete) {
        if (data[`${slot}_user`]) {
          Alert.alert('Error', `Slot "${slot}" is booked and cannot be removed`);
          return;
        }
      }

      // Remove each slot field
      const updates: Record<string, any> = {};
      toDelete.forEach(slot => {
        updates[slot] = deleteField();
      });

      await setDoc(docRef, updates, { merge: true });

      // Check if after deletion, document has any fields left
      const updatedSnapshot = await getDoc(docRef);
      if (updatedSnapshot.exists()) {
        const updatedData = updatedSnapshot.data();
        if (!updatedData || Object.keys(updatedData).length === 0) {
          await deleteDoc(docRef);
        }
      }

      Alert.alert('Success', 'Slots deleted');
      handleDateSelect(selectedDate);
    } catch {
      Alert.alert('Error', 'Failed to delete slots');
    }
  };

  const getSlotStyle = (slot: string) => {
    const status = slotStatuses[slot];
    const isSelected = selectedSlots.includes(slot);
    // const isPast = isPastSlot(selectedDate, slot);

    let baseStyle = {
      backgroundColor: 'lightgray',
    };

    if (status === 'available') baseStyle.backgroundColor = 'lightgray';
    // if (status === 'booked') baseStyle.backgroundColor = '#FF6B6B';
    // if (isPast) baseStyle.backgroundColor = 'red';

    if (isSelected) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: 'skyblue'
      };
    }

    return baseStyle;
  };

  const filteredSlots = timeSlots.filter(slot => {
    const status = slotStatuses[slot];
    const isPast = isPastSlot(selectedDate, slot);

    if (isPast) return false;

    if (mode === 'add') return !status; 
    if (mode === 'delete') return status === 'available';
    return false;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Manage Available Slots</Text>

      <View style={styles.modeSelector}>
       <TouchableOpacity
  style={[styles.modeButton, mode === 'add' && styles.selectedMode]}
  onPress={() => setMode('add')}
>
  <Text style={[styles.modeText, mode === 'add' && styles.selectedModeText]}>
    ➕ Add
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={[styles.modeButton, mode === 'delete' && styles.selectedMode]}
  onPress={() => setMode('delete')}
>
  <Text style={[styles.modeText, mode === 'delete' && styles.selectedModeText]}>
    🗑️ Delete
  </Text>
</TouchableOpacity>

      </View>

      <Calendar
        onDayPress={(day) => handleDateSelect(day.dateString)}
        markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
        minDate={today}
        theme={{
          selectedDayBackgroundColor: 'green',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="purple" />
      ) : selectedDate ? (
        <>
          <Text style={styles.subtitle}>Slots for {selectedDate}</Text>
          {filteredSlots.length > 0 ? (
            <View style={styles.slotsGrid}>
              {filteredSlots.map(slot => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => toggleSlotSelection(slot)}
                  disabled={isPastSlot(selectedDate, slot)}
                  style={[styles.slotButton, getSlotStyle(slot)]}
                >
                  <Text style={styles.slotText}>{slot}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.infoText}>No slots to show for this mode.</Text>
          )}

          {mode === 'add' && (
            <TouchableOpacity style={styles.actionButton} onPress={addSelectedSlots}>
              <Text style={styles.buttonText}>Add Selected</Text>
            </TouchableOpacity>
          )}

          {mode === 'delete' && (
            <TouchableOpacity
              style={[styles.actionButton]}
              onPress={deleteSelectedSlots}
            >
              <Text style={styles.buttonText}>Delete Selected</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.infoText}>Select a date to manage time slots</Text>
      )}
    </ScrollView>
  );
};

export default ManageSlots;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    borderRadius: 10,
    padding: 14,
    minWidth: '30%',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotText: {
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    width: '95%',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  infoText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modeButton: {
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'lightgray',
  },
  selectedMode: {
    backgroundColor: 'green',
  },
  modeText: {
  fontSize: 16,
  fontWeight: '600',
  color: 'black',
},
  selectedModeText: {
  color: 'white',
}

});

