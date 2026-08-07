import React, { useState } from 'react';
import { register } from '../api';

const Register = ({ onSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      const data = await register(username, password);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="title">Create Account</h2>
      <p className="subtitle">Sign up to get started</p>

      {error && <div className="error-badge">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="reg-username">Username or Email</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Choose username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="Choose password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="switch-text">
        Already have an account?{' '}
        <span onClick={onSwitch} className="switch-link">
          Sign In
        </span>
      </p>
    </div>
  );
};

export default Register;
