import React, { useEffect } from 'react';
import EnquiryForm from './EnquiryForm';

const ContactModal = () => {
  useEffect(() => {
    // Show early bird modal after 5 seconds
    const timer = setTimeout(() => {
      if (window.bootstrap && window.bootstrap.Modal) {
        const modal = document.getElementById('earlyBirdModal');
        if (modal && !sessionStorage.getItem('earlyBirdShown')) {
          const bsModal = new window.bootstrap.Modal(modal);
          bsModal.show();
          sessionStorage.setItem('earlyBirdShown', 'true');
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Contact Enquiry Modal */}
      <div className="modal fade" id="contactModal" tabIndex="-1" aria-labelledby="contactModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '15px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ background: '#015927', color: '#fff' }}>
              <h5 className="modal-title" id="contactModalLabel">
                <i className="fas fa-graduation-cap me-2"></i> Quick Enquiry
              </h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              <EnquiryForm idPrefix="modal_" />
            </div>
          </div>
        </div>
      </div>

      {/* Early Bird Popup */}
      <div className="modal fade p-2" id="earlyBirdModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 bg-transparent position-relative">
            <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-2" style={{ zIndex: 10 }}
              data-bs-dismiss="modal" aria-label="Close"></button>
            {/* Desktop View */}
            <img src="/assets/public/EarlyBird-banner.jpg" className="img-fluid d-none d-md-block rounded shadow-lg"
              alt="Early Bird Offer" loading="eager" />
            {/* Mobile View */}
            <div className="d-block d-md-none shadow-lg">
              <img src="/assets/public/Early-Bird-Banner-mobile.JPG" className="img-fluid" alt="Early Bird Offer Mobile"
                loading="eager" />
              <div className="text-white shadow" style={{ background: '#e9f6fe', padding: '10px' }}>
                <div className="p-3 rounded" style={{ background: '#e2ffee' }}>
                  <div className="text-center">
                    <h3 className="fw-bold" style={{ fontSize: '25px', color: '#015927' }}>ADMISSION ENQUIRY</h3>
                    <p className="fw-bold my-3 mb-0 text-black">BEGIN YOUR SUCCESS JOURNEY</p>
                    <p className="fw-bold text-black">with RANKRISE!</p>
                  </div>
                  <EnquiryForm idPrefix="earlybird_modal_" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactModal;
