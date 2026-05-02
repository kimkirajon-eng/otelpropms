import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      if (res.ok) {
        const data = await res.json();
        console.log("Sunucudan Gelen Odalar:", data); // Tarayıcı konsolunda veriyi görmek için
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Hata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  if (loading) return <div style={{textAlign:'center', padding:'100px'}}>Odalar Getiriliyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2 style={{fontSize: '2rem', fontWeight: '900', color: '#1a1f36'}}>Oda Rack Planı</h2>
        <button className="primary-btn">+ Yeni Oda Tanımla</button>
      </div>

      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="empty-state">Veritabanında oda var ama liste okunamıyor olabilir.</div>
        ) : (
          rooms.map((room, index) => (
            <div key={room.id || index} className="room-card shadow">
              <div className="room-top">
                {/* DİKKAT: Veritabanından gelen kolon adıyla eşleşmeli */}
                <span className="room-no">{room.room_number || "No Yok"}</span>
                <span className={`status-pill ${(room.current_status || 'temiz').toLowerCase()}`}>
                  {room.current_status || 'Temiz'}
                </span>
              </div>
              <div className="room-info">
                <label>{room.room_type || 'Standart'}</label>
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
        /* Mevcut CSS stillerin aynen kalabilir, sadece grid kısmına dikkat */
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; margin-top: 20px; }
        .room-card { background: white; padding: 25px; border-radius: 30px; border: 1px solid #f0f2f5; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .room-no { font-size: 1.8rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.6rem; font-weight: 900; padding: 5px 10px; border-radius: 8px; text-transform: uppercase; background: #f0fff4; color: #38a169; }
        .room-info strong { display: block; font-size: 1.1rem; color: #1a1f36; }
        .room-footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-weight: 800; }
        .action-btn { color: #ff4d00; background: none; border: none; font-weight: 900; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
