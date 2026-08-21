import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { trackLeadSubmitted, trackFormStart } from '../utils/analytics';
const Admissions = () => {
  const [formData, setFormData] = useState({
    name: '',
    father_name: '',
    phone: '',
    course: '',
    program: '',
    email: '',
    location: ''
  });
  const [status, setStatus] = useState('');
  const hasStartedRef = useRef(false);

  const handleChange = (e) => {
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      trackFormStart('admissions_form');
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await api.post('/api/admissions', formData);
      setStatus('Success! Your admission enquiry has been submitted.');
      trackLeadSubmitted('admissions_form', 'admission');
      setFormData({ name: '', father_name: '', phone: '', course: '', program: '', email: '', location: '' });
      hasStartedRef.current = false;
    } catch (err) {
      console.error(err);
      let message;
      if (err.response) {
        message = err.response.data?.message || 'Failed to submit. Please check the fields and try again.';
      } else if (err.request) {
        message = 'Could not reach the server. Please make sure the backend is running and try again.';
      } else {
        message = 'Something went wrong while submitting. Please try again.';
      }
      setStatus(message);
    }
  };

  return (
    <div className="admissions-page">
      <Helmet>
        <title>Admissions Open | Rankrise Coaching Centers</title>
        <meta name="description" content="Apply now for IIT-JEE, NEET, EAMCET & BITSAT coaching at Rankrise. Admissions are open. Scholarships available for meritorious students." />
        <meta name="keywords" content="Rankrise admissions, coaching admissions, IIT JEE admission Hyderabad, NEET coaching enrollment" />
        <link rel="canonical" href="https://rankrise.in/admissions" />
        <meta property="og:title" content="Admissions Open | Rankrise Coaching Centers" />
        <meta property="og:description" content="Apply now for IIT-JEE, NEET, EAMCET & BITSAT coaching at Rankrise. Admissions are open. Scholarships available for meritorious students." />
        <meta property="og:url" content="https://rankrise.in/admissions" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'Admissions', item: 'https://rankrise.in/admissions' },
            ],
          })}
        </script>
      </Helmet>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="text-success fw-bold">
              <i className="fa-solid fa-graduation-cap me-2"></i> ADMISSIONS
            </h1>
            <p className="lead">Join the Best Coaching Institute in Hyderabad for IIT-JEE & NEET</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card shadow border-0 rounded-4">
                <div className="card-body p-5">
                  <h3 className="mb-4 text-center">Admission Enquiry Form</h3>
                  <form onSubmit={handleSubmit} id="rankrise_form">
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Student Name *</label>
                        <input type="text" className="form-control" name="name" id="name" placeholder="Student Name *" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Father Name *</label>
                        <input type="text" className="form-control" name="father_name" id="father_name" placeholder="Father Name *" value={formData.father_name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Mobile Number *</label>
                        <input type="tel" className="form-control" name="phone" id="phone" placeholder="+91 Mobile Number *" value={formData.phone} onChange={handleChange} pattern="[1-9]{1}[0-9]{9}" maxLength="10" required />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label" htmlFor="course_select">Course *</label>
                        <select className="form-select" name="course" id="course_select" value={formData.course} onChange={handleChange} required>
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
                      <div className="col-md-12 mb-2">
                        <label className="form-label" htmlFor="program_select">Program *</label>
                        <select className="form-select" name="program" id="program_select" value={formData.program} onChange={handleChange} required>
                          <option value="">Select Program</option>
                          <option value="Days-scholar">Days-scholar</option>
                          <option value="Residential">Residential</option>
                          <option value="Semi-Residential">Semi-Residential</option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Email (optional)</label>
                        <input type="email" className="form-control" name="email" id="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Location (optional)</label>
                        <input type="text" className="form-control" name="location" id="location" placeholder="Location (optional)" value={formData.location} onChange={handleChange} />
                      </div>
                      <div className="col-12 text-center mt-3">
                        <button type="submit" className="submit-btn btn btn-success btn-lg px-5 w-100 fw-bold rounded-3">SUBMIT Enquiry</button>
                        {status && <div className={`mt-3 fw-bold ${status.includes('Success') ? 'text-success' : 'text-danger'}`}>{status}</div>}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
