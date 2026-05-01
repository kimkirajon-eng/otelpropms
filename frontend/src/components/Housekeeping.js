import React from 'react';

const Housekeeping = () => {
  const tasks = [
    { id: 101, staff: 'Ayşe K.', status: 'Temizlikte', progress: 65 },
    { id: 204, staff: 'Fatma Y.', status: 'Kirli', progress: 0 },
    { id: 305, staff: 'Mehmet T.', status: 'Denetleniyor', progress: 100 },
  ];

  return (
    <div className="module-container">
      <div className="module-header">
        <h2>Kat Hizmetleri Takibi</h2>
        <div className="stats-mini">5 Kirli Oda Bekliyor</div>
      </div>

      <div className="pms-table-card">
        <table className="pms-table">
          <thead>
            <tr>
              <th>ODA NO</th>
              <th>GÖREVLİ</th>
              <th>DURUM</th>
              <th>İLERLEME</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="bold">{task.id}</td>
                <td>{task.staff}</td>
                <td><span className={`badge ${task.status.toLowerCase()}`}>{task.status}</span></td>
                <td className="progress-cell">
                  <div className="progress-bar"><div className="fill" style={{width: `${task.progress}%`}}></div></div>
                  <span>%{task.progress}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .pms-table-card { background: white; border-radius: 30px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .pms-table { width: 100%; border-collapse: collapse; text-align: left; }
        .pms-table th { background: #1a1f36; color: white; padding: 20px; font-size: 0.7rem; font-weight: 800; letter-spacing: 1px; }
        .pms-table td { padding: 20px; border-bottom: 1px solid #f7fafc; font-size: 0.9rem; color: #4a5568; }
        .pms-table tr:hover { background: #fcfcfd; }
        .bold { font-weight: 900; color: #1a1f36 !important; font-size: 1.1rem !important; }
        
        .badge { padding: 5px 12px; border-radius: 10px; font-size: 0.65rem; font-weight: 800; }
        .badge.temizlikte { background: #ebf8ff; color: #4299e1; }
        .badge.kirli { background: #fff5f5; color: #f56565; }
        .badge.denetleniyor { background: #f0fff4; color: #48bb78; }

        .progress-cell { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 0.7rem; }
        .progress-bar { flex: 1; background: #edf2f7; h-height: 8px; border-radius: 10px; height: 8px; overflow: hidden; }
        .fill { background: #4299e1; height: 100%; transition: 0.5s; }
        .stats-mini { background: #fff5f5; color: #e53e3e; padding: 8px 15px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

export default Housekeeping;
