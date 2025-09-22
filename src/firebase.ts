import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase yapılandırması
const firebaseConfig = {
  apiKey: "AIzaSyC8U0pbtnEdQZ-cY19dSDQLztA-P1euqtc",
  authDomain: "drama-collection.firebaseapp.com",
  projectId: "drama-collection",
  storageBucket: "drama-collection.firebasestorage.app",
  messagingSenderId: "932255639619",
  appId: "1:932255639619:web:26e69c82aa4cb8232b4cf6",
  measurementId: "G-YMXYGXMJTD"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore'u export et
export const auth = getAuth(app);
export const db = getFirestore(app);