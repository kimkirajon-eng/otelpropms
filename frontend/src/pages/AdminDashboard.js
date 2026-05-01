import React, { useState, useEffect } from 'react';
import FrontOffice from '../components/FrontOffice';
import Housekeeping from '../components/Housekeeping';
import Finance from '../components/Finance';
import POS from '../components/POS';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState(user.role === 'admin' ? 'frontoffice' : user.role);
  const [realTimeNotice, setNotice] = useState("");

  // REAL-TIME: Socket.io bağlantısı simülasyonu
  useEffect(() => {
    // Örn: Bir oda temizlendiğinde bildirim düşer
    const mockSocket = setInterval(() => {
      setNotice("Oda 102 temizlendi!"); 
      setTimeout(() => setNotice(""), 3000);
    }, 15000);
    return () => clearInterval(mockSocket);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="w-64 bg-slate-900 text-white flex flex-col p-6">
        <h1 className="text-2xl font-bold text-orange-500 mb-10 italic">OtelPro PMS</h1>
        
        <div className="flex-1 space-y-2">
          {(user.role === 'admin' || user.role === 'reception') && (
            <button onClick={() => setActiveTab('frontoffice')} className={`w-full text-left p-3 rounded ${activeTab === 'frontoffice' ? 'bg-orange-600' : 'hover:bg-slate-800'}`}>Front Office</button>
          )}
          {(user.role === 'admin' || user.role === 'hk') && (
            <button onClick={() => setActiveTab('hk')} className={`w-full text-left p-3 rounded ${activeTab === 'hk' ? 'bg-orange-600' : 'hover:bg-slate-800'}`}>Housekeeping</button>
          )}
          {(user.role === 'admin' || user.role === 'finance') && (
            <button onClick={() => setActiveTab('finance')} className={`w-full text-left p-3 rounded ${activeTab === 'finance' ? 'bg-orange-600' : 'hover:bg-slate-800'}`}>Finance & Folio</button>
          )}
          {(user.role === 'admin' || user.role === 'pos') && (
            <button onClick={() => setActiveTab('pos')} className={`w-full text-left p-3 rounded ${activeTab === 'pos' ? 'bg-orange-600' : 'hover:bg-slate-800'}`}>POS System</button>
          )}
        </div>

        <button onClick={onLogout} className="mt-auto border border-red-500 text-red-500 p-2 rounded hover:bg-red-500 hover:text-white transition">Çıkış Yap</button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold capitalize">{activeTab} Paneli</h2>
          {realTimeNotice && <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full animate-pulse text-sm">🔔 {realTimeNotice}</div>}
          <span className="text-gray-500 font-medium italic">Hoş geldin, {user.username}</span>
        </header>

        {/* Dynamic Section */}
        <div className="p-6">
          {activeTab === 'frontoffice' && <FrontOffice />}
          {activeTab === 'hk' && <Housekeeping />}
          {activeTab === 'finance' && <Finance />}
          {activeTab === 'pos' && <POS />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
