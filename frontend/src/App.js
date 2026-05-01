import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Ana uygulama mantığı
const AppContent = () => {
  const [user, setUser] = useState(null); // Role: 'admin', 'hk', 'reception', 'finance'

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
};

// AuthProvider ile sarmalanmış ana bileşen
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
