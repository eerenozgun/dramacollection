import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../types/Product';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type FavoritesContextType = {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const uid = auth?.user?.email;

  const loadFavoritesFromFirestore = async () => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      const data = snapshot.exists() ? snapshot.data().favorites || [] : [];
      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Favori verisi yüklenemedi:', error);
    }
  };

  const saveFavoritesToFirestore = async (favoritesData: Product[]) => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, { favorites: favoritesData }, { merge: true });
    } catch (error) {
      console.error('Favori verisi kaydedilemedi:', error);
    }
  };

  useEffect(() => {
    loadFavoritesFromFirestore();
  }, [uid]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const updated = exists ? prev : [...prev, product];
      saveFavoritesToFirestore(updated);
      return updated;
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveFavoritesToFirestore(updated);
      return updated;
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};