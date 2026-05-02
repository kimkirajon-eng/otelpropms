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

  // 1. VERİLERİ SUNUCUDAN ÇEK
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      if (res.ok) {
        const data = await res.json();
        // Eğer data bir liste değilse boş liste ayarla (hata almamak için)
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Odalar çekilirken hata oluştu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // 2. YENİ ODA KAYDET
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: String(newRoom.room_number),
          room_type: String(newRoom.room_type),
          price: Number(newRoom.price),
          current_status: String(newRoom.current_status)
        })
      });

      if (res.ok) {
        alert("Oda Başarıyla Eklendi!");
        setShowModal(false); // Modalı kapat
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' }); // Formu sıfırla
        fetchRooms(); // LİSTEYİ ANINDA GÜNCELLE
      } else {
        alert("Oda eklenirken bir sorun oluştu.");
      }
    } catch (err) {
      alert("Bağlantı hatası! Gateway çalışıyor mu?");
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center', fontWeight: 'bold'}}>Yükleniyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 style={{fontSize: '2.5rem', fontWeight: '900', margin: 0}}>Oda Rack Planı</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Yeni Oda Ekle</button>
      </div>

      {/* ODA EKLEME MODAL (FORM) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="pms-modal">
            <h3>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div className="form-group">
                <label>Oda Numarası</label>
                <input type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} placeholder="Örn: 101" />
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
                <input type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} placeholder="3500" />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="save-btn">Odayı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ODA LİSTESİ (KARTLAR) */}
      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="empty-state">Henüz oda eklenmemiş. Lütfen sağ üstten yeni oda tanımlayın.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className="room-card shadow-lg">
              <div className="room-top">
                <span className="room-no">{room.room_number}</span>
                <span className={`status-pill ${room.current_status.toLowerCase()}`}>{room.current_status}</span>
              </div>
              <div className="room-info">
                <label>{room.room_type}</label>
                <strong>{room.guest_name || 'MÜSAİT'}</strong>
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
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .primary-btn { background: #1a1f36; color: white; border: none; padding: 15px 30px; border-radius: 15px; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .primary-btn:hover { background: #ff4d00; transform: translateY(-3px); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .pms-modal { background: white; padding: 40px; border-radius: 30px; width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); }
        .pms-modal h3 { font-size: 1.8rem; font-weight: 900; margin-bottom: 25px; color: #1a1f36; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #a0aec0; margin-bottom: 8px; text-transform: uppercase; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border-radius: 12px; border: 2px solid #edf2f7; font-weight: 600; outline: none; box-sizing: border-box; }
        
        .modal-actions { display: flex; gap: 15px; margin-top: 30px; }
        .cancel-btn { flex: 1; background: #f7fafc; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; color: #4a5568; }
        .save-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(255,77,0,0.2); }

        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
        .room-card { background: white; padding: 30px; border-radius: 30px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; transition: 0.3s; }
        .room-card:hover { transform: translateY(-10px); border-color: #ff4d00; }
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .room-no { font-size: 1.8rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.6rem; font-weight: 900; padding: 5px 12px; border-radius: 10px; text-transform: uppercase; }
        .status-pill.temiz { background: #f0fff4; color: #38a169; }
        .room-info strong { display: block; font-size: 1.2rem; color: #1a1f36; margin-top: 5px; }
        .room-footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-weight: 900; }
        .action-btn { color: #ff4d00; background: none; border: none; font-weight: 900; cursor: pointer; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 100px; border: 3px dashed #edf2f7; border-radius: 40px; color: #cbd5e0; font-weight: 700; font-size: 1.2rem; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
