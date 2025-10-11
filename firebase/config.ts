// firebase/config.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCkfXjwzLlsBzqvRv2TbKdiL8qIRJqrJGs',
  authDomain: 'metahub-25cd4.firebaseapp.com',
  projectId: 'metahub-25cd4',
  storageBucket: 'metahub-25cd4.appspot.com',
  messagingSenderId: '191257001803',
  appId: '1:191257001803:android:72e9daf55dd076aa21f2ce',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);

// Initialize Auth - AsyncStorage will be used automatically by Firebase in React Native
export const auth = getAuth(app);
