import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../Auth.css';

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!auth) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert('Lütfen e-posta ve şifre alanlarını doldurun.');
      return;
    }

    setLoading(true);
    try {
      await auth.login(email.trim(), password);
      navigate('/home');
    } catch (error) {
      console.error('Giriş hatası:', error);
      alert('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
      <form className="auth-card" onSubmit={handleLogin}>
        <h2>Giriş Yap</h2>
        <input
          placeholder="E-posta"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Şifre"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <Link to="/forgot-password" style={{ color: '#4da6ff', textDecoration: 'underline' }}>
            Şifremi unuttum
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;