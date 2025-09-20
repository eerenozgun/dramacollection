import React from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  isFavorite, 
  onToggle, 
  className = '' 
}) => {
  return (
    <button
      onClick={onToggle}
      className={`favorite-button ${className}`}
      aria-label={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      <div className="favorite-icon">
        {isFavorite ? (
          AiFillHeart({ 
            className: "heart-icon filled", 
            size: window.innerWidth <= 768 ? 12 : 22 
          })
        ) : (
          AiOutlineHeart({ 
            className: "heart-icon outline", 
            size: window.innerWidth <= 768 ? 12 : 22 
          })
        )}
      </div>
    </button>
  );
};

export default FavoriteButton;
