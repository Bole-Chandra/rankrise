import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userApi from '../utils/userApi';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [info, setInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userApi.post('/api/auth/reset-password', { email, otp, newPassword });
      navigate('/login', { state: { message: 'Password reset successfully. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    setResending(true);
    try {
      const res = await userApi.post('/api/auth/resend-otp', { email, purpose: 'reset_password' });
      setInfo(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '420px' }}>
      <Helmet>
        <title>Reset Password | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.JPG" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Reset Password</h3>
          <p className="text-muted small">Enter the code we sent you and choose a new password.</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {info && <div className="alert alert-success py-2 small">{info}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Reset Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="form-control text-center fw-bold"
              style={{ fontSize: '22px', letterSpacing: '6px' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">New Password</label>
            <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Confirm New Password</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 text-white"
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword;
