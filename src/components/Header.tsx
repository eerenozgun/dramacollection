import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

type Props = {
  onCartClick: () => void;
  onSortChange?: (sortBy: string) => void;
  currentSort?: string;
};

const Header: React.FC<Props> = ({ onCartClick, onSortChange, currentSort = 'name' }) => {
  const auth = useContext(AuthContext);
  const cart = useContext(CartContext);
  const { isAdmin, canAccessAdmin } = useAdmin();
  const location = useLocation();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const fullName = auth?.user?.name || auth?.user?.email;
  
  // Sırala butonunu sadece belirli sayfalarda göster
  const shouldShowSort = onSortChange && !location.pathname.includes('/favorites');

  const shortenName = (name?: string): string => {
    if (!name) return 'Kullanıcı';
    const firstWord = name.split(' ')[0];
    return firstWord.length > 8 ? firstWord.slice(0, 6) + '...' : firstWord;
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleMobileCartClick = () => {
    onCartClick();
    setMobileMenuOpen(false);
  };



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="site-header">
      <div className="nav-bar">
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="Drama Collection" className="site-logo" />
          </Link>
        </div>

        <div className="nav-right">
          <nav className="nav-links">
            <Link to="/" className="nav-link-ultra">
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Anasayfa</span>
              <div className="nav-glow"></div>
            </Link>
            <Link to="/category" className="nav-link-ultra">
              <span className="nav-icon">📂</span>
              <span className="nav-text">Kategoriler</span>
              <div className="nav-glow"></div>
            </Link>
            
            {/* Mini Sort Button */}
            {shouldShowSort && (
              <div className="mini-sort-wrapper" ref={sortRef}>
                <div className="sort-container">
                  <div className="sort-clickable" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                    <span className="sort-text">Sırala</span>
                    <span className="sort-arrow">▼</span>
                  </div>
                  {showSortDropdown && (
                    <div className="sort-dropdown">
                      <div className="sort-option" onClick={() => { onSortChange('name'); setShowSortDropdown(false); }}>
                        A-Z
                      </div>
                      <div className="sort-option" onClick={() => { onSortChange('price-low'); setShowSortDropdown(false); }}>
                        Fiyat ↑
                      </div>
                      <div className="sort-option" onClick={() => { onSortChange('price-high'); setShowSortDropdown(false); }}>
                        Fiyat ↓
                      </div>
                      <div className="sort-option" onClick={() => { onSortChange('category'); setShowSortDropdown(false); }}>
                        Kategori
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            
            <button onClick={onCartClick} className="cart-button-ultra">
              <div className="cart-icon-container">
                <span className="cart-icon-ultra">🛍️</span>
                <div className="cart-ripple"></div>
              </div>
              <span className="cart-text-ultra">Sepetim</span>
              <div className="cart-shine"></div>
            </button>
            
            <Link to="/favorites" className="nav-link-ultra">
              <span className="nav-icon">❤️</span>
              <span className="nav-text">Favorilerim</span>
              <div className="nav-glow"></div>
            </Link>

            {/* Admin Link - Sadece admin kullanıcılar için görünür */}
            {isAdmin && (
              <Link to={canAccessAdmin ? "/admin/dashboard" : "/admin/login"} className="nav-link-ultra admin-link">
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Admin</span>
                <div className="nav-glow"></div>
              </Link>
            )}

            {auth?.user ? (
              <>
                <div className="nav-user-ultra" title={`Hoşgeldin, ${fullName}`}>
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">Hoşgeldin, {shortenName(fullName)}</span>
                  <div className="nav-glow"></div>
                </div>
                <button onClick={auth.logout} className="nav-link-ultra">
                  <span className="nav-icon">🚪</span>
                  <span className="nav-text">Çıkış Yap</span>
                  <div className="nav-glow"></div>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link-ultra">
                  <span className="nav-icon">🔑</span>
                  <span className="nav-text">Giriş Yap</span>
                  <div className="nav-glow"></div>
                </Link>
                <Link to="/register" className="nav-link-ultra">
                  <span className="nav-icon">📝</span>
                  <span className="nav-text">Üye Ol</span>
                  <div className="nav-glow"></div>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Sort Button - Always Visible */}
          {shouldShowSort && (
            <div className="mobile-sort-visible" ref={sortRef}>
              <div className="mobile-sort-clickable" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                <span className="mobile-sort-text">Sırala</span>
                <span className="mobile-sort-arrow">▼</span>
              </div>
              {showSortDropdown && (
                <div className="mobile-sort-dropdown">
                  <div className="mobile-sort-option" onClick={() => { onSortChange('name'); setShowSortDropdown(false); }}>
                    A-Z
                  </div>
                  <div className="mobile-sort-option" onClick={() => { onSortChange('price-low'); setShowSortDropdown(false); }}>
                    Fiyat ↑
                  </div>
                  <div className="mobile-sort-option" onClick={() => { onSortChange('price-high'); setShowSortDropdown(false); }}>
                    Fiyat ↓
                  </div>
                  <div className="mobile-sort-option" onClick={() => { onSortChange('category'); setShowSortDropdown(false); }}>
                    Kategori
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn" 
            onClick={handleMobileMenuToggle}
            aria-label="Menüyü aç"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu open" onClick={handleMobileMenuClose}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img src="/logo.jpg" alt="Drama Collection" className="site-logo" style={{ height: '28px' }} />
              <button className="mobile-menu-close" onClick={handleMobileMenuClose}>
                ✕
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link to="/" className="mobile-nav-link-ultra" onClick={handleMobileMenuClose}>
                <span className="mobile-nav-icon">🏠</span>
                <span className="mobile-nav-text">Anasayfa</span>
                <div className="mobile-nav-glow"></div>
              </Link>
              <Link to="/category" className="mobile-nav-link-ultra" onClick={handleMobileMenuClose}>
                <span className="mobile-nav-icon">📂</span>
                <span className="mobile-nav-text">Kategoriler</span>
                <div className="mobile-nav-glow"></div>
              </Link>
              
              <Link to="/favorites" className="mobile-nav-link-ultra" onClick={handleMobileMenuClose}>
                <span className="mobile-nav-icon">❤️</span>
                <span className="mobile-nav-text">Favorilerim</span>
                <div className="mobile-nav-glow"></div>
              </Link>

              {/* Admin Link - Mobil menü için */}
              {isAdmin && (
                <Link to={canAccessAdmin ? "/admin/dashboard" : "/admin/login"} className="mobile-nav-link-ultra admin-link" onClick={handleMobileMenuClose}>
                  <span className="mobile-nav-icon">⚙️</span>
                  <span className="mobile-nav-text">Admin Panel</span>
                  <div className="mobile-nav-glow"></div>
                </Link>
              )}
              
              <button onClick={handleMobileCartClick} className="mobile-cart-button-ultra">
                <div className="mobile-cart-icon-container">
                  <span className="mobile-cart-icon-ultra">🛍️</span>
                  <div className="mobile-cart-ripple"></div>
                </div>
                <span className="mobile-cart-text-ultra">Sepetim</span>
                <div className="mobile-cart-shine"></div>
              </button>
              
              

              {auth?.user ? (
                <div className="mobile-user-info-ultra">
                  <div className="mobile-user-name-ultra">
                    <span className="mobile-nav-icon">👤</span>
                    <span className="mobile-nav-text">Hoşgeldin, {shortenName(fullName)}</span>
                    <div className="mobile-nav-glow"></div>
                  </div>
                  <button onClick={auth.logout} className="mobile-nav-link-ultra">
                    <span className="mobile-nav-icon">🚪</span>
                    <span className="mobile-nav-text">Çıkış Yap</span>
                    <div className="mobile-nav-glow"></div>
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link-ultra" onClick={handleMobileMenuClose}>
                    <span className="mobile-nav-icon">🔑</span>
                    <span className="mobile-nav-text">Giriş Yap</span>
                    <div className="mobile-nav-glow"></div>
                  </Link>
                  <Link to="/register" className="mobile-nav-link-ultra" onClick={handleMobileMenuClose}>
                    <span className="mobile-nav-icon">📝</span>
                    <span className="mobile-nav-text">Üye Ol</span>
                    <div className="mobile-nav-glow"></div>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;