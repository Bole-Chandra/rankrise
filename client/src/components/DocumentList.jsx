import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getFileSrc, formatFileSize } from '../utils/fileSrc';
import { trackDownload } from '../utils/analytics';

const SECTION_LABELS = {
  'exam-pattern': 'Exam Pattern',
  syllabus: 'Syllabus'
};

const getFileIcon = (fileType) => {
  if (!fileType) return 'fa-file-lines';
  if (fileType.includes('pdf')) return 'fa-file-pdf';
  if (fileType.includes('word') || fileType.includes('msword')) return 'fa-file-word';
  return 'fa-file-lines';
};

const DocumentList = ({ course, section }) => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);
    api
      .get('/api/documents', { params: { course, section } })
      .then((res) => {
        if (mounted) setDocs(res.data || []);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [course, section]);

  const label = SECTION_LABELS[section] || section;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2 mb-0">Loading {label}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 text-muted">
        <p className="mb-0 fs-5">Unable to load {label}. Please try again later.</p>
      </div>
    );
  }

  if (docs.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="fa-solid fa-file-circle-plus fa-3x mb-3" style={{ color: '#c8c8c8' }} />
        <h3 className="fw-bold" style={{ color: '#015927' }}>
          {label} Coming Soon
        </h3>
        <p className="mt-2 mb-0 fs-5 text-muted">We are preparing the {label.toLowerCase()} for this course. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="my-4">
      <h3 className="fw-bold mb-4" style={{ color: '#015927' }}>
        <i className={`fa-solid ${section === 'Documents' ? 'fa-book' : 'fa-file-arrow-down'} me-2`} />
        {label}
      </h3>
      <div className="row g-3">
        {docs.map((doc) => (
          <div className="col-md-6" key={doc._id}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{ width: 52, height: 52, background: '#e8f5e9', color: '#015927', fontSize: 26 }}
                >
                  <i className={`fa-solid ${getFileIcon(doc.fileType)}`} />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h6 className="fw-bold mb-0 text-truncate" title={doc.title}>
                    {doc.title}
                  </h6>
                  {doc.fileSize ? (
                    <small className="text-muted">{formatFileSize(doc.fileSize)}</small>
                  ) : null}
                </div>
                <div className="d-flex gap-2 flex-shrink-0">
                  <a
                    href={getFileSrc(doc.file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success btn-sm fw-bold"
                    title="Open"
                  >
                    <i className="fa-solid fa-eye me-1" />
                    View
                  </a>
                  <a
                    href={getFileSrc(doc.file)}
                    download
                    onClick={() => trackDownload(doc.title || doc.file, section)}
                    className="btn btn-success btn-sm fw-bold"
                    title="Download"
                  >
                    <i className="fa-solid fa-download" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList;