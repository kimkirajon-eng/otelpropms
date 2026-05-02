import React, { useState, useEffect, useCallback } from 'react';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");
  
  // DOĞRUDAN ÇALIŞAN LİNK
  const API_URL_RES = "https://reservation-service-y38u.onrender.com";

  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL_RES}/rooms`);
      const data = await res.json(); // Artık güvenle json() kullanabiliriz
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Veri çekme hatası:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleAction = async (action, room) => {
    const url = `${API_URL_RES}/rooms/${room.id}/${action}`;
    const body = action === 'checkin' ? JSON.stringify({ guest_name: guestName }) : null;
    
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });
    setGuestName(""); setSelectedRoom(null); fetchRooms();
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center'}}>Sistem Yükleniyor...</div>;

  return (
    <div style={{padding:'20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h2 style={{fontWeight:'900', fontSize:'2rem'}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'10px', fontWeight:'700'}}>
            <span style={{color:'#38a169'}}>T: {rooms.filter(r=>r.current_status==='Temiz').length}</span>
            <span style={{color:'#e53e3e'}}>D: {rooms.filter(r=>r.current_status==='Dolu').length}</span>
            <span style={{color:'#d69e2e'}}>K: {rooms.filter(r=>r.current_status==='Kirli').length}</span>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px'}}>
        {rooms.map(room => (
          <div key={room.id} style={{background:'white', padding:'20px', borderRadius:'25px', border:'1px solid #eee', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
              <span style={{fontSize:'1.5rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
              <span style={{fontSize:'0.6rem', fontWeight:'900', color: room.current_status === 'Dolu' ? '#e53e3e' : '#38a169'}}>{room.current_status}</span>
            </div>
            <div style={{marginBottom:'15px'}}>
              <div style={{fontSize:'0.7rem', color:'#a0aec0'}}>{room.room_type}</div>
              <div style={{fontWeight:'700'}}>{room.guest_name || "MÜSAİT"}</div>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'10px'}}>
               <span style={{fontWeight:'900'}}>₺{room.price}</span>
               <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'800', cursor:'pointer'}}>İŞLEM</button>
            </div>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'25px', width:'300px'}}>
            <h3 style={{fontWeight:'900'}}>{selectedRoom.room_number} Nolu Oda</h3>
            {selectedRoom.current_status === 'Temiz' ? (
              <div>
                <input type="text" placeholder="Müşteri Adı" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'10px', border:'1px solid #ddd'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'10px', borderRadius:'10px', border:'none', fontWeight:'800'}}>GİRİŞ YAP</button>
              </div>
            ) : (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'10px', borderRadius:'10px', border:'none', fontWeight:'800'}}>ÇIKIŞ YAP</button>
            )}
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'10px', border:'none', background:'none', color:'#718096'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
