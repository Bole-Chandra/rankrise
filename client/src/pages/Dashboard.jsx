import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import AdminGallery from '../components/Admin/AdminGallery';
import AdminBlogs from '../components/Admin/AdminBlogs';
import AdminVideoGallery from '../components/Admin/AdminVideoGallery';
import AdminBlogReview from '../components/Admin/AdminBlogReview';
import AdminTeacherApprovals from '../components/Admin/AdminTeacherApprovals';
import AdminCourseDocuments from '../components/Admin/AdminCourseDocuments';

const ADMISSION_STATUSES = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

const Dashboard = () => {
  const [admissions, setAdmissions] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('admissions');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [admissionsRes, enquiriesRes] = await Promise.all([
        api.get('/api/admissions'),
        api.get('/api/contact')
      ]);
      setAdmissions(admissionsRes.data);
      setEnquiries(enquiriesRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Your session may have expired.');
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin/login'); return; }
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      setBusyId(id);
      const res = await api.put(`/api/admissions/${id}`, { status });
      setAdmissions((prev) => prev.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteAdmission = async (id) => {
    if (!window.confirm('Delete this admission application? This cannot be undone.')) return;
    try {
      setBusyId(id);
      await api.delete(`/api/admissions/${id}`);
      setAdmissions((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry? This cannot be undone.')) return;
    try {
      setBusyId(id);
      await api.delete(`/api/contact/${id}`);
      setEnquiries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setBusyId(null);
    }
  };

  const exportToCSV = (rows, filename) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).filter((k) => k !== '__v');
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAdmissions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return admissions;
    return admissions.filter((a) =>
      [a.name, a.father_name, a.phone, a.course, a.program, a.status, a.email, a.location]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [admissions, search]);

  const filteredEnquiries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enquiries;
    return enquiries.filter((e) =>
      [e.name, e.father_name, e.phone, e.course, e.program, e.source, e.email, e.location]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [enquiries, search]);

  const navItems = [
    { key: 'admissions', icon: 'fa-graduation-cap', label: 'Admissions', count: admissions.length },
    { key: 'enquiries', icon: 'fa-headset', label: 'Enquiries', count: enquiries.length },
    { key: 'gallery', icon: 'fa-images', label: 'Photo Gallery' },
    { key: 'videos', icon: 'fa-video', label: 'Video Gallery' },
    { key: 'blogs', icon: 'fa-blog', label: 'Blogs' },
    { key: 'documents', icon: 'fa-file-lines', label: 'Course Documents' },
    { key: 'blogReview', icon: 'fa-file-circle-check', label: 'Blog Review' },
    { key: 'teachers', icon: 'fa-chalkboard-user', label: 'Teacher Approvals' },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
        <div className="text-center">
          <div className="spinner-border text-success" role="status" style={{ width: '3.5rem', height: '3.5rem' }}></div>
          <p className="mt-3 text-muted fw-bold">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <Helmet>
        <title>Admin Dashboard | Rankrise</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ── Top Navbar ── */}
      <nav style={{ background: '#015927', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-outline-light d-lg-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <img src="/assets/public/Rankriselogo.webp" alt="Logo" style={{ height: '38px', borderRadius: '6px' }} />
          <span style={{ color: '#fff200', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '0.5px' }}>
            RANKRISE Admin Panel
          </span>
        </div>
        <button className="btn btn-danger btn-sm fw-bold px-3" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
        </button>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* ── Sidebar ── */}
        <div
          style={{
            width: '220px',
            minWidth: '220px',
            background: '#fff',
            borderRight: '1px solid #e0e0e0',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
            transition: 'all 0.3s',
            position: 'sticky',
            top: '60px',
            height: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
          className={`d-none d-lg-block`}
        >
          <div className="py-3">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  width: '100%',
                  border: 'none',
                  background: activeTab === item.key ? '#e8f5e9' : 'transparent',
                  borderLeft: activeTab === item.key ? '4px solid #015927' : '4px solid transparent',
                  color: activeTab === item.key ? '#015927' : '#555',
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i>
                <span className="flex-grow-1">{item.label}</span>
                {item.count !== undefined && (
                  <span style={{ background: '#015927', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem' }}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mobile Sidebar Overlay ── */}
        {sidebarOpen && (
          <div
            style={{ position: 'fixed', top: '60px', left: 0, zIndex: 999, height: 'calc(100vh - 60px)', width: '220px', background: '#fff', boxShadow: '4px 0 16px rgba(0,0,0,0.15)' }}
            className="d-lg-none"
          >
            <div className="py-3">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
                  style={{
                    width: '100%', border: 'none',
                    background: activeTab === item.key ? '#e8f5e9' : 'transparent',
                    borderLeft: activeTab === item.key ? '4px solid #015927' : '4px solid transparent',
                    color: activeTab === item.key ? '#015927' : '#555',
                    padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
                  }}
                >
                  <i className={`fa-solid ${item.icon}`} style={{ width: '20px' }}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span style={{ background: '#015927', color: '#fff', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem' }}>{item.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Main Content ── */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', minWidth: 0 }}>
          {error && <div className="alert alert-danger border-0 shadow-sm mb-4">{error}</div>}

          {/* Stats Bar */}
          {(activeTab === 'admissions' || activeTab === 'enquiries') && (
            <div className="row g-3 mb-4">
              {[
                { label: 'Total Admissions', value: admissions.length, icon: 'fa-graduation-cap', color: '#015927', bg: '#e8f5e9' },
                { label: 'Total Enquiries', value: enquiries.length, icon: 'fa-headset', color: '#1565c0', bg: '#e3f2fd' },
                { label: 'Today\'s Leads', value: [...admissions, ...enquiries].filter(i => new Date(i.createdAt).toDateString() === new Date().toDateString()).length, icon: 'fa-fire', color: '#e65100', bg: '#fff3e0' },
              ].map((stat, idx) => (
                <div key={idx} className="col-md-4">
                  <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fa-solid ${stat.icon}`} style={{ color: stat.color, fontSize: '1.3rem' }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search + Export toolbar (Admissions / Enquiries only) */}
          {(activeTab === 'admissions' || activeTab === 'enquiries') && (
            <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
              <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '340px' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '0.85rem' }}></i>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search by name, phone, course..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '34px', borderRadius: '8px' }}
                />
              </div>
              <button
                className="btn btn-sm btn-outline-secondary fw-bold"
                onClick={() =>
                  activeTab === 'admissions'
                    ? exportToCSV(filteredAdmissions, 'rankrise-admissions.csv')
                    : exportToCSV(filteredEnquiries, 'rankrise-enquiries.csv')
                }
                disabled={(activeTab === 'admissions' ? filteredAdmissions : filteredEnquiries).length === 0}
              >
                <i className="fa-solid fa-file-export me-1"></i>Export CSV
              </button>
            </div>
          )}

          {/* Admissions Tab */}
          {activeTab === 'admissions' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
                  <i className="fa-solid fa-graduation-cap me-2"></i>Admission Applications
                </h5>
                <button className="btn btn-sm btn-outline-success fw-bold" onClick={fetchData}>
                  <i className="fa-solid fa-rotate-right me-1"></i>Refresh
                </button>
              </div>
              {filteredAdmissions.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
                  <p>{admissions.length === 0 ? 'No applications received yet.' : 'No applications match your search.'}</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle" style={{ fontSize: '0.88rem' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="text-muted fw-bold">#</th>
                        <th className="text-muted fw-bold">Date</th>
                        <th className="text-muted fw-bold">Student Name</th>
                        <th className="text-muted fw-bold">Father Name</th>
                        <th className="text-muted fw-bold">Mobile</th>
                        <th className="text-muted fw-bold">Course</th>
                        <th className="text-muted fw-bold">Program</th>
                        <th className="text-muted fw-bold">Email</th>
                        <th className="text-muted fw-bold">Location</th>
                        <th className="text-muted fw-bold">Status</th>
                        <th className="text-muted fw-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmissions.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="text-muted">{idx + 1}</td>
                          <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold">{item.name}</td>
                          <td>{item.father_name}</td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td><span className="badge" style={{ background: '#015927' }}>{item.course}</span></td>
                          <td><span className="badge bg-info text-dark">{item.program}</span></td>
                          <td className="text-muted">{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : '—'}</td>
                          <td className="text-muted">{item.location || '—'}</td>
                          <td>
                            <select
                              className="form-select form-select-sm fw-bold"
                              aria-label={`Change status for ${item.name || 'this admission'}`}
                              style={{ minWidth: '110px', display: 'inline-block' }}
                              value={item.status || 'Pending'}
                              disabled={busyId === item._id}
                              onChange={(e) => handleStatusChange(item._id, e.target.value)}
                            >
                              {ADMISSION_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={busyId === item._id}
                              onClick={() => handleDeleteAdmission(item._id)}
                              title="Delete application"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Enquiries Tab */}
          {activeTab === 'enquiries' && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
                  <i className="fa-solid fa-headset me-2"></i>Web Enquiries
                </h5>
                <button className="btn btn-sm btn-outline-success fw-bold" onClick={fetchData}>
                  <i className="fa-solid fa-rotate-right me-1"></i>Refresh
                </button>
              </div>
              {filteredEnquiries.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
                  <p>{enquiries.length === 0 ? 'No enquiries received yet.' : 'No enquiries match your search.'}</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle" style={{ fontSize: '0.88rem' }}>
                    <thead style={{ background: '#f8f9fa' }}>
                      <tr>
                        <th className="text-muted fw-bold">#</th>
                        <th className="text-muted fw-bold">Date</th>
                        <th className="text-muted fw-bold">Student Name</th>
                        <th className="text-muted fw-bold">Father Name</th>
                        <th className="text-muted fw-bold">Mobile</th>
                        <th className="text-muted fw-bold">Course</th>
                        <th className="text-muted fw-bold">Program</th>
                        <th className="text-muted fw-bold">Email</th>
                        <th className="text-muted fw-bold">Location</th>
                        <th className="text-muted fw-bold">Source</th>
                        <th className="text-muted fw-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.map((item, idx) => (
                        <tr key={item._id}>
                          <td className="text-muted">{idx + 1}</td>
                          <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td className="fw-bold">{item.name}</td>
                          <td>{item.father_name}</td>
                          <td><a href={`tel:${item.phone}`}>{item.phone}</a></td>
                          <td><span className="badge" style={{ background: '#015927' }}>{item.course}</span></td>
                          <td><span className="badge bg-info text-dark">{item.program}</span></td>
                          <td className="text-muted">{item.email ? <a href={`mailto:${item.email}`}>{item.email}</a> : '—'}</td>
                          <td className="text-muted">{item.location || '—'}</td>
                          <td><span className="badge bg-secondary">{item.source || 'Website'}</span></td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={busyId === item._id}
                              onClick={() => handleDeleteEnquiry(item._id)}
                              title="Delete enquiry"
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gallery' && <AdminGallery />}
          {activeTab === 'videos' && <AdminVideoGallery />}
          {activeTab === 'blogs' && <AdminBlogs />}
          {activeTab === 'documents' && <AdminCourseDocuments />}
          {activeTab === 'blogReview' && <AdminBlogReview />}
          {activeTab === 'teachers' && <AdminTeacherApprovals />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
