import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userApi from '../utils/userApi';
import { useUserAuth } from '../context/UserAuthContext';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUserAuth();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(location.state?.warning || null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await userApi.post('/api/auth/verify-otp', { email, otp });
      if (res.data.awaitingApproval) {
        navigate('/login', { state: { message: res.data.message } });
      } else {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      const res = await userApi.post('/api/auth/resend-otp', { email, purpose: 'verify_email' });
      if (res.data.emailSent === false) {
        setError(res.data.message);
      } else {
        setInfo(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '420px' }}>
      <Helmet>
        <title>Verify Your Email | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.JPG" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Verify Your Email</h3>
          <p className="text-muted small">Enter the 6-digit code we sent to your email.</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {info && <div className="alert alert-success py-2 small">{info}</div>}

        <form onSubmit={handleVerify}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Verification Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="form-control text-center fw-bold"
              style={{ fontSize: '24px', letterSpacing: '8px' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 text-white"
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center mt-3 small">
          Didn't get a code?{' '}
          <button className="btn btn-link p-0 small fw-bold" style={{ color: '#015927' }} onClick={handleResend} disabled={resending}>
            {resending ? 'Sending...' : 'Resend Code'}
          </button>
        </div>

        <div className="text-center mt-2 small">
          <Link to="/login" className="text-muted">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
