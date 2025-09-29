import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '../components/Header';

// 👇 Your Q&A pairs
const qaPairs: Record<string, string> = {
  "Hi": "Hello, How can i assist you now",
  "what are your hours": "We are open Monday–Friday, 8am–5pm.",
  "how to book appointment": "You can schedule through the Calendar option in the app.",
  "emergency": "Please call 911 or the emergency numbers in the Contact section.",
};

type Message = { id: string; sender: 'user' | 'bot'; text: string };

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const inText = input.trim();
    const userMessage: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: inText,
    };

    const lower = inText.toLowerCase();
    const matchKey = Object.keys(qaPairs).find(q => lower.includes(q));
    const botText = matchKey ? qaPairs[matchKey] : "Sorry, I don't know the answer to that.";
    const botMessage: Message = {
      id: String(Date.now() + 1),
      sender: 'bot',
      text: botText,
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <Header title="Chatbot" />

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.msg, item.sender === 'user' ? styles.user : styles.bot]}>
            <Text style={{ color: item.sender === 'user' ? '#fff' : '#000' }}>
              {item.text}
            </Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask something..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  msg: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
  user: { alignSelf: 'flex-end', backgroundColor: '#006747' },
  bot: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#006747',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
});
