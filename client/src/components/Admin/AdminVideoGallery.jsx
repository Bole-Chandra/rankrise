import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { getImageSrc } from '../../utils/imageSrc';

const VIDEO_CATEGORIES = ['General', 'Campus Tour', 'Student Testimonials', 'Events', 'Results', 'Other'];

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const AdminVideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null); // for full-screen preview
  const itemsPerPage = 9;

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [uploadType, setUploadType] = useState('youtube');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const fileInputRef = useRef();

  const getToken = () => localStorage.getItem('adminToken');

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/videos');
      setVideos(res.data);
    } catch (err) {
      setError('Failed to load videos. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
    else { setError(msg); setTimeout(() => setError(''), 5000); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) { showMsg('error', 'Video must be under 100MB'); return; }
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle(''); setCategory('General'); setUploadType('youtube');
    setYoutubeUrl(''); setVideoFile(null); setVideoPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { showMsg('error', 'Please enter a video title.'); return; }

    try {
      setSubmitting(true);
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (uploadType === 'youtube') {
        if (!youtubeUrl.trim()) { showMsg('error', 'Please enter a YouTube URL.'); setSubmitting(false); return; }
        const ytId = getYouTubeId(youtubeUrl);
        if (!ytId) { showMsg('error', 'Invalid YouTube URL. Please check and try again.'); setSubmitting(false); return; }
        await api.post('/api/videos', {
          title: title.trim(), category,
          type: 'youtube', videoUrl: youtubeUrl,
          thumbnail: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        }, { headers });
      } else {
        if (!videoFile) { showMsg('error', 'Please select a video file.'); setSubmitting(false); return; }
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('category', category);
        formData.append('type', 'upload');
        formData.append('video', videoFile);
        await api.post('/api/videos', formData, {
          headers: { ...headers, 'Content-Type': 'multipart/form-data' },
          timeout: 300000
        });
      }

      showMsg('success', 'Video added successfully!');
      resetForm();
      setCurrentPage(1);
      fetchVideos();
    } catch (err) {
      showMsg('error', 'Failed to add video: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this video? This cannot be undone.')) return;
    try {
      await api.delete(`/api/videos/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setVideos(prev => prev.filter(v => v._id !== id));
      if (editItem?._id === id) setEditItem(null);
      showMsg('success', 'Video deleted.');
    } catch (err) {
      showMsg('error', 'Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdate = async (id, newTitle, newCategory) => {
    try {
      await api.put(`/api/videos/${id}`, { title: newTitle, category: newCategory }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setVideos(prev => prev.map(v => v._id === id ? { ...v, title: newTitle, category: newCategory } : v));
      setEditItem(null);
      showMsg('success', 'Updated successfully!');
    } catch (err) {
      showMsg('error', 'Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = videos.filter(v => {
    const matchSearch = v.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = filterCat === 'All' || v.category === filterCat;
    return matchSearch && matchCat;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const ytId = getYouTubeId(youtubeUrl);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
            <i className="fa-solid fa-video me-2"></i>Video Gallery Management
          </h4>
          <p className="text-muted small mb-0 mt-1">{videos.length} total videos</p>
        </div>
      </div>

      {success && <div className="alert alert-success border-0 shadow-sm py-2">{success}</div>}
      {error && <div className="alert alert-danger border-0 shadow-sm py-2">{error}</div>}

      <div className="row g-4">
        {/* ── Add Video Form ── */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: '80px' }}>
            <h6 style={{ color: '#015927', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fa-solid fa-plus me-2"></i>Add New Video
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase">Video Title *</label>
                <input type="text" className="form-control" placeholder="e.g. Campus Tour 2024" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Type Toggle */}
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase">Video Source</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn flex-grow-1 fw-bold ${uploadType === 'youtube' ? '' : 'btn-outline-danger'}`}
                    style={uploadType === 'youtube' ? { background: '#ff0000', color: '#fff', border: 'none' } : {}}
                    onClick={() => setUploadType('youtube')}
                  >
                    <i className="fa-brands fa-youtube me-1"></i>YouTube
                  </button>
                  <button
                    type="button"
                    className={`btn flex-grow-1 fw-bold ${uploadType === 'upload' ? '' : 'btn-outline-success'}`}
                    style={uploadType === 'upload' ? { background: '#015927', color: '#fff', border: 'none' } : {}}
                    onClick={() => setUploadType('upload')}
                  >
                    <i className="fa-solid fa-file-video me-1"></i>Upload File
                  </button>
                </div>
              </div>

              {uploadType === 'youtube' ? (
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">YouTube URL</label>
                  <input type="url" className="form-control" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
                  {youtubeUrl && ytId && (
                    <div className="mt-2 text-center">
                      <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="YouTube thumbnail" style={{ width: '100%', borderRadius: '8px' }} />
                      <p className="text-success small mt-1"><i className="fa-solid fa-check-circle me-1"></i>Valid YouTube URL</p>
                    </div>
                  )}
                  {youtubeUrl && !ytId && (
                    <p className="text-danger small mt-1"><i className="fa-solid fa-exclamation-circle me-1"></i>Invalid YouTube URL</p>
                  )}
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted text-uppercase">Video File (max 100MB)</label>
                  <input type="file" className="form-control" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo" onChange={handleFileChange} ref={fileInputRef} />
                  {videoPreview && (
                    <div className="mt-2">
                      <video src={videoPreview} controls style={{ width: '100%', borderRadius: '8px', maxHeight: '150px' }} />
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{ background: '#015927', color: '#fff200', borderRadius: '8px', padding: '10px' }}
                disabled={submitting}
              >
                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="fa-solid fa-plus me-2"></i>Add Video</>}
              </button>
            </form>
          </div>
        </div>

        {/* ── Video Grid ── */}
        <div className="col-lg-8">
          {/* Search & Filter */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input type="text" className="form-control" placeholder="🔍 Search videos..." value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={filterCat}
              onChange={e => { setFilterCat(e.target.value); setCurrentPage(1); }}>
              <option value="All">All Categories</option>
              {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
              <p className="mt-3 text-muted">Loading videos...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <i className="fa-solid fa-film fa-3x text-muted mb-3 d-block"></i>
              <p className="text-muted">{videos.length === 0 ? 'No videos yet. Add your first video!' : 'No videos match your search.'}</p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {paginated.map(video => {
                  const ytVideoId = video.type === 'youtube' ? getYouTubeId(video.videoUrl) : null;
                  const thumbSrc = video.thumbnail || (ytVideoId ? `https://img.youtube.com/vi/${ytVideoId}/hqdefault.jpg` : null);

                  return (
                    <div key={video._id} className="col-sm-6 col-lg-4">
                      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        {/* Thumbnail */}
                        <div style={{ height: '155px', position: 'relative', background: '#111', cursor: 'pointer' }}
                          onClick={() => setPreviewVideo(video)}>
                          {video.type === 'youtube' && thumbSrc ? (
                            <>
                              <img src={thumbSrc} alt={video.title || 'Video thumbnail'} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-brands fa-youtube" style={{ fontSize: '2.8rem', color: '#ff0000', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}></i>
                              </div>
                            </>
                          ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}>
                              <i className="fa-solid fa-play-circle fa-3x" style={{ color: '#fff', opacity: 0.8 }}></i>
                            </div>
                          )}
                          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px' }}>
                            <span style={{ background: video.type === 'youtube' ? '#ff0000' : '#015927', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>
                              {video.type === 'youtube' ? '▶ YouTube' : '📁 File'}
                            </span>
                          </div>
                          <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: '10px' }}>
                            {video.category}
                          </span>
                        </div>

                        <div style={{ padding: '12px' }}>
                          <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#333', margin: '0 0 10px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} title={video.title}>
                            {video.title}
                          </p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm flex-grow-1 fw-bold"
                              style={{ background: '#e8f5e9', color: '#015927', border: '1px solid #c8e6c9', fontSize: '0.75rem' }}
                              onClick={() => setEditItem({ ...video })}
                            >
                              <i className="fa-solid fa-pen me-1"></i>Edit
                            </button>
                            {video.type === 'youtube' && (
                              <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                                className="btn btn-sm fw-bold"
                                style={{ background: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2', fontSize: '0.75rem' }}>
                                <i className="fa-brands fa-youtube"></i>
                              </a>
                            )}
                            <button
                              className="btn btn-sm fw-bold"
                              style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '0.75rem' }}
                              onClick={() => handleDelete(video._id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              <p className="text-muted small text-center mt-2">Showing {paginated.length} of {filtered.length} videos</p>
            </>
          )}
        </div>
      </div>

      {/* ── Video Preview Modal ── */}
      {previewVideo && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={() => setPreviewVideo(null)}>
          <div style={{ width: '100%', maxWidth: '720px', background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ padding: '12px 16px', background: '#1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{previewVideo.title}</span>
              <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setPreviewVideo(null)}>✕</button>
            </div>
            {previewVideo.type === 'youtube' ? (
              <iframe
                width="100%"
                height="380"
                src={`https://www.youtube.com/embed/${getYouTubeId(previewVideo.videoUrl)}?autoplay=1`}
                title={previewVideo.title}
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video src={getImageSrc(previewVideo.videoUrl)} controls autoPlay style={{ width: '100%', maxHeight: '380px' }} />
            )}
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 800, margin: 0 }}>Edit Video Details</h5>
              <button className="btn-close" onClick={() => setEditItem(null)}></button>
            </div>
            {editItem.type === 'youtube' && getYouTubeId(editItem.videoUrl) && (
              <img src={editItem.thumbnail || `https://img.youtube.com/vi/${getYouTubeId(editItem.videoUrl)}/hqdefault.jpg`}
                alt="thumbnail" style={{ width: '100%', borderRadius: '10px', marginBottom: '16px' }} />
            )}
            <div className="mb-3">
              <label className="form-label fw-bold small text-uppercase text-muted">Title</label>
              <input type="text" className="form-control" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase text-muted">Category</label>
              <select className="form-select" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                {VIDEO_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="d-flex gap-2">
              <button className="btn fw-bold flex-grow-1" style={{ background: '#015927', color: '#fff200' }} onClick={() => handleUpdate(editItem._id, editItem.title, editItem.category)}>
                <i className="fa-solid fa-check me-2"></i>Save Changes
              </button>
              <button className="btn btn-outline-secondary fw-bold" onClick={() => setEditItem(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideoGallery;
