import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Gateway üzerinden veriyi çekiyoruz
        const res = await fetch(`${API_URL}/res/rooms`);
        const data = await res.json();
        
        console.log("Gelen Veri Kontrolü:", data); // F12 Console'da veriyi göreceksin

        // Eğer veri bir obje içindeki listedeyse veya direkt listeyse ayıkla
        const roomsList = Array.isArray(data) ? data : (data.rooms || []);
        setRooms(roomsList);
      } catch (err) {
        console.error("Bağlantı hatası:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>Veritabanına bağlanılıyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h2 style={{fontSize: '2rem', fontWeight: '900'}}>Oda Rack Planı</h2>
        <button style={{background:'#1a1f36', color:'white', padding:'10px 20px', borderRadius:'10px', border:'none', cursor:'pointer'}}>+ Yeni Oda Tanımla</button>
      </div>

      <div className="room-grid" style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px'}}>
        {rooms.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', padding:'50px', border:'2px dashed #ddd', borderRadius:'20px'}}>
            Veritabanında oda var ancak liste yüklenemedi. <br/>
            Lütfen <b>F12</b> tuşuna basıp "Console" sekmesindeki hatayı kontrol edin.
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} style={{background:'white', padding:'20px', borderRadius:'20px', boxShadow:'0 4px 10px rgba(0,0,0,0.05)', border:'1px solid #eee'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{fontSize:'1.5rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{fontSize:'0.6rem', fontWeight:'900', background:'#f0fff4', color:'#38a169', padding:'4px 10px', borderRadius:'8px'}}>{room.current_status || 'TEMİZ'}</span>
              </div>
              <div style={{marginBottom:'15px'}}>
                <label style={{fontSize:'0.7rem', color:'#a0aec0', fontWeight:'800'}}>{room.room_type}</label>
                <strong style={{display:'block', color:'#1a1f36'}}>{room.guest_name || 'MÜSAİT'}</strong>
              </div>
              <div style={{borderTop:'1px solid #f7fafc', paddingTop:'10px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span style={{fontWeight:'800'}}>₺{room.price}</span>
                <button style={{background:'none', border:'none', color:'#ff4d00', fontWeight:'800', cursor:'pointer'}}>İşlem</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FrontOffice;
