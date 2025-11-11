import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Button, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
// @ts-ignore - Using legacy API to avoid deprecation warnings
import * as FileSystem from "expo-file-system/legacy";
import { db } from "../../firebase/config";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { supabase } from "../supabase/supabase";
import Header from "../components/Header";

interface Appointment {
  time: string;
  email: string;
  reportUrl?: string;
}

export default function ViewAppointments() {
  const [appointments, setAppointments] = useState<Record<string, Appointment[]>>({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const slotsSnapshot = await getDocs(collection(db, "slots"));
      const groupedData: Record<string, Appointment[]> = {};

      slotsSnapshot.forEach((docSnap) => {
        const date = docSnap.id;
        const data = docSnap.data();
        const bookedSlots: Appointment[] = [];

        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === "string" && value === "booked") {
            const userKey = `${key}_user`;
            const email = data[userKey] || "Unknown";
            const reportKey = `${key}_reportUrl`;
            const reportUrl = data[reportKey] || null;

            bookedSlots.push({ time: key, email, reportUrl });
          }
        });

        if (bookedSlots.length > 0) {
          groupedData[date] = bookedSlots;
        }
      });

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
      const fileExtension = file.assets[0].name?.split('.').pop() || 'pdf';
      
      // Create a unique filename for Supabase storage
      const fileName = `${date}_${time}_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExtension}`;

      // Step 2: Read the file as base64 (React Native compatible)
      const base64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Step 3: Convert base64 to ArrayBuffer for Supabase
      // Convert base64 string to byte array
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Step 4: Determine content type
      const contentType = fileExtension === 'pdf' 
        ? 'application/pdf' 
        : file.assets[0].mimeType || 'application/octet-stream';

      // Step 5: Upload file to Supabase Storage bucket "health-reports"
      // Supabase accepts ArrayBuffer/Uint8Array in React Native
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("health-reports")
        .upload(fileName, byteArray, {
          contentType: contentType,
          upsert: true, // Overwrite if file exists
        });

      if (uploadError) {
        throw uploadError;
      }

      // Step 6: Get the public URL of the uploaded file
      const { data: publicData } = supabase.storage
        .from("health-reports")
        .getPublicUrl(fileName);

      const fileUrl = publicData.publicUrl;

      // Step 7: Save file URL to Firestore in the nested structure
      // Structure: healthReports/{userEmail}/reports/{reportId}
      // Fields: date, fileUrl, description
      const reportsRef = collection(db, 'healthReports', email, 'reports');
      await addDoc(reportsRef, {
        date: date,
        fileUrl: fileUrl,
        description: `Health report for appointment on ${date} at ${time}`,
      });

      Alert.alert("✅ Upload Successful", "Report uploaded and saved successfully!");
      
      // Step 8: Refresh the appointments list to show updated status
      await fetchAppointments();
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("❌ Upload Failed", error.message || "Something went wrong. Please try again.");
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
          <Text style={styles.dateHeader}>{date}</Text>
          {appointments[date].map((appt, index) => (
            <View key={index} style={styles.appointmentCard}>
              <Text style={styles.text}>Time: {appt.time}</Text>
              <Text style={styles.text}>Email: {appt.email}</Text>
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
