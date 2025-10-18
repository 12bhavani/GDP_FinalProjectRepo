#!/usr/bin/env python3
"""
Script to fix the Chatbot.tsx file with proper template literals
"""

chatbot_content = '''import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Header from '../components/Header';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase/config';
import moment from 'moment';
import { GEMINI_CONFIG, MENTAL_HEALTH_PROMPT } from '../config/gemini.config';

const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.API_KEY);

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  buttons?: ButtonOption[];
  isTyping?: boolean;
};

type ButtonOption = {
  label: string;
  action: string;
  data?: any;
};

const emergencyContacts = [
  { label: 'University Police', phone: '660.562.1254' },
  { label: 'Mosaic Medical Center', phone: '660.562.2600' },
  { label: 'Crisis Lifeline', phone: '988' },
  { label: 'Emergencies', phone: '911' },
];

const faqDatabase = [
  {
    keywords: ['hours', 'open', 'timing', 'schedule', 'when open'],
    answer: '🕐 **Wellness Services Hours:**\\n\\nMonday-Friday: 8:00 AM - 5:00 PM\\nWeekends: Closed\\n\\nFor after-hours emergencies, please call 911 or visit Mosaic Medical Center Emergency Department.',
  },
  {
    keywords: ['location', 'address', 'where', 'find you', 'directions'],
    answer: '📍 **Location:**\\n\\nUniversity Wellness Services\\n800 University Drive\\nMaryville, MO 64468\\n\\nPhone: 660.562.1348',
  },
  {
    keywords: ['services', 'offer', 'provide', 'available', 'what do you'],
    answer: '🏥 **Our Services:**\\n\\n• Mental Health Counseling\\n• Medical Consultations\\n• Wellness Education\\n• Health Screenings\\n• Emergency Support\\n\\nWould you like to book an appointment?',
  },
  {
    keywords: ['insurance', 'cost', 'payment', 'billing', 'price', 'fee'],
    answer: '💳 **Billing & Insurance:**\\n\\nWe accept most insurance plans. For specific questions about billing, please contact our Billing Coordinator, Linda Guess at:\\n\\n📞 660.562.1348\\n✉️ lguess@nwmissouri.edu',
  },
  {
    keywords: ['cancel', 'reschedule', 'change appointment'],
    answer: '📅 **To Cancel or Reschedule:**\\n\\nPlease call us at 660.562.1348 or visit your Appointment History in the app to manage your bookings.',
  },
  {
    keywords: ['confidential', 'privacy', 'private', 'hipaa'],
    answer: '🔒 **Privacy & Confidentiality:**\\n\\nAll services are strictly confidential and HIPAA-compliant. Your health information is protected and will not be shared without your consent, except as required by law.',
  },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'menu' | 'gemini' | 'faq'>('menu');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    addBotMessage(
      "👋 Hello! I'm your Wellness Assistant. How can I help you today?",
      [
        { label: '📅 My Appointments', action: 'appointments' },
        { label: '🗓️ Book Appointment', action: 'book' },
        { label: '📞 Contact Info', action: 'contacts' },
        { label: '💬 Mental Health Advice (AI)', action: 'gemini' },
        { label: '❓ FAQs', action: 'faq' },
      ]
    );
  }, []);

  const addBotMessage = (text: string, buttons?: ButtonOption[]) => {
    const botMessage: Message = {
      id: String(Date.now()),
      sender: 'bot',
      text,
      buttons,
    };
    setMessages((prev) => [...prev, botMessage]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const addTypingIndicator = () => {
    const typingMessage: Message = {
      id: 'typing',
      sender: 'bot',
      text: '',
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const removeTypingIndicator = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'));
  };

  const askGemini = async (question: string) => {
    try {
      setLoading(true);
      addTypingIndicator();

      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
      const prompt = `${MENTAL_HEALTH_PROMPT}\\n\\nStudent question: ${question}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      removeTypingIndicator();
      addBotMessage(
        text,
        [
          { label: '💬 Ask Another Question', action: 'gemini' },
          { label: '🏠 Main Menu', action: 'menu' },
        ]
      );
    } catch (error) {
      removeTypingIndicator();
      addBotMessage(
        "I'm having trouble connecting right now. Please try again or contact our counseling services directly at 660.562.1348.",
        [{ label: '🏠 Main Menu', action: 'menu' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    const email = auth.currentUser?.email;
    if (!email) {
      addBotMessage(
        'Please log in to view your appointments.',
        [{ label: '🏠 Main Menu', action: 'menu' }]
      );
      return;
    }

    try {
      setLoading(true);
      addTypingIndicator();

      const snapshot = await getDocs(collection(db, 'slots'));
      const appointments: any[] = [];

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
              doctor: detailData.doctor || 'Not assigned',
            };
          });

        const results = await Promise.all(detailPromises);
        appointments.push(...results);
      }

      removeTypingIndicator();

      const now = moment();
      const upcoming = appointments.filter((app) =>
        moment(`${app.date} ${app.time}`, 'YYYY-MM-DD hh:mm A').isSameOrAfter(now)
      );

      if (upcoming.length === 0) {
        addBotMessage(
          "You don't have any upcoming appointments. Would you like to book one?",
          [
            { label: '🗓️ Book Appointment', action: 'book' },
            { label: '🏠 Main Menu', action: 'menu' },
          ]
        );
      } else {
        let appointmentText = `📅 **Your Upcoming Appointments:**\\n\\n`;
        upcoming.forEach((app, idx) => {
          appointmentText += `${idx + 1}. **${app.date}** at **${app.time}**\\n`;
          appointmentText += `   Doctor: ${app.doctor}\\n`;
          appointmentText += `   Status: ${app.status}\\n\\n`;
        });

        addBotMessage(appointmentText, [
          { label: '🗓️ Book Another', action: 'book' },
          { label: '🏠 Main Menu', action: 'menu' },
        ]);
      }
    } catch (error) {
      removeTypingIndicator();
      addBotMessage(
        'Sorry, I had trouble fetching your appointments. Please try again.',
        [{ label: '🏠 Main Menu', action: 'menu' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const showContacts = () => {
    let contactText = `📞 **Emergency Contacts:**\\n\\n`;
    emergencyContacts.forEach((contact) => {
      contactText += `• ${contact.label}: ${contact.phone}\\n`;
    });
    contactText += `\\n🏥 **Wellness Services:**\\n`;
    contactText += `Phone: 660.562.1348\\n`;
    contactText += `Location: 800 University Drive, Maryville, MO\\n\\n`;
    contactText += `For full staff directory, visit the Contact section in the app.`;

    addBotMessage(contactText, [
      { label: '📞 Call Wellness Services', action: 'call_wellness' },
      { label: '🚨 Call 911', action: 'call_911' },
      { label: '🏠 Main Menu', action: 'menu' },
    ]);
  };

  const handleFAQ = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    for (const faq of faqDatabase) {
      if (faq.keywords.some((keyword) => lowerQuery.includes(keyword))) {
        addBotMessage(faq.answer, [
          { label: '❓ Ask Another FAQ', action: 'faq' },
          { label: '🏠 Main Menu', action: 'menu' },
        ]);
        return;
      }
    }

    addBotMessage(
      "I don't have a specific answer for that. Would you like to:\\n\\n1. Try asking our AI assistant\\n2. Contact us directly at 660.562.1348\\n3. Visit nwmissouri.edu/wellness",
      [
        { label: '💬 Ask AI Assistant', action: 'gemini' },
        { label: '📞 Contact Info', action: 'contacts' },
        { label: '🏠 Main Menu', action: 'menu' },
      ]
    );
  };

  const handleButtonPress = (action: string) => {
    switch (action) {
      case 'menu':
        setMode('menu');
        addBotMessage(
          'How can I help you?',
          [
            { label: '📅 My Appointments', action: 'appointments' },
            { label: '🗓️ Book Appointment', action: 'book' },
            { label: '📞 Contact Info', action: 'contacts' },
            { label: '💬 Mental Health Advice (AI)', action: 'gemini' },
            { label: '❓ FAQs', action: 'faq' },
          ]
        );
        break;

      case 'appointments':
        addUserMessage('Show my appointments');
        fetchAppointments();
        break;

      case 'book':
        addUserMessage('Book an appointment');
        addBotMessage(
          '📅 To book an appointment, please use the **Calendar Schedule** feature in the app.\\n\\nYou can:\\n1. Select your preferred date\\n2. Choose an available time slot\\n3. Fill in your health information\\n\\nWould you like me to help with anything else?',
          [{ label: '🏠 Main Menu', action: 'menu' }]
        );
        break;

      case 'contacts':
        addUserMessage('Show contact information');
        showContacts();
        break;

      case 'gemini':
        setMode('gemini');
        addUserMessage('Talk to AI Assistant');
        addBotMessage(
          "💬 **AI Mental Health Assistant**\\n\\nI'm here to provide support and advice. Feel free to ask me about:\\n\\n• Stress management\\n• Anxiety or depression\\n• Coping strategies\\n• Self-care tips\\n• Study-life balance\\n\\n**Type your question below:**",
          [{ label: '🏠 Main Menu', action: 'menu' }]
        );
        break;

      case 'faq':
        setMode('faq');
        addUserMessage('View FAQs');
        addBotMessage(
          '❓ **Frequently Asked Questions**\\n\\nType your question, such as:\\n\\n• What are your hours?\\n• Where are you located?\\n• What services do you offer?\\n• Do you accept insurance?\\n• How do I cancel an appointment?\\n\\n**Or choose an option:**',
          [
            { label: '🕐 Hours & Location', action: 'faq_hours' },
            { label: '🏥 Services Offered', action: 'faq_services' },
            { label: '💳 Insurance & Billing', action: 'faq_insurance' },
            { label: '🏠 Main Menu', action: 'menu' },
          ]
        );
        break;

      case 'faq_hours':
        addUserMessage('Hours and location');
        handleFAQ('what are your hours');
        break;

      case 'faq_services':
        addUserMessage('Services offered');
        handleFAQ('what services do you offer');
        break;

      case 'faq_insurance':
        addUserMessage('Insurance and billing');
        handleFAQ('insurance and billing');
        break;

      case 'call_wellness':
        Linking.openURL('tel:6605621348');
        break;

      case 'call_911':
        Linking.openURL('tel:911');
        break;

      default:
        break;
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) {
      return;
    }

    const userInput = input.trim();
    addUserMessage(userInput);
    setInput('');

    if (mode === 'gemini') {
      askGemini(userInput);
    } else if (mode === 'faq') {
      handleFAQ(userInput);
    } else {
      handleFAQ(userInput);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isTyping) {
      return (
        <View style={[styles.msg, styles.bot, styles.typingContainer]}>
          <ActivityIndicator size="small" color="#006747" />
          <Text style={styles.typingText}>Typing...</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageWrapper}>
        <View style={[styles.msg, item.sender === 'user' ? styles.user : styles.bot]}>
          <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
            {item.text}
          </Text>
        </View>

        {item.buttons && item.buttons.length > 0 && (
          <View style={styles.buttonContainer}>
            {item.buttons.map((btn, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.optionButton}
                onPress={() => handleButtonPress(btn.action)}
              >
                <Text style={styles.optionButtonText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Wellness Chatbot" />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={
              mode === 'gemini'
                ? 'Ask about mental health...'
                : mode === 'faq'
                ? 'Type your question...'
                : 'Type a message...'
            }
            style={styles.input}
            editable={!loading}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  listContent: { padding: 16, paddingBottom: 20 },
  messageWrapper: { marginVertical: 6 },
  msg: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#006747',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#000',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    marginLeft: 8,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginLeft: 8,
  },
  optionButton: {
    backgroundColor: '#006747',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: '#006747',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    minWidth: 70,
    alignItems: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#999',
  },
  sendBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
'''

# Write the file
with open('/Users/chanakya/GDP_FinalProjectRepo/src/screens/Chatbot.tsx', 'w') as f:
    f.write(chatbot_content)

print("✅ Chatbot.tsx has been successfully created!")
