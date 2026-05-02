import React, { useState, useEffect, useCallback } from 'react';
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

  // 1. VERİTABANINDAKİ ODALARI ÇEK (GÜNCEL LİSTE)
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      if (res.ok) {
        const data = await res.json();
        // Gelen verinin liste olduğundan emin oluyoruz
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Odalar veritabanından çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 2. YENİ ODA KAYDET VE LİSTEYİ GÜNCELLE
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
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        // Ekleme sonrası veritabanından güncel halini tekrar çekiyoruz (KRİTİK)
        await fetchRooms(); 
        alert("Oda veritabanına başarıyla mühürlendi!");
      } else {
        alert("Sunucu odayı kaydedemedi.");
      }
    } catch (err) {
      alert("Bağlantı hatası!");
    }
  };

  if (loading) return <div style={{textAlign: 'center', padding: '100px', fontWeight: 'bold'}}>Veritabanına bağlanılıyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 className="title">Oda Rack Planı</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Yeni Oda Tanımla</button>
      </div>

      {/* ODA EKLEME MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Yeni Oda Ekle</h3>
            <form onSubmit={handleAddRoom}>
              <div className="input-group">
                <label>Oda No</label>
                <input type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Tipi</label>
                <select value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}>
                  <option>Standart</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                  <option>Kral Dairesi</option>
                </select>
              </div>
              <div className="input-group">
                <label>Fiyat (₺)</label>
                <input type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="confirm-btn">Veritabanına Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CANLI ODA KARTLARI */}
      <div className="rack-grid">
        {rooms.length === 0 ? (
          <div className="no-room">Veritabanında kayıtlı oda bulunamadı. Lütfen sağ üstten ekleyin.</div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="rack-card shadow">
              <div className="rack-top">
                <span className="room-id">{room.room_number}</span>
                <span className={`pill ${room.current_status?.toLowerCase() || 'temiz'}`}>{room.current_status || 'Temiz'}</span>
              </div>
              <div className="rack-body">
                <label>{room.room_type}</label>
                <strong>{room.guest_name || 'MÜSAİT'}</strong>
              </div>
              <div className="rack-footer">
                <span className="price">₺{room.price}</span>
                <button className="btn-action text-orange">İşlem</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .title { font-size: 2rem; font-weight: 900; color: #1a1f36; }
        .add-btn { background: #1a1f36; color: white; border: none; padding: 12px 25px; border-radius: 15px; font-weight: 700; cursor: pointer; transition: 0.3s; }
        .add-btn:hover { background: #ff4d00; transform: scale(1.05); }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(10px); }
        .modal-box { background: white; padding: 35px; border-radius: 30px; width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #a0aec0; margin-bottom: 5px; text-transform: uppercase; }
        .input-group input, .input-group select { width: 100%; padding: 12px; border-radius: 12px; border: 1px solid #edf2f7; font-weight: 700; outline: none; }
        .modal-footer { display: flex; gap: 10px; margin-top: 25px; }
        .confirm-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .cancel-btn { flex: 1; background: #f7fafc; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }

        .rack-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .rack-card { background: white; padding: 25px; border-radius: 30px; border: 1px solid #f0f2f5; transition: 0.3s; }
        .rack-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); border-color: #ff4d00; }
        .rack-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .room-id { font-size: 1.5rem; font-weight: 900; color: #cbd5e0; }
        .pill { font-size: 0.6rem; font-weight: 900; padding: 5px 12px; border-radius: 10px; text-transform: uppercase; }
        .pill.temiz { background: #f0fff4; color: #38a169; }
        .rack-body label { display: block; font-size: 0.7rem; font-weight: 800; color: #a0aec0; }
        .rack-body strong { font-size: 1.1rem; color: #1a1f36; }
        .rack-footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; font-weight: 900; }
        .btn-action { background: none; border: none; font-weight: 900; cursor: pointer; }
        .no-room { grid-column: 1/-1; text-align: center; padding: 100px; border: 3px dashed #edf2f7; border-radius: 40px; color: #cbd5e0; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
