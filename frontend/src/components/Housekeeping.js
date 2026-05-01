const Housekeeping = () => {
  const updateStatus = (id, status) => {
    // API Call to /hk/update-status
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold border-b pb-2 mb-4">Kat Hizmetleri Görev Listesi</h1>
      <div className="space-y-4">
        {[101, 102, 201].map(id => (
          <div key={id} className="flex justify-between items-center p-3 border rounded shadow">
            <span>Oda {id}</span>
            <div className="flex gap-2">
              <button onClick={() => updateStatus(id, 'Cleaning')} className="bg-yellow-500 text-white px-3 py-1 rounded">Temizlikte</button>
              <button onClick={() => updateStatus(id, 'Clean')} className="bg-green-500 text-white px-3 py-1 rounded">Hazır</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Housekeeping;
