import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: '450px' }}>
      <Helmet>
        <title>Admin Login | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Admin login for Rankrise Educational Institutions." />
      </Helmet>
      
      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.JPG" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Admin Portal</h3>
          <p className="text-muted small">Sign in to manage admissions & enquiries</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="e.g. admin@rankrise.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn w-100 fw-bold py-2 text-white" 
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'LOGIN'}
          </button>
        </form>

        <div className="text-center mt-4 text-muted" style={{ fontSize: '12px' }}>
          Default Credentials: <br />
          Email: <span className="fw-bold">admin@rankrise.in</span> | Pass: <span className="fw-bold">Rankrise@123</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
