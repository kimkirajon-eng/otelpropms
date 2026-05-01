import React, { useState } from 'react';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([
    { id: 101, staff: 'Ayşe K.', status: 'Cleaning', progress: 65, type: 'Suite' },
    { id: 104, staff: 'Fatma Y.', status: 'Dirty', progress: 0, type: 'Deluxe' },
    { id: 205, staff: 'Zeynep M.', status: 'Inspected', progress: 100, type: 'Standard' },
  ]);

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-800 underline decoration-blue-500 decoration-4">Kat Hizmetleri</h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Anlık Oda Temizlik ve Bakım Takibi</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                <span className="font-bold text-sm text-slate-600">5 Kirli Oda</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-6 uppercase text-[10px] tracking-widest font-black">Oda No</th>
              <th className="p-6 uppercase text-[10px] tracking-widest font-black">Görevli</th>
              <th className="p-6 uppercase text-[10px] tracking-widest font-black">Durum</th>
              <th className="p-6 uppercase text-[10px] tracking-widest font-black">İlerleme</th>
              <th className="p-6 uppercase text-[10px] tracking-widest font-black text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-6 font-black text-xl text-slate-800">{task.id} <span className="text-[10px] text-slate-400 block">{task.type}</span></td>
                <td className="p-6 font-bold text-slate-600">{task.staff}</td>
                <td className="p-6">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${task.status === 'Cleaning' ? 'bg-blue-100 text-blue-600' : task.status === 'Inspected' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-6 w-64">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${task.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-black text-slate-500">%{task.progress}</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <button className="bg-slate-100 p-2 rounded-lg hover:bg-orange-500 hover:text-white transition-all">⚙️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Housekeeping;
