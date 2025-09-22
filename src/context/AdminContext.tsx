import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Admin şifresi - gerçek projede environment variable'da tutulmalı
const ADMIN_PASSWORD = 'dramaadmin2024';

type AdminContextType = {
  isAdmin: boolean;
  isAdminLoggedIn: boolean;
  canAccessAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  loading: boolean;
};

export const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    // Sayfa yenilendiğinde admin girişini koru
    return localStorage.getItem('adminLoggedIn') === 'true';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firebase'den admin durumunu kontrol et
  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('🔍 Admin kontrolü başladı');
      console.log('📧 Kullanıcı e-postası:', authContext?.user?.email);
      
      if (!authContext?.user?.email) {
        console.log('❌ Kullanıcı e-postası yok');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('🔑 Admin dokümanı kontrol ediliyor...');
        // Firestore'da admin kullanıcıları kontrol et
        const adminDoc = await getDoc(doc(db, 'admins', authContext.user.email));
        console.log('📄 Admin dokümanı var mı:', adminDoc.exists());
        console.log('📋 Admin verisi:', adminDoc.data());
        
        const isAdminUser = adminDoc.exists() && adminDoc.data()?.isAdmin === true;
        console.log('✅ Admin durumu:', isAdminUser);
        setIsAdmin(isAdminUser);
        
        // Eğer admin değilse, admin girişini temizle
        if (!isAdminUser) {
          console.log('🧹 Admin girişi temizleniyor');
          setIsAdminLoggedIn(false);
          localStorage.removeItem('adminLoggedIn');
        }
      } catch (error) {
        console.error('❌ Admin durumu kontrol edilemedi:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
        console.log('🏁 Admin kontrolü tamamlandı');
      }
    };

    checkAdminStatus();
  }, [authContext?.user?.email]);
  
  // Admin paneline erişebilir mi? (hem admin email hem de admin şifresi gerekli)
  const canAccessAdmin = isAdmin && isAdminLoggedIn;

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
  };

  // Normal kullanıcı çıkış yaptığında admin girişini de temizle
  React.useEffect(() => {
    if (!authContext?.user) {
      adminLogout();
    }
  }, [authContext?.user]);

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isAdminLoggedIn,
      canAccessAdmin,
      adminLogin,
      adminLogout,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};

// Admin context hook'u
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
