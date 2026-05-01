import React from 'react';

const Finance = () => {
  const transactions = [
    { id: 1, room: 101, guest: 'Ahmet Y.', service: 'Oda Ücreti', amount: 4500, status: 'Unpaid' },
    { id: 2, room: 105, guest: 'Selma T.', service: 'Mini Bar', amount: 250, status: 'Paid' },
    { id: 3, room: 302, guest: 'Can V.', service: 'Spa & Masaj', amount: 1200, status: 'Unpaid' },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <FinanceStat label="Günlük Ciro" value="₺12.450" color="bg-green-500" />
        <StatCard label="Açık Folyolar" value="₺8.200" color="text-orange-500" />
        <StatCard label="Tahsil Edilen" value="₺4.250" color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800">Son İşlemler & Harcamalar</h3>
            <button className="text-blue-600 font-bold text-sm hover:underline italic">Tümünü Gör</button>
        </div>
        <div className="space-y-4">
          {transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between p-5 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">{t.room}</div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{t.guest}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{t.service}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-slate-900">₺{t.amount}</p>
                <span className={`text-[9px] font-black uppercase ${t.status === 'Paid' ? 'text-green-500' : 'text-red-400'}`}>{t.status === 'Paid' ? 'ÖDENDİ' : 'AÇIK HESAP'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FinanceStat = ({ label, value, color }) => (
    <div className={`${color} p-8 rounded-[2rem] shadow-xl shadow-green-200/40 text-white`}>
        <p className="text-[10px] uppercase font-black tracking-widest opacity-70 mb-2">{label}</p>
        <p className="text-4xl font-black">{value}</p>
    </div>
);

const StatCard = ({ label, value, color }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">{label}</p>
        <p className={`text-4xl font-black ${color}`}>{value}</p>
    </div>
);

export default Finance;
