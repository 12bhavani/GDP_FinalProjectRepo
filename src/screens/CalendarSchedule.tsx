import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { db } from '../../firebase/config';
import Header from '../components/Header';

import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 

type CalendarScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

export default function CalendarScreen() {
  const navigation = useNavigation<CalendarScreenNavProp>();

  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, 'available' | 'booked'>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  const today = moment().format('YYYY-MM-DD');

  const isPastSlot = (date: string, time: string) => {
    const now = moment();
    const slotDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD hh:mm A');
    return slotDateTime.isBefore(now);
  };

  useEffect(() => {
    const fetchMarkedDates = async () => {
      const snapshot = await getDocs(collection(db, 'slots'));
      const marks: Record<string, any> = {};
      const today = moment();

      snapshot.forEach(docSnap => {
        const dateId = docSnap.id;
        if (moment(dateId).isBefore(today, 'day')) return;

        const data = docSnap.data();
        const values = Object.values(data).filter(v => typeof v === 'string' && !v.includes('@'));
        const booked = values.filter(v => v === 'booked').length;
        const total = values.length;

        let color = 'blue';
        if (booked === 0) color = 'green';
        else if (booked === total) color = 'red';

        marks[dateId] = {
          customStyles: {
            container: { backgroundColor: color },
            text: { color: 'white', fontWeight: 'normal' },
          },
        };
      });

      setMarkedDates(marks);
      setLoadingCalendar(false);
    };

    fetchMarkedDates();
  }, []);

  const onDayPress = async (day: any) => {
    if (!day?.dateString) return;
    const dateStr = day.dateString;
    setSelectedDate(dateStr);
    setLoadingSlots(true);

    try {
      const slotDoc = await getDoc(doc(db, 'slots', dateStr));
      if (slotDoc.exists()) {
        const data = slotDoc.data();
        const filtered: Record<string, 'available' | 'booked'> = {};

        Object.entries(data).forEach(([key, value]) => {
          if (!key.endsWith('_user') && (value === 'available' || value === 'booked')) {
            filtered[key] = value;
          }
        });

        setSlots(filtered);
      } else {
        setSlots({});
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }

    setLoadingSlots(false);
  };

  const handleSlotPress = (slot: string) => {
    const user = auth().currentUser;
    if (!user || !selectedDate) {
      Alert.alert('You must be logged in to book a slot.');
      return;
    }

    navigation.navigate('Form', { date: selectedDate, slot });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <Header title="Schedule an Appointment" /> 

      <ScrollView contentContainerStyle={styles.container}>
       

        <Calendar
          markingType="custom"
          markedDates={markedDates}
          onDayPress={onDayPress}
          minDate={today}
        />

        {selectedDate && (
          <>
            <Text style={styles.subtitle}>Available Slots for {selectedDate}:</Text>

            {loadingSlots ? (
              <ActivityIndicator style={{ marginTop: 20 }} />
            ) : Object.keys(slots).length > 0 ? (
              Object.entries(slots).map(([slot, status]) => {
                if (isPastSlot(selectedDate, slot)) {
                  return (
                    <Text key={slot} style={{ color: 'grey', marginTop: 10 }}>
                      {slot} - Past slot
                    </Text>
                  );
                }

                if (status === 'available') {
                  return (
                    <Button key={slot} title={`Book ${slot}`} onPress={() => handleSlotPress(slot)} />
                  );
                } else {
                  return (
                    <Text key={slot} style={{ color: 'grey', marginTop: 10 }}>
                      {slot} - Booked
                    </Text>
                  );
                }
              })
            ) : (
              <Text style={styles.noSlots}>No slots found for this date.</Text>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  noSlots: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
