import React, { createContext, useState, useEffect, useContext } from 'react';
import { Product } from '../types/Product';
import { AuthContext } from './AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

type CartItem = Product & { quantity: number; stock: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  getQuantity: (id: string) => number;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useContext(AuthContext);
  const [cart, setCart] = useState<CartItem[]>([]);

  const loadCartFromLocalStorage = (uid: string) => {
    try {
      const storedCart = localStorage.getItem(`cart:${uid}`);
      if (storedCart) {
        const data = JSON.parse(storedCart);
        const sanitizedCart = Array.isArray(data)
          ? data.filter(
              (item) =>
                item.id &&
                typeof item.price === 'number' &&
                typeof item.quantity === 'number' &&
                typeof item.stock === 'number' &&
                item.price >= 0 &&
                item.quantity > 0 &&
                item.stock >= item.quantity
            )
          : [];
        setCart(sanitizedCart);
      }
    } catch (error) {
      console.error('Sepet verisi yüklenemedi:', error);
    }
  };

  const saveCartToLocalStorage = (uid: string, cartData: CartItem[]) => {
    try {
      localStorage.setItem(`cart:${uid}`, JSON.stringify(cartData));
    } catch (error) {
      console.error('Sepet verisi kaydedilemedi:', error);
    }
  };

  useEffect(() => {
    if (auth?.user?.email) {
      const uid = auth.user.email;
      loadCartFromLocalStorage(uid);
    } else {
      setCart([]);
    }
  }, [auth?.user]);

  const addToCart = (product: Product) => {
    const stock = product.stock ?? 99;

    if (!product.id || product.price < 0 || stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const updatedCart = existing
        ? prevCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1 > stock ? stock : item.quantity + 1,
                }
              : item
          )
        : [...prevCart, { ...product, quantity: 1, stock }];

      if (auth?.user?.email) {
        saveCartToLocalStorage(auth.user.email, updatedCart);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : 0,
              }
            : item
        )
        .filter((item) => item.quantity > 0);

      if (auth?.user?.email) {
        saveCartToLocalStorage(auth.user.email, updatedCart);
      }

      return updatedCart;
    });
  };

  const increaseQuantity = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1 > item.stock ? item.stock : item.quantity + 1,
            }
          : item
      );
      if (auth?.user?.email) saveCartToLocalStorage(auth.user.email, updatedCart);
      return updatedCart;
    });
  };

  const decreaseQuantity = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity > 1 ? item.quantity - 1 : 0,
              }
            : item
        )
        .filter((item) => item.quantity > 0);
      if (auth?.user?.email) saveCartToLocalStorage(auth.user.email, updatedCart);
      return updatedCart;
    });
  };

  const getQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        setCart,
        increaseQuantity,
        decreaseQuantity,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};