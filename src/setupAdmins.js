// Admin e-postalarını kolayca eklemek için script
// Bu dosyayı çalıştırmak için: node src/setupAdmins.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase yapılandırması - kendi değerlerinizi yazın
const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin e-postalarını buraya yazın
const adminEmails = [
  'admin@dramacollection.com',  // Ana admin
  'owner@dramacollection.com',  // İkinci admin
  'your-email@gmail.com',       // Kendi e-postan
  // Daha fazla admin e-postası ekleyebilirsin
];

const setupAdmins = async () => {
  console.log('🚀 Admin e-postaları ekleniyor...');
  
  for (const email of adminEmails) {
    try {
      await setDoc(doc(db, 'admins', email), {
        email: email,
        isAdmin: true,
        role: email === 'admin@dramacollection.com' ? 'super_admin' : 'admin',
        createdAt: new Date(),
        permissions: ['all']
      });
      console.log(`✅ ${email} admin olarak eklendi`);
    } catch (error) {
      console.error(`❌ ${email} eklenirken hata:`, error);
    }
  }
  
  console.log('🎉 Tüm admin e-postaları başarıyla eklendi!');
  console.log('📧 Admin e-postaları:', adminEmails);
};

setupAdmins();
