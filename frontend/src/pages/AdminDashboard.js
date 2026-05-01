import React, { useState, useEffect } from 'react';
import FrontOffice from '../components/FrontOffice';
import Housekeeping from '../components/Housekeeping';
import Finance from '../components/Finance';
import POS from '../components/POS';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('frontoffice');
  const [stats, setStats] = useState({ occupied: 42, dirty: 5, pendingRes: 12 });

  return (
    <div className="bg-red-500 text-white p-10 text-5xl">TEST MESAJI</div>
      {/* Sidebar - Profesyonel Koyu Tema */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-black tracking-tighter text-orange-500">OTELPRO <span className="text-white font-light text-sm block tracking-widest">PMS SYSTEM</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem icon="🏨" label="Front Office" active={activeTab === 'frontoffice'} onClick={() => setActiveTab('frontoffice')} />
          <NavItem icon="🧹" label="Housekeeping" active={activeTab === 'hk'} onClick={() => setActiveTab('hk')} />
          <NavItem icon="💰" label="Finance & Folio" active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} />
          <NavItem icon="🍽️" label="Restaurant & POS" active={activeTab === 'pos'} onClick={() => setActiveTab('pos')} />
          <div className="pt-8 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Raporlama</div>
          <NavItem icon="📊" label="Günlük Rapor" />
        </nav>

        <div className="p-6 bg-slate-950">
          <div className="flex items-center gap-3 mb-4">
            {/* HATA DÜZELTME: User kontrolü eklendi */}
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white shadow-lg">
              {user?.username ? user.username[0].toUpperCase() : 'A'}
            </div>
            <div>
              <p className="text-sm font-bold">{user?.username || 'Yönetici'}</p>
              <p className="text-xs text-slate-400">Genel Müdür</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-semibold border border-red-500/20">Güvenli Çıkış</button>
        </div>
      </aside>

      {/* Ana İçerik */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10 shadow-sm">
          <div className="flex gap-12">
            <StatCard label="Dolu Oda" value={stats.occupied} color="text-blue-600" />
            <StatCard label="Kirli Oda" value={stats.dirty} color="text-red-500" />
            <StatCard label="Bekleyen Rez." value={stats.pendingRes} color="text-green-600" />
          </div>
          <div className="flex items-center gap-6">
            <span className="animate-pulse flex items-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Çevrimiçi
            </span>
            <span className="text-xl cursor-pointer hover:scale-110 transition-transform">🔔</span>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'frontoffice' && <FrontOffice />}
            {activeTab === 'hk' && <Housekeeping />}
            {activeTab === 'finance' && <Finance />}
            {activeTab === 'pos' && <POS />}
          </div>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold text-sm ${active ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/40 translate-x-2' : 'hover:bg-slate-800 text-slate-400'}`}>
    <span className="text-xl">{icon}</span>
    {label}
  </button>
);

const StatCard = ({ label, value, color }) => (
  <div className="flex flex-col">
    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">{label}</p>
    <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;
