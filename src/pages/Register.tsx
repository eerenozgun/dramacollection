import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../Auth.css';

const Register: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!auth) return null;

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = userName.trim();

    if (!trimmedName || !trimmedEmail || !password) {
      alert('Lütfen tüm alanları eksiksiz doldurun.');
      return;
    }

    if (password.length < 6) {
      alert('Şifreniz en az 6 karakter olmalı.');
      return;
    }

    setLoading(true);
    try {
      await auth.register(trimmedEmail, password, trimmedName);
      navigate('/home');
    } catch (error) {
      console.error('Kayıt hatası:', error);
      alert('Kayıt başarısız. Lütfen geçerli bir e-posta ve güçlü bir şifre girin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '0 1rem',
      }}
    >
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Drama Collection Ailesi'ne Katıl</h2>
        <input
          placeholder="Adınız"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          placeholder="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Şifre Belirleyin"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>

        <p className="email-warning">
          📩 Lütfen “Spam ve Gereksiz” e-posta kutunuzu da kontrol edin. Doğrulama kodu bazen “Gereksiz” veya “Spam” klasörüne düşebiliyor.
        </p>
      </form>
    </div>
  );
};

export default Register;