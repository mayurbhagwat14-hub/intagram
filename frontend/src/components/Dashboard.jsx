import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  return (
    <div className="dashboard-card">
      <div className="status-badge">Authenticated</div>
      <h2>Welcome back, <span className="username-highlight">{user.username}</span>!</h2>
      <p className="dashboard-desc">
        You have successfully authenticated via JWT. Your credentials are securely managed and protected.
      </p>

      <div className="info-box">
        <h4>Session Details</h4>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Auth Method:</strong> Password Hashing (bcrypt)</p>
      </div>

      <button onClick={onLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
