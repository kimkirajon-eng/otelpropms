import React, { useState } from 'react';

const POS = () => {
  const [cart, setCart] = useState([]);
  const menuItems = [
    { id: 1, name: 'Mercimek Çorbası', price: 120, category: 'Çorbalar', icon: '🥣' },
    { id: 2, name: 'Adana Kebap', price: 450, category: 'Ana Yemek', icon: '🍖' },
    { id: 3, name: 'Gavurdağı Salata', price: 180, category: 'Salatalar', icon: '🥗' },
    { id: 4, name: 'Künefe', price: 220, category: 'Tatlılar', icon: '🍮' },
    { id: 5, name: 'Ayran', price: 40, category: 'İçecekler', icon: '🥛' },
    { id: 6, name: 'Türk Kahvesi', price: 80, category: 'İçecekler', icon: '☕' },
  ];

  const addToCart = (item) => {
    setCart([...cart, { ...item, cartId: Date.now() }]);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="pos-container">
      <div className="pos-main">
        <div className="pos-header">
          <h2>Restaurant Menü</h2>
          <div className="category-filter">
            <span className="active">Hepsi</span>
            <span>Yemekler</span>
            <span>İçecekler</span>
          </div>
        </div>

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item.id} className="menu-card" onClick={() => addToCart(item)}>
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p>₺{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="pos-sidebar">
        <div className="cart-header">
          <h3>Adisyon #4502</h3>
          <button onClick={() => setCart([])} className="clear-btn">Temizle</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart text-center py-10 opacity-40">Sepetiniz Boş</div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item">
                <span>{item.name}</span>
                <strong>₺{item.price}</strong>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="total-row">
            <span>Toplam</span>
            <span className="total-price">₺{total}</span>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0}>Odaya Aktar</button>
          <button className="cash-btn" disabled={cart.length === 0}>Nakit / K. Kartı</button>
        </div>
      </aside>

      <style>{`
        .pos-container { display: flex; gap: 30px; height: 75vh; }
        .pos-main { flex: 1; overflow-y: auto; padding-right: 10px; }
        .pos-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .pos-header h2 { font-weight: 900; font-size: 2rem; color: #1a1f36; }
        
        .category-filter { display: flex; gap: 10px; }
        .category-filter span { background: white; padding: 8px 15px; border-radius: 12px; font-size: 0.8rem; font-weight: 800; color: #a0aec0; cursor: pointer; transition: 0.3s; }
        .category-filter span.active { background: #1a1f36; color: white; }

        .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .menu-card { background: white; padding: 25px; border-radius: 30px; text-align: center; cursor: pointer; transition: 0.3s; border: 1px solid #f0f2f5; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .menu-card:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: #ff4d00; }
        .menu-icon { font-size: 2.5rem; margin-bottom: 15px; }
        .menu-info h3 { font-size: 0.9rem; font-weight: 800; color: #2d3748; margin-bottom: 5px; }
        .menu-info p { font-weight: 900; color: #ff4d00; font-size: 1.1rem; }

        .pos-sidebar { width: 350px; background: white; border-radius: 40px; display: flex; flex-direction: column; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; }
        .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .cart-header h3 { font-weight: 900; }
        .clear-btn { background: none; border: none; color: #f56565; font-size: 0.7rem; font-weight: 800; cursor: pointer; text-transform: uppercase; }

        .cart-items { flex: 1; overflow-y: auto; margin-bottom: 20px; }
        .cart-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f7fafc; font-size: 0.9rem; color: #4a5568; font-weight: 700; }

        .cart-footer { padding-top: 20px; border-top: 2px dashed #edf2f7; }
        .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .total-row span { font-weight: 800; color: #a0aec0; }
        .total-price { font-size: 1.8rem !important; color: #1a1f36 !important; font-weight: 900 !important; }

        .checkout-btn { width: 100%; padding: 18px; background: #ff4d00; color: white; border: none; border-radius: 20px; font-weight: 900; font-size: 1rem; cursor: pointer; margin-bottom: 10px; box-shadow: 0 10px 20px rgba(255,77,0,0.3); transition: 0.3s; }
        .cash-btn { width: 100%; padding: 15px; background: #f7fafc; color: #4a5568; border: none; border-radius: 20px; font-weight: 800; cursor: pointer; }
        .checkout-btn:hover { background: #e64500; }
        .checkout-btn:disabled { background: #edf2f7; color: #a0aec0; box-shadow: none; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default POS;
