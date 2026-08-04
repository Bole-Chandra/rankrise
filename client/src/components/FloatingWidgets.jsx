import React, { useEffect } from 'react';
import './FloatingWidgets.css';
import { trackCallClick, trackWhatsAppClick, trackYouTubeClick } from '../utils/analytics';

const FloatingWidgets = () => {
  useEffect(() => {
    const askBox = document.getElementById('askBox');
    let expanded = false;

    const slideAskBox = () => {
      expanded = !expanded;
      if (askBox) {
        askBox.classList.toggle('expand', expanded);
      }
    };

    const interval = setInterval(slideAskBox, 1500);

    const openContact = document.getElementById('openContact');
    const handleOpenContact = () => {
      if (window.bootstrap && window.bootstrap.Modal) {
        const contactModal = new window.bootstrap.Modal(document.getElementById('contactModal'));
        contactModal.show();
      }
    };

    if (openContact) {
      openContact.addEventListener('click', handleOpenContact);
    }

    const seeMeBtn = document.getElementById('seeMeBtn');
    const sidebar = document.getElementById('quickSidebar');

    const handleSeeMe = () => {
      if (sidebar && seeMeBtn) {
        sidebar.classList.toggle('active');
        if (sidebar.classList.contains('active')) {
          seeMeBtn.textContent = 'Hide Me';
        } else {
          seeMeBtn.textContent = 'See Me';
        }
      }
    };

    if (seeMeBtn) {
      seeMeBtn.addEventListener('click', handleSeeMe);
    }

    return () => {
      clearInterval(interval);
      if (openContact) {
        openContact.removeEventListener('click', handleOpenContact);
      }
      if (seeMeBtn) {
        seeMeBtn.removeEventListener('click', handleSeeMe);
      }
    };
  }, []);

  return (
    <div className="floating-widget-container">
      {/* Floating Widget */}
      <div className="floating-widget">
        <a style={{ textDecoration: 'none' }} href="/contact">
          <div className="ask-box" id="askBox">
            <div className="ask-icon ms-2">
              <img src="/assets/public/whitbglogo.webp" alt="" className="w-100" loading="eager" />
            </div>
            <div className="ask-text fw-bolder">Ask Rankrise</div>
          </div>
        </a>
        <a href="https://wa.me/919948962952" target="_blank" rel="noopener noreferrer" aria-label="Chat with Rankrise on WhatsApp" onClick={() => trackWhatsAppClick('919948962952', 'floating_widget')} className="float-btn whatsapp slide-btn">
          <i className="fab fa-whatsapp"></i>
        </a>
        <a href="tel:9948962952"
          aria-label="Call Rankrise"
          onClick={() => trackCallClick('9948962952', 'floating_widget')}
          className="float-btn call slide-btn d-inline-flex align-items-center justify-content-center bg-white border-0 text-decoration-none rounded-circle"
          style={{
            width: '50px',
            height: '50px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)'
          }}>

          {/* Using fa-phone-volume to show "ringing/answering" action */}
          <i className="fas fa-phone-volume"
            style={{
              color: '#007bff',
              fontSize: '20px',
              transform: 'rotate(-15deg)' /* Tilts the phone slightly to make it look "lifted" */
            }}>
          </i>
        </a>
      </div>

      {/* Floating Sidebar */}
      <div className="quick-sidebar" id="quickSidebar">
        {/* Contact Tab */}
        <div className="sidebar-tab contact" id="openContact" style={{ cursor: 'pointer' }}>
          Quick Enquiry
        </div>

        {/* Facebook */}
        <a href="https://www.facebook.com/share/1EyG1jMR4C/" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
          <img src="/assets/public/fblogo.webp" alt="Facebook" style={{ width: '37px' }} loading="eager" />
        </a>

        {/* Instagram */}
        <a href="https://www.instagram.com/rankriseinstitute?igsh=MTRua253dzl5ZzliOQ==" target="_blank" rel="noopener noreferrer" className="social-icon instra">
          <img src="/assets/public/inst.jpg.webp" alt="Instagram" style={{ width: '37px' }} loading="eager" />
        </a>

        {/* Twitter / X */}
        <a href="https://x.com/RiseRise291827?t=Tvo9pQCz-TxOVj0c9kN_Hg&s=08" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
          <img src="/assets/public/twitte.jpg.webp" alt="Twitter" style={{ width: '37px' }} loading="eager" />
        </a>

        {/* YouTube */}
        <a href="https://youtube.com/@rankriseinstitute?si=c3x2CqCzUcofjlN2" target="_blank" rel="noopener noreferrer" onClick={() => trackYouTubeClick('floating_widget')} className="social-icon youtube">
          <img src="/assets/public/youtub.jpg.webp" alt="YouTube" style={{ width: '37px' }} loading="eager" />
        </a>
      </div>

      {/* "See Me" Vertical Button (Mobile Only) */}
      <button className="see-me-btn-vertical" id="seeMeBtn">See Me</button>
    </div>
  );
};

export default FloatingWidgets;
