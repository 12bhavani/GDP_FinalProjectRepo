import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Header from "../components/Header";

const TherapyAssistanceOnline = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Page Header */}
      <Header title="Therapy Assistance Online (TAO)" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Intro */}
        <Text style={styles.sectionTitle}>What is TAO?</Text>
        <Text style={styles.paragraph}>
          Therapy Assistance Online (TAO) is a free and confidential resource
          available to Northwest students, faculty, and staff. It provides
          interactive educational modules, practice tools, and guided activities
          that help you manage stress, anxiety, depression, and more.
        </Text>
        <Text style={styles.paragraph}>
          TAO combines online videos, brief exercises, and reflection activities
          to support your mental well-being—anytime, anywhere.
        </Text>

        {/* Modules / Pathways */}
        <Text style={styles.sectionTitle}>TAO Pathways</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 Calming Your Worry</Text>
          <Text style={styles.paragraph}>
            Learn how to challenge anxious thinking and manage worry more
            effectively.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 Let Go and Be Well</Text>
          <Text style={styles.paragraph}>
            Practical techniques to improve mood and cope with stress or
            sadness.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 Improving Relationships</Text>
          <Text style={styles.paragraph}>
            Strengthen your communication skills and develop healthier
            connections.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📌 Other Well-Being Modules</Text>
          <Text style={styles.paragraph}>
            Explore mindfulness, self-esteem, and resilience-building
            strategies.
          </Text>
        </View>

        {/* Student Sign Up */}
        <Text style={styles.sectionTitle}>Student Sign-Up</Text>
        <Text style={styles.paragraph}>Follow these steps to register:</Text>
        <Text style={styles.listItem}>
          1. Visit the{" "}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL("https://thepath.taoconnect.org/local/login/index.php")
            }
          >
            TAO Login Page
          </Text>
          .
        </Text>
        <Text style={styles.listItem}>
          2. Click on "Sign-Up in Self-Help with an Institution".
        </Text>
        <Text style={styles.listItem}>
          3. Enter your Northwest email address and create your account.
        </Text>
        <Text style={styles.listItem}>
          4. Confirm your registration through the link sent to your email.
        </Text>

        {/* Employee Sign Up */}
        <Text style={styles.sectionTitle}>Employee Sign-Up</Text>
        <Text style={styles.paragraph}>
          Faculty and staff can also access TAO using their Northwest email.
        </Text>
        <Text style={styles.listItem}>
          1. Go to the{" "}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL("https://thepath.taoconnect.org/local/login/index.php")
            }
          >
            TAO Login Page
          </Text>
          .
        </Text>
        <Text style={styles.listItem}>
          2. Choose "Sign-Up with an Institution".
        </Text>
        <Text style={styles.listItem}>
          3. Enter your Northwest email and complete registration.
        </Text>

        {/* App Downloads */}
        <Text style={styles.sectionTitle}>Access TAO on Mobile</Text>
        <View style={styles.downloadRow}>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=org.taoconnect.app"
              )
            }
          >
            <Text style={styles.downloadText}>📱 Download on Google Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadBtn}
            onPress={() =>
              Linking.openURL("https://apps.apple.com/us/app/tao-connect/id1343718534")
            }
          >
            <Text style={styles.downloadText}>🍏 Download on App Store</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.noteText}>
            TAO is designed to complement counseling services, but it is not a
            substitute for professional treatment in crisis situations.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TherapyAssistanceOnline;

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
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 8,
  },
  listItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
    color: "#333",
  },
  link: {
    color: "#006747",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  card: {
    backgroundColor: "#f6f6f6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 15,
  },
  downloadRow: {
    flexDirection: "column",
    gap: 8,
    marginVertical: 12,
  },
  downloadBtn: {
    backgroundColor: "#006747",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  downloadText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
  footerNote: {
    backgroundColor: "#fff8f5",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  noteText: {
    fontSize: 13,
    color: "#444",
    fontStyle: "italic",
  },
});
