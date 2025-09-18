import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) return <p>Sepet verisi alınamadı.</p>;

  const { cart, addToCart, removeFromCart } = cartContext;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>Sepetiniz</h2>
      {cart.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                {/* ✅ Sol blok: Ürün görseli */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100x100?text=No+Image';
                  }}
                />

                {/* ✅ Orta blok: Ürün bilgileri */}
                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>{`$${item.price} x ${item.quantity}`}</p>
                  <p>{`Ara toplam: $${(item.price * item.quantity).toFixed(2)}`}</p>
                  <div className="cart-buttons">
                    <button onClick={() => addToCart(item)}>Add One More</button>
                  </div>
                </div>

                {/* ✅ Sağ blok: Çöp kutusu sabit */}
                <div className="cart-delete">
                  <button onClick={() => removeFromCart(item.id)} className="delete-button">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 className="cart-total">Toplam: ${total.toFixed(2)}</h3>

          <Link to="/checkout">
            <button className="checkout-button">Ödeme Yap</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;