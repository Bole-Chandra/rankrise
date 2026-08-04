import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import userApi from '../utils/userApi';
import { useUserAuth } from '../context/UserAuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Signup = () => {
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);
  const navigate = useNavigate();
  const { login } = useUserAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.password.trim()) {
      setError('Password cannot be blank');
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.post('/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
      });
      navigate('/verify-email', {
        state: {
          email: formData.email,
          warning: res.data.emailSent === false ? res.data.message : null,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleError(null);
    try {
      const res = await userApi.post('/api/auth/google', { idToken: credential, role });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setGoogleError(err.response?.data?.message || 'Google sign-up failed.');
    }
  };

  return (
    <div className="container py-5 mt-4" style={{ maxWidth: '460px' }}>
      <Helmet>
        <title>Sign Up | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <img src="/assets/public/Rankriselogo.webp" alt="Rankrise" height="50" className="mb-3" />
          <h3 className="fw-bold" style={{ color: '#015927' }}>Create Your Account</h3>
          <p className="text-muted small">Join Rankrise to write and publish articles</p>
        </div>

        {/* Role toggle */}
        <div className="btn-group w-100 mb-4" role="group">
          <button
            type="button"
            className={`btn ${role === 'student' ? 'text-white' : 'btn-outline-secondary'}`}
            style={role === 'student' ? { background: '#015927' } : {}}
            onClick={() => setRole('student')}
          >
            I'm a Student
          </button>
          <button
            type="button"
            className={`btn ${role === 'teacher' ? 'text-white' : 'btn-outline-secondary'}`}
            style={role === 'teacher' ? { background: '#015927' } : {}}
            onClick={() => setRole('teacher')}
          >
            I'm a Teacher
          </button>
        </div>

        {role === 'teacher' && (
          <div className="alert alert-warning py-2 small">
            Teacher accounts require admin approval before you can log in. You'll get an email once approved.
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 small">
            {error}
            {error.toLowerCase().includes('already exists') && (
              <div className="mt-2">
                <Link to="/login" className="fw-bold" style={{ color: '#842029' }}>Log in instead</Link>
                {' · '}
                <Link to="/verify-email" state={{ email: formData.email }} className="fw-bold" style={{ color: '#842029' }}>
                  Verify email
                </Link>
              </div>
            )}
          </div>
        )}
        {googleError && <div className="alert alert-danger py-2 small">{googleError}</div>}

        <GoogleSignInButton onCredential={handleGoogleCredential} text="signup_with" />

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">OR</span>
          <hr className="flex-grow-1" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Confirm Password</label>
            <input type="password" name="confirmPassword" className="form-control" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-2 text-white"
            style={{ background: '#015927', borderRadius: '8px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Sign Up as ${role === 'student' ? 'Student' : 'Teacher'}`}
          </button>
        </form>

        <div className="text-center mt-4 small">
          Already have an account? <Link to="/login" style={{ color: '#015927', fontWeight: 'bold' }}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
