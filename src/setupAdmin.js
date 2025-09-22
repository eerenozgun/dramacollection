// Admin kullanıcılarını Firebase'e eklemek için script
// Bu dosyayı çalıştırmak için: node src/setupAdmin.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase yapılandırması (gerçek değerlerinizi buraya yazın)
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Admin kullanıcılarını ekle
const setupAdminUsers = async () => {
  const adminUsers = [
    {
      email: 'admin@dramacollection.com',
      isAdmin: true,
      role: 'super_admin',
      createdAt: new Date(),
      permissions: ['all']
    },
    {
      email: 'owner@dramacollection.com', 
      isAdmin: true,
      role: 'owner',
      createdAt: new Date(),
      permissions: ['all']
    }
  ];

  try {
    for (const adminUser of adminUsers) {
      await setDoc(doc(db, 'admins', adminUser.email), adminUser);
      console.log(`✅ Admin kullanıcı eklendi: ${adminUser.email}`);
    }
    console.log('🎉 Tüm admin kullanıcıları başarıyla eklendi!');
  } catch (error) {
    console.error('❌ Admin kullanıcıları eklenirken hata:', error);
  }
};

// Script'i çalıştır
setupAdminUsers();
