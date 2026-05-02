import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");

  // 1. ODALARI GETİR (GİZLİ KARAKTER TEMİZLEYİCİ İLE)
  const fetchRooms = useCallback(async () => {
    try {
      // ÖNEMLİ: Linkin Gateway (api-gateway-riqy) üzerinden gittiğinden emin ol
      const res = await fetch(`${API_URL}/res/rooms`);
      const rawText = await res.text();
      
      // JSON'un başladığı '[' ve bittiği ']' arasını bul (BOM ve boşlukları atar)
      const start = rawText.indexOf('[');
      const end = rawText.lastIndexOf(']') + 1;
      
      if (start !== -1 && end !== -1) {
        const cleanData = rawText.substring(start, end).trim();
        const data = JSON.parse(cleanData);
        setRooms(Array.isArray(data) ? data : []);
      } else {
        setRooms([]);
      }
    } catch (e) {
      console.error("Oda listesi okunamadı:", e);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // 2. İŞLEM YAP (GİRİŞ / ÇIKIŞ / TEMİZLİK)
  const handleAction = async (action, room) => {
    try {
      const url = `${API_URL}/res/rooms/${room.id}/${action}`;
      const body = action === 'checkin' ? JSON.stringify({ guest_name: guestName }) : null;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body
      });

      if (res.ok) {
        setGuestName("");
        setSelectedRoom(null);
        fetchRooms(); // Ekranı güncelle
      } else {
        alert("İşlem başarısız oldu.");
      }
    } catch (err) {
      alert("Bağlantı hatası!");
    }
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:'800'}}>Oda Planı Yükleniyor...</div>;

  return (
    <div style={{padding:'20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{fontWeight:'900', fontSize:'2.2rem', margin:0}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'15px', fontWeight:'900', fontSize:'0.8rem'}}>
            <span style={{color:'#38a169', background:'#f0fff4', padding:'5px 12px', borderRadius:'10px'}}>TEMİZ: {rooms.filter(r=>r.current_status==='Temiz').length}</span>
            <span style={{color:'#e53e3e', background:'#fff5f5', padding:'5px 12px', borderRadius:'10px'}}>DOLU: {rooms.filter(r=>r.current_status==='Dolu').length}</span>
            <span style={{color:'#d69e2e', background:'#fffff0', padding:'5px 12px', borderRadius:'10px'}}>KİRLİ: {rooms.filter(r=>r.current_status==='Kirli').length}</span>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'25px'}}>
        {rooms.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', padding:'80px', border:'3px dashed #edf2f7', borderRadius:'40px', color:'#cbd5e0'}}>Henüz tanımlı oda yok.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{
              background: 'white', padding: '25px', borderRadius: '35px', border: '2px solid',
              borderColor: room.current_status === 'Dolu' ? '#fed7d7' : room.current_status === 'Kirli' ? '#fefcbf' : '#f0f2f5',
              boxShadow: '0 10px 25px rgba(0,0,0,0.02)', transition: '0.3s'
            }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{fontSize:'1.8rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{
                  padding:'5px 12px', borderRadius:'10px', fontSize:'0.65rem', fontWeight:'900',
                  background: room.current_status === 'Dolu' ? '#fff5f5' : room.current_status === 'Kirli' ? '#fffff0' : '#f0fff4',
                  color: room.current_status === 'Dolu' ? '#e53e3e' : room.current_status === 'Kirli' ? '#b7791f' : '#38a169'
                }}>{room.current_status.toUpperCase()}</span>
              </div>
              <div style={{marginBottom:'20px'}}>
                <div style={{fontWeight:'800', color:'#a0aec0', fontSize:'0.7rem'}}>{room.room_type}</div>
                <div style={{fontWeight:'800', fontSize:'1.1rem', color:'#1a1f36'}}>{room.guest_name || "MÜSAİT"}</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'15px'}}>
                 <span style={{fontWeight:'900', fontSize:'1.1rem'}}>₺{room.price}</span>
                 <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'900', cursor:'pointer'}}>İŞLEM</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* İŞLEM PENCERESİ (MODAL) */}
      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'35px', width:'320px'}}>
            <h3 style={{fontWeight:'900', marginBottom:'10px'}}>{selectedRoom.room_number} Nolu Oda</h3>
            <p style={{fontSize:'0.9rem', color:'#718096', marginBottom:'30px'}}>Durum: <b>{selectedRoom.current_status}</b></p>
            
            {selectedRoom.current_status === 'Temiz' && (
              <div>
                <input type="text" placeholder="Müşteri Adı Soyadı" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'15px', marginBottom:'20px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700', boxSizing:'border-box'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'900', cursor:'pointer'}}>GİRİŞ YAP (CHECK-IN)</button>
              </div>
            )}

            {selectedRoom.current_status === 'Dolu' && (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'900', cursor:'pointer'}}>ÇIKIŞ YAP (CHECK-OUT)</button>
            )}

            {selectedRoom.current_status === 'Kirli' && (
              <button onClick={() => handleAction('cleaned', selectedRoom)} style={{width:'100%', background:'#3182ce', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'900', cursor:'pointer'}}>TEMİZLENDİ İŞARETLE</button>
            )}
            
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'20px', background:'none', color:'#a0aec0', border:'none', cursor:'pointer', fontWeight:'800'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
