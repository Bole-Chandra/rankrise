import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { getImageSrc } from '../../utils/imageSrc';

const AdminBlogReview = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [previewBlog, setPreviewBlog] = useState(null);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/blogs/pending');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      setBusyId(id);
      await api.put(`/api/blogs/${id}/approve`);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setPreviewBlog(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve.');
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Optional: reason for rejection (shown to the author)') || '';
    try {
      setBusyId(id);
      await api.put(`/api/blogs/${id}/reject`, { reason });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      setPreviewBlog(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
          <i className="fa-solid fa-file-circle-check me-2"></i>Blog Submissions Awaiting Review
        </h5>
        <button className="btn btn-sm btn-outline-success fw-bold" onClick={fetchPending}>
          <i className="fa-solid fa-rotate-right me-1"></i>Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center text-muted py-5">Loading...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
          <p>No articles are waiting for review.</p>
        </div>
      ) : (
        <div className="row g-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-md-6">
              <div className="border rounded-3 p-3 h-100 d-flex flex-column">
                <div className="d-flex gap-3">
                  <img
                    src={getImageSrc(blog.image)}
                    alt={blog.title}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                  />
                  <div>
                    <div className="fw-bold">{blog.title}</div>
                    <div className="text-muted small">
                      By {blog.authorId?.name || blog.author} ({blog.authorId?.role || blog.authorRole})
                    </div>
                    <div className="text-muted small">{new Date(blog.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                {blog.summary && <p className="small text-muted mt-2 mb-2">{blog.summary}</p>}
                <div className="mt-auto d-flex gap-2 pt-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setPreviewBlog(blog)}>
                    Preview
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    disabled={busyId === blog._id}
                    onClick={() => handleApprove(blog._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={busyId === blog._id}
                    onClick={() => handleReject(blog._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {previewBlog && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
          onClick={() => setPreviewBlog(null)}
        >
          <div
            className="bg-white rounded-4 p-4"
            style={{ maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h4 className="fw-bold">{previewBlog.title}</h4>
              <button className="btn-close" onClick={() => setPreviewBlog(null)}></button>
            </div>
            {previewBlog.image && (
              <img src={getImageSrc(previewBlog.image)} alt={previewBlog.title} className="img-fluid rounded-3 mb-3" />
            )}
            <div dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogReview;
