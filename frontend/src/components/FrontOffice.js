import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error("Odalar çekilemedi"); }
  };

  useEffect(() => { fetchRooms(); }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: String(newRoom.room_number),
          room_type: String(newRoom.room_type),
          price: Number(newRoom.price), // Sayıya çevirmek şart
          current_status: "Temiz"
        })
      });

      if (res.ok) {
        alert("Oda Başarıyla Eklendi!");
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        fetchRooms();
      } else {
        alert("Sunucu Hatası: Tablolar henüz oluşmamış olabilir.");
      }
    } catch (err) {
      alert("Bağlantı Hatası: Gateway servisine ulaşılamıyor.");
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 style={{fontSize: '2rem', fontWeight: '900'}}>Oda Rack Planı</h2>
        <button className="add-btn" onClick={() => setShowModal(true)}>+ Yeni Oda Ekle</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="pms-modal">
            <h3>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div className="f-group"><label>Oda No</label><input type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div className="f-group"><label>Tip</label><select value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div className="f-group"><label>Fiyat (₺)</label><input type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div className="m-btns">
                <button type="button" className="c-btn" onClick={() => setShowModal(false)}>İptal</button>
                <button type="submit" className="s-btn">Odayı Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="room-grid">
        {rooms.length === 0 ? <div className="empty">Oda bulunamadı.</div> : rooms.map(room => (
          <div key={room.id} className="room-card">
            <strong>{room.room_number}</strong>
            <p>{room.room_type}</p>
            <span>₺{room.price}</span>
          </div>
        ))}
      </div>

      <style>{`
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .add-btn { background: #ff4d00; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .pms-modal { background: white; padding: 30px; border-radius: 20px; width: 350px; }
        .f-group { margin-bottom: 15px; }
        .f-group label { display: block; font-size: 0.7rem; font-weight: 800; color: #a0aec0; margin-bottom: 5px; }
        .f-group input, .f-group select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; }
        .m-btns { display: flex; gap: 10px; margin-top: 20px; }
        .s-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: 800; }
        .c-btn { flex: 1; background: #eee; border: none; padding: 10px; border-radius: 8px; }
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        .room-card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
