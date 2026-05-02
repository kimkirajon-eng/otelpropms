import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      
      // KORUNAKLI VERİ OKUMA:
      const rawText = await res.text(); // Önce ham metni al
      const cleanText = rawText.trim(); // Boşlukları ve gizli karakterleri uçur
      
      console.log("Temizlenmiş Veri:", cleanText);

      if (cleanText) {
        const data = JSON.parse(cleanText); // Şimdi güvenle JSON'a çevir
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Bağlantı veya JSON hatası:", err);
    } finally {
      setLoading(false);
    }
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
          price: Number(newRoom.price),
          current_status: "Temiz"
        })
      });

      if (res.ok) {
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        await fetchRooms();
      }
    } catch (err) {
      alert("Oda eklenirken hata oluştu.");
    }
  };

  if (loading) return <div style={{textAlign:'center', padding:'100px', fontWeight:'bold'}}>Veritabanına Bağlanılıyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{fontSize: '2.2rem', fontWeight: '900', margin:0, color:'#1a1f36'}}>Oda Rack Planı</h2>
        <button onClick={() => setShowModal(true)} className="add-btn">+ Yeni Oda Tanımla</button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div className="field"><label>ODA NO</label><input type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div className="field"><label>TİP</label><select value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div className="field"><label>FİYAT</label><input type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div className="actions">
                <button type="button" onClick={() => setShowModal(false)} className="c-btn">İptal</button>
                <button type="submit" className="s-btn">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="no-data">Odalar yüklenemedi veya veritabanı boş.</div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-header">
                <span className="no">{room.room_number}</span>
                <span className="pill">{room.current_status || 'Temiz'}</span>
              </div>
              <div className="room-body">
                <p>{room.room_type}</p>
                <strong>{room.guest_name || 'MÜSAİT'}</strong>
              </div>
              <div className="room-footer">
                <span>₺{room.price}</span>
                <button className="action">İşlem</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .add-btn { background: #1a1f36; color: white; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; font-weight: 800; transition: 0.3s; }
        .add-btn:hover { background: #ff4d00; transform: scale(1.05); }
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 999; backdrop-filter: blur(8px); }
        .modal-box { background: white; padding: 40px; border-radius: 30px; width: 350px; }
        .field { margin-bottom: 15px; }
        .field label { display: block; font-size: 0.7rem; font-weight: 900; color: #a0aec0; margin-bottom: 5px; }
        .field input, .field select { width: 100%; padding: 12px; border: 1px solid #edf2f7; border-radius: 12px; font-weight: 700; box-sizing: border-box; }
        .actions { display: flex; gap: 10px; margin-top: 20px; }
        .s-btn { flex: 2; background: #ff4d00; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .c-btn { flex: 1; background: #f7fafc; border: none; padding: 12px; border-radius: 12px; font-weight: 800; cursor: pointer; }
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; }
        .room-card { background: white; padding: 25px; border-radius: 30px; border: 1px solid #f0f2f5; transition: 0.3s; }
        .room-card:hover { transform: translateY(-5px); border-color: #ff4d00; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .no { font-size: 1.8rem; font-weight: 900; color: #cbd5e0; }
        .pill { background: #f0fff4; color: #38a169; padding: 5px 12px; border-radius: 10px; font-size: 0.6rem; font-weight: 900; }
        .room-body p { margin: 0; font-size: 0.7rem; font-weight: 800; color: #a0aec0; }
        .room-body strong { font-size: 1.1rem; color: #1a1f36; }
        .room-footer { margin-top: 20px; pt: 15px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-weight: 900; padding-top: 15px; }
        .action { background: none; border: none; color: #ff4d00; font-weight: 900; cursor: pointer; }
        .no-data { grid-column: 1/-1; text-align: center; padding: 50px; border: 2px dashed #edf2f7; border-radius: 20px; color: #a0aec0; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
