// src/screens/AppointmentDetails.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Header from '../components/Header';

export default function AppointmentDetails() {
  const route = useRoute<any>();
  const { appointment } = route.params;

  return (
    <View style={styles.container}>
      {/* ✅ App Header */}
      <Header title="Appointment Details" />

      <ScrollView contentContainerStyle={styles.body}>
        {/* ✅ Card for appointment info */}
        <View style={styles.card}>
          <DetailRow label="Date" value={appointment.date} />
          <DetailRow label="Time" value={appointment.time} />
          <DetailRow label="Health Issue" value={appointment.healthIssue} />
          <DetailRow
            label="Status"
            value={appointment.status}
            highlight={appointment.status === 'declined' ? 'red' : '#006747'}
          />
          <DetailRow label="Doctor" value={appointment.doctor} />
          <DetailRow label="Notes" value={appointment.notes || '—'} />
        </View>
      </ScrollView>
    </View>
  );
}

/* ✅ Reusable detail row */
const DetailRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: string;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, highlight ? { color: highlight } : {}]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: {
    padding: 20,
  },
  card: {
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  row: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006747',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
});
