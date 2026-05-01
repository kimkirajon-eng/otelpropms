import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });

  // 1. MEVCUT ODALARI ÇEK
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) { console.error("Hata:", err); }
  };

  useEffect(() => { fetchRooms(); }, []);

  // 2. YENİ ODA KAYDET
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRoom)
      });
      if (res.ok) {
        alert("Oda Başarıyla Eklendi!");
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        fetchRooms(); // Listeyi güncelle
      }
    } catch (err) { alert("Hata: Oda eklenemedi."); }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Oda Rack Planı</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Yeni Oda Ekle</button>
      </div>

      {/* ODA EKLEME FORMU (MODAL) */}
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

      {/* ODA LİSTESİ */}
      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="empty-state">Henüz oda bulunamadı. Lütfen yeni bir oda ekleyin.</div>
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
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(5px); }
        .pms-modal { background: white; padding: 40px; border-radius: 30px; width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .pms-modal h3 { margin-bottom: 25px; font-weight: 900; font-size: 1.5rem; color: #1a1f36; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #a0aec0; margin-bottom: 5px; text-transform: uppercase; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; font-weight: 600; outline: none; }
        .modal-actions { display: flex; gap: 10px; margin-top: 25px; }
        .cancel-btn { flex: 1; background: #f7fafc; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; color: #4a5568; }
        .save-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .empty-state { grid-column: 1/-1; text-align: center; padding: 100px; background: white; border-radius: 30px; border: 2px dashed #e2e8f0; color: #a0aec0; font-weight: 700; }
        
        /* Önceki stillerin buraya eklendiğinden emin ol */
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .primary-btn { background: #1a1f36; color: white; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; }
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .room-card { background: white; padding: 20px; border-radius: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; position: relative; }
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .room-no { font-size: 1.5rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; background: #f0fff4; color: #38a169; }
        .room-info strong { display: block; font-size: 1.1rem; color: #2d3748; }
        .room-footer { margin-top: 15px; pt: 15px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; }
        .action-btn { background: none; border: none; color: #ff4d00; font-weight: 800; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
