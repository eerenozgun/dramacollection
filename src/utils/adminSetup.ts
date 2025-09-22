// Admin kullanıcılarını Firestore'a eklemek için yardımcı fonksiyonlar
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Admin kullanıcılarını Firestore'a ekle
export const setupAdminUsers = async () => {
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
      console.log(`Admin kullanıcı eklendi: ${adminUser.email}`);
    }
    console.log('Tüm admin kullanıcıları başarıyla eklendi!');
  } catch (error) {
    console.error('Admin kullanıcıları eklenirken hata:', error);
  }
};

// Yeni admin kullanıcı ekle
export const addAdminUser = async (email: string, role: string = 'admin') => {
  try {
    const adminUser = {
      email,
      isAdmin: true,
      role,
      createdAt: new Date(),
      permissions: role === 'super_admin' ? ['all'] : ['products', 'orders']
    };

    await setDoc(doc(db, 'admins', email), adminUser);
    console.log(`Yeni admin kullanıcı eklendi: ${email}`);
    return true;
  } catch (error) {
    console.error('Admin kullanıcı eklenirken hata:', error);
    return false;
  }
};

// Admin kullanıcıyı kaldır
export const removeAdminUser = async (email: string) => {
  try {
    await setDoc(doc(db, 'admins', email), { isAdmin: false });
    console.log(`Admin kullanıcı kaldırıldı: ${email}`);
    return true;
  } catch (error) {
    console.error('Admin kullanıcı kaldırılırken hata:', error);
    return false;
  }
};
