import React, { useState, useEffect } from 'react';
import FrontOffice from '../components/FrontOffice';
import Housekeeping from '../components/Housekeeping';
import Finance from '../components/Finance';
import POS from '../components/POS';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('frontoffice');
  const [stats] = useState({ occupied: 42, dirty: 5, pendingRes: 12 });

  return (
    <div className="pms-container">
      {/* Yan Menü */}
      <aside className="pms-sidebar">
        <div className="pms-logo">
          <span className="logo-icon">H</span>
          <div className="logo-text">OTELPRO <span>PMS</span></div>
        </div>
        
        <nav className="pms-nav">
          <button className={activeTab === 'frontoffice' ? 'active' : ''} onClick={() => setActiveTab('frontoffice')}>🏨 Resepsiyon</button>
          <button className={activeTab === 'hk' ? 'active' : ''} onClick={() => setActiveTab('hk')}>🧹 Kat Hizmetleri</button>
          <button className={activeTab === 'finance' ? 'active' : ''} onClick={() => setActiveTab('finance')}>💰 Finans / Folio</button>
          <button className={activeTab === 'pos' ? 'active' : ''} onClick={() => setActiveTab('pos')}>🍽️ Restaurant POS</button>
        </nav>

        <div className="pms-user-box">
          <div className="user-avatar">{user?.username ? user.username[0].toUpperCase() : 'A'}</div>
          <div className="user-info">
            <strong>{user?.username || 'Yönetici'}</strong>
            <span>Master Admin</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>Çıkış</button>
        </div>
      </aside>

      {/* Ana Ekran */}
      <main className="pms-main">
        <header className="pms-header">
          <div className="header-stats">
            <div className="stat-item"><label>DOLU ODA</label><span className="blue">{stats.occupied}</span></div>
            <div className="stat-item"><label>KİRLİ</label><span className="red">{stats.dirty}</span></div>
            <div className="stat-item"><label>BEKLEYEN</label><span className="green">{stats.pendingRes}</span></div>
          </div>
          <div className="system-status">● Sistem Çevrimiçi</div>
        </header>

        <section className="pms-content">
          {activeTab === 'frontoffice' && <FrontOffice />}
          {activeTab === 'hk' && <Housekeeping />}
          {activeTab === 'finance' && <Finance />}
          {activeTab === 'pos' && <POS />}
        </section>
      </main>

      {/* GÖMÜLÜ CSS - TASARIM MOTORU BURASI */}
      <style>{`
        .pms-container { display: flex; h-height: 100vh; background: #f0f2f5; font-family: 'Inter', sans-serif; color: #1a1f36; height: 100vh; overflow: hidden; }
        .pms-sidebar { width: 280px; background: #1a1f36; color: white; display: flex; flex-direction: column; padding: 20px; box-shadow: 4px 0 15px rgba(0,0,0,0.1); }
        .pms-logo { display: flex; align-items: center; gap: 12px; padding: 20px 10px; margin-bottom: 30px; }
        .logo-icon { background: #ff4d00; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 900; transform: rotate(10deg); }
        .logo-text { font-weight: 900; font-size: 1.2rem; letter-spacing: -1px; }
        .logo-text span { color: #ff4d00; }
        
        .pms-nav { flex: 1; }
        .pms-nav button { width: 100%; text-align: left; padding: 15px; margin-bottom: 5px; background: none; border: none; color: #a0aec0; font-weight: 600; cursor: pointer; border-radius: 12px; transition: 0.3s; }
        .pms-nav button:hover { background: rgba(255,255,255,0.05); color: white; }
        .pms-nav button.active { background: #ff4d00; color: white; box-shadow: 0 10px 20px rgba(255,77,0,0.3); }

        .pms-user-box { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 20px; display: flex; align-items: center; gap: 12px; position: relative; }
        .user-avatar { width: 45px; height: 45px; background: linear-gradient(45deg, #ff4d00, #ff8000); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1.2rem; }
        .user-info strong { display: block; font-size: 0.9rem; }
        .user-info span { font-size: 0.7rem; color: #718096; text-transform: uppercase; font-weight: 800; }
        .logout-btn { margin-left: auto; background: none; border: 1px solid #4a5568; color: #fc8181; padding: 5px 10px; border-radius: 8px; cursor: pointer; font-size: 0.7rem; }

        .pms-main { flex: 1; display: flex; flex-direction: column; }
        .pms-header { height: 90px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #e2e8f0; }
        .header-stats { display: flex; gap: 40px; }
        .stat-item label { display: block; font-size: 0.6rem; font-weight: 900; color: #a0aec0; letter-spacing: 1.5px; margin-bottom: 4px; }
        .stat-item span { font-size: 1.5rem; font-weight: 900; }
        .stat-item .blue { color: #3182ce; }
        .stat-item .red { color: #e53e3e; }
        .stat-item .green { color: #38a169; }
        .system-status { font-size: 0.7rem; color: #38a169; font-weight: 800; animation: pulse 2s infinite; }

        .pms-content { flex: 1; padding: 40px; overflow-y: auto; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
