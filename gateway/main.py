import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '' });

  // 1. VERİLERİ ZORLAYARAK ÇEK
  const fetchRooms = useCallback(async () => {
    try {
      // Önbellek (Cache) sorununu önlemek için sonuna rastgele sayı ekliyoruz
      const res = await fetch(`${API_URL}/res/rooms?t=${new Date().getTime()}`);
      const rawText = await res.text();
      
      const start = rawText.indexOf('[');
      const end = rawText.lastIndexOf(']') + 1;
      
      if (start !== -1 && end > start) {
        const cleanJson = rawText.substring(start, end).trim();
        const data = JSON.parse(cleanJson);
        
        console.log("Ekrana Basılacak Odalar:", data); // Veri geliyorsa burada göreceğiz
        setRooms([...data]); // Diziyi kopyalayarak state'i tetikle
      }
    } catch (e) {
      console.error("Veri ayıklama hatası:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  // 2. ODA EKLE VE EKRANI TAZELE
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
        // Önemli: Ekleme sonrası 1 saniye bekle (Veritabanı yazma süresi için) ve ÇEK
        setTimeout(() => fetchRooms(), 1000);
      }
    } catch (err) { alert("Bağlantı hatası!"); }
  };

  const handleAction = async (action, room) => {
    const url = `${API_URL}/res/rooms/${room.id}/${action}`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: action === 'checkin' ? JSON.stringify({ guest_name: guestName }) : null
    });
    setGuestName(""); setSelectedRoom(null); fetchRooms();
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center'}}>Sistem Yükleniyor...</div>;

  return (
    <div style={{padding:'20px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{fontWeight:'900', fontSize:'2rem'}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
            <button onClick={() => setShowAddModal(true)} style={{background:'#1a1f36', color:'white', padding:'12px 25px', borderRadius:'12px', fontWeight:'800', cursor:'pointer'}}>+ Yeni Oda Ekle</button>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'20px'}}>
        {rooms.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', padding:'80px', border:'2px dashed #ddd', borderRadius:'30px'}}>
            Veritabanında oda var ama liste boş görünüyor. <br/>
            (Sayfayı Ctrl+F5 ile yenileyin)
          </div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{background:'white', padding:'25px', borderRadius:'30px', border:'2px solid #f0f2f5', boxShadow:'0 5px 15px rgba(0,0,0,0.05)'}}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                <span style={{fontSize:'1.8rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{padding:'5px 10px', borderRadius:'10px', fontSize:'0.6rem', fontWeight:'900', background:'#f0fff4', color:'#38a169'}}>{room.current_status}</span>
              </div>
              <div style={{marginBottom:'15px'}}>
                <div style={{fontSize:'0.7rem', color:'#a0aec0', fontWeight:'800'}}>{room.room_type}</div>
                <div style={{fontWeight:'700'}}>{room.guest_name || "MÜSAİT"}</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'15px'}}>
                 <span style={{fontWeight:'900'}}>₺{room.price}</span>
                 <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'900', cursor:'pointer'}}>İŞLEM</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODALLAR (Ekle & İşlem) AYNI KALACAK */}
      {showAddModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000}}>
          <div style={{background:'white', padding:'40px', borderRadius:'30px', width:'350px'}}>
            <h3 style={{fontWeight:'900', marginBottom:'20px'}}>Yeni Oda Kaydet</h3>
            <form onSubmit={handleAddRoom}>
              <div style={{marginBottom:'15px'}}><label>ODA NO</label><input style={{width:'100%', padding:'10px'}} type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div style={{marginBottom:'15px'}}><label>TİP</label><select style={{width:'100%', padding:'10px'}} value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div style={{marginBottom:'20px'}}><label>FİYAT</label><input style={{width:'100%', padding:'10px'}} type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div style={{display:'flex', gap:'10px'}}><button type="button" onClick={() => setShowAddModal(false)} style={{flex:1}}>İptal</button><button type="submit" style={{flex:2, background:'#ff4d00', color:'white'}}>Kaydet</button></div>
            </form>
          </div>
        </div>
      )}

      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000}}>
          <div style={{background:'white', padding:'30px', borderRadius:'25px', width:'300px'}}>
            <h3 style={{fontWeight:'900'}}>{selectedRoom.room_number}</h3>
            {selectedRoom.current_status === 'Temiz' ? (
              <div>
                <input type="text" placeholder="İsim" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'10px', marginBottom:'10px'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'10px'}}>GİRİŞ YAP</button>
              </div>
            ) : (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'10px'}}>ÇIKIŞ YAP</button>
            )}
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'10px'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
