import React from 'react';

const FrontOffice = () => {
  const rooms = [
    { id: 101, type: 'King Suite', status: 'Occupied', guest: 'Mert Demir', checkout: '20.10' },
    { id: 102, type: 'Standard', status: 'Clean', guest: '-', checkout: '-' },
    { id: 103, type: 'Standard', status: 'Dirty', guest: '-', checkout: '-' },
    { id: 104, type: 'Deluxe', status: 'Reserved', guest: 'Ayşe Kaya', checkout: '21.10' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 underline decoration-orange-500 decoration-4">Oda Planı (Rack)</h2>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg">+ Yeni Rezervasyon</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(room => (
          <div key={room.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-4xl font-black text-slate-200 group-hover:text-orange-500 transition-colors">{room.id}</span>
              <StatusBadge status={room.status} />
            </div>
            <p className="text-sm font-bold text-slate-500 mb-1">{room.type}</p>
            <p className="text-lg font-black text-slate-800">{room.guest}</p>
            <div className="mt-4 pt-4 border-t flex justify-between text-[11px] font-bold text-slate-400">
              <span>CHECK-OUT: {room.checkout}</span>
              <button className="text-orange-500 hover:underline italic">İşlemler</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const colors = {
    Occupied: 'bg-blue-100 text-blue-600',
    Clean: 'bg-green-100 text-green-600',
    Dirty: 'bg-red-100 text-red-600',
    Reserved: 'bg-yellow-100 text-yellow-600'
  };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${colors[status]}`}>{status}</span>;
};

export default FrontOffice;
