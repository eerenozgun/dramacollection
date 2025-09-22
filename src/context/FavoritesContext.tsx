import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../types/Product';
import { AuthContext } from './AuthContext';

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

  const loadFavoritesFromLocalStorage = () => {
    if (!uid) return;
    try {
      const storedFavorites = localStorage.getItem(`favorites:${uid}`);
      if (storedFavorites) {
        const data = JSON.parse(storedFavorites);
        setFavorites(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Favori verisi yüklenemedi:', error);
    }
  };

  const saveFavoritesToLocalStorage = (favoritesData: Product[]) => {
    if (!uid) return;
    try {
      localStorage.setItem(`favorites:${uid}`, JSON.stringify(favoritesData));
    } catch (error) {
      console.error('Favori verisi kaydedilemedi:', error);
    }
  };

  useEffect(() => {
    loadFavoritesFromLocalStorage();
  }, [uid]);

  const addToFavorites = (product: Product) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      const updated = exists ? prev : [...prev, product];
      saveFavoritesToLocalStorage(updated);
      return updated;
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      saveFavoritesToLocalStorage(updated);
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