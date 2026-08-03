import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userApi from '../utils/userApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await userApi.post('/api/auth/forgot-password', { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '420px' }}>
      <Helmet>
        <title>Forgot Password | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.JPG" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Forgot Password</h3>
          <p className="text-muted small">Enter your email and we'll send you a reset code.</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 text-white"
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>

        <div className="text-center mt-4 small">
          <Link to="/login" className="text-muted">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
