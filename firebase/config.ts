// firebase/config.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getReactNativePersistence } from '../node_modules/firebase/node_modules/@firebase/auth/dist/rn/index.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCkfXjwzLlsBzqvRv2TbKdiL8qIRJqrJGs',
  authDomain: 'metahub-25cd4.firebaseapp.com',
  projectId: 'metahub-25cd4',
  storageBucket: 'metahub-25cd4.appspot.com',
  messagingSenderId: '191257001803',
  appId: '1:191257001803:android:72e9daf55dd076aa21f2ce',
};

const hasApp = getApps().length > 0;
const app = hasApp ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = hasApp
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
export const storage = getStorage(app);
