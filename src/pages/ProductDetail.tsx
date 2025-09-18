import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import allProducts from '../data/allProducts.json';
import { Product } from '../types/Product';
import { CartContext } from '../context/CartContext';
import { FavoritesContext } from '../context/FavoritesContext';
import './ProductDetail.css';

const categoryNames: Record<string, string> = {
  earrings: 'Küpe',
  necklaces: 'Kolye',
  bracelets: 'Bileklik',
  piercings: 'Piercing'
};

interface ProductDetailProps {
  onCartOpen?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ onCartOpen }) => {
  const { id, category } = useParams<{ id: string; category: string }>();
  const cartContext = useContext(CartContext);
  const favoritesContext = useContext(FavoritesContext);

  if (!cartContext || !favoritesContext) {
    return <p>Bağlam verisi eksik</p>;
  }

  const { addToCart } = cartContext;
  const { addToFavorites } = favoritesContext;

  const product = allProducts.find(
    (item: Product) =>
      String(item.id) === id &&
      item.category.toLowerCase() === category?.toLowerCase()
  );

  if (!product || !category) {
    return <div>Ürün bulunamadı</div>;
  }

  const displayName = categoryNames[category.toLowerCase()] || category;

  const handleAddToCart = () => {
    addToCart(product);
    if (onCartOpen) onCartOpen(); // ✅ Sepet panelini aç
  };

  return (
    <div className="product-detail">
      {/* ✅ Breadcrumb navigasyonu */}
      <div className="breadcrumb">
        <Link to="/">Anasayfa</Link> &gt;{' '}
        <Link to={`/category/${category}`}>{displayName}</Link> &gt;{' '}
        <span>{product.name}</span>
      </div>

      <h1>{product.name}</h1>
      <img
        src={product.imageUrl}
        alt={product.name}
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Görsel+Yok';
        }}
      />
      <p className="description">{product.description}</p>
      <p className="price">{`Fiyat: ₺${product.price}`}</p>
      <button onClick={handleAddToCart}>Sepete Ekle</button>
      <button onClick={() => addToFavorites(product)}>Favorilere Ekle</button>
      <Link to={`/category/${category}`} className="back-link">
        ← {displayName} kategorisine geri dön
      </Link>
    </div>
  );
};

export default ProductDetail;