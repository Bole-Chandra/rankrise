import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { getFileSrc, formatFileSize } from '../../utils/fileSrc';

const COURSES = [
  { key: 'iit-jee', label: 'IIT-JEE Coaching' },
  { key: 'neet', label: 'NEET Coaching' },
  { key: 'eamcet', label: 'EAMCET Coaching' },
  { key: 'bitsat', label: 'BITSAT Coaching' },
  { key: 'mpc-iit', label: 'INTER: MPC with IIT-JEE' },
  { key: 'mpc-eamcet', label: 'INTER: MPC with EAMCET' },
  { key: 'bipc-neet', label: 'INTER: BIPC with NEET' }
];

const SECTIONS = [
  { key: 'exam-pattern', label: 'Exam Pattern' },
  { key: 'syllabus', label: 'Syllabus' }
];

const SECTION_MAP = SECTIONS.reduce((acc, s) => { acc[s.key] = s.label; return acc; }, {});
const COURSE_MAP = COURSES.reduce((acc, c) => { acc[c.key] = c.label; return acc; }, {});

const getFileIcon = (fileType) => {
  if (!fileType) return 'fa-file-lines';
  if (fileType.includes('pdf')) return 'fa-file-pdf';
  if (fileType.includes('word') || fileType.includes('msword')) return 'fa-file-word';
  return 'fa-file-lines';
};

const AdminCourseDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Upload form state
  const [course, setCourse] = useState('iit-jee');
  const [section, setSection] = useState('exam-pattern');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef();

  // Edit state
  const [editItem, setEditItem] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const editFileRef = useRef();

  const getToken = () => localStorage.getItem('adminToken');

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/documents');
      setDocs(res.data);
    } catch (err) {
      setError('Failed to load documents. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const showMsg = (type, msg) => {
    if (type === 'success') { setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
    else { setError(msg); setTimeout(() => setError(''), 5000); }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const resetUploadForm = () => {
    setTitle(''); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { showMsg('error', 'Please select a PDF or Word file.'); return; }
    if (!title.trim()) { showMsg('error', 'Please enter a title.'); return; }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('course', course);
      formData.append('section', section);
      formData.append('title', title.trim());
      formData.append('file', file);
      await api.post('/api/documents', formData, {
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
      });
      showMsg('success', 'Document uploaded successfully!');
      resetUploadForm();
      fetchDocs();
    } catch (err) {
      showMsg('error', 'Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document? This cannot be undone.')) return;
    try {
      await api.delete(`/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      showMsg('success', 'Document deleted.');
      setDocs(prev => prev.filter(d => d._id !== id));
      if (editItem?._id === id) setEditItem(null);
    } catch (err) {
      showMsg('error', 'Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setEditFile(f);
  };

  const handleUpdate = async (id, newTitle) => {
    try {
      const formData = new FormData();
      formData.append('title', newTitle);
      if (editFile) formData.append('file', editFile);
      const res = await api.put(`/api/documents/${id}`, formData, {
        headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data' }
      });
      setDocs(prev => prev.map(d => d._id === id ? res.data : d));
      setEditItem(null);
      setEditFile(null);
      if (editFileRef.current) editFileRef.current.value = '';
      showMsg('success', 'Document updated successfully!');
    } catch (err) {
      showMsg('error', 'Update failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = docs.filter(d => {
    const matchSearch = (d.title + ' ' + (COURSE_MAP[d.course] || '') + ' ' + (SECTION_MAP[d.section] || '')).toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h4 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
            <i className="fa-solid fa-file-lines me-2"></i>Course Documents
          </h4>
          <p className="text-muted small mb-0 mt-1">{docs.length} total documents (PDF / DOC / DOCX)</p>
        </div>
      </div>

      {success && <div className="alert alert-success border-0 shadow-sm py-2">{success}</div>}
      {error && <div className="alert alert-danger border-0 shadow-sm py-2">{error}</div>}

      <div className="row g-4">
        {/* ── Upload Form ── */}
        <div className="col-lg-4">
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', position: 'sticky', top: '80px' }}>
            <h6 style={{ color: '#015927', fontWeight: 800, marginBottom: '20px' }}>
              <i className="fa-solid fa-cloud-arrow-up me-2"></i>Upload New Document
            </h6>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Course *</label>
                <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
                  {COURSES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Section *</label>
                <select className="form-select" value={section} onChange={e => setSection(e.target.value)}>
                  {SECTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>Document Title *</label>
                <input type="text" className="form-control" placeholder="e.g. IIT-JEE Mains Exam Pattern 2026" value={title} onChange={e => setTitle(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold small text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>File (PDF / DOC / DOCX) *</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} ref={fileInputRef} />
              </div>
              {file && (
                <div className="mb-3 p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: '#f1f8f1' }}>
                  <i className={`fa-solid ${getFileIcon(file.type)}`} style={{ color: '#015927', fontSize: 20 }} />
                  <div className="overflow-hidden flex-grow-1">
                    <p className="mb-0 small fw-bold text-truncate">{file.name}</p>
                    <small className="text-muted">{formatFileSize(file.size)}</small>
                  </div>
                </div>
              )}
              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{ background: '#015927', color: '#fff200', borderRadius: '8px', padding: '10px' }}
                disabled={submitting}
              >
                {submitting ? <><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</> : <><i className="fa-solid fa-upload me-2"></i>Upload Document</>}
              </button>
              {file && (
                <button type="button" className="btn btn-link text-danger w-100 mt-1 small" onClick={resetUploadForm}>
                  Clear selection
                </button>
              )}
            </form>
          </div>
        </div>

        {/* ── Documents List ── */}
        <div className="col-lg-8">
          <div className="d-flex gap-2 mb-4 flex-wrap">
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by title, course or section..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-3 text-muted">Loading documents...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <i className="fa-regular fa-file-lines fa-3x text-muted mb-3 d-block"></i>
              <p className="text-muted">{docs.length === 0 ? 'No documents yet. Upload the first PDF / DOCX!' : 'No documents match your search.'}</p>
            </div>
          ) : (
            <>
              <div className="row g-3">
                {filtered.map(item => (
                  <div key={item._id} className="col-12">
                    <div style={{ background: '#fff', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <div className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0" style={{ width: 48, height: 48, background: '#e8f5e9', color: '#015927', fontSize: 24 }}>
                          <i className={`fa-solid ${getFileIcon(item.fileType)}`} />
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: '180px' }}>
                          <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem', color: '#333' }} title={item.title}>{item.title}</p>
                          <small className="text-muted">
                            {COURSE_MAP[item.course] || item.course} • {SECTION_MAP[item.section] || item.section}
                            {item.fileSize ? ` • ${formatFileSize(item.fileSize)}` : ''}
                          </small>
                        </div>
                        <div className="d-flex gap-2 flex-shrink-0">
                          <a href={getFileSrc(item.file)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success fw-bold" title="Open">
                            <i className="fa-solid fa-eye me-1"></i>View
                          </a>
                          <button
                            className="btn btn-sm fw-bold"
                            style={{ background: '#e8f5e9', color: '#015927', border: '1px solid #c8e6c9' }}
                            onClick={() => setEditItem({ ...item })}
                          >
                            <i className="fa-solid fa-pen me-1"></i>Edit
                          </button>
                          <button
                            className="btn btn-sm fw-bold"
                            style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2' }}
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
              <p className="text-muted small text-center mt-3">Showing {filtered.length} of {docs.length} documents</p>
            </>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: 800, margin: 0 }}>Edit Document</h5>
              <button className="btn-close" onClick={() => { setEditItem(null); setEditFile(null); }}></button>
            </div>
            <div className="mb-3 p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: '#f1f8f1' }}>
              <i className={`fa-solid ${getFileIcon(editItem.fileType)}`} style={{ color: '#015927', fontSize: 24 }} />
              <div className="overflow-hidden flex-grow-1">
                <p className="mb-0 small fw-bold text-truncate">{editItem.title}</p>
                <small className="text-muted">{COURSE_MAP[editItem.course] || editItem.course} • {SECTION_MAP[editItem.section] || editItem.section}</small>
              </div>
              <a href={getFileSrc(editItem.file)} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-success">
                <i className="fa-solid fa-eye"></i>
              </a>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold small text-uppercase text-muted">Replace File (optional)</label>
              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="form-control" onChange={handleEditFileChange} ref={editFileRef} />
            </div>
            {editFile && (
              <div className="mb-3 small fw-bold text-success">
                <i className="fa-solid fa-check-circle me-1"></i>{editFile.name}
              </div>
            )}
            <div className="mb-4">
              <label className="form-label fw-bold small text-uppercase text-muted">Title</label>
              <input type="text" className="form-control" value={editItem.title} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn fw-bold flex-grow-1" style={{ background: '#015927', color: '#fff200' }} onClick={() => handleUpdate(editItem._id, editItem.title)}>
                <i className="fa-solid fa-check me-2"></i>Save Changes
              </button>
              <button className="btn btn-outline-secondary fw-bold" onClick={() => { setEditItem(null); setEditFile(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseDocuments;