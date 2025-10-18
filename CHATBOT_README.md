# 🤖 Enhanced Wellness Chatbot

pkill -f "expo start" || true && sleep 2 && npx expo start --tunnel --go --clear

use the above command to run expo go, honestly it works better this way


## Overview
The chatbot has been completely rebuilt with intelligent features:

### ✨ Key Features

1. **📅 Appointment Management**
   - View all upcoming appointments
   - Fetches real appointment data from Firebase
   - Shows doctor, date, time, and status

2. **🗓️ Booking Assistance**
   - Guides users to Calendar Schedule feature
   - Provides step-by-step instructions

3. **📞 Contact Information**
   - Emergency contacts with one-tap calling
   - Full wellness services contact details
   - Direct links to call 911 or wellness center

4. **💬 AI Mental Health Assistant (Gemini Integration)**
   - Powered by Google's Gemini AI
   - Specialized mental health support
   - Crisis detection and appropriate referrals
   - Empathetic, supportive responses

5. **❓ Enhanced FAQ System**
   - Keyword-based intelligent matching
   - Covers hours, location, services, insurance, privacy
   - Fallback to AI assistant for unknown questions

6. **🎯 Interactive Button Interface**
   - Guided conversation flows
   - Easy navigation with buttons
   - No confusing menu systems

### 🔧 Technical Implementation

**Technologies:**
- React Native
- Google Generative AI (Gemini Pro)
- Firebase Firestore
- TypeScript
- Moment.js for date handling

**Key Components:**
- Button-driven navigation
- Typing indicators for better UX
- Auto-scrolling chat
- Multi-line input support
- Loading states

### 📁 New Files Created

1. **`src/config/gemini.config.ts`** - Gemini API configuration
2. **`.env`** - Environment variables (API keys)
3. **Updated `src/screens/Chatbot.tsx`** - Complete rewrite

### 🔑 Setup Instructions

1. **Get Your Gemini API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create a new API key
   - Replace the key in `src/config/gemini.config.ts`

2. **Install Dependencies:**
   ```bash
   npm install @google/generative-ai moment
   ```

3. **Test the Chatbot:**
   - Run your app
   - Navigate to the Chatbot screen
   - Try different features:
     - Check appointments
     - Ask mental health questions
     - Search FAQs
     - Get contact info

### 🎨 User Experience

**Conversation Flow:**
```
Welcome Screen
  ├─> My Appointments → Shows user's bookings
  ├─> Book Appointment → Guides to calendar
  ├─> Contact Info → Shows all contacts + call buttons
  ├─> AI Assistant → Mental health support
  └─> FAQs → Quick answers
```

**AI Assistant Topics:**
- Stress management
- Anxiety and depression
- Coping strategies
- Self-care tips
- Study-life balance

### 🚨 Safety Features

- Crisis detection in AI responses
- Automatic referral to 988 or 911 for emergencies
- HIPAA compliance messaging
- Professional boundaries (no diagnosis/prescriptions)

### 📊 Data Sources

- **Appointments:** Firebase Firestore `/slots` collection
- **Contact Info:** Hardcoded from university wellness services
- **FAQs:** Local database with keyword matching
- **AI Responses:** Google Gemini Pro API

### 🔄 Future Enhancements

Possible additions:
- Voice input/output
- Multilingual support
- Appointment booking within chatbot
- Push notifications for responses
- Chat history persistence
- Image upload for health reports
- Integration with campus counseling scheduling system

### 🐛 Troubleshooting

**Issue:** Gemini API not responding
- **Solution:** Check API key in config file, ensure internet connection

**Issue:** Appointments not showing
- **Solution:** Verify user is logged in, check Firebase permissions

**Issue:** Buttons not working
- **Solution:** Check console for errors, ensure all action handlers are defined

### 📝 Code Structure

```typescript
ChatbotScreen
├── State Management
│   ├── messages (conversation history)
│   ├── input (user text input)
│   ├── loading (API call status)
│   └── mode (menu/gemini/faq)
│
├── Core Functions
│   ├── addBotMessage() - Adds bot response with buttons
│   ├── addUserMessage() - Adds user message
│   ├── addTypingIndicator() - Shows typing animation
│   └── removeTypingIndicator() - Removes typing animation
│
├── Feature Functions
│   ├── askGemini() - AI mental health support
│   ├── fetchAppointments() - Get user's bookings
│   ├── showContacts() - Display contact information
│   ├── handleFAQ() - FAQ keyword matching
│   └── handleButtonPress() - Button action routing
│
└── UI Components
    ├── FlatList (message display)
    ├── TextInput (user input)
    ├── Buttons (interactive options)
    └── KeyboardAvoidingView (mobile keyboard handling)
```

### 🌟 Benefits

1. **For Users:**
   - Quick access to appointments
   - 24/7 mental health guidance
   - Easy emergency contacts
   - No learning curve - button-driven

2. **For University:**
   - Reduced call volume to wellness center
   - After-hours student support
   - Better student engagement
   - Crisis intervention capability

### 📱 Screenshots Description

**Main Menu:**
- 5 colorful buttons with emojis
- Welcome message
- Clean, modern design

**Appointment View:**
- List of upcoming appointments
- Date, time, doctor, status
- Options to book more

**AI Chat:**
- Natural conversation
- Typing indicators
- Supportive, empathetic responses

**Contact Screen:**
- Emergency numbers with call buttons
- Wellness services info
- One-tap calling

---

## 🎯 Mission

To provide Northwest Missouri State University students with instant, intelligent, and empathetic support for their mental health and wellness needs, 24/7.

**We got this! 🚀**
