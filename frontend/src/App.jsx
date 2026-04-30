import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const App = () => {
  const [user, setUser] = useState(null); // Role: 'admin', 'hk', 'reception', 'finance'

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
};

export default App;
