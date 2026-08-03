import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userApi from '../utils/userApi';
import { useUserAuth } from '../context/UserAuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [info] = useState(useLocation().state?.message || null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUserAuth();

  // A single login form serves everyone — where it sends you depends on
  // the account's role. Admin accounts use a separate token/storage key
  // (matching the existing admin panel's own auth system) so the two never
  // interfere with each other.
  const routeAfterLogin = (token, user) => {
    if (user.role === 'admin') {
      localStorage.setItem('adminToken', token);
      navigate('/admin/dashboard');
    } else {
      login(token, user);
      navigate('/dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await userApi.post('/api/auth/login', { email, password });
      routeAfterLogin(res.data.token, res.data.user);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      if (message.toLowerCase().includes('verify your email')) {
        // Send them straight to the verification page instead of leaving
        // them stuck with no way to get there.
        navigate('/verify-email', { state: { email } });
        return;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError(null);
    try {
      // No role passed here — for an EXISTING account this is ignored anyway;
      // if it's actually a brand-new signup via Google, the backend will
      // ask for a role, which we handle by sending them to the signup flow.
      const res = await userApi.post('/api/auth/google', { idToken: credential });
      routeAfterLogin(res.data.token, res.data.user);
    } catch (err) {
      if (err.response?.data?.message?.includes('select whether')) {
        setError('No account found for this Google email yet — please use "Sign Up" and choose Student or Teacher first.');
      } else {
        setError(err.response?.data?.message || 'Google sign-in failed.');
      }
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '420px' }}>
      <Helmet>
        <title>Log In | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.JPG" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Log In</h3>
          <p className="text-muted small">Students, teachers & admin — one login, taken to the right place</p>
        </div>

        {info && <div className="alert alert-success py-2 small">{info}</div>}
        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <GoogleSignInButton onCredential={handleGoogleCredential} />

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-2">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="d-flex justify-content-between mb-4 small">
            <Link to="/verify-email" state={{ email }} style={{ color: '#015927' }}>Need to verify your email?</Link>
            <Link to="/forgot-password" style={{ color: '#015927' }}>Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 text-white"
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="text-center mt-4 small">
          Don't have an account? <Link to="/signup" style={{ color: '#015927', fontWeight: 'bold' }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
