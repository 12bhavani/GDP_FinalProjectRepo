import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
// @ts-ignore - Using legacy API to avoid deprecation warnings
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { addDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import Header from "../components/Header";
import { supabase } from "../supabase/supabase";
import { formatDateToMDY } from "../utils/dateFormat";

interface Appointment {
  time: string;
  email: string;
  reportUrl?: string;
  caseType?: "emergency" | "non-emergency";
}

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState<Record<string, Appointment[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const sanitizeStorageSegment = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '_')
      .replace(/_+/g, '_');

  const shouldFallbackToFirebase = (message: string) =>
    /network request failed/i.test(message) ||
    /creating blobs from 'arraybuffer' and 'arraybufferview' are not supported/i.test(message);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const slotsSnapshot = await getDocs(collection(db, "slots"));
      const groupedData: Record<string, Appointment[]> = {};

      for (const docSnap of slotsSnapshot.docs) {
        const date = docSnap.id;
        const data = docSnap.data();
        const bookedSlots: Appointment[] = [];

        for (const [key, value] of Object.entries(data)) {
          if (typeof value === "string" && value === "booked") {
            const userKey = `${key}_user`;
            const email = data[userKey] || "Unknown";
            const reportKey = `${key}_reportUrl`;
            const reportUrl = data[reportKey] || null;
            const detailDoc = await getDoc(doc(db, "slots", date, "details", `${key}_${date}`));
            const detailData = detailDoc.exists() ? detailDoc.data() : {};
            const caseType = detailData.caseType === "emergency" ? "emergency" : "non-emergency";

            bookedSlots.push({ time: key, email, reportUrl, caseType });
          }
        }

        if (bookedSlots.length > 0) {
          groupedData[date] = bookedSlots;
        }
      }

      setAppointments(groupedData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpload = async (date: string, time: string, email: string) => {
    try {
      // Step 1: Pick a file (PDF or image)
      const file = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (file.canceled) {
        return; // User cancelled file picker
      }

      setUploading(true);

      const fileUri = file.assets[0].uri;
      const pickedName = file.assets[0].name || 'report.pdf';
      const fileExtension = pickedName.split('.').pop() || 'pdf';
      
      // Create a URL-safe object key for Supabase storage.
      const safeDate = sanitizeStorageSegment(date);
      const safeTime = sanitizeStorageSegment(time);
      const safeEmail = sanitizeStorageSegment(email);
      const safeExt = sanitizeStorageSegment(fileExtension) || 'pdf';
      const fileName = `reports/${safeDate}_${safeTime}_${safeEmail}_${Date.now()}.${safeExt}`;

      // Step 2: Read the file as base64 (React Native compatible)
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Step 3: Convert base64 to ArrayBuffer for Supabase (React Native-safe)
      const arrayBuffer = decode(base64);

      // Step 4: Determine content type
      const contentType = fileExtension === 'pdf' 
        ? 'application/pdf' 
        : file.assets[0].mimeType || 'application/octet-stream';

      // Step 5: Upload file to Supabase Storage bucket "health-reports"
      // Retry once if device network flakes during upload.
      let uploadError: any = null;
      let fileUrl = '';
      for (let attempt = 1; attempt <= 2; attempt++) {
        const result = await supabase.storage
          .from('health-reports')
          .upload(fileName, arrayBuffer, {
            contentType: contentType,
            upsert: true,
          });

        uploadError = result.error;
        if (!uploadError) {
          break;
        }

        const isNetworkError = /network request failed/i.test(uploadError.message || '');
        if (!isNetworkError || attempt === 2) {
          break;
        }
      }

      if (!uploadError) {
        // Step 6A: Supabase upload succeeded.
        const { data: publicData } = supabase.storage
          .from('health-reports')
          .getPublicUrl(fileName);
        fileUrl = publicData.publicUrl;
      } else if (shouldFallbackToFirebase(uploadError.message || '')) {
        // Step 6B: Fallback to Firebase Storage if Supabase host is unreachable
        // or this runtime does not support the binary body type used by Supabase upload.
        const firebaseRef = ref(storage, `health-reports/${fileName}`);
        await uploadString(firebaseRef, base64, 'base64', { contentType });
        fileUrl = await getDownloadURL(firebaseRef);
      } else {
        throw uploadError;
      }

      // Step 7: Save file URL to Firestore in the nested structure
      // Structure: healthReports/{userEmail}/reports/{reportId}
      // Fields: date, fileUrl, description
      const reportsRef = collection(db, 'healthReports', email, 'reports');
      await addDoc(reportsRef, {
        date: date,
        fileUrl: fileUrl,
        description: `Health report for appointment on ${formatDateToMDY(date)} at ${time}`,
      });

      // Persist report URL in slot document so admin list shows "Report uploaded" immediately.
      await setDoc(
        doc(db, 'slots', date),
        { [`${time}_reportUrl`]: fileUrl },
        { merge: true }
      );

      Alert.alert("✅ Upload Successful", "Report uploaded and saved successfully!");
      
      // Step 8: Refresh the appointments list to show updated status
      await fetchAppointments();
    } catch (error: any) {
      console.error("Upload error:", error);
      const message = error?.message || 'Something went wrong. Please try again.';
      if (shouldFallbackToFirebase(message)) {
        Alert.alert(
          '❌ Upload Failed',
          'Cloud upload could not complete in this environment. Please retry. If it continues, check app network access and storage configuration.'
        );
      } else {
        Alert.alert('❌ Upload Failed', message);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="View Appointments" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#006747" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="View Appointments" />
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.title}>Appointments Grouped by Date</Text>

      {Object.keys(appointments).map((date) => (
        <View key={date} style={styles.groupContainer}>
          <Text style={styles.dateHeader}>{formatDateToMDY(date)}</Text>
          {appointments[date].map((appt, index) => (
            <View key={index} style={styles.appointmentCard}>
              <Text style={styles.text}>Time: {appt.time}</Text>
              <Text style={styles.text}>Email: {appt.email}</Text>
              <Text style={styles.text}>
                Case Type: {appt.caseType === "emergency" ? "Emergency" : "Non-Emergency"}
              </Text>
              {appt.reportUrl ? (
                <Text style={{ color: "green" }}>📄 Report uploaded</Text>
              ) : (
                <Button
                  title={uploading ? "Uploading..." : "Upload Report"}
                  onPress={() => handleUpload(date, appt.time, appt.email)}
                  disabled={uploading}
                />
              )}
            </View>
          ))}
        </View>
      ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, color: "#006747" },
  groupContainer: { marginBottom: 24 },
  dateHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#006747" },
  appointmentCard: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#006747",
  },
  text: { fontSize: 16, marginBottom: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { marginTop: 10, color: "#666", fontSize: 16 },
});
