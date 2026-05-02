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

  // 📥 ODALARI ÇEK
  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/res/rooms`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Oda çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // ➕ ODA EKLE
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
        setNewRoom({
          room_number: '',
          room_type: 'Standart',
          price: '',
          current_status: 'Temiz'
        });

        fetchRooms(); // tekrar çek
      } else {
        console.error("Oda ekleme başarısız");
      }

    } catch (err) {
      console.error("POST hatası:", err);
      alert("Oda eklenemedi.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold' }}>
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="module-container">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>Oda Rack Planı</h2>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: '#1a1f36',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '10px',
            border: 'none'
          }}
        >
          + Yeni Oda
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>

          <div style={{ background: '#fff', padding: 30, borderRadius: 20, width: 300 }}>
            <h3>Yeni Oda</h3>

            <form onSubmit={handleAddRoom}>
              <input
                placeholder="Oda No"
                value={newRoom.room_number}
                onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })}
                required
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
                value={newRoom.price}
                onChange={e => setNewRoom({ ...newRoom, price: e.target.value })}
                required
              />

              <button type="submit">Kaydet</button>
              <button type="button" onClick={() => setShowModal(false)}>
                İptal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ODALAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
        {rooms.length === 0 ? (
          <div>Oda yok</div>
        ) : (
          rooms.map(room => (
            <div key={room.id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 10 }}>
              <h3>{room.room_number}</h3>
              <p>{room.room_type}</p>
              <p>{room.current_status}</p>
              <strong>₺{room.price}</strong>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default FrontOffice;
