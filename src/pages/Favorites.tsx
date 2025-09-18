import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types/Product';
import { AiFillHeart } from 'react-icons/ai';
import './Favorites.css';

const Favorites: React.FC = () => {
  const favoritesContext = useContext(FavoritesContext);
  const navigate = useNavigate();

  if (!favoritesContext) return <p>Favori verisi alınamadı.</p>;

  const { favorites, removeFromFavorites } = favoritesContext;

  return (
    <div className="favorites-page">
      <h2>Favorilerim</h2>
      {favorites.length === 0 ? (
        <p>Henüz favori ürününüz yok.</p>
      ) : (
        <div className="product-list">
          {favorites.map((product: Product) => (
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

              <Link to={`/category/${product.category}/${product.id}`}>
                Detayları Gör
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(product.id);
                }}
                className="favorite-btn"
                title="Favorilerden çıkar"
              >
                {AiFillHeart({ color: '#e63946', size: 22 })}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;