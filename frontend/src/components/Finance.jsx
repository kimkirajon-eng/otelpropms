const Finance = () => {
  const transactions = [
    { id: 1, room: 101, service: 'Restaurant', amount: 450, date: '2023-10-27' },
    { id: 2, room: 101, service: 'Room Rate', amount: 2500, date: '2023-10-27' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold mb-6">Finansal Raporlar & Folio Takibi</h1>
      <table className="w-full text-left border-collapse bg-white shadow-md">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Oda</th><th className="p-3">Hizmet</th><th className="p-3">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{t.room}</td>
              <td className="p-3">{t.service}</td>
              <td className="p-3 font-bold text-green-600">{t.amount} TL</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
