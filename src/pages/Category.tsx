import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Category.css';
import products from '../data/allProducts.json';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // ❤️ Kalp ikonları

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

const categoryNames: Record<string, string> = {
  earrings: 'Küpe',
  necklaces: 'Kolye',
  bracelets: 'Bileklik',
  piercings: 'Piercing',
};

const Category: React.FC<Props> = ({ onCartOpen }) => {
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

  const displayName = categoryNames[category?.toLowerCase() || ''] || category;

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onCartOpen();
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

      <input
        type="text"
        placeholder="Ürün ara..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="product-list">
        {filtered.length > 0 ? (
          filtered.map((product: Product) => (
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

              <button
                onClick={(e) => handleToggleFavorite(e, product)}
                className="favorite-btn"
              >
                {isFavorite(product.id)
                  ? AiFillHeart({ color: '#e63946', size: 22 })
                  : AiOutlineHeart({ color: '#555', size: 22 })}
              </button>
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