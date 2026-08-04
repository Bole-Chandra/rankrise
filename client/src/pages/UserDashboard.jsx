import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUserAuth } from '../context/UserAuthContext';
import userApi from '../utils/userApi';
import { getImageSrc } from '../utils/imageSrc';
import WriteBlogForm from '../components/WriteBlogForm';

const STATUS_STYLES = {
  Approved: { bg: '#e8f5e9', color: '#1e7e34', icon: 'fa-circle-check' },
  Pending: { bg: '#fff3e0', color: '#e65100', icon: 'fa-clock' },
  Rejected: { bg: '#fdecea', color: '#c62828', icon: 'fa-circle-xmark' },
};

const UserDashboard = () => {
  const { user, logout } = useUserAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const res = await userApi.get('/api/blogs/mine');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const handleSubmitted = () => {
    setShowWriteForm(false);
    setJustSubmitted(true);
    fetchMyBlogs();
    setTimeout(() => setJustSubmitted(false), 5000);
  };

  return (
    <div style={{ background: '#f8f9fa', minHeight: '80vh' }} className="py-5">
      <Helmet>
        <title>My Dashboard | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Profile header */}
        <div className="d-flex justify-content-between align-items-center bg-white shadow-sm rounded-4 p-4 mb-4">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: '#015927' }}>Hi, {user.name} 👋</h4>
            <span className="badge text-capitalize" style={{ background: '#015927' }}>{user.role}</span>
            {user.authProvider === 'google' && <span className="badge bg-secondary ms-2">Google Account</span>}
          </div>
          <button className="btn btn-outline-danger btn-sm fw-bold" onClick={logout}>
            <i className="fa-solid fa-right-from-bracket me-1"></i>Logout
          </button>
        </div>

        {user.role === 'teacher' && user.teacherStatus !== 'approved' && (
          <div className={`alert ${user.teacherStatus === 'rejected' ? 'alert-danger' : 'alert-warning'} mb-4`}>
            {user.teacherStatus === 'rejected'
              ? 'Your teacher account application was not approved. Please contact the admin for more information.'
              : 'Your teacher account is awaiting admin approval.'}
          </div>
        )}

        {justSubmitted && (
          <div className="alert alert-success mb-4">Your article has been submitted and is awaiting review!</div>
        )}

        {/* Write new article */}
        <div className="bg-white shadow-sm rounded-4 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0" style={{ color: '#015927' }}>
              <i className="fa-solid fa-pen-nib me-2"></i>Write a New Article
            </h5>
            <button
              className="btn btn-sm fw-bold text-white"
              style={{ background: '#015927' }}
              onClick={() => setShowWriteForm((v) => !v)}
            >
              {showWriteForm ? 'Close' : '+ New Article'}
            </button>
          </div>
          {showWriteForm && (
            <div className="mt-4">
              <WriteBlogForm onSubmitted={handleSubmitted} onCancel={() => setShowWriteForm(false)} />
            </div>
          )}
        </div>

        {/* My articles */}
        <div className="bg-white shadow-sm rounded-4 p-4">
          <h5 className="fw-bold mb-3" style={{ color: '#015927' }}>
            <i className="fa-solid fa-list me-2"></i>My Articles
          </h5>

          {loading ? (
            <div className="text-center py-4 text-muted">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="fa-solid fa-inbox fa-2x mb-2 d-block"></i>
              You haven't submitted any articles yet.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => {
                    const style = STATUS_STYLES[blog.status] || STATUS_STYLES.Pending;
                    return (
                      <tr key={blog._id}>
                        <td>
                          <img
                            src={getImageSrc(blog.image)}
                            alt={blog.title || 'Blog post cover image'}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </td>
                        <td className="fw-bold">{blog.title}</td>
                        <td className="text-muted small">{new Date(blog.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span
                            className="badge d-inline-flex align-items-center gap-1"
                            style={{ background: style.bg, color: style.color, fontWeight: 600 }}
                          >
                            <i className={`fa-solid ${style.icon}`}></i> {blog.status}
                          </span>
                          {blog.status === 'Rejected' && blog.rejectionReason && (
                            <div className="text-muted small mt-1">Reason: {blog.rejectionReason}</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
