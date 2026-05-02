import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '' });

  const fetchRooms = useCallback(async () => {
    try {
      // Cache (önbellek) sorununu önlemek için zaman damgası ekliyoruz
      const res = await fetch(`${API_URL}/res/rooms?v=${new Date().getTime()}`);
      const rawText = await res.text();
      
      // CIMBIZ: Sadece JSON listesinin olduğu kısmı ayıkla
      const start = rawText.indexOf('[');
      const end = rawText.lastIndexOf(']') + 1;
      
      if (start !== -1 && end > start) {
        const cleanJson = rawText.substring(start, end).trim();
        const data = JSON.parse(cleanJson);
        setRooms(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Oda çekme hatası:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/res/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newRoom, price: Number(newRoom.price) })
    });
    setShowAddModal(false);
    setNewRoom({ room_number: '', room_type: 'Standart', price: '' });
    // Ekleme sonrası yarım saniye bekleyip listeyi tazele
    setTimeout(() => fetchRooms(), 500);
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:'800'}}>Sistem Bağlanıyor...</div>;

  return (
    <div style={{padding:'30px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'40px', alignItems:'center'}}>
        <h2 style={{fontWeight:'900', fontSize:'2.2rem', margin:0, color:'#1a1f36'}}>Resepsiyon Rack Planı</h2>
        <button onClick={() => setShowAddModal(true)} style={{background:'#1a1f36', color:'white', border:'none', padding:'14px 28px', borderRadius:'16px', fontWeight:'800', cursor:'pointer'}}>+ Yeni Oda Ekle</button>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'25px'}}>
        {rooms.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', padding:'100px', border:'3px dashed #edf2f7', borderRadius:'40px', color:'#a0aec0', fontWeight:'700'}}>Henüz oda tanımlanmamış.</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{background: 'white', padding: '25px', borderRadius: '35px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border:'1px solid #f0f2f5'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <span style={{fontSize:'1.8rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{padding:'6px 12px', borderRadius:'10px', fontSize:'0.65rem', fontWeight:'900', background:'#f0fff4', color:'#38a169'}}>{room.current_status.toUpperCase()}</span>
              </div>
              <div style={{marginBottom:'20px'}}>
                <small style={{fontWeight:'800', color:'#a0aec0', fontSize:'0.75rem'}}>{room.room_type}</small>
                <div style={{fontWeight:'700', fontSize:'1.2rem', color:'#1a1f36'}}>{room.guest_name || "MÜSAİT"}</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'15px'}}>
                 <span style={{fontWeight:'900', fontSize:'1.1rem'}}>₺{room.price}</span>
                 <button style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'900', cursor:'pointer'}}>İŞLEM</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'40px', width:'360px'}}>
            <h3 style={{fontWeight:'900', marginBottom:'30px'}}>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'5px'}}>ODA NO</label><input style={{width:'100%', padding:'12px', borderRadius:'12px', border:'2px solid #edf2f7'}} type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'5px'}}>TİP</label><select style={{width:'100%', padding:'12px', borderRadius:'12px', border:'2px solid #edf2f7'}} value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div style={{marginBottom:'30px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'5px'}}>FİYAT</label><input style={{width:'100%', padding:'12px', borderRadius:'12px', border:'2px solid #edf2f7'}} type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div style={{display:'flex', gap:'15px'}}><button type="button" onClick={() => setShowAddModal(false)} style={{flex:1, padding:'12px', borderRadius:'12px', border:'none', cursor:'pointer', background:'#f7fafc', fontWeight:'800'}}>İptal</button><button type="submit" style={{flex:2, background:'#ff4d00', color:'white', border:'none', padding:'12px', borderRadius:'12px', fontWeight:'800', cursor:'pointer'}}>Kaydet</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
