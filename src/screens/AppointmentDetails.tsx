// src/screens/AppointmentDetails.tsx
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import { formatDateToMDY } from '../utils/dateFormat';

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
          <DetailRow label="Date" value={formatDateToMDY(appointment.date)} />
          <DetailRow label="Time" value={appointment.time} />
          <DetailRow
            label="Case Type"
            value={appointment.caseType === 'emergency' ? 'Emergency' : 'Non-Emergency'}
          />
          <DetailRow label="Health Issue" value={appointment.healthIssue} />
          <DetailRow
            label="Status"
            value={appointment.status}
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
}: {
  label: string;
  value: string;
}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
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
    color: '#000',
    marginTop: 2,
  },
});
