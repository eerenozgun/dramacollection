import React, { createContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

type AuthContextType = {
  user: { email: string; name?: string } | null;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const storedName = localStorage.getItem(`name:${firebaseUser.email}`);
          setUser({ email: firebaseUser.email!, name: storedName || undefined });
        } else {
          alert('Hesabınız doğrulanmamış. Lütfen e-posta adresinizi doğrulayın.');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      localStorage.setItem(`name:${email}`, name);
      alert('Doğrulama e-postası gönderildi. Lütfen e-postanı kontrol et.');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt başarısız oldu. Lütfen geçerli bir e-posta ve güçlü bir şifre girin.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.emailVerified) {
        const storedName = localStorage.getItem(`name:${email}`);
        setUser({ email: userCredential.user.email!, name: storedName || undefined });
      } else {
        alert('Lütfen e-posta adresinizi doğrulayın.');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş başarısız oldu. Lütfen e-posta ve şifrenizi kontrol edin.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      alert('Çıkış yapılamadı. Lütfen tekrar deneyin.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error);
      alert('Şifre sıfırlama başarısız oldu. Lütfen e-posta adresinizi kontrol edin.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};