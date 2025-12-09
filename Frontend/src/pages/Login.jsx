import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-brand">
          <div className="brand-logo">
            <span className="logo-icon">🌐</span>
            <span className="logo-text">HRFlow</span>
          </div>
          <h1 className="brand-title">Welcome Back</h1>
          <p className="brand-subtitle">Sign in to manage your workspace and track your leave requests efficiently</p>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon">🔒</span>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to HRFlow?</span>
          </div>

          <Link to="/register" className="btn-secondary btn-large">
            Create an account
          </Link>

          <div className="demo-credentials">
            <div className="demo-header">
              <span className="demo-icon">🎯</span>
              <strong>Quick Demo Access</strong>
            </div>
            <div className="demo-grid">
              <div className="demo-item">
                <span className="demo-role">Admin</span>
                <span className="demo-email">admin@hrflow.test</span>
                <span className="demo-pass">Admin1234</span>
              </div>
              <div className="demo-item">
                <span className="demo-role">Employee</span>
                <span className="demo-email">john@hrflow.test</span>
                <span className="demo-pass">password</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
