import React, { useEffect } from 'react';
import './Toast.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  onClick?: () => void;
  clickable?: boolean;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000,
  onClick,
  clickable = false
}) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  const handleToastClick = () => {
    if (clickable && onClick) {
      onClick();
      onClose();
    }
  };

  return (
    <div 
      className={`toast toast-${type} ${isVisible ? 'toast-visible' : ''} ${clickable ? 'toast-clickable' : ''}`}
      onClick={handleToastClick}
    >
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
        {clickable && (
          <span className="toast-hint">👆 Sepete git</span>
        )}
        <button className="toast-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
