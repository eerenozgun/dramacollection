import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartDrawer.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CartDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const cartContext = useContext(CartContext);
  if (!cartContext) return null;

  const { cart, addToCart, removeFromCart, setCart } = cartContext;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeEntireItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Sepetiniz</h2>
        <button className="close-button" onClick={onClose}>✖</button>
      </div>

      {cart.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-image"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100x100?text=Görsel+Yok';
                  }}
                />
                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>{`₺${item.price} x ${item.quantity}`}</p>
                  <p>{`Ara toplam: ₺${(item.price * item.quantity).toFixed(2)}`}</p>
                  <div className="cart-buttons">
                    <button onClick={() => removeFromCart(item.id)}>−</button>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>
                </div>
                <button
                  className="remove-icon"
                  onClick={() => removeEntireItem(item.id)}
                  title="Tümünü Sil"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <h3 className="cart-total">Toplam: ₺{total.toFixed(2)}</h3>

          <Link to="/checkout">
            <button className="checkout-button">Ödeme Yap</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartDrawer;