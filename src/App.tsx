import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';

import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Header onCartClick={handleCartOpen} />
            <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
            <Routes>
              {/* ✅ Sepete ekleme sonrası panel açılması için prop geçildi */}
              <Route path="/" element={<Home onCartOpen={handleCartOpen} />} />
              <Route path="/home" element={<Home onCartOpen={handleCartOpen} />} />
              <Route path="/category" element={<CategoryList />} />
              <Route
                path="/category/:category"
                element={<Category onCartOpen={handleCartOpen} />} // ✅ Eklendi
              />
              <Route
                path="/category/:category/:id"
                element={<ProductDetail onCartOpen={handleCartOpen} />}
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;