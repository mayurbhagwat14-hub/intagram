import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import { getMe } from './api';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getMe();
          if (data?.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('login');
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }}></div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onUserUpdate={handleUserUpdate}
        />
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
