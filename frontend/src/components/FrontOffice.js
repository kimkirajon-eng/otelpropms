import React, { useState } from 'react';

const FrontOffice = () => {
  const [rooms, setRooms] = useState([
    { id: 101, type: 'Suite', status: 'Clean', guest: 'Ahmet Yılmaz' },
    { id: 102, type: 'Standard', status: 'Dirty', guest: '-' },
  ]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Ön Büro Kontrol Paneli</h1>
      <div className="grid grid-cols-4 gap-4">
        {rooms.map(room => (
          <div key={room.id} className={`p-4 rounded shadow-lg ${room.status === 'Clean' ? 'bg-green-100' : 'bg-red-100'}`}>
            <h2 className="font-bold text-xl">Oda {room.id}</h2>
            <p>{room.type}</p>
            <p className="text-sm italic">{room.guest}</p>
            <button className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">Check-In</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrontOffice; // <-- BU SATIR ÇOK ÖNEMLİ
