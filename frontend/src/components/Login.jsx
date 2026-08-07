import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onSuccess, onSwitch }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(username, password);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2 className="title">Account Sign In</h2>
      <p className="subtitle">Enter your credentials to access your account</p>

      {error && <div className="error-badge">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="username">Username or Email</label>
          <input
            id="username"
            type="text"
            placeholder="Enter username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="switch-text">
        Don't have an account?{' '}
        <span onClick={onSwitch} className="switch-link">
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
