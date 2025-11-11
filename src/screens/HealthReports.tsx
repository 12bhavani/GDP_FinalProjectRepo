import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { db } from '../../firebase/config'; 
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Header from '../components/Header';

interface HealthReportItem {
  id: string;
  date: string;
  description: string;
  fileUrl: string;
  appointmentTime?: string;
  uploadedAt?: string;
}

const HealthReports = () => {
  const [reports, setReports] = useState<HealthReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      try {
        // Access the nested structure: healthReports/{userEmail}/reports
        const userEmail = currentUser.email!;
        const reportsRef = collection(db, 'healthReports', userEmail, 'reports');
        const querySnapshot = await getDocs(reportsRef);

        const data: HealthReportItem[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();
          data.push({
            id: doc.id,
            date: docData.date || 'N/A',
            description: docData.description || 'No description',
            fileUrl: docData.fileUrl || '',
            appointmentTime: docData.appointmentTime || '',
            uploadedAt: docData.uploadedAt || '',
          });
        });

        // Sort by date (newest first)
        data.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setReports(data);
      } catch (error) {
        console.error('Error fetching health reports:', error);
        Alert.alert('Error', 'Failed to load health reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentUser]);

  const handleDownload = async (fileUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Error', 'Cannot open this file URL');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Failed to open the report. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Health Reports" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#006747" />
          <Text style={styles.loadingText}>Loading health reports...</Text>
        </View>
      </View>
    );
  }

  if (reports.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Health Reports" />
        <View style={styles.center}>
          <Text style={styles.emptyText}>No health reports found.</Text>
          <Text style={styles.emptySubtext}>Your reports will appear here once uploaded by an admin.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Health Reports" />
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.date}>{item.date}</Text>
              {item.appointmentTime && (
                <Text style={styles.time}>Time: {item.appointmentTime}</Text>
              )}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            {item.fileUrl ? (
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => handleDownload(item.fileUrl)}
              >
                <Text style={styles.downloadButtonText}>📄 View/Download Report</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.noUrlText}>No file available</Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#006747',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#006747',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
    lineHeight: 20,
  },
  downloadButton: {
    backgroundColor: '#006747',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noUrlText: {
    color: '#999',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default HealthReports;
