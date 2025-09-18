import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../Auth.css';

const ForgotPassword: React.FC = () => {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState('');

  if (!auth) return null;

  const handleReset = async () => {
    await auth.resetPassword(email);
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
      <div className="auth-card">
        <h2>Şifre Sıfırla</h2>
        <input
          placeholder="E-posta adresiniz"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleReset}>Sıfırlama Bağlantısı Gönder</button>
      </div>
    </div>
  );
};

export default ForgotPassword;