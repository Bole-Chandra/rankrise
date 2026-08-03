import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import quill styles
import { compressImage } from '../../utils/imageCompressor';
import { getImageSrc } from '../../utils/imageSrc';

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [author, setAuthor] = useState('Admin');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  
  const fileInputRef = useRef();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (title && !editingId) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, editingId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setSlug(blog.slug);
    setAuthor(blog.author || 'Admin');
    setSummary(blog.summary || '');
    setTags(blog.tags ? blog.tags.join(', ') : '');
    setContent(blog.content);
    setPreview(getImageSrc(blog.image));
    setImageFile(null);
    window.scrollTo(0, 0);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setAuthor('Admin');
    setSummary('');
    setTags('');
    setContent('');
    setImageFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !slug || !content) {
      alert('Title, slug, and content are required');
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('author', author);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('tags', tags.split(',').map(t => t.trim()).filter(t => t).join(','));
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (preview && !editingId) {
        // Fallback for some edge cases, though preview usually means imageFile exists
      }

      const token = localStorage.getItem('adminToken');
      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (editingId) {
        await api.put(`/api/blogs/${editingId}`, formData, { headers });
        alert('Blog updated successfully!');
      } else {
        await api.post('/api/blogs', formData, { headers });
        alert('Blog created successfully!');
        setCurrentPage(1); // Go to first page on new creation
      }

      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert('Failed to save blog. ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await api.delete(`/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(blogs.filter(b => b._id !== id));
      if (editingId === id) resetForm();
      
      const newTotalPages = Math.ceil((blogs.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete blog');
    }
  };

  // React-Quill modules configuration for toolbar
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  if (loading) return <div className="text-center py-4">Loading Blogs...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0" style={{ color: '#015927' }}>Blog Management</h4>
        <span className="badge bg-success fs-6">{blogs.length} Published Blogs</span>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card shadow-sm border-0 mb-5" style={{ borderRadius: '15px' }}>
        <div className="card-header bg-white border-bottom-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold m-0 text-success">
            <i className={`fa-solid ${editingId ? 'fa-pen' : 'fa-plus'} me-2`}></i>
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h5>
          {editingId && (
            <button className="btn btn-sm btn-outline-secondary" onClick={resetForm}>
              Cancel Editing
            </button>
          )}
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-muted small text-uppercase">Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-muted small text-uppercase">URL Slug * (auto-generated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold text-muted small text-uppercase">Author</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="col-md-8 mb-3">
                <label className="form-label fw-bold text-muted small text-uppercase">Tags (comma separated)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. NEET, Tips, Result"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-bold text-muted small text-uppercase">Short Summary</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A brief excerpt for the blog preview card"
                />
              </div>

              <div className="col-12 mb-4">
                <label className="form-label fw-bold text-muted small text-uppercase">Cover Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  required={!editingId && !preview}
                />
                {preview && (
                  <div className="mt-3">
                    <img src={preview} alt="Preview" className="img-thumbnail shadow-sm" style={{ maxHeight: '200px', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className="col-12 mb-4">
                <label className="form-label fw-bold text-muted small text-uppercase">Main Content *</label>
                <div style={{ minHeight: '300px', marginBottom: '50px' }}>
                  <ReactQuill 
                    theme="snow" 
                    value={content} 
                    onChange={setContent} 
                    modules={modules}
                    style={{ height: '300px' }}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-lg w-100 fw-bold mt-4" 
              style={{ background: '#015927', color: '#fff' }}
              disabled={submitting}
            >
              {submitting ? (
                 <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
              ) : (editingId ? 'Update Blog Post' : 'Publish Blog Post')}
            </button>
          </form>
        </div>
      </div>

      <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4 border-bottom pb-3"><i className="fa-solid fa-list-check me-2 text-success"></i>Manage Published Blogs</h5>
          <div className="row g-4 mb-4">
            {blogs.length === 0 ? (
              <div className="col-12 text-center text-muted py-5">
                <i className="fa-solid fa-file-pen fs-1 mb-3"></i>
                <p>No blogs published yet.</p>
              </div>
            ) : (
              currentBlogs.map(blog => (
                <div className="col-md-6 col-lg-4" key={blog._id}>
                  <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                    {blog.image && (
                      <img 
                        src={getImageSrc(blog.image)} 
                        alt={blog.title} 
                        className="card-img-top"
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary mb-2 align-self-start">{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <h5 className="card-title fw-bold" style={{ fontSize: '16px' }}>{blog.title}</h5>
                      <p className="card-text small text-muted mb-3 flex-grow-1">
                        {blog.summary || (blog.content.replace(/<[^>]+>/g, '').substring(0, 100) + '...')}
                      </p>
                      <div className="d-flex justify-content-between mt-auto pt-3 border-top">
                        <button className="btn btn-sm btn-primary fw-bold px-3" onClick={() => handleEdit(blog)}>
                          <i className="fa-solid fa-pen me-1"></i> Edit
                        </button>
                        <button className="btn btn-sm btn-danger fw-bold px-3" onClick={() => handleDelete(blog._id)}>
                          <i className="fa-solid fa-trash me-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav aria-label="Blogs pagination" className="d-flex justify-content-center mt-4 border-top pt-4">
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button 
                      className="page-link shadow-sm" 
                      onClick={() => setCurrentPage(i + 1)}
                      style={currentPage === i + 1 ? { backgroundColor: '#015927', borderColor: '#015927' } : {}}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlogs;
