import React, { useState, useContext } from 'react';
import products from '../data/allProducts.json';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import FavoriteButton from '../components/FavoriteButton';
import bgImage from '../assets/bg-soft.jpg';

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

const Home: React.FC<Props> = ({ onCartOpen, onShowToast, sortBy = 'name' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const cart = useContext(CartContext);
  const favorites = useContext(FavoritesContext);

  const filtered = products.filter((p) =>
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
      case 'category':
        return a.category.localeCompare(b.category, 'tr');
      default:
        return 0;
    }
  });

  const handleAddToCart = (product: Product) => {
    if (cart?.addToCart) {
      cart.addToCart(product);
      
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
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (!favorites) return;
    favorites.isFavorite(product.id)
      ? favorites.removeFromFavorites(product.id)
      : favorites.addToFavorites(product);
  };

  return (
    <div
      className="home-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="home-content">
        <h1>Drama Collection’a Hoş Geldiniz</h1>

        <div className="search-wrapper-ultra">
          <div className="search-container-ultra">
            <div className="search-icon-ultra">
              <span className="search-icon-symbol">🔍</span>
              <div className="search-icon-glow"></div>
            </div>
            <input
              type="text"
              placeholder="Tüm ürünlerde ara..."
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
              <div key={product.id} className="product-card clickable">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/200x200?text=Görsel+Yok';
                  }}
                  onClick={() =>
                    navigate(`/category/${product.category}/${product.id}`)
                  }
                />
                <h3>{product.name}</h3>
                <p>{`₺${product.price}`}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className="nav-link cart-button"
                >
                  Sepete Ekle
                </button>

                <FavoriteButton
                  isFavorite={favorites?.isFavorite(product.id) || false}
                  onToggle={(e) => handleToggleFavorite(e, product)}
                />
              </div>
            ))
          ) : (
            <p>Ürün bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;