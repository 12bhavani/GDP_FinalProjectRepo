import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Header from "../components/Header";

// ---------- Helpers ----------
const normalizeTel = (raw: string) => raw.replace(/[^\d+]/g, "");
const openTel = (raw: string) => Linking.openURL(`tel:${normalizeTel(raw)}`);

// ---------- Emergency numbers ----------
const emergencyNumbers: Array<
  | { label: string; phone: string; note?: never }
  | { label: string; note: string; phone?: never }
> = [
  { label: "University Police", phone: "660.562.1254" },
  { label: "Mosaic Medical Center - Maryville", phone: "660.562.2600" },
  { label: "Community Health Line", phone: "1.800.455.2476" },
  { label: "Mosaic Behavioral Health - Maryville", phone: "660.562.4305" },
  { label: "Sexual Assault Hotline", phone: "660.562.1972" },
  { label: "Support Line For Students in Crisis", phone: "888.279.8188" },
  { label: "National Suicide & Crisis Lifeline", phone: "988" },
  { label: "Emergencies", phone: "911" },
  { label: "Mental Health Text Line", note: "Text HOME to 741741" },
];

// ---------- Staff data (full list) ----------
const staffData = [
  {
    name: "Kylee Cockerham",
    title: "Wellness Educator",
    phone: "660.562.1070",
    email: "kcockerham@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Kylee-Cockerham.jpg",
  },
  {
    name: "Brianna Colvin",
    title: "Office Manager",
    phone: "660.562.1348",
    email: "bcolvin@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Brianna_Colvin.jpg",
  },
  {
    name: "Carissa Everhart",
    title: "Staff Nurse",
    phone: "660.562.1348",
    email: "ceverhart@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/everhart.jpg",
  },
  {
    name: "Mark Falke",
    title: "Counselor",
    phone: "660.562.1348",
    email: "mfalke@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/MarkFalke.jpg",
  },
  {
    name: "Terra Feick",
    title: "Counselor",
    phone: "660.562.1070",
    email: "terraf@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Feick.jpg",
  },
  {
    name: "Lisa Finney",
    title: "Family Nurse Practitioner",
    phone: "660.562.1348",
    email: "lfinney@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Lisa%20Finney%20fall2016%20tw01309.jpg",
  },
  {
    name: "Judy Frueh",
    title: "Director of Clinic Services / Women’s Health Nurse Practitioner",
    phone: "660.562.1348",
    email: "jfrueh@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/frueh.jpg",
  },
  {
    name: "Linda Guess",
    title: "Billing Coordinator",
    phone: "660.562.1348",
    email: "lguess@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/guess.jpg",
  },
  {
    name: "Taylin Hunter",
    title: "Staff Nurse",
    phone: "660.562.1348",
    email: "thunter@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Taylin-Hunter.jpg",
  },
  {
    name: "Kendra Long",
    title: "Counselor",
    phone: "660.562.1348",
    email: "klong@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Kendra_Long.jpg",
  },
  {
    name: "Rachel Mayfield",
    title: "Lead Counselor",
    phone: "660.562.1348",
    email: "rmayfield@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/mayfield.jpg",
  },
  {
    name: "Kristen Peltz",
    title: "Director of Counseling Services",
    phone: "660.562.1348",
    email: "kpeltz@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/peltz.jpg",
  },
  {
    name: "Rachel Peter",
    title: "Staff Nurse",
    phone: "660.562.1348",
    email: "rachelp@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/peter.jpg",
  },
  {
    name: "Evan Rand",
    title: "Assistant Director, Wellness Services (Operations)",
    phone: "660.562.1348",
    email: "erand@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/rand.jpg",
  },
  {
    name: "Christina Tapps",
    title: "AVP, Health & Wellbeing",
    phone: "660.562.1348",
    email: "ctapps@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Christy-Tapps.jpg",
  },
  {
    name: "Suzanne Von Behren",
    title: "Assistant Director, Wellness Services (Education & Prevention)",
    phone: "660.562.1222",
    email: "suzannev@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/Suzanne_Fall2023.jpg",
  },
  {
    name: "Susan Watson",
    title: "Medical Director / Physician",
    phone: "660.562.1348",
    email: "swatson@nwmissouri.edu",
    img: "https://www.nwmissouri.edu/wellness/images/people/watson.jpg",
  },
];

const StaffDirectory = () => {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header title="Contact Us" />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.container}
        scrollEventThrottle={16}
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          if (!showTopBtn && y > 200) setShowTopBtn(true);
          else if (showTopBtn && y <= 200) setShowTopBtn(false);
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Us */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <View style={styles.contactBox}>
          <Text style={styles.bold}>University Wellness Services</Text>
          <Text>800 University Drive{"\n"}Maryville, MO 64468</Text>
          <Text style={styles.bold}>Phone: 660.562.1348</Text>
          <Text style={styles.bold}>Fax: 660.562.1585</Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://wellness.nwmissouri.edu/login_directory.aspx"
              )
            }
          >
            <Text style={styles.link}>Go to Wellness Portal</Text>
          </TouchableOpacity>
        </View>

        {/* After Hours Notice */}
        <View style={styles.noticeBox}>
          <Text style={styles.noticeText}>
            If you require medical attention outside of regular business hours,
            please contact your own healthcare provider, call{" "}
            <Text style={styles.bold}>911</Text>, or go to the Mosaic Medical
            Center Emergency Department.
          </Text>

          <Text style={[styles.noticeText, { marginTop: 12 }]}>
            If you have a question about your condition after hours, the{" "}
            <Text style={styles.bold}>Community Health Line</Text> is available.
            Their registered nurses are available to answer questions and
            provide quality health information. This local service is free and
            confidential and is offered 24 hours a day, 7 days a week.
          </Text>

          <Text style={[styles.noticeText, { marginTop: 8 }]}>
            Please call <Text style={styles.bold}>1.800.455.2476</Text> to
            access this service.{" "}
            <Text style={styles.bold}>
              THIS SERVICE IS ONLY ACCESSIBLE USING A LOCAL PHONE.
            </Text>
          </Text>
        </View>

        {/* 📍 Emergency Numbers */}
<Text style={styles.sectionTitle}>Emergency Phone Numbers</Text>
<View style={styles.emergencyBox}>
  {emergencyNumbers.map((item, idx) => (
    <View key={idx} style={styles.emergencyRow}>
      <Text style={{ flex: 1 }}>{item.label}</Text>
      {item.phone ? (
        <TouchableOpacity onPress={() => openTel(item.phone)}>
          <Text style={styles.link}>{item.phone}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.note}>{item.note}</Text>
      )}
    </View>
  ))}
</View>

        {/* Staff Directory */}
        <Text style={styles.sectionTitle}>Meet the Staff</Text>
        <View style={styles.staffGrid}>
          {staffData.map((staff, index) => (
            <View key={index} style={styles.staffCard}>
              <Image source={{ uri: staff.img }} style={styles.staffImg} />
              <Text style={styles.name}>{staff.name}</Text>
              <Text style={styles.role}>{staff.title}</Text>

              <TouchableOpacity onPress={() => openTel(staff.phone)}>
                <Text style={styles.link}>{staff.phone}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${staff.email}`)}
              >
                <Text style={styles.link}>{staff.email}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Back-to-Top Button (appears after scroll) */}
      {showTopBtn && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Back to top"
          style={styles.floatingButton}
          onPress={() => scrollViewRef.current?.scrollTo({ y: 0, animated: true })}
          activeOpacity={0.9}
        >
          <Text style={styles.floatingButtonText}>⬆</Text>

        </TouchableOpacity>
      )}
    </View>
  );
};

export default StaffDirectory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#006747",
    marginVertical: 12,
  },
  contactBox: {
    backgroundColor: "#f5f9f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  link: {
    color: "#006747",
    fontWeight: "600",
    marginTop: 4,
  },
  note: {
    color: "#444",
    fontStyle: "italic",
  },
  noticeBox: {
    backgroundColor: "#fff8f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#cc3300",
  },
  noticeText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  emergencyBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  emergencyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#ddd",
    paddingVertical: 6,
  },
  staffGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  staffCard: {
    width: "48%",
    backgroundColor: "#f6f6f6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  staffImg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  role: {
    fontSize: 13,
    color: "#555",
    marginVertical: 4,
    textAlign: "center",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#006747",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  floatingButtonText: {
  color: "#fff",
  fontSize: 40,
  fontWeight: "900",
  lineHeight: 56,  // same as button height

  textAlign: "center",    // ensures horizontal center
  includeFontPadding: false, // Android fix for extra padding
  textAlignVertical: "center", // Android vertical align
},


});
