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
    <SafeAreaView style={{ flex: 1 }}>
      {/* Header */}
      <CustomHeader title="Secure Messages" />

      {/* Main Content */}
      <View style={styles.container}>
        <Text style={styles.heading}>Who do you want to message?</Text>

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
    </SafeAreaView>
  );
};

export default SelectCommunicationOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
