# 📱 Preview Your metaHub App in Codespaces

## ✅ Current Status
Your Expo dev server is **RUNNING** with tunnel mode enabled!

---

## 🚀 How to Preview on Your Devices

### **For Android Devices:**

1. **Install Expo Go**
   - Open Google Play Store
   - Search for "Expo Go"
   - Install: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan QR Code**
   - Open the Expo Go app
   - Tap "Scan QR code"
   - Point your camera at the QR code in the terminal
   - Your app will load automatically!

### **For iOS Devices (iPhone/iPad):**

1. **Install Expo Go**
   - Open App Store
   - Search for "Expo Go"
   - Install: https://apps.apple.com/app/expo-go/id982107779

2. **Scan QR Code**
   - Open the native **Camera** app (NOT Expo Go)
   - Point your camera at the QR code in the terminal
   - A notification will appear at the top
   - Tap the notification to open in Expo Go
   - Your app will load!

---

## 📍 Connection URL
```
exp://kqit-4s-anonymous-8081.exp.direct
```

You can also manually enter this URL in Expo Go:
- Open Expo Go app
- Tap "Enter URL manually"
- Paste the URL above
- Tap "Connect"

---

## 🔄 Development Features

### Live Reload
Any changes you make to the code will automatically reload on your device!

### Developer Menu
Shake your device (or press Cmd+D on iOS simulator, Cmd+M on Android) to open:
- Reload
- Debug Remote JS
- Toggle Performance Monitor
- And more...

### Keyboard Shortcuts in Terminal
While the Expo server is running:
- **`r`** - Reload the app on all connected devices
- **`m`** - Toggle menu on all connected devices  
- **`j`** - Open Chrome debugger
- **`shift+m`** - More developer tools
- **`?`** - Show all commands

---

## 🔧 Troubleshooting

### **Can't scan QR code?**
1. Make sure your phone and computer are on networks that can reach each other
2. Try entering the URL manually in Expo Go
3. Check that the tunnel is connected (you should see "Tunnel ready" in terminal)

### **App not loading?**
1. Check your internet connection (tunnel requires internet)
2. Make sure you're using the latest version of Expo Go
3. Try restarting the Expo server:
   - Press Ctrl+C in terminal
   - Run: `npx expo start --tunnel --go`

### **Seeing errors on the device?**
1. Check the terminal for error messages
2. The app logs will show in the terminal
3. Shake the device and select "Reload" from the developer menu

### **Firebase/Authentication issues?**
Make sure:
- `google-services.json` is properly configured for Android
- `GoogleService-Info.plist` is properly configured for iOS
- Firebase project has the correct app IDs registered

---

## 📱 Testing Both Platforms

You can test on **multiple devices simultaneously**:
- Scan the QR code on your Android phone
- Scan the QR code on your iPhone
- Both will connect to the same dev server
- Changes will reload on both devices at once!

---

## 🎯 What You Can Test

✅ **User Authentication**
- Login/Signup flows
- Firebase authentication
- Profile management

✅ **Navigation**
- All screens and navigation flows
- Bottom tabs
- Stack navigation

✅ **Features**
- Calendar scheduling
- Appointment booking
- Chatbot functionality
- Contact forms
- Admin dashboard (if you have admin access)

✅ **UI/UX**
- Layout on different screen sizes
- Touch interactions
- Animations
- Loading states

---

## 💡 Pro Tips

1. **Keep Terminal Visible**: Watch the logs to see what's happening
2. **Test on Real Devices**: Simulators don't always match real device behavior
3. **Test Both Platforms**: iOS and Android can behave differently
4. **Use Reload**: Press `r` in terminal to reload all connected devices
5. **Debug Remotely**: Press `j` to open Chrome DevTools for debugging

---

## 🛑 Stopping the Server

When you're done testing:
- Press **Ctrl+C** in the terminal to stop the Expo server

---

## 📊 Current Configuration

- **App Name**: metaHub
- **Package ID (Android)**: com.metahub
- **Bundle ID (iOS)**: com.metahub
- **Expo Go Mode**: ✅ Active
- **Tunnel**: ✅ Connected
- **Platforms**: Android & iOS

---

## 🎉 You're All Set!

Open Expo Go on your device and scan the QR code to start testing your app!
