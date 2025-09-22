import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';

const App: React.FC = () => {
  const [isCartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
    clickable?: boolean;
    onClick?: () => void;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
    clickable: false
  });

  const handleCartOpen = () => setCartOpen(true);
  const handleCartClose = () => setCartOpen(false);
  const handleSortChange = (newSortBy: string) => setSortBy(newSortBy);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', clickable?: boolean, onClick?: () => void) => {
    setToast({ message, type, isVisible: true, clickable: clickable || false, onClick });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <AuthProvider>
      <AdminProvider>
        <FavoritesProvider>
          <CartProvider>
            <Router>
            <ScrollToTop />
            <Header 
              onCartClick={handleCartOpen}
              onSortChange={handleSortChange}
              currentSort={sortBy}
            />
            <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={toast.isVisible}
              onClose={hideToast}
              clickable={toast.clickable}
              onClick={toast.onClick}
            />
            <Routes>
              <Route path="/" element={<Home onCartOpen={handleCartOpen} onShowToast={showToast} sortBy={sortBy} />} />
              <Route path="/home" element={<Home onCartOpen={handleCartOpen} onShowToast={showToast} sortBy={sortBy} />} />
              <Route path="/category" element={<CategoryList />} />
              <Route path="/category/:category" element={<Category onCartOpen={handleCartOpen} onShowToast={showToast} sortBy={sortBy} />} />
              <Route path="/category/:category/:id" element={<ProductDetail onCartOpen={handleCartOpen} onShowToast={showToast} />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            </Router>
          </CartProvider>
        </FavoritesProvider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default App;
