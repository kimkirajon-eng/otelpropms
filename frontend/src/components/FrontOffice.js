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
      const res = await fetch(`${API_URL}/rooms`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
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
      const res = await fetch(`${API_URL}/rooms`, {
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
        setNewRoom({
          room_number: '',
          room_type: 'Standart',
          price: '',
          current_status: 'Temiz'
        });
        fetchRooms();
      }
    } catch (err) {
      alert("Oda eklenemedi.");
    }
  };

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>
        Sistem Yükleniyor...
      </div>
    );

  return (
    <div className="module-container">
      <div className="module-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1a1f36', margin: 0 }}>
          Oda Rack Planı
        </h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#1a1f36',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          + Yeni Oda Ekle
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '30px', width: '350px' }}>
            <h3 style={{ marginBottom: '25px', fontWeight: '900' }}>Yeni Oda Kaydet</h3>
            <form onSubmit={handleAddRoom}>
              
              <input
                type="text"
                placeholder="Oda No"
                required
                value={newRoom.room_number}
                onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })}
              />

              <select
                value={newRoom.room_type}
                onChange={e => setNewRoom({ ...newRoom, room_type: e.target.value })}
              >
                <option>Standart</option>
                <option>Deluxe</option>
                <option>Suite</option>
              </select>

              <input
                type="number"
                placeholder="Fiyat"
                required
                value={newRoom.price}
                onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
              />

              <button type="submit">Kaydet</button>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
        {rooms.length === 0 ? (
          <div>Henüz oda yok</div>
        ) : (
          rooms.map((room) => (
            <div key={room.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
              <h3>{room.room_number}</h3>
              <p>{room.room_type}</p>
              <p>{room.current_status}</p>
              <p>₺{room.price}</p>
              <strong>{room.guest_name || 'MÜSAİT'}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FrontOffice;
