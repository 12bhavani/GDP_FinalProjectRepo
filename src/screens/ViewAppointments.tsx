import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../firebase/config';
import {
  collection,
  getDocs,
  doc as firestoreDoc,
  updateDoc,
} from 'firebase/firestore';
import Header from '../components/Header';

type Appointment = {
  date: string;
  time: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  healthIssue: string;
  status: 'booked' | 'confirmed' | 'declined';
};

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const slotsRef = collection(db, 'slots');
      const snapshot = await getDocs(slotsRef);
      const appointmentsList: Appointment[] = [];

      for (const slotDoc of snapshot.docs) {
        const date = slotDoc.id;
        const detailsRef = collection(db, 'slots', date, 'details');
        const detailsSnap = await getDocs(detailsRef);

        for (const detailDoc of detailsSnap.docs) {
          const data = detailDoc.data();

          appointmentsList.push({
            date,
            time: detailDoc.id.split('_')[0],
            userEmail: data.email || 'N/A',
            userName: data.name || 'N/A',
            userPhone: data.phone || 'N/A',
            healthIssue: data.healthIssue || 'Not specified',
            status: data.status || 'booked',
          });
        }
      }

      appointmentsList.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA.getTime() === dateB.getTime()) {
          return a.time.localeCompare(b.time);
        }
        return dateA.getTime() - dateB.getTime();
      });

      setAppointments(appointmentsList);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    appointment: Appointment,
    newStatus: 'confirmed' | 'declined'
  ) => {
    try {
      const docRef = firestoreDoc(
        db,
        'slots',
        appointment.date,
        'details',
        `${appointment.time}_${appointment.date}`
      );
      await updateDoc(docRef, { status: newStatus });

      setAppointments(prev =>
        prev.map(a =>
          a.time === appointment.time && a.date === appointment.date
            ? { ...a, status: newStatus }
            : a
        )
      );
    } catch (error) {
      Alert.alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FCAF03" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Manage Appointments" />

      {appointments.length === 0 ? (
        <Text style={styles.noAppointments}>No appointments found</Text>
      ) : (
        appointments.map((appointment, index) => (
          <View key={index} style={styles.appointmentCard}>
            <Text style={styles.dateTime}>
              {appointment.date} at {appointment.time}
            </Text>

            <View style={styles.userInfo}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{appointment.userName}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{appointment.userEmail}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{appointment.userPhone}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.label}>Issue:</Text>
              <Text style={styles.value}>{appointment.healthIssue}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.label}>Status:</Text>
              <Text style={[styles.value, { textTransform: 'capitalize' }]}>
                {appointment.status}
              </Text>
            </View>

            {appointment.status === 'booked' && (
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: '#008000' }]}
                  onPress={() => handleStatusChange(appointment, 'confirmed')}
                >
                  <Text style={styles.statusText}>Confirm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusButton, { backgroundColor: '#AA4A44' }]}
                  onPress={() => handleStatusChange(appointment, 'declined')}
                >
                  <Text style={styles.statusText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAppointments: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  appointmentCard: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  dateTime: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: 'black',
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    fontWeight: '600',
    width: 75,
  },
  value: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ViewAppointments;
