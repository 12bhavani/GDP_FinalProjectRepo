import { LogBox } from 'react-native';
import 'web-streams-polyfill';

// Completely disable LogBox to suppress all warnings/errors in Expo Go
LogBox.ignoreAllLogs(true);

// Also suppress warnings BEFORE any other imports
LogBox.ignoreLogs([
  'React Native version mismatch',
  'AsyncStorage has been extracted',
  '@firebase/auth',
  'You are initializing Firebase Auth',
  'JavaScript version',
  'Native version',
]);

// Suppress console warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  const argsString = String(args);
  if (
    argsString.includes('Firebase Auth') ||
    argsString.includes('AsyncStorage') ||
    argsString.includes('version mismatch')
  ) {
    return;
  }
  originalWarn(...args);
};

// Suppress console.error for version mismatch and other non-critical errors
const originalError = console.error;
console.error = (...args) => {
  const argsString = String(args);
  if (
    argsString.includes('React Native version mismatch') ||
    argsString.includes('JavaScript version') ||
    argsString.includes('Native version') ||
    argsString.includes('checkVersions')
  ) {
    return;
  }
  originalError(...args);
};

import { registerRootComponent } from 'expo';
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
