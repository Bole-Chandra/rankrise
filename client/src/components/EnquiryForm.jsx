import React, { useState, useRef } from 'react';
import api from '../utils/api';
import { trackLeadSubmitted, trackFormStart } from '../utils/analytics';

const EnquiryForm = ({ buttonStyle = {}, buttonClassName = 'submit-btn btn btn-lg fw-bold w-100 rounded-3', className = '', idPrefix = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    phone: '',
    course: '',
    program: '',
    email: '',
    location: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasStartedRef = useRef(false);

  const handleChange = (e) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStart('enquiry_form');
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'info', message: 'Submitting...' });

    try {
      await api.post('/api/contact', { ...formData, source: 'Website Enquiry' });
      setStatus({ type: 'success', message: 'Enquiry submitted successfully! We will contact you soon.' });
      trackLeadSubmitted('enquiry_form', 'enquiry');
      setFormData({ name: '', father_name: '', phone: '', course: '', program: '', email: '', location: '' });
      hasStartedRef.current = false;
    } catch (err) {
      console.error(err);
      let message;
      if (err.response) {
        // Server responded with an error (validation, DB down, etc.)
        message = err.response.data?.message || 'Failed to submit. Please check your details and try again.';
      } else if (err.request) {
        // Request was sent but no response came back — backend isn't running
        // or isn't reachable at the configured API URL.
        message = 'Could not reach the server. Please make sure the backend is running and try again.';
      } else {
        message = 'Something went wrong while submitting. Please try again.';
      }
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id={`${idPrefix}rankrise_form`} className={className}>
      <div className="mb-2">
        <input
          type="text"
          name="name"
          id={`${idPrefix}name`}
          placeholder="Student Name *"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          name="father_name"
          id={`${idPrefix}father_name`}
          placeholder="Father Name *"
          className="form-control"
          value={formData.father_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="tel"
          name="phone"
          id={`${idPrefix}phone`}
          placeholder="+91 Mobile Number *"
          className="form-control"
          value={formData.phone}
          onChange={handleChange}
          maxLength="10"
          pattern="[1-9]{1}[0-9]{9}"
          required
        />
      </div>
      <div className="mb-2">
        <select
          name="course"
          id={`${idPrefix}course_select`}
          className="form-select"
          value={formData.course}
          onChange={handleChange}
          required
        >
          <option value="">Select Course</option>
          <option value="NEET Long Term">NEET Long Term</option>
          <option value="IIT-JEE Long Term">IIT-JEE Long Term</option>
          <option value="EAMCET Long Term">EAMCET Long Term</option>
          <option value="NEET Short Term">NEET Short Term</option>
          <option value="IIT-JEE Short Term">IIT-JEE Short Term</option>
          <option value="EAMCET Short Term">EAMCET Short Term</option>
          <option value="BITSAT Short Term">BITSAT Short Term</option>
          <option value="MPC with IIT-JEE">MPC with IIT-JEE</option>
          <option value="BIPC with NEET">BIPC with NEET</option>
          <option value="MPC with EAMCET">MPC with EAMCET</option>
        </select>
      </div>
      <div className="mb-2">
        <select
          name="program"
          id={`${idPrefix}program_select`}
          className="form-select"
          value={formData.program}
          onChange={handleChange}
          required
        >
          <option value="">Select Program</option>
          <option value="Days-scholar">Days-scholar</option>
          <option value="Residential">Residential</option>
          <option value="Semi-Residential">Semi-Residential</option>
        </select>
      </div>
      <div className="mb-2">
        <input
          type="email"
          name="email"
          id={`${idPrefix}email`}
          placeholder="Email (optional)"
          className="form-control"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-2">
        <input
          type="text"
          name="location"
          id={`${idPrefix}location`}
          placeholder="Location (optional)"
          className="form-control"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div className="text-center mt-3">
        <button
          type="submit"
          className={buttonClassName}
          style={{ background: '#015927', color: '#fff200', ...buttonStyle }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SUBMITTING...' : 'SUBMIT Enquiry'}
        </button>
      </div>
      {status.message && (
        <div className={`mt-3 text-center fw-bold small ${status.type === 'success' ? 'text-success' : status.type === 'error' ? 'text-danger' : 'text-info'}`}>
          {status.message}
        </div>
      )}
    </form>
  );
};

export default EnquiryForm;
