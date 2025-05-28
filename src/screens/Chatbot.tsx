// src/screens/Chatbot.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../components/Header';

const Chatbot = () => {
  return (
    <View style={styles.container}>
      <Header title="Chatbot Assistant" />
      <Text style={styles.text}>
        🤖 Hi there! I'm your virtual assistant. Ask me anything about the app, appointments, or help!
      </Text>
      {/* You can later integrate an actual chatbot UI here */}
    </View>
  );
};

export default Chatbot;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 20,
  },
});
