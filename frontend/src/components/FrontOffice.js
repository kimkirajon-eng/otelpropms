import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CANLI VERİ ÇEKME FONKSİYONU
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Gateway üzerinden Reservation Service'e istek atar
        const response = await fetch(`${API_URL}/res/rooms`);
        if (!response.ok) throw new Error('Veri çekme hatası');
        const data = await response.json();
        setRooms(data);
        setLoading(false);
      } catch (err) {
        console.error("Hata:", err);
        setError("Veritabanına bağlanılamadı. Lütfen backend servislerini kontrol edin.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Oda Durumları Canlı Olarak Yükleniyor...</p>
      <style>{`
        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: #718096; }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #ff4d00; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 15px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  if (error) return <div style={{color: '#e53e3e', fontWeight: 'bold', textAlign: 'center', padding: '50px'}}>{error}</div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Oda Rack Planı</h2>
        <div className="live-status">
          <span className="dot"></span> CANLI VERİ AKIŞI
        </div>
      </div>
      
      <div className="room-grid">
        {rooms.length === 0 ? (
          <div className="no-data">Veritabanında henüz oda tanımlanmamış.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className="room-card">
              <div className="room-top">
                <span className="room-no">{room.room_number || room.id}</span>
                <span className={`status-pill ${(room.current_status || 'temiz').toLowerCase()}`}>
                  {room.current_status || 'Temiz'}
                </span>
              </div>
              <div className="room-info">
                <label>{room.room_type || 'Standart'}</label>
                <strong>{room.guest_name || 'Müsait'}</strong>
              </div>
              <div className="room-footer">
                <span>{room.price ? `₺${room.price}` : '₺0.00'}</span>
                <button className="action-btn">İşlemler</button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .module-header h2 { font-size: 2rem; font-weight: 900; color: #1a1f36; margin: 0; }
        .live-status { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 900; color: #38a169; background: #f0fff4; padding: 6px 12px; border-radius: 20px; border: 1px solid #c6f6d5; }
        .dot { width: 8px; height: 8px; background: #38a169; border-radius: 50%; animation: pulse 1.5s infinite; }
        
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 25px; }
        .room-card { background: white; padding: 25px; border-radius: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #f0f2f5; transition: 0.3s ease; }
        .room-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); border-color: #ff4d00; }
        
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .room-no { font-size: 1.8rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.6rem; font-weight: 900; padding: 5px 12px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
        .status-pill.dolu { background: #ebf4ff; color: #3182ce; }
        .status-pill.temiz { background: #f0fff4; color: #38a169; }
        .status-pill.kirli { background: #fff5f5; color: #e53e3e; }
        .status-pill.rezerve { background: #fffaf0; color: #dd6b20; }

        .room-info label { display: block; font-size: 0.7rem; color: #a0aec0; font-weight: 800; margin-bottom: 4px; text-transform: uppercase; }
        .room-info strong { font-size: 1.1rem; color: #2d3748; display: block; min-height: 1.5rem; }
        
        .room-footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 900; color: #1a1f36; }
        .action-btn { background: #f7fafc; border: none; color: #ff4d00; font-weight: 900; cursor: pointer; padding: 8px 15px; border-radius: 10px; transition: 0.2s; }
        .action-btn:hover { background: #ff4d00; color: white; }
        
        .no-data { grid-column: 1 / -1; text-align: center; padding: 100px; color: #a0aec0; font-weight: 700; background: white; border-radius: 30px; border: 2px dashed #edf2f7; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default FrontOffice;
