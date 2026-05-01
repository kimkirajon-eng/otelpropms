import React from 'react';

const Housekeeping = () => {
  const rooms = [
    { id: 101, staff: 'Ayşe K.', status: 'Temizleniyor', progress: 65, note: 'VIP Misafir Bekleniyor' },
    { id: 102, staff: '-', status: 'Kirli', progress: 0, note: 'Check-out yapıldı' },
    { id: 103, staff: 'Mehmet T.', status: 'Arızalı', progress: 0, note: 'Klima sorunu' },
    { id: 104, staff: 'Fatma Y.', status: 'Denetleniyor', progress: 100, note: 'Hazır' },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Kat Hizmetleri <span className="text-blue-600">.</span></h2>
        <div className="flex gap-2">
            <button className="bg-white border px-4 py-2 rounded-xl text-sm font-bold shadow-sm">Rapor Al</button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-200">🧹 Görev Ata</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map(room => (
          <div key={room.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl font-black text-slate-800">{room.id}</span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${room.status === 'Kirli' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{room.status}</span>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Görevli Personel</p>
                    <p className="font-bold text-slate-700">{room.staff}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Durum Notu</p>
                    <p className="text-xs text-slate-600 italic">"{room.note}"</p>
                </div>
                <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                        <span>İlerleme</span>
                        <span>%{room.progress}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all duration-500" style={{width: `${room.progress}%`}}></div>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Housekeeping;
