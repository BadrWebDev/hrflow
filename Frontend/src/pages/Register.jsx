import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Registration failed. Please try again.'
      );
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
          <h1 className="brand-title">Join HRFlow</h1>
          <p className="brand-subtitle">Create your account and start managing your leave requests with ease. Join thousands of professionals already using HRFlow.</p>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                autoComplete="name"
              />
            </div>

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
                minLength="8"
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_confirmation">
                <span className="label-icon">🔐</span>
                Confirm Password
              </label>
              <input
                type="password"
                id="password_confirmation"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary btn-large" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="btn-secondary btn-large">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
