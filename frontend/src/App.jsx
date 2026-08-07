import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' | 'register'

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };

  return (
    <div className="app-container">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : view === 'login' ? (
        <Login
          onSuccess={handleAuthSuccess}
          onSwitch={() => setView('register')}
        />
      ) : (
        <Register
          onSuccess={handleAuthSuccess}
          onSwitch={() => setView('login')}
        />
      )}
    </div>
  );
}

export default App;
