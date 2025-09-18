import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout: React.FC = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) return <p>Sepet verisi alınamadı.</p>;

  const { cart } = cartContext;

  const validCart = cart.filter(
    (item) =>
      item.id &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      item.price >= 0 &&
      item.quantity > 0
  );

  const total = validCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderMessage = encodeURIComponent(
    `Merhaba, aşağıdaki ürünleri sipariş vermek istiyorum:\n\n` +
      validCart
        .map(
          (item) =>
            `• ${item.name} x${item.quantity} - ₺${(item.price * item.quantity).toFixed(2)}`
        )
        .join('\n') +
      `\n\nToplam: ₺${total.toFixed(2)}`
  );

  const whatsappUrl = `https://wa.me/905550581207?text=${orderMessage}`;

  return (
    <div className="checkout-page">
      <h2>Ödeme Sayfası</h2>
      {validCart.length === 0 ? (
        <p>Sepetiniz boş.</p>
      ) : (
        <>
          <ul className="checkout-list">
            {validCart.map((item) => (
              <li key={item.id} className="checkout-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="checkout-image"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/100x100?text=Görsel+Yok';
                  }}
                />
                <div>
                  <p>{item.name} x{item.quantity}</p>
                  <p>₺{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <p><strong>Toplam:</strong> ₺{total.toFixed(2)}</p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <button className="whatsapp-button">WhatsApp ile Sipariş Ver</button>
          </a>
        </>
      )}
    </div>
  );
};

export default Checkout;