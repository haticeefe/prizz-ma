import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA-aYsXr0JsI8F0JmgQZNDIk3Fka5avVaY",
  authDomain: "prizz-ma.firebaseapp.com",
  projectId: "prizz-ma",
  storageBucket: "prizz-ma.firebasestorage.app",
  messagingSenderId: "566988635712",
  appId: "1:566988635712:web:2e2fb365c59cbd76b6e9a5"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);