import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({ 
    room_number: '', 
    room_type: 'Standart', 
    price: '', 
    current_status: 'Temiz' 
  });

  // 1. ODALARI ÇEK
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      if (!res.ok) throw new Error('Veri çekilemedi');
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) { 
      console.error("Hata:", err); 
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // 2. YENİ ODA KAYDET
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRoom,
          price: parseInt(newRoom.price) // Sayıya çevirmek kritik!
        })
      });
      
      if (res.ok) {
        alert("Oda Başarıyla Eklendi!");
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        fetchRooms(); // Listeyi yenile
      } else {
        const errorData = await res.json();
        alert("Hata: " + (errorData.detail || "Oda eklenemedi."));
      }
    } catch (err) { 
      alert("Bağlantı Hatası: Sunucuya ulaşılamadı."); 
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontWeight: 'bold', color: '#1a1f36'}}>Sistem Yükleniyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="title">Oda Rack Planı</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Yeni Oda Ekle</button>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="pms-modal">
            <h3>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Oda Numarası</label>
                <input type="text" placeholder="Örn: 101" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Oda Tipi</label>
                <select value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}>
                  <option>Standart</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                  <option>Kral Dairesi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Gecelik Fiyat (₺)</label>
                <input type="number" placeholder="3500" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="save-btn">Odayı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ODA KARTLARI */}
      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="empty-state">Henüz oda bulunamadı. Lütfen sağ üstten yeni bir oda ekleyin.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-top">
                <span className="room-no">{room.room_number}</span>
                <span className={`status-pill ${room.current_status.toLowerCase()}`}>{room.current_status}</span>
              </div>
              <div className="room-info">
                <label>{room.room_type}</label>
                <strong>{room.guest_name || 'Müsait'}</strong>
              </div>
              <div className="room-footer">
                <span>₺{room.price}</span>
                <button className="action-btn">İşlem</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .module-container { animation: fadeIn 0.5s ease; }
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .title { font-size: 2.2rem; font-weight: 900; color: #1a1f36; margin: 0; }
        .primary-btn { background: #1a1f36; color: white; border: none; padding: 14px 28px; border-radius: 16px; font-weight: 700; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .primary-btn:hover { transform: translateY(-2px); background: #2d3748; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(26, 31, 54, 0.8); display: flex; align-items: center; justify-content: center; z-index: 2000; backdrop-filter: blur(8px); }
        .pms-modal { background: white; padding: 40px; border-radius: 35px; width: 420px; box-shadow: 0 30px 60px rgba(0,0,0,0.4); animation: slideUp 0.3s ease; }
        .pms-modal h3 { margin-bottom: 30px; font-weight: 900; font-size: 1.8rem; color: #1a1f36; letter-spacing: -1px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.75rem; font-weight: 800; color: #718096; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .form-group input, .form-group select { width: 100%; padding: 14px; border-radius: 14px; border: 2px solid #edf2f7; font-weight: 600; outline: none; transition: 0.3s; box-sizing: border-box; }
        .form-group input:focus { border-color: #ff4d00; }
        .modal-actions { display: flex; gap: 12px; margin-top: 35px; }
        .cancel-btn { flex: 1; background: #f7fafc; border: none; padding: 15px; border-radius: 15px; font-weight: 800; cursor: pointer; color: #4a5568; }
        .save-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 15px; border-radius: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(255, 77, 0, 0.3); }

        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
        .room-card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; transition: 0.3s; }
        .room-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: #ff4d00; }
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .room-no { font-size: 1.8rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.65rem; font-weight: 900; padding: 6px 12px; border-radius: 10px; text-transform: uppercase; background: #f0fff4; color: #38a169; }
        .room-info strong { display: block; font-size: 1.2rem; color: #1a1f36; margin-top: 5px; }
        .room-footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-weight: 900; font-size: 1.1rem; }
        .action-btn { background: none; border: none; color: #ff4d00; font-weight: 800; cursor: pointer; font-size: 0.9rem; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 100px; border: 3px dashed #edf2f7; border-radius: 40px; color: #cbd5e0; font-weight: 700; font-size: 1.2rem; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default FrontOffice;
