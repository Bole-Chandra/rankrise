import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import userApi from '../utils/userApi';
import { compressImage } from '../utils/imageCompressor';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const WriteBlogForm = ({ onSubmitted, onCancel }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const compressed = await compressImage(file);
    setPreview(compressed);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !content) {
      setError('Title and content are required.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('summary', summary);
      formData.append('content', content);
      formData.append('tags', tags.split(',').map((t) => t.trim()).filter(Boolean).join(','));
      if (imageFile) formData.append('image', imageFile);

      await userApi.post('/api/blogs/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTitle(''); setSlug(''); setSummary(''); setTags(''); setContent('');
      setImageFile(null); setPreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      onSubmitted?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit your article. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger py-2 small">{error}</div>}
      <div className="alert alert-info py-2 small">
        Your article will be reviewed by an admin before it appears on the public blog.
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold small">Title *</label>
        <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold small">URL Slug</label>
        <input type="text" className="form-control" value={slug} onChange={(e) => setSlug(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold small">Summary</label>
        <textarea className="form-control" rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold small">Tags (comma separated)</label>
        <input type="text" className="form-control" placeholder="e.g. IIT-JEE, Study Tips" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold small">Cover Image</label>
        <input type="file" accept="image/*" className="form-control" ref={fileInputRef} onChange={handleFileChange} />
        {preview && <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />}
      </div>

      <div className="mb-4">
        <label className="form-label fw-bold small">Content *</label>
        <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} style={{ background: '#fff' }} />
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn fw-bold text-white" style={{ background: '#015927' }} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary fw-bold" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default WriteBlogForm;
