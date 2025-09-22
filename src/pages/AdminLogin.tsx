import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import '../Auth.css';

const AdminLogin: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const authContext = useContext(AuthContext);
  const { isAdmin, adminLogin } = useAdmin();
  const navigate = useNavigate();

  // Eğer kullanıcı giriş yapmamışsa normal login'e yönlendir
  React.useEffect(() => {
    if (!authContext?.user) {
      navigate('/login');
      return;
    }

    // Eğer kullanıcı admin değilse ana sayfaya yönlendir
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [authContext?.user, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = adminLogin(adminPassword);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Yanlış admin şifresi!');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  if (!authContext?.user || !isAdmin) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2>Erişim Reddedildi</h2>
          <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Admin Panel Girişi</h2>
          <p>Hoş geldin <strong>{authContext.user.name || authContext.user.email}</strong></p>
          <p>Admin paneline erişmek için admin şifresini girin:</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="adminPassword">Admin Şifresi</label>
            <input
              type="password"
              id="adminPassword"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Admin şifrenizi girin"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Admin Paneline Giriş Yap'}
          </button>
        </form>

        <div className="auth-footer">
          <button 
            onClick={() => navigate('/')}
            className="link-button"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
