import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { trackCallClick, trackYouTubeClick } from '../utils/analytics';

const Footer = () => {
  return (
    <footer className="footer-bg custom-footer py-3 mt-5 text-white">
      <div className="container position-relative my-4">
        <div className="row justify-content-center text-center mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold">
              Get In <span style={{ color: '#f3f001' }}>Touch</span>
            </h2>
            <p className="mb-0">
              Unsure which course fits you best? Reach out to us — we'll help you make the right decision.
            </p>
            <div className="my-3">
              <Link to="/contact" className="getstart btn-lg fw-bold">Click Here</Link>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', width: '100%', backgroundColor: '#ccc', margin: '3px 0' }} className="my-4"></div>

        <div className="row text-md-start text-center">
          <div className="col-md-3 col-12 col-sm-12">
            <div>
              <img src="/assets/public/Rankriselogo.webp" alt="Rankrise Logo" className="w-100" style={{ borderRadius: '15px' }} loading="eager" />
            </div>
            <p className="mt-4">
              <strong>RANKRISE</strong> is a reputed institute in Hyderabad Since 2011 offering INTERMEDIATE with IIT-JEE,
              NEET & EAMCET coaching, guiding students toward top ranks and success.
            </p>
          </div>

          <div className="col-md-3 px-md-5 px-0 col-12 col-sm-12">
            <h4 className="mb-3" style={{ color: '#f3f001' }}>Courses</h4>
            <ul className="offers-list">
              <li><Link to="/courses/iit-jee" style={{ textDecoration: 'none' }} className="text-white">IIT-JEE Coaching</Link></li>
              <li><Link to="/courses/neet" style={{ textDecoration: 'none' }} className="text-white">NEET Coaching</Link></li>
              <li><Link to="/courses/eamcet" style={{ textDecoration: 'none' }} className="text-white">EAMCET Coaching</Link></li>
              <li><Link to="/courses/bitsat" style={{ textDecoration: 'none' }} className="text-white">BITSAT Coaching</Link></li>
              <li><Link to="/college/mpc-iit" style={{ textDecoration: 'none' }} className="text-white">INTER: MPC with IIT-JEE</Link></li>
              <li><Link to="/college/bipc-neet" style={{ textDecoration: 'none' }} className="text-white">INTER: BIPC with NEET</Link></li>
              <li><Link to="/college/mpc-eamcet" style={{ textDecoration: 'none' }} className="text-white">INTER: MPC with EAMCET</Link></li>
            </ul>
          </div>

          <div className="col-md-2 p-0 col-12 col-ms-12">
            <h4 className="mb-3" style={{ color: '#f3f001' }}>Useful Links</h4>
            <ul className="offers-list">
              <li><Link to="/" style={{ textDecoration: 'none' }} className="text-white">Home</Link></li>
              <li><Link to="/about" style={{ textDecoration: 'none' }} className="text-white">About</Link></li>
              <li><Link to="/courses/iit-jee" style={{ textDecoration: 'none' }} className="text-white">Long Term & Short Term</Link></li>
              <li><Link to="/college/mpc-iit" style={{ textDecoration: 'none' }} className="text-white">Jr. College</Link></li>
              <li><Link to="/blog" style={{ textDecoration: 'none' }} className="text-white">Blog</Link></li>
            </ul>
          </div>

          <div className="col-md-4 px-md-5 px-0 col-12 col-sm-12">
            <h4 className="mb-3" style={{ color: '#f3f001' }}>Contact Us</h4>
            <div>
              <p className="my-4 text-white fs-5">
                <i className="fas fa-envelope me-2" style={{ color: '#f3f001' }}></i>
                info@rankrise.in
              </p>
              <div className="phone-box justify-content-center">
                <i className="fa fa-phone phone-icon" aria-hidden="true"></i>
                <div className="phone-list">
                  <a href="tel:9948962952" onClick={() => trackCallClick('9948962952', 'footer')}>+91 9948 962 952</a>
                  <a href="tel:8886945745" onClick={() => trackCallClick('8886945745', 'footer')}>+91 8886 945 745</a>
                  <a href="tel:8121571596" onClick={() => trackCallClick('8121571596', 'footer')}>+91 8121 571 596</a>
                  <a href="tel:8121492622" onClick={() => trackCallClick('8121492622', 'footer')}>+91 8121 492 622</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="fw-bold mb-2 text-white">Our Centers</h2>
          {/* Desktop View */}
          <div id="branchesCarousel" className="carousel slide d-none d-md-block" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="branches-line">
                  <span className="branch-title">Hyderabad</span>
                  <span className="branch-title">Khammam</span>
                  <span className="branch-title">Warangal</span>
                  <span className="branch-title">Vijayawada</span>
                </div>
              </div>
              <div className="carousel-item">
                <div className="branches-line">
                  <span className="branch-title">Guntur</span>
                  <span className="branch-title">Vizag</span>
                  <span className="branch-title">Tirupati</span>
                  <span className="branch-title">Bangalore</span>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile View */}
          <div id="branchesCarouselMobile" className="carousel slide d-md-none" data-bs-ride="carousel">
            <div className="carousel-inner text-center">
              <div className="carousel-item active"><span className="branch-title">Hyderabad</span></div>
              <div className="carousel-item"><span className="branch-title">Khammam</span></div>
              <div className="carousel-item"><span className="branch-title">Warangal</span></div>
              <div className="carousel-item"><span className="branch-title">Vijayawada</span></div>
              <div className="carousel-item"><span className="branch-title">Guntur</span></div>
              <div className="carousel-item"><span className="branch-title">Vizag</span></div>
              <div className="carousel-item"><span className="branch-title">Tirupati</span></div>
              <div className="carousel-item"><span className="branch-title">Bangalore</span></div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', width: '100%', backgroundColor: '#ccc', margin: '3px 0' }} className="my-4"></div>

        <div className="row align-items-center justify-content-between">
          <div className="col-md-6 text-white small">
            <p className="text-white mb-0" style={{ color: '#fff !important' }}>
              © 2025 <strong className="px-1 sitename">RANKRISE Educational Institutions</strong> <span>All Rights Reserved</span>
            </p>
            <div className="mt-1">
              <Link to="/terms-conditions" className="footer-link">Terms & Conditions</Link>
              <span className="mx-2" style={{ color: '#f9f400' }}>|</span>
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="footer-icons d-flex justify-content-end align-items-center">
              <a href="https://www.instagram.com/rankriseinstitute" target="_blank" rel="noopener noreferrer" className="footer-icon"><i className="fab fa-instagram"></i></a>
              <span className="footer-divider"></span>
              <a href="https://www.facebook.com/share/1EyG1jMR4C/" target="_blank" rel="noopener noreferrer" className="footer-icon"><i className="fab fa-facebook-f"></i></a>
              <span className="footer-divider"></span>
              <a href="https://x.com/RiseRise291827" target="_blank" rel="noopener noreferrer" className="footer-icon"><i className="fab fa-twitter"></i></a>
              <span className="footer-divider"></span>
              <a href="https://youtube.com/@rankriseinstitute" target="_blank" rel="noopener noreferrer" onClick={() => trackYouTubeClick('footer')} className="footer-icon"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
