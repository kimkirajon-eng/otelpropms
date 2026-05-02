import React, { useState, useEffect } from 'react';
import { API_URL } from '../constants';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newRoom, setNewRoom] = useState({
    room_number: '',
    room_type: 'Standart',
    price: '',
    current_status: 'Temiz'
  });

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const rawText = await res.text();
      
      // MUCİZE ÇÖZÜM: JSON'un başladığı '[' ve bittiği ']' arasını bulur
      const jsonStart = rawText.indexOf('[');
      const jsonEnd = rawText.lastIndexOf(']') + 1;

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanJson = rawText.substring(jsonStart, jsonEnd);
        const data = JSON.parse(cleanJson);
        setRooms(Array.isArray(data) ? data : []);
      } else {
        // Eğer liste değil tek bir objeyse '{' kontrolü yap
        const objStart = rawText.indexOf('{');
        const objEnd = rawText.lastIndexOf('}') + 1;
        if (objStart !== -1) {
          const cleanObj = rawText.substring(objStart, objEnd);
          const data = JSON.parse(cleanObj);
          setRooms(Array.isArray(data) ? data : [data]);
        }
      }
    } catch (err) {
      console.error("Veri okuma hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/res/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          room_number: String(newRoom.room_number),
          room_type: String(newRoom.room_type),
          price: Number(newRoom.price),
          current_status: "Temiz"
        })
      });
      if (res.ok) {
        setShowModal(false);
        setNewRoom({ room_number: '', room_type: 'Standart', price: '', current_status: 'Temiz' });
        fetchRooms();
      }
    } catch (err) {
      alert("Oda eklenemedi.");
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>Sistem Yükleniyor...</div>;

  return (
    <div className="module-container">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a1f36', margin: 0 }}>Oda Rack Planı</h2>
        <button onClick={() => setShowModal(true)} style={{ background: '#1a1f36', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
          + Yeni Oda Ekle
        </button>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', width: '350px' }}>
            <h3 style={{ marginBottom: '25px', fontWeight: '900' }}>Yeni Oda Kaydet</h3>
            <form onSubmit={handleAddRoom}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: '#a0aec0', marginBottom: '5px' }}>ODA NO</label>
                <input style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', fontWeight: '700' }} type="text" required value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: '#a0aec0', marginBottom: '5px' }}>TİP</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', fontWeight: '700' }} value={newRoom.room_type} onChange={e => setNewRoom({ ...newRoom, room_type: e.target.value })}>
                  <option>Standart</option>
                  <option>Deluxe</option>
                  <option>Suite</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '900', color: '#a0aec0', marginBottom: '5px' }}>FİYAT (₺)</label>
                <input style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #edf2f7', fontWeight: '700' }} type="number" required value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800' }}>İptal</button>
                <button type="submit" style={{ flex: 2, background: '#ff4d00', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
        {rooms.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', border: '2px dashed #edf2f7', borderRadius: '20px', color: '#a0aec0', fontWeight: '700' }}>
            Henüz oda bulunamadı.
          </div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} style={{ background: 'white', padding: '25px', borderRadius: '30px', border: '1px solid #f0f2f5', transition: '0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#cbd5e0' }}>{room.room_number}</span>
                <span style={{ background: '#f0fff4', color: '#38a169', padding: '5px 12px', borderRadius: '10px', fontSize: '0.6rem', fontWeight: '900' }}>{room.current_status}</span>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#a0aec0', fontWeight: '800' }}>{room.room_type}</label>
                <strong style={{ fontSize: '1.1rem', color: '#1a1f36' }}>{room.guest_name || 'MÜSAİT'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f7fafc', paddingTop: '15px' }}>
                <span style={{ fontWeight: '900' }}>₺{room.price}</span>
                <button style={{ color: '#ff4d00', background: 'none', border: 'none', fontWeight: '900', cursor: 'pointer' }}>İşlem</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FrontOffice;
