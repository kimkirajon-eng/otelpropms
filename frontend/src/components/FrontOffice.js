import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const text = await res.text();
      const clean = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
      setRooms(JSON.parse(clean));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleAction = async (action, room) => {
    let url = `${API_URL}/res/rooms/${room.id}/${action}`;
    let body = action === 'checkin' ? JSON.stringify({ guest_name: guestName }) : null;
    
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
    setGuestName(""); setSelectedRoom(null); fetchRooms();
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center'}}>Sistem Hazırlanıyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h2 style={{fontWeight:'900', fontSize:'2rem'}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'10px', fontSize:'0.8rem', fontWeight:'700'}}>
            <span style={{color:'#38a169'}}>● Temiz: {rooms.filter(r=>r.current_status==='Temiz').length}</span>
            <span style={{color:'#e53e3e'}}>● Dolu: {rooms.filter(r=>r.current_status==='Dolu').length}</span>
            <span style={{color:'#d69e2e'}}>● Kirli: {rooms.filter(r=>r.current_status==='Kirli').length}</span>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px'}}>
        {rooms.map(room => (
          <div key={room.id} className="room-card" style={{
            background: 'white', padding: '20px', borderRadius: '25px', border: '2px solid',
            borderColor: room.current_status === 'Dolu' ? '#fed7d7' : room.current_status === 'Kirli' ? '#fefcbf' : '#f0f2f5'
          }}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
              <span style={{fontSize:'1.5rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
              <span style={{
                padding:'4px 8px', borderRadius:'8px', fontSize:'0.6rem', fontWeight:'900',
                background: room.current_status === 'Dolu' ? '#fff5f5' : room.current_status === 'Kirli' ? '#fffff0' : '#f0fff4',
                color: room.current_status === 'Dolu' ? '#e53e3e' : room.current_status === 'Kirli' ? '#b7791f' : '#38a169'
              }}>{room.current_status.toUpperCase()}</span>
            </div>
            <div style={{marginBottom:'15px'}}>
              <small style={{fontWeight:'800', color:'#a0aec0'}}>{room.room_type}</small>
              <div style={{fontWeight:'700'}}>{room.guest_name || "MÜSAİT"}</div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'10px'}}>
               <span style={{fontWeight:'900'}}>₺{room.price}</span>
               <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'800', cursor:'pointer'}}>İŞLEM</button>
            </div>
          </div>
        ))}
      </div>

      {/* İŞLEM MODAL */}
      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'25px', width:'300px'}}>
            <h3 style={{fontWeight:'900'}}>{selectedRoom.room_number} Nolu Oda</h3>
            <p style={{fontSize:'0.8rem', color:'#718096', marginBottom:'20px'}}>Mevcut Durum: {selectedRoom.current_status}</p>
            
            {selectedRoom.current_status === 'Temiz' && (
              <div>
                <input type="text" placeholder="Müşteri Adı" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'10px', border:'1px solid #ddd'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'10px', borderRadius:'10px', border:'none', fontWeight:'800', cursor:'pointer'}}>GİRİŞ YAP (CHECK-IN)</button>
              </div>
            )}

            {selectedRoom.current_status === 'Dolu' && (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'10px', borderRadius:'10px', border:'none', fontWeight:'800', cursor:'pointer'}}>ÇIKIŞ YAP (CHECK-OUT)</button>
            )}

            {selectedRoom.current_status === 'Kirli' && (
              <button onClick={() => handleAction('cleaned', selectedRoom)} style={{width:'100%', background:'#3182ce', color:'white', padding:'10px', borderRadius:'10px', border:'none', fontWeight:'800', cursor:'pointer'}}>TEMİZLENDİ İŞARETLE</button>
            )}
            
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'10px', background:'none', color:'#718096', border:'none', cursor:'pointer', fontWeight:'700'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
