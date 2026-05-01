import React from 'react';

const Finance = () => {
  const data = [
    { room: 101, guest: 'Can Yılmaz', amount: '₺4.200', status: 'Ödenmedi' },
    { room: 302, guest: 'Ece Su', amount: '₺1.500', status: 'Ödendi' },
  ];

  return (
    <div className="module-container">
      <div className="finance-grid">
        <div className="card summary-card">
          <label>GÜNLÜK TOPLAM CİRO</label>
          <h3>₺12.450</h3>
        </div>
        <div className="card detail-card">
            <label>AÇIK FOLYO SAYISI</label>
            <h3>12</h3>
        </div>
      </div>

      <div className="transaction-list">
        <h3>Son İşlemler</h3>
        {data.map((item, i) => (
          <div key={i} className="t-item">
            <div className="t-icon">{item.room}</div>
            <div className="t-info">
              <strong>{item.guest}</strong>
              <span>Folio Kaydı</span>
            </div>
            <div className="t-amount">
              <strong>{item.amount}</strong>
              <span className={item.status === 'Ödendi' ? 'paid' : 'unpaid'}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .finance-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .card { padding: 30px; border-radius: 25px; color: white; }
        .summary-card { background: #38a169; box-shadow: 0 10px 20px rgba(56,161,105,0.2); }
        .detail-card { background: white; color: #1a1f36; border: 1px solid #e2e8f0; }
        .card label { font-size: 0.7rem; font-weight: 800; opacity: 0.8; letter-spacing: 1px; }
        .card h3 { font-size: 2.5rem; font-weight: 900; margin: 10px 0 0; }

        .transaction-list { background: white; padding: 30px; border-radius: 30px; border: 1px solid #e2e8f0; }
        .transaction-list h3 { margin-bottom: 20px; font-weight: 900; }
        .t-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #f7fafc; }
        .t-icon { width: 50px; height: 50px; background: #edf2f7; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #a0aec0; }
        .t-info { flex: 1; }
        .t-info strong { display: block; font-size: 1rem; color: #2d3748; }
        .t-info span { font-size: 0.7rem; color: #a0aec0; font-weight: 700; }
        .t-amount { text-align: right; }
        .t-amount strong { display: block; font-size: 1.1rem; color: #1a1f36; }
        .t-amount span { font-size: 0.6rem; font-weight: 900; text-transform: uppercase; }
        .t-amount span.paid { color: #38a169; }
        .t-amount span.unpaid { color: #e53e3e; }
      `}</style>
    </div>
  );
};

export default Finance;
