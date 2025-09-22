import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırması
// Gerçek projede environment variables kullanın
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "drama-collection-demo.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "drama-collection-demo",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "drama-collection-demo.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore'u export et
export const auth = getAuth(app);
export const db = getFirestore(app);