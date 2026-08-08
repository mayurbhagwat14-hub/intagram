import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-logo">Instagram</div>

      <div className="status-badge">
        <span className="status-dot"></span>
        Authenticated
      </div>

      <h2>Welcome back, <span className="username-highlight">{user.username}</span>!</h2>

      <p className="dashboard-desc">
        You have successfully authenticated. Your session is active and secure.
      </p>

      <div className="info-box">
        <h4>Session Details</h4>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Auth Method:</strong> Password Hashing (bcrypt)</p>
        <p><strong>Token:</strong> JWT Active</p>
      </div>

      <button onClick={onLogout} className="logout-btn" id="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
