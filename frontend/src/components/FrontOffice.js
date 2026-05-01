import React from 'react';

const FrontOffice = () => {
  const rooms = [
    { id: 101, type: 'Kral Dairesi', status: 'Dolu', guest: 'Mert Demir', price: '₺4.500' },
    { id: 102, type: 'Standart', status: 'Temiz', guest: '-', price: '₺2.100' },
    { id: 103, type: 'Standart', status: 'Kirli', guest: '-', price: '₺2.100' },
    { id: 104, type: 'Deluxe', status: 'Rezerve', guest: 'Ayşe Kaya', price: '₺3.200' },
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Oda Rack Planı</h2>
        <button className="primary-btn">+ Yeni Kayıt</button>
      </div>
      
      <div className="room-grid">
        {rooms.map(room => (
          <div key={room.id} className="room-card">
            <div className="room-top">
              <span className="room-no">{room.id}</span>
              <span className={`status-pill ${room.status.toLowerCase()}`}>{room.status}</span>
            </div>
            <div className="room-info">
              <label>{room.type}</label>
              <strong>{room.guest}</strong>
            </div>
            <div className="room-footer">
              <span>{room.price}</span>
              <button className="action-btn">İşlem</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .module-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .module-header h2 { font-size: 2rem; font-weight: 900; color: #1a1f36; }
        .primary-btn { background: #1a1f36; color: white; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; }
        
        .room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .room-card { background: white; padding: 20px; border-radius: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #f0f2f5; transition: 0.3s; }
        .room-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
        
        .room-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .room-no { font-size: 1.5rem; font-weight: 900; color: #cbd5e0; }
        .status-pill { font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
        .status-pill.dolu { background: #ebf4ff; color: #3182ce; }
        .status-pill.temiz { background: #f0fff4; color: #38a169; }
        .status-pill.kirli { background: #fff5f5; color: #e53e3e; }
        .status-pill.rezerve { background: #fffaf0; color: #dd6b20; }

        .room-info label { display: block; font-size: 0.7rem; color: #a0aec0; font-weight: 700; margin-bottom: 2px; }
        .room-info strong { font-size: 1rem; color: #2d3748; }
        .room-footer { margin-top: 15px; pt: 15px; border-top: 1px solid #f7fafc; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; font-weight: 800; color: #4a5568; }
        .action-btn { background: none; border: none; color: #ff4d00; font-weight: 800; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default FrontOffice;
