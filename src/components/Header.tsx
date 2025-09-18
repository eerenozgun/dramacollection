import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../context/AuthContext';

type Props = {
  onCartClick: () => void;
};

const Header: React.FC<Props> = ({ onCartClick }) => {
  const auth = useContext(AuthContext);
  const fullName = auth?.user?.name || auth?.user?.email;

  // ✅ Akıllı kısaltma: sadece ilk kelime, 8 harften uzunsa kes
  const shortenName = (name?: string): string => {
    if (!name) return 'Kullanıcı';
    const firstWord = name.split(' ')[0];
    return firstWord.length > 8 ? firstWord.slice(0, 6) + '...' : firstWord;
  };

  return (
    <header className="site-header">
      <div className="nav-bar">
        {/* ✅ Sol blok: Logo */}
        <div className="nav-left">
          <Link to="/" className="logo-link">
            <img src="/logo.jpg" alt="Drama Collection" className="site-logo" />
          </Link>
        </div>

        {/* ✅ Sağ blok: Menü linkleri */}
        <div className="nav-right">
          <nav className="nav-links">
            <Link to="/" className="nav-link">Anasayfa</Link>
            <Link to="/category" className="nav-link">Kategoriler</Link>
            <button onClick={onCartClick} className="nav-link cart-button">Sepetim</button>
            <Link to="/favorites" className="nav-link">Favorilerim</Link>

            {auth?.user ? (
              <>
                {/* ✅ Kısaltılmış isim + tooltip */}
                <span
                  className="nav-user"
                  title={`Hoşgeldin, ${fullName}`}
                >
                  Hoşgeldin, {shortenName(fullName)}
                </span>
                <button onClick={auth.logout} className="nav-link">Çıkış Yap</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Giriş Yap</Link>
                <Link to="/register" className="nav-link">Üye Ol</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;