import React, { useState } from 'react';
import { register } from '../api';
import logoImg from '../assets/250px-Instagram_logo_2016.svg.webp';

const Register = ({ onSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [showMoreFields, setShowMoreFields] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await register({
        username,
        password,
        fullName: fullName || username,
        email,
        bio: bio || undefined,
        location: location || undefined,
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (onSuccess) {
        onSuccess(data.user, data.token);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <img src={logoImg} alt="Instagram Logo" className="logo-image" />
      <h1 className="brand-title">Instagram</h1>

      <p className="auth-subtitle">Sign up to see photos and videos from your friends.</p>

      {error && <div className="error-badge">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Username */}
        <div className="input-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Username (e.g. john_doe)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>

        {/* Full Name */}
        <div className="input-group">
          <label htmlFor="reg-fullname">Full Name</label>
          <input
            id="reg-fullname"
            type="text"
            placeholder="Full Name (e.g. John Doe)"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email Address */}
        <div className="input-group">
          <label htmlFor="reg-email">Email Address</label>
          <input
            id="reg-email"
            type="email"
            placeholder="Mobile Number or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div className="input-group password-wrapper">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 chars)"
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

        {/* Confirm Password */}
        <div className="input-group password-wrapper">
          <label htmlFor="reg-confirm-password">Confirm Password</label>
          <input
            id="reg-confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        {/* Expandable Extra Details */}
        <button
          type="button"
          className="extra-fields-toggle"
          onClick={() => setShowMoreFields(!showMoreFields)}
        >
          {showMoreFields ? '▲ Hide extra profile details' : '▼ Add Bio & Location (Optional)'}
        </button>

        {showMoreFields && (
          <div className="extra-fields-container">
            <div className="input-group">
              <input
                type="text"
                placeholder="Short Bio / Status (e.g. Web Developer 🚀)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                placeholder="Location (e.g. Mumbai, India 📍)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          id="register-submit-btn"
          disabled={loading || !username || !password || !confirmPassword}
        >
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

      <p className="switch-text">
        Have an account?{' '}
        <span onClick={onSwitch} className="switch-link" role="button" tabIndex={0}>
          Log in
        </span>
      </p>

      <div className="meta-footer">
        <span className="meta-infinity">∞</span>
        <span className="meta-logo">Meta</span>
      </div>
    </div>
  );
};

export default Register;
