import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '' });

  // 1. ODALARI ÇEK (Gelişmiş JSON Okuyucu)
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const rawText = await res.text();
      
      const start = rawText.indexOf('[');
      const end = rawText.lastIndexOf(']') + 1;
      
      if (start !== -1 && end !== -1) {
        const cleanData = rawText.substring(start, end).trim();
        const parsedData = JSON.parse(cleanData);
        setRooms(Array.isArray(parsedData) ? parsedData : []);
      } else {
        setRooms([]);
      }
    } catch (e) { 
      console.error("Veri hatası:", e);
      setRooms([]); 
    } finally { 
      setLoading(false); 
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // 2. YENİ ODA KAYDET
  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newRoom, price: Number(newRoom.price) })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '' });
        fetchRooms();
      }
    } catch (err) { alert("Oda eklenemedi."); }
  };

  // 3. İŞLEM YAP (Check-in, Check-out, Temizlik)
  const handleAction = async (action, room) => {
    try {
      const res = await fetch(`${API_URL}/res/rooms/${room.id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'checkin' ? JSON.stringify({ guest_name: guestName }) : null
      });
      if (res.ok) {
        setGuestName(""); 
        setSelectedRoom(null); 
        fetchRooms();
      }
    } catch (err) { alert("İşlem başarısız."); }
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:'800'}}>Sistem Yükleniyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{fontWeight:'900', fontSize:'2rem', margin:0, color:'#1a1f36'}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            <div style={{display:'flex', gap:'12px', fontSize:'0.75rem', fontWeight:'800'}}>
                <span style={{color:'#38a169'}}>TEMİZ: {rooms.filter(r=>r.current_status==='Temiz').length}</span>
                <span style={{color:'#e53e3e'}}>DOLU: {rooms.filter(r=>r.current_status==='Dolu').length}</span>
                <span style={{color:'#d69e2e'}}>KİRLİ: {rooms.filter(r=>r.current_status==='Kirli').length}</span>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{background:'#1a1f36', color:'white', border:'none', padding:'12px 25px', borderRadius:'14px', fontWeight:'800', cursor:'pointer'}}>+ Yeni Oda Ekle</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'25px'}}>
        {rooms.length === 0 ? (
            <div style={{gridColumn:'1/-1', textAlign:'center', padding:'100px', border:'3px dashed #edf2f7', borderRadius:'40px', color:'#cbd5e0', fontWeight:'700'}}>Henüz oda tanımlanmamış.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{
              background: 'white', padding: '25px', borderRadius: '35px', border: '2px solid',
              borderColor: room.current_status === 'Dolu' ? '#fed7d7' : room.current_status === 'Kirli' ? '#fefcbf' : '#f0f2f5',
              boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
            }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <span style={{fontSize:'1.8rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{
                  padding:'6px 12px', borderRadius:'12px', fontSize:'0.65rem', fontWeight:'900',
                  background: room.current_status === 'Dolu' ? '#fff5f5' : room.current_status === 'Kirli' ? '#fffff0' : '#f0fff4',
                  color: room.current_status === 'Dolu' ? '#e53e3e' : room.current_status === 'Kirli' ? '#b7791f' : '#38a169'
                }}>{room.current_status.toUpperCase()}</span>
              </div>
              <div style={{marginBottom:'25px'}}>
                <small style={{fontWeight:'800', color:'#a0aec0', fontSize:'0.75rem', textTransform:'uppercase'}}>{room.room_type}</small>
                <div style={{fontWeight:'700', fontSize:'1.2rem', color:'#1a1f36', marginTop:'4px'}}>{room.guest_name || "MÜSAİT"}</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'20px'}}>
                 <span style={{fontWeight:'900', fontSize:'1.1rem'}}>₺{room.price}</span>
                 <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'900', cursor:'pointer', fontSize:'0.9rem'}}>İŞLEM</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ODA EKLE */}
      {showAddModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'45px', borderRadius:'40px', width:'380px'}}>
            <h3 style={{fontWeight:'900', marginBottom:'30px', fontSize:'1.8rem'}}>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>ODA NO</label><input style={{width:'100%', padding:'14px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700'}} type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>TİP</label><select style={{width:'100%', padding:'14px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700'}} value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div style={{marginBottom:'30px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>FİYAT</label><input style={{width:'100%', padding:'14px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700'}} type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div style={{display:'flex', gap:'15px'}}><button type="button" onClick={() => setShowAddModal(false)} style={{flex:1, padding:'15px', borderRadius:'15px', border:'none', cursor:'pointer', fontWeight:'800', background:'#f7fafc'}}>İptal</button><button type="submit" style={{flex:2, background:'#ff4d00', color:'white', border:'none', padding:'15px', borderRadius:'15px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(255,77,0,0.2)'}}>Odayı Kaydet</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: İŞLEM */}
      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'35px', width:'320px'}}>
            <h3 style={{fontWeight:'900', marginBottom:'10px', fontSize:'1.6rem'}}>{selectedRoom.room_number} Nolu Oda</h3>
            <p style={{fontSize:'0.85rem', color:'#718096', marginBottom:'30px'}}>Mevcut Durum: <b>{selectedRoom.current_status}</b></p>
            {selectedRoom.current_status === 'Temiz' && (
              <div>
                <input type="text" placeholder="Müşteri Adı" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'15px', marginBottom:'20px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(56,161,105,0.2)'}}>GİRİŞ YAP (CHECK-IN)</button>
              </div>
            )}
            {selectedRoom.current_status === 'Dolu' && (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(229,62,62,0.2)'}}>ÇIKIŞ YAP (CHECK-OUT)</button>
            )}
            {selectedRoom.current_status === 'Kirli' && (
              <button onClick={() => handleAction('cleaned', selectedRoom)} style={{width:'100%', background:'#3182ce', color:'white', padding:'15px', borderRadius:'15px', border:'none', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(49,130,206,0.2)'}}>TEMİZLENDİ İŞARETLE</button>
            )}
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'20px', background:'none', color:'#718096', border:'none', cursor:'pointer', fontWeight:'800', fontSize:'0.9rem'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
