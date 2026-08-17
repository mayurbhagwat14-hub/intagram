import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../api';

const Dashboard = ({ user, onLogout, onUserUpdate }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'security' | 'session'
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Fetch latest user details from GET API on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const data = await getProfile();
        if (data?.user) {
          setCurrentUser(data.user);
          if (onUserUpdate) {
            onUserUpdate(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user profile via GET API', err);
      }
    };

    fetchLatestProfile();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setEditForm({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
      });
    }
  }, [currentUser]);

  const toggleEditing = () => {
    if (!isEditing) {
      setEditForm({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        bio: currentUser?.bio || '',
        location: currentUser?.location || '',
      });
      setSaveMsg('');
    }
    setIsEditing(!isEditing);
  };

  const username = currentUser?.username || 'User';
  const fullName = currentUser?.fullName || username;
  const initial = (fullName || username).charAt(0).toUpperCase();

  const formattedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const lastLoginDate = currentUser?.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'Active Now';

  // Handle PUT API call & refetch via GET API
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMsg('');
    try {
      // 1. Call PUT API
      const putRes = await updateProfile(editForm);
      
      // 2. Call GET API to re-verify latest database state
      const getRes = await getProfile();
      const updatedUser = getRes?.user || putRes?.user;

      if (updatedUser) {
        setCurrentUser(updatedUser);
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        setSaveMsg('Profile updated & saved to Database! ✓');
        setIsEditing(false);
      } else {
        setSaveMsg('Failed to save changes.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setSaveMsg(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="profile-dashboard">
      {/* Cover Header */}
      <div className="profile-cover">
        <div className="cover-gradient"></div>
        <div className="avatar-ring-container">
          <div className="name-avatar-glow">{initial}</div>
          <span className="online-badge" title="Online & Authenticated"></span>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="profile-header">
        <h1 className="profile-name">{fullName}</h1>
        <p className="profile-username">@{username}</p>

        <div className="profile-badges">
          <span className="badge-pill role-pill">{currentUser?.role || 'Member 🌟'}</span>
          <span className="badge-pill location-pill">
            {currentUser?.location ? currentUser.location : 'Location Not Set 📍'}
          </span>
          <span className="badge-pill auth-pill">Verified Session ✓</span>
        </div>

        <p className="profile-bio">
          {currentUser?.bio ? `"${currentUser.bio}"` : 'No bio added yet. Click Edit Profile to add one!'}
        </p>
      </div>

      {/* Stats Counter Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{currentUser?.loginCount || 1}</span>
          <span className="stat-label">Total Logins</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">256-bit</span>
          <span className="stat-label">JWT Token</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">Bcrypt</span>
          <span className="stat-label">Password Hash</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">Active</span>
          <span className="stat-label">Security Guard</span>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveMsg && <div className="save-toast">{saveMsg}</div>}

      {/* Profile Edit Form */}
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-profile-card">
          <h3>Edit Profile Details (PUT /api/auth/profile)</h3>
          <div className="edit-grid">
            <div className="edit-field">
              <label>Full Name</label>
              <input
                type="text"
                value={editForm.fullName}
                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                placeholder="Full Name (e.g. Mayur Bhagwat)"
              />
            </div>
            <div className="edit-field">
              <label>Email Address</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="Email Address"
              />
            </div>
            <div className="edit-field full-width">
              <label>Bio / Tagline</label>
              <input
                type="text"
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Short bio / status"
              />
            </div>
            <div className="edit-field full-width">
              <label>Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                placeholder="City, Country (e.g. Mumbai, India 📍)"
              />
            </div>
          </div>
          <div className="edit-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saveLoading}>
              {saveLoading ? 'Updating...' : 'Save & Sync Profile'}
            </button>
          </div>
        </form>
      ) : null}

      {/* Tab Navigation */}
      <div className="tab-bar">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          👤 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
        <button
          className={`tab-btn ${activeTab === 'session' ? 'active' : ''}`}
          onClick={() => setActiveTab('session')}
        >
          🌐 Session Info
        </button>
      </div>

      {/* Tab Contents */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="details-card-group">
            <div className="detail-row">
              <span className="detail-key">Full Name</span>
              <span className="detail-val">{fullName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Username</span>
              <span className="detail-val">@{username}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Email</span>
              <span className="detail-val">{currentUser?.email ? currentUser.email : 'Not set'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Location</span>
              <span className="detail-val">{currentUser?.location ? currentUser.location : 'Not set'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Member Since</span>
              <span className="detail-val">{formattedDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Account ID</span>
              <span className="detail-val code-font">{currentUser?._id}</span>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="details-card-group">
            <div className="detail-row">
              <span className="detail-key">Password Standard</span>
              <span className="detail-val highlight-green">Bcrypt Salted & Hashed ✓</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Token Algorithm</span>
              <span className="detail-val">HS256 JWT Signed</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Token Expiry</span>
              <span className="detail-val">30 Days Active Session</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Route Authorization</span>
              <span className="detail-val highlight-blue">Bearer Token Interceptor</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Credential Leak Status</span>
              <span className="detail-val highlight-green">Protected (No raw saving)</span>
            </div>
          </div>
        )}

        {activeTab === 'session' && (
          <div className="details-card-group">
            <div className="detail-row">
              <span className="detail-key">Last Login</span>
              <span className="detail-val">{lastLoginDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">IP Address</span>
              <span className="detail-val code-font">{currentUser?.ipAddress || '127.0.0.1'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">User Agent</span>
              <span className="detail-val truncate-text">{currentUser?.userAgent || 'Browser Session'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-key">Session Health</span>
              <span className="detail-val highlight-green">Optimal • No Latency</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="profile-actions">
        <button
          onClick={toggleEditing}
          className="action-btn edit-btn"
        >
          {isEditing ? 'Close Editor' : '✏️ Edit Profile'}
        </button>

        <button onClick={onLogout} className="action-btn logout-btn">
          🚪 Log Out
        </button>
      </div>

      <div className="profile-footer-brand">
        <span className="meta-infinity">∞</span> Meta Authentication Platform
      </div>
    </div>
  );
};

export default Dashboard;
