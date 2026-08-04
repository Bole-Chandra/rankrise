import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { getImageSrc } from '../../utils/imageSrc';

const CATEGORIES = ['Events', 'Campus', 'Results', 'Achievements', 'Other'];

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null); // item being edited
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const itemsPerPage = 12;

  // Upload form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Events');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef();

  const getToken = () => localStorage.getItem('adminToken');

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/gallery');
      setItems(res.data);
    } catch (err) {
      setError('Failed to load gallery. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGallery(); }, []);

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
    else { setError(msg); setTimeout(() => setError(''), 5000); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetUploadForm = () => {
    setTitle(''); setCategory('Events'); setImageFile(null); setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) { showMsg('error', 'Please select an image file.'); return; }
    if (!title.trim()) { showMsg('error', 'Please enter a title.'); return; }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category);
      formData.append('image', imageFile);
      await api.post('/api/gallery', formData, {
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
      });
      showMsg('success', 'Image uploaded successfully!');
      resetUploadForm();
      setCurrentPage(1);
      fetchGallery();
    } catch (err) {
      showMsg('error', 'Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image? This cannot be undone.')) return;
    try {
      await api.delete(`/api/gallery/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showMsg('success', 'Image deleted.');
      setItems(prev => prev.filter(i => i._id !== id));
      if (editItem?._id === id) setEditItem(null);
    } catch (err) {
      showMsg('error', 'Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setEditImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdateTitle = async (id, newTitle, newCategory) => {
    try {
      const token = getToken();
      const formData = new FormData();
      formData.append('title', newTitle);
      formData.append('category', newCategory);
      if (editImageFile) formData.append('image', editImageFile);

      const res = await api.put(`/api/gallery/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setItems(prev => prev.map(i => i._id === id ? res.data : i));
      setEditItem(null);
      setEditImageFile(null);
      setEditImagePreview('');
      showMsg('success', 'Updated successfully!');
    } catch (err) {
      showMsg('error', 'Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filtered + paginated
  const filtered = items.filter(i => {
    const matchSearch = i.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'All' || i.category === filterCat;
    return matchSearch && matchCat;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
            <i className="fa-solid fa-images me-2"></i>Photo Gallery Management
          </h4>
          <p className="text-muted small mb-0 mt-1">{items.length} total images</p>
        </div>
      </div>

      {success && <div className="alert alert-success border-0 shadow-sm py-2">{success}</div>}
      {error && <div className="alert alert-danger border-0 shadow-sm py-2">{error}</div>}

      <div className="row g-4">
        {/* ── Upload Form ── */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: '80px' }}>
            <h6 style={{ color: '#015927', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload New Image
            </h6>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Image Title *</label>
                <input type="text" className="form-control" placeholder="e.g. JEE Toppers 2024" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Image File *</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
              </div>
              {preview && (
                <div className="mb-3 text-center">
                  <img src={preview} alt="Preview" style={{ maxHeight: '160px', borderRadius: '10px', objectFit: 'cover', width: '100%' }} />
                </div>
              )}
              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{ background: '#015927', color: '#fff200', borderRadius: '8px', padding: '10px' }}
                disabled={submitting}
              >
                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</> : <><i className="fa-solid fa-upload me-2"></i>Upload Image</>}
              </button>
              {imageFile && (
                <button type="button" className="btn btn-link text-danger w-100 mt-1 small" onClick={resetUploadForm}>
                  Clear selection
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ── Gallery Grid ── */}
        <div className="col-lg-8">
          {/* Search & Filter */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search images..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={filterCat} onChange={e => { setFilterCat(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 text-muted">Loading gallery...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <i className="fa-regular fa-images fa-3x text-muted mb-3 d-block"></i>
              <p className="text-muted">{items.length === 0 ? 'No images yet. Upload your first image!' : 'No images match your search.'}</p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {paginated.map(item => (
                  <div key={item._id} className="col-sm-6 col-lg-4">
                    <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ height: '160px', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={getImageSrc(item.image)}
                          alt={item.title || 'Gallery photo'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => e.target.src = '/assets/public/Rankriselogo.webp'}
                        />
                        <span style={{
                          position: 'absolute', top: '8px', right: '8px',
                          background: 'rgba(0,0,0,0.6)', color: '#fff',
                          fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                          borderRadius: '10px'
                        }}>{item.category}</span>
                      </div>
                      <div style={{ padding: '12px' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#333', margin: '0 0 10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={item.title}>
                          {item.title}
                        </p>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm flex-grow-1 fw-bold"
                            style={{ background: '#e8f5e9', color: '#015927', border: '1px solid #c8e6c9', fontSize: '0.75rem' }}
                            onClick={() => setEditItem({ ...item })}
                          >
                            <i className="fa-solid fa-pen me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm fw-bold"
                            style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '0.75rem' }}
                            onClick={() => handleDelete(item._id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                    <i className="fa-solid fa-chevron-left me-1"></i>Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-success' : 'btn-outline-secondary'}`} onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  ))}
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                    Next<i className="fa-solid fa-chevron-right ms-1"></i>
                  </button>
                </div>
              )}
              <p className="text-muted small text-center mt-2">Showing {paginated.length} of {filtered.length} images</p>
            </>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 800, margin: 0 }}>Edit Image Details</h5>
              <button className="btn-close" onClick={() => setEditItem(null)}></button>
            </div>
            <img src={editImagePreview || getImageSrc(editItem.image)} alt={editItem.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', marginBottom: '12px' }}
              onError={e => e.target.src = '/assets/public/Rankriselogo.webp'} />
            <div className="mb-3">
              <label className="form-label fw-bold small text-uppercase text-muted">Replace Image (optional)</label>
              <input type="file" accept="image/*" className="form-control" onChange={handleEditImageChange} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold small text-uppercase text-muted">Title</label>
              <input type="text" className="form-control" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
              <select className="form-select" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn fw-bold flex-grow-1" style={{ background: '#015927', color: '#fff200' }} onClick={() => handleUpdateTitle(editItem._id, editItem.title, editItem.category)}>
                <i className="fa-solid fa-check me-2"></i>Save Changes
              </button>
              <button className="btn btn-outline-secondary fw-bold" onClick={() => { setEditItem(null); setEditImageFile(null); setEditImagePreview(''); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
