import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [newRoom, setNewRoom] = useState({ room_number: '', room_type: 'Standart', price: '' });

  // 1. ODALARI ÇEK (ZIRHLI VE TEMİZLEYİCİ SÜRÜM)
  const fetchRooms = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const rawText = await res.text();
      
      // Konsolda ne geldiğini görelim (Hata ayıklama için)
      console.log("Ham Veri:", rawText);

      // JSON'un başladığı '[' ve bittiği ']' yerleri bul (Pislikleri temizle)
      const start = rawText.indexOf('[');
      const end = rawText.lastIndexOf(']') + 1;
      
      if (start !== -1 && end !== -1) {
        const cleanData = rawText.substring(start, end).trim();
        const parsedData = JSON.parse(cleanData);
        setRooms(Array.isArray(parsedData) ? parsedData : []);
      } else if (rawText.includes("[]")) {
        setRooms([]);
      }
    } catch (e) { 
      console.error("Veri işleme hatası:", e); 
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
        // Küçük bir gecikmeyle listeyi tazele (DB mühürleme süresi için)
        setTimeout(() => fetchRooms(), 500);
      }
    } catch (err) { alert("Oda eklenemedi."); }
  };

  // 3. İŞLEM YAP (Giriş/Çıkış/Temizlik)
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
        setGuestName(""); setSelectedRoom(null); fetchRooms();
      }
    } catch (err) { alert("İşlem başarısız."); }
  };

  if (loading) return <div style={{padding:'100px', textAlign:'center', fontWeight:'800'}}>Otel Verileri Okunuyor...</div>;

  return (
    <div className="module-container">
      {/* HEADER VE İSTATİSTİKLER */}
      <div className="module-header" style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{fontWeight:'900', fontSize:'2.2rem', margin:0, color:'#1a1f36'}}>Resepsiyon & Rack Planı</h2>
        <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
            <div style={{display:'flex', gap:'12px', fontSize:'0.75rem', fontWeight:'900'}}>
                <span style={{color:'#38a169', background:'#f0fff4', padding:'5px 12px', borderRadius:'10px'}}>TEMİZ: {rooms.filter(r=>r.current_status==='Temiz').length}</span>
                <span style={{color:'#e53e3e', background:'#fff5f5', padding:'5px 12px', borderRadius:'10px'}}>DOLU: {rooms.filter(r=>r.current_status==='Dolu').length}</span>
                <span style={{color:'#d69e2e', background:'#fffff0', padding:'5px 12px', borderRadius:'10px'}}>KİRLİ: {rooms.filter(r=>r.current_status==='Kirli').length}</span>
            </div>
            <button onClick={() => setShowAddModal(true)} style={{background:'#1a1f36', color:'white', border:'none', padding:'14px 28px', borderRadius:'15px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(0,0,0,0.1)'}}>+ Yeni Oda Ekle</button>
        </div>
      </div>

      {/* ODA KARTLARI GRİD */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'25px'}}>
        {rooms.length === 0 ? (
            <div style={{gridColumn:'1/-1', textAlign:'center', padding:'100px', border:'3px dashed #edf2f7', borderRadius:'40px', color:'#cbd5e0', fontWeight:'700'}}>
              Veritabanında kayıtlı oda bulunamadı. Lütfen sağ üstten oda ekleyin.
            </div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{
              background: 'white', padding: '25px', borderRadius: '35px', border: '2px solid',
              borderColor: room.current_status === 'Dolu' ? '#fed7d7' : room.current_status === 'Kirli' ? '#fefcbf' : '#f0f2f5',
              boxShadow: '0 8px 20px rgba(0,0,0,0.02)', transition: '0.3s'
            }}>
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <span style={{fontSize:'1.8rem', fontWeight:'900', color:'#cbd5e0'}}>{room.room_number}</span>
                <span style={{
                  padding:'6px 12px', borderRadius:'10px', fontSize:'0.65rem', fontWeight:'900',
                  background: room.current_status === 'Dolu' ? '#fff5f5' : room.current_status === 'Kirli' ? '#fffff0' : '#f0fff4',
                  color: room.current_status === 'Dolu' ? '#e53e3e' : room.current_status === 'Kirli' ? '#b7791f' : '#38a169'
                }}>{room.current_status.toUpperCase()}</span>
              </div>
              <div style={{marginBottom:'25px'}}>
                <small style={{fontWeight:'800', color:'#a0aec0', fontSize:'0.75rem', textTransform:'uppercase'}}>{room.room_type}</small>
                <div style={{fontWeight:'800', fontSize:'1.2rem', color:'#1a1f36', marginTop:'4px'}}>{room.guest_name || "MÜSAİT"}</div>
              </div>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #f7fafc', paddingTop:'20px'}}>
                 <span style={{fontWeight:'900', fontSize:'1.1rem'}}>₺{room.price}</span>
                 <button onClick={() => setSelectedRoom(room)} style={{color:'#ff4d00', border:'none', background:'none', fontWeight:'900', cursor:'pointer', fontSize:'0.9rem'}}>İŞLEM</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: YENİ ODA EKLE */}
      {showAddModal && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'40px', width:'380px', boxShadow:'0 30px 60px rgba(0,0,0,0.4)'}}>
            <h3 style={{fontWeight:'900', marginBottom:'30px', fontSize:'1.8rem'}}>Yeni Oda Tanımla</h3>
            <form onSubmit={handleAddRoom}>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>ODA NO</label><input style={{width:'100%', padding:'15px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700', boxSizing:'border-box'}} type="text" required value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} /></div>
              <div style={{marginBottom:'20px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>TİP</label><select style={{width:'100%', padding:'15px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700', boxSizing:'border-box'}} value={newRoom.room_type} onChange={e => setNewRoom({...newRoom, room_type: e.target.value})}><option>Standart</option><option>Deluxe</option><option>Suite</option></select></div>
              <div style={{marginBottom:'30px'}}><label style={{display:'block', fontSize:'0.75rem', fontWeight:'900', color:'#718096', marginBottom:'8px'}}>FİYAT</label><input style={{width:'100%', padding:'15px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700', boxSizing:'border-box'}} type="number" required value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} /></div>
              <div style={{display:'flex', gap:'15px'}}><button type="button" onClick={() => setShowAddModal(false)} style={{flex:1, padding:'15px', borderRadius:'15px', border:'none', cursor:'pointer', fontWeight:'800', background:'#f7fafc'}}>İptal</button><button type="submit" style={{flex:2, background:'#ff4d00', color:'white', border:'none', padding:'15px', borderRadius:'15px', fontWeight:'800', cursor:'pointer', boxShadow:'0 10px 20px rgba(255,77,0,0.2)'}}>Odayı Kaydet</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: İŞLEM (CHECK-IN / OUT) */}
      {selectedRoom && (
        <div style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2000, backdropFilter:'blur(10px)'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'40px', width:'340px', boxShadow:'0 30px 60px rgba(0,0,0,0.4)'}}>
            <h3 style={{fontWeight:'900', marginBottom:'10px', fontSize:'1.8rem'}}>{selectedRoom.room_number} Nolu Oda</h3>
            <p style={{fontSize:'0.9rem', color:'#718096', marginBottom:'30px'}}>Durum: <b>{selectedRoom.current_status}</b></p>
            {selectedRoom.current_status === 'Temiz' && (
              <div>
                <input type="text" placeholder="Müşteri Adı Soyadı" value={guestName} onChange={e=>setGuestName(e.target.value)} style={{width:'100%', padding:'15px', marginBottom:'20px', borderRadius:'15px', border:'2px solid #edf2f7', fontWeight:'700', boxSizing:'border-box'}} />
                <button onClick={() => handleAction('checkin', selectedRoom)} style={{width:'100%', background:'#38a169', color:'white', padding:'18px', borderRadius:'18px', border:'none', fontWeight:'900', cursor:'pointer', boxShadow:'0 10px 20px rgba(56,161,105,0.2)'}}>GİRİŞ YAP (CHECK-IN)</button>
              </div>
            )}
            {selectedRoom.current_status === 'Dolu' && (
              <button onClick={() => handleAction('checkout', selectedRoom)} style={{width:'100%', background:'#e53e3e', color:'white', padding:'18px', borderRadius:'18px', border:'none', fontWeight:'900', cursor:'pointer', boxShadow:'0 10px 20px rgba(229,62,62,0.2)'}}>ÇIKIŞ YAP (CHECK-OUT)</button>
            )}
            {selectedRoom.current_status === 'Kirli' && (
              <button onClick={() => handleAction('cleaned', selectedRoom)} style={{width:'100%', background:'#3182ce', color:'white', padding:'18px', borderRadius:'18px', border:'none', fontWeight:'900', cursor:'pointer', boxShadow:'0 10px 20px rgba(49,130,206,0.2)'}}>TEMİZLENDİ İŞARETLE</button>
            )}
            <button onClick={()=>setSelectedRoom(null)} style={{width:'100%', marginTop:'20px', background:'none', color:'#a0aec0', border:'none', cursor:'pointer', fontWeight:'800'}}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
