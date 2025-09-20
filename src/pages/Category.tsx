import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Category.css';
import products from '../data/allProducts.json';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoriteButton from '../components/FavoriteButton';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

type Props = {
  onCartOpen: () => void;
  onShowToast: (message: string, type?: 'success' | 'error' | 'info', clickable?: boolean, onClick?: () => void) => void;
  sortBy?: string;
};

const categoryNames: Record<string, string> = {
  earrings: 'Küpe',
  necklaces: 'Kolye',
  bracelets: 'Bileklik',
  piercings: 'Piercing',
  'şahmeran': 'Şahmeran',
  'y-kolye': 'Y Kolye',
};

const Category: React.FC<Props> = ({ onCartOpen, onShowToast, sortBy = 'name' }) => {
  const { category } = useParams<{ category: string }>();
  const cartContext = useContext(CartContext);
  const favoritesContext = useContext(FavoritesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (!cartContext || !favoritesContext) {
    return <p>Bağlam verisi eksik</p>;
  }

  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    getQuantity,
  } = cartContext;

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = favoritesContext;

  const filtered = products.filter(
    (p) =>
      p.category.toLowerCase() === (category?.toLowerCase() || '') &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProducts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name, 'tr');
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const displayName = categoryNames[category?.toLowerCase() || ''] || category;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    
    // Mobilde clickable toast, desktop'ta normal toast
    if (window.innerWidth <= 768) {
      onShowToast(
        `${product.name} sepete eklendi! 🛍️`, 
        'success', 
        true, 
        onCartOpen
      );
    } else {
      onShowToast(`${product.name} sepete eklendi! 🛍️`, 'success');
      onCartOpen();
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    isFavorite(product.id)
      ? removeFromFavorites(product.id)
      : addToFavorites(product);
  };

  return (
    <div className="category-page">
      <h2>{displayName}</h2>

      <div className="search-wrapper-ultra">
        <div className="search-container-ultra">
          <div className="search-icon-ultra">
            <span className="search-icon-symbol">🔍</span>
            <div className="search-icon-glow"></div>
          </div>
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-ultra"
          />
          <div className="search-ripple"></div>
          <div className="search-shine"></div>
        </div>
      </div>

      <div className="product-list">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product: Product) => (
            <div
              key={product.id}
              className="product-card clickable"
              onClick={() =>
                navigate(`/category/${product.category}/${product.id}`)
              }
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://via.placeholder.com/200x200?text=Görsel+Yok';
                }}
              />
              <h3>{product.name}</h3>
              <p>{`₺${product.price}`}</p>

              {getQuantity(product.id) > 0 ? (
                <div className="quantity-controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      decreaseQuantity(product.id);
                    }}
                  >
                    –
                  </button>
                  <span>{getQuantity(product.id)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      increaseQuantity(product.id);
                    }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                >
                  Sepete Ekle
                </button>
              )}

              <FavoriteButton
                isFavorite={isFavorite(product.id)}
                onToggle={(e) => handleToggleFavorite(e, product)}
              />
            </div>
          ))
        ) : (
          <p>Bu kategoride ürün bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default Category;