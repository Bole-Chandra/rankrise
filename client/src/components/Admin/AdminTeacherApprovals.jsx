import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const AdminTeacherApprovals = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get(showAll ? '/api/auth/teachers' : '/api/auth/teachers/pending');
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAll]);

  const handleAction = async (id, action) => {
    if (!window.confirm(`${action === 'approve' ? 'Approve' : 'Reject'} this teacher account?`)) return;
    try {
      setBusyId(id);
      await api.put(`/api/auth/teachers/${id}/${action}`);
      fetchTeachers();
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      approved: 'bg-success',
      rejected: 'bg-danger',
      pending: 'bg-warning text-dark',
    };
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>;
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ color: '#015927', fontWeight: 800, margin: 0 }}>
          <i className="fa-solid fa-chalkboard-user me-2"></i>Teacher Approvals
        </h5>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-outline-secondary fw-bold" onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show Pending Only' : 'Show All Teachers'}
          </button>
          <button className="btn btn-sm btn-outline-success fw-bold" onClick={fetchTeachers}>
            <i className="fa-solid fa-rotate-right me-1"></i>Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-muted py-5">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
          <p>{showAll ? 'No teacher accounts yet.' : 'No pending teacher approvals.'}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle" style={{ fontSize: '0.88rem' }}>
            <thead style={{ background: '#f8f9fa' }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Signed Up</th>
                <th>Status</th>
                {!showAll && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t._id}>
                  <td className="fw-bold">{t.name}</td>
                  <td>{t.email}</td>
                  <td className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>{statusBadge(t.teacherStatus)}</td>
                  {!showAll && (
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          disabled={busyId === t._id}
                          onClick={() => handleAction(t._id, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={busyId === t._id}
                          onClick={() => handleAction(t._id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminTeacherApprovals;
