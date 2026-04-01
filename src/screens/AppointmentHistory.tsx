// src/screens/AppointmentHistory.tsx
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { auth, db } from '../../firebase/config';
import Header from '../components/Header';
import { formatDateToMDY } from '../utils/dateFormat';

export default function AppointmentHistory() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const email = auth.currentUser?.email || '';

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!email) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'slots'));
        const results: any[] = [];

        for (const docSnap of snapshot.docs) {
          const date = docSnap.id;
          const data = docSnap.data();

          const detailPromises = Object.entries(data)
            .filter(([key, value]) => key.endsWith('_user') && value === email)
            .map(async ([key]) => {
              const slotName = key.replace('_user', '');
              const detailDoc = await getDoc(
                doc(db, 'slots', date, 'details', `${slotName}_${date}`)
              );
              const detailData = detailDoc.exists() ? detailDoc.data() : {};
              return {
                date,
                time: slotName,
                status: detailData.status || 'booked',
                caseType: detailData.caseType || 'non-emergency',
                healthIssue: detailData.healthIssue || 'No health issue provided',
                doctor: detailData.doctor || 'Not assigned',
                notes: detailData.notes || 'No notes',
              };
            });

          const detailResults = await Promise.all(detailPromises);
          results.push(...detailResults);
        }

        results.sort((a, b) =>
          moment(`${a.date} ${a.time}`, 'YYYY-MM-DD hh:mm A').diff(
            moment(`${b.date} ${b.time}`, 'YYYY-MM-DD hh:mm A')
          )
        );

        setAppointments(results);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [email]);

  const now = moment();
  const upcoming = appointments.filter(app =>
    moment(`${app.date} ${app.time}`, 'YYYY-MM-DD hh:mm A').isSameOrAfter(now)
  );
  const past = appointments.filter(app =>
    moment(`${app.date} ${app.time}`, 'YYYY-MM-DD hh:mm A').isBefore(now)
  );

  const renderStatus = (status: string) => {
    const color = status === 'declined' ? 'red' : 'green';
    return <Text style={{ color, fontWeight: '600' }}>Status: {status}</Text>;
  };

  const formatCaseType = (caseType: string) =>
    caseType === 'emergency' ? 'Emergency' : 'Non-Emergency';

  return (
    <View style={styles.screen}>
      <Header title="Appointment History" />

      <View style={styles.contentArea}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#006747" />
          </View>
        ) : appointments.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>You haven’t had prior appointments.</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            {upcoming.length > 0 ? (
              upcoming.map((app, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate('AppointmentDetails', { appointment: app })
                  }
                >
                  <Text style={styles.date}>{formatDateToMDY(app.date)}</Text>
                  <Text style={styles.time}>{app.time}</Text>
                  <Text>Case Type: {formatCaseType(app.caseType)}</Text>
                  <Text>Health Issue: {app.healthIssue}</Text>
                  {renderStatus(app.status)}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.empty}>No upcoming appointments</Text>
            )}

            <Text style={styles.sectionTitle}>Past Appointments</Text>
            {past.length > 0 ? (
              past.map((app, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.cardPast}
                  onPress={() =>
                    navigation.navigate('AppointmentDetails', { appointment: app })
                  }
                >
                  <Text style={styles.date}>{formatDateToMDY(app.date)}</Text>
                  <Text style={styles.time}>{app.time}</Text>
                  <Text>Case Type: {formatCaseType(app.caseType)}</Text>
                  <Text>Health Issue: {app.healthIssue}</Text>
                  {renderStatus(app.status)}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.empty}>No past appointments</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  contentArea: { flex: 1 },
  container: { padding: 16, paddingBottom: 30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#006747',
  },
  card: {
    backgroundColor: '#E6F7FF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardPast: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  date: { fontSize: 16, fontWeight: '600' },
  time: { fontSize: 14, color: '#333' },
  empty: { fontStyle: 'italic', textAlign: 'center', marginVertical: 15 },
});
