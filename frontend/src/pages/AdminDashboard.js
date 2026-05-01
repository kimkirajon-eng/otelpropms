import React, { useState, useEffect } from 'react';
import FrontOffice from '../components/FrontOffice';
import Housekeeping from '../components/Housekeeping';
import Finance from '../components/Finance';
import POS from '../components/POS';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('frontoffice');
  const [stats, setStats] = useState({ occupied: 42, dirty: 5, pendingRes: 12 });
  const [notification, setNotification] = useState(null);

  // REAL-TIME SİMÜLASYONU: Hata düzeltildi
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotification("🔔 Housekeeping: 104 numaralı oda temizlendi!");
      setStats((prev) => ({ ...prev, dirty: prev.dirty - 1 }));
      
      setTimeout(() => setNotification(null), 5000);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Yan Menü (Sidebar) */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg rotate-12 flex items-center justify-center font-black">H</div>
            <h1 className="text-xl font-black tracking-tight italic">OTELPRO <span className="text-orange-500">PMS</span></h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Management Console</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon="🏨" label="Resepsiyon" active={activeTab === 'frontoffice'} onClick={() => setActiveTab('frontoffice')} />
          <NavItem icon="🧹" label="Kat Hizmetleri" active={activeTab === 'hk'} onClick={() => setActiveTab('hk')} />
          <NavItem icon="💰" label="Finans / Folio" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <NavItem icon="🍽️" label="Restaurant POS" active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
        </nav>

        <div className="p-6 bg-slate-950/50 m-4 rounded-3xl border border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center font-black text-xl shadow-lg">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-sm font-bold truncate w-32">{user?.username || 'Yönetici'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Admin</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full py-3 bg-white/5 hover:bg-red-500 transition-all rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white">Çıkış Yap</button>
        </div>
      </aside>

      {/* Ana Ekran (Main Area) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Üst Bar (Header) */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-12 z-10">
          <div className="flex gap-12">
            <Stat label="Dolu Oda" value={stats.occupied} color="text-blue-600" />
            <Stat label="Kirli" value={stats.dirty} color="text-red-500" />
            <Stat label="Bekleyen" value={stats.pendingRes} color="text-emerald-500" />
          </div>
          
          {notification && (
            <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 animate-bounce">
              {notification}
            </div>
          )}
        </header>

        {/* Dinamik İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-12 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'frontoffice' && <FrontOffice />}
            {activeTab === 'hk' && <Housekeeping />}
            {activeTab === 'finance' && <Finance />}
            {activeTab === 'pos' && <POS />}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 font-bold text-sm ${active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40 translate-x-2' : 'hover:bg-slate-800 text-slate-500'}`}>
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

const Stat = ({ label, value, color }) => (
  <div className="flex flex-col">
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
    <p className={`text-3xl font-black ${color} tracking-tighter`}>{value}</p>
  </div>
);

export default AdminDashboard;
