import React from 'react';
import { Link } from 'react-router-dom';
import { trackCallClick } from '../utils/analytics';

const TopInfoBar = () => {
  return (
    <div className="top-bar" style={{ background: '#015927', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
        <div className="row align-items-center gy-2">
          {/* LEFT SIDE (Mobile Numbers) */}
          <div className="col-12 col-md-7 order-1">
            <div className="top-contact d-flex flex-column flex-md-row justify-content-center justify-content-md-start align-items-center gap-2 gap-md-3">
              <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'top_bar')} className="d-inline-flex align-items-center text-white text-decoration-none">
                <i className="fa-solid fa-phone-volume d-inline-flex align-items-center justify-content-center text-dark rounded-circle me-2"
                  style={{ width: '28px', height: '28px', backgroundColor: '#f9f400', fontSize: '12px' }}></i>
                9948962952
              </a>

              <a href="tel:8886945745" onClick={() => trackCallClick('8886945745', 'top_bar')} className="d-inline-flex align-items-center text-white text-decoration-none">
                <i className="fa-solid fa-phone d-inline-flex align-items-center justify-content-center text-dark rounded-circle me-2"
                  style={{ width: '28px', height: '28px', backgroundColor: '#f9f400', fontSize: '12px' }}></i>
                8886945745
              </a>

              {/* Email */}
              <a href="mailto:info@rankrise.in" className="d-inline-flex align-items-center text-white text-decoration-none">
                <i className="fa-solid fa-envelope me-1" style={{ color: '#f9f400' }}></i>
                info@rankrise.in
              </a>
            </div>
          </div>

          {/* RIGHT SIDE (Admissions Button) */}
          <div className="col-12 col-md-5 order-2">
            <div className="top-buttons d-flex justify-content-center justify-content-md-end align-items-center gap-2">
              <Link to="/admissions" className="btn download-btn d-inline-flex align-items-center gap-1 text-decoration-none" style={{ whiteSpace: 'nowrap' }}>
                <i className="fa-solid fa-graduation-cap" style={{ color: '#fff82c', fontSize: '28px' }}></i>
                <span style={{ fontSize: '24px', color: '#fff' }}> ADMISSIONS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInfoBar;
