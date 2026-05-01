const POS = () => {
  const items = ['Burger', 'Pizza', 'Cola', 'Coffee'];
  
  return (
    <div className="flex h-screen">
      <div className="w-2/3 grid grid-cols-3 gap-4 p-4">
        {items.map(item => (
          <button key={item} className="h-32 bg-gray-200 rounded-xl text-xl font-semibold shadow hover:bg-orange-400 transition-colors">
            {item}
          </button>
        ))}
      </div>
      <div className="w-1/3 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <h2 className="text-xl font-bold border-b pb-4">Adisyon #4502</h2>
        <div className="text-2xl mt-4">Toplam: 0.00 TL</div>
        <button className="w-full bg-green-600 py-4 rounded-lg font-bold text-xl">Odaya Aktar</button>
      </div>
    </div>
  );
};
