import React from 'react';

const Dashboard = ({ user, onLogout }) => {
  const username = user?.username || 'User';
  const initial = username.charAt(0).toUpperCase();

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="dashboard-card">
      <div className="dashboard-logo">Instagram</div>

      {/* Name Avatar (No photo, initial based avatar badge) */}
      <div className="profile-avatar-wrapper">
        <div className="name-avatar">{initial}</div>
        <span className="avatar-caption">Default Avatar (No Photo)</span>
      </div>

      <div className="status-badge">
        <span className="status-dot"></span>
        Authenticated & Verified
      </div>

      <h2>Welcome, <span className="username-highlight">{username}</span>!</h2>

      <p className="dashboard-desc">
        Your account is fully authenticated via standard MERN auth & JWT session.
      </p>

      <div className="info-box">
        <h4>User Profile & Account Info</h4>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
        <p><strong>Member Since:</strong> {formattedDate}</p>
        <p><strong>Auth Security:</strong> Bcrypt Password Hashing</p>
        <p><strong>Authorization:</strong> JWT Bearer Token Active</p>
      </div>

      <button onClick={onLogout} className="logout-btn" id="logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
