import React, { useState, useContext } from 'react';
import products from '../data/allProducts.json';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
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
};

const Home: React.FC<Props> = ({ onCartOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const cart = useContext(CartContext);
  const favorites = useContext(FavoritesContext);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
    if (cart?.addToCart) {
      cart.addToCart(product);
      onCartOpen();
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

        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Tüm ürünlerde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="product-list">
          {filtered.length > 0 ? (
            filtered.map((product: Product) => (
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

                <button
                  onClick={(e) => handleToggleFavorite(e, product)}
                  className="favorite-btn"
                >
                  {favorites?.isFavorite(product.id)
                    ? AiFillHeart({ color: '#e63946', size: 22 })
                    : AiOutlineHeart({ color: '#555', size: 22 })}
                </button>
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