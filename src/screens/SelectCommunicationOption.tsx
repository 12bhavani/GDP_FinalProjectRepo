// src/screens/SelectCommunicationOption.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/Header';

const SelectCommunicationOption: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.screen}>
      <CustomHeader title="Secure Messages" />

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Who do you want to message?</Text>
          <Text style={styles.subheading}>Choose a recipient to continue composing your message.</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate("ComposeMessage", { recipient: "NURSE" })
            }
          >
            <Text style={styles.optionText}>Message Nurse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() =>
              navigation.navigate("ComposeMessage", { recipient: "COUNSELOR" })
            }
          >
            <Text style={styles.optionText}>Message Counselor</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectCommunicationOption;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
    color: '#0F172A',
  },
  subheading: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 18,
  },
  option: {
    backgroundColor: "#006747",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  optionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
