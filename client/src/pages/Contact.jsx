import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import EnquiryForm from '../components/EnquiryForm';
import { trackDownload } from '../utils/analytics';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if(window.AOS) window.AOS.refresh();
  }, []);

  return (
    <div className="contact-page">
      <Helmet>
        <title>Contact Us | Rankrise Coaching Centers Hyderabad</title>
        <meta name="description" content="Get in touch with Rankrise Educational Institutions. Visit our campus, call us at +91 9948962952, or fill our enquiry form for IIT-JEE, NEET & EAMCET coaching details." />
        <meta name="keywords" content="Rankrise contact, coaching center address Hyderabad, Rankrise phone number" />
        <link rel="canonical" href="https://rankrise.in/contact" />
        <meta property="og:title" content="Contact Us | Rankrise Coaching Centers Hyderabad" />
        <meta property="og:description" content="Get in touch with Rankrise Educational Institutions. Visit our campus, call us at +91 9948962952, or fill our enquiry form for IIT-JEE, NEET & EAMCET coaching details." />
        <meta property="og:url" content="https://rankrise.in/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'Contact Us', item: 'https://rankrise.in/contact' },
            ],
          })}
        </script>
      </Helmet>
      <div>
  <section>
    <div className="hero-section position-relative d-none d-md-block">
      <div>
        <img src="/assets/public/Contact Page.JPG" alt="Snow" style={{width: '100%', borderBottom: '2px solid #005826'}} loading="eager" />
      </div>
    </div>
    <div className="hero-section-mobile d-md-none">
      <div>
        <img src="/assets/public/Mobile-Contact.JPG" alt="Mobile Banner" style={{width: '100%', borderBottom: '2px solid #005826'}} loading="eager" />
      </div>
    </div>
  </section>
  <section className="brochurestyle text-center d-md-none">
    <Link to="/assets/brochure/Rankrise-Brochure.pdf" download onClick={() => trackDownload('Rankrise-Brochure.pdf', 'brochure')} className="fw-bold text-white text-decoration-none">
      <i className="fa-solid fa-file-arrow-down me-1" style={{color: '#fff82c', fontSize: 20}} />
      Click here to Download Brochure
    </Link>
  </section>
  <section className="my-5">
    <div className="container">
      <div className="row align-items-center justify-content-center mb-4">
        <div className="col-md-3">
          <div className="sideborder" />
        </div>
        <div className="col-md-3">
          <h2 style={{fontStyle: 'italic', color: '#006700'}} className="text-center">Contact Us</h2>
        </div>
        <div className="col-md-3">
          <div className="sideborder" />
        </div>
      </div>
      <div className="row align-items-center">
        <div className="col-lg-7 col-md-7">
          <div>
            <img src="/assets/public/Contact Page New Banner.JPG" alt className="w-100" loading="eager" />
          </div>
        </div>
        <div className="col-md-5">
          <div className="sidebar text-white enquiry-box1 ">
            <div className="text-center">
              <h3 className="text-center fw-bold" style={{background: '#005926', color: '#fff', padding: 5}}>ADMISSION ENQUIRY</h3>
              <p className="formsubheading mb-0">START YOUR PREPARATION
              </p>
              <p className="formsubheading">with RANKRISE
              </p>
            </div>
            <EnquiryForm />
          </div>
          <div id="successPopup" className="popup-box">
            <div className="popup-content">
              <img src="/assets/public/successicon.png" alt style={{width: 80}} loading="eager" />
              <h4>Submitted Successfully!</h4>
              <p> Thank you! Your details have been shared successfully.<br />
                Our team will contact you soon.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div className="container">
      <div className="section-title text-center">
        <h2 className="mb-5">Our Locations</h2>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best NEET | IIT-JEE (Mains&amp; Advanced)| EAMCET Long Term &amp; Short Term Coaching
                  centres in Hyderabad.</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12799.258631388906!2d78.38385930119594!3d17.495940511266017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2966948ad98880f3%3A0xddec5e8f6cf633bc!2sRANKRISE%20-%20Best%20NEET%20%7C%20IIT-JEE%20(Mains%26%20Advanced)%7C%20EAMCET%20Long%20Term%20%26%20Short%20Term%20Coaching%20centres%20in%20Hyderabad.!5e0!3m2!1sen!2sin!4v1764830708632!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best NEET | IIT-JEE (Mains&amp; Advanced)| EAMCET Long Term &amp; Short Term Coaching
                  centres in Hyderabad.</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12799.258631388906!2d78.38385930119594!3d17.495940511266017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91bf81a87c2f%3A0x81baf58adc71efe3!2sRANKRISE%20-%20Best%20NEET%20%7C%20IIT-JEE%20(Mains%26%20Advance)%7C%20EAMCET%20Long%20Term%20%26%20Short%20Term%20Coaching%20centres%20in%20Hyderabad.!5e0!3m2!1sen!2sin!4v1764830498172!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best NEET | IIT-JEE | EAMCET Coaching Center in Hubsiguda,Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3201.3894954746484!2d78.5446992485018!3d17.40625994324334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb993fb8d05277%3A0xc9aff918388aa3e0!2s6-141%2C%20Shobana%20Nagar%2C%20Habsiguda%2C%20Hyderabad%2C%20Telangana%20500007!5e0!3m2!1sen!2sin!4v1764830238084!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best NEET | IIT-JEE | EAMCET Coaching Centre in 9th Phase,Kphb,Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15221.855655877354!2d78.37048985541993!3d17.485354400000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9137ee7af5cf%3A0xe980a4b1259a3f87!2sRANKRISE%20-%20Best%20NEET%20%7C%20IIT-JEE%20%7C%20EAMCET%20Coaching%20Centre%20in%209th%20Phase%2CKphb%2CHyderabad%20Co!5e0!3m2!1sen!2sin!4v1764830932339!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best NEET | IIT-JEE | EAMCET Long Term &amp; Short Term Coaching Centres in
                  Dilsukhnagar,Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243706.84119361415!2d78.24260188671875!3d17.3676113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99440e79aed7%3A0xf90d2ce7d777c1c0!2sRANKRISE%20-%20Best%20NEET%20%7C%20IIT-JEE%20%7C%20EAMCET%20Long%20Term%20%26%20Short%20Term%20Coaching%20Centres%20in%20Dilsukhnagar%2CHyderabad!5e0!3m2!1sen!2sin!4v1764831160691!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best Intermediate(Junior College) with NEET | IIT-JEE | EAMCET Coaching in
                  Hubsiguda,Hyderabad </p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15228.46082557331!2d78.544931!3d17.406258!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb993fb8d05277%3A0xc9aff918388aa3e0!2s6-141%2C%20Shobana%20Nagar%2C%20Habsiguda%2C%20Hyderabad%2C%20Telangana%20500007!5e0!3m2!1sen!2sin!4v1764833684047!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best INTERMEDIATE (Junior College) with NEET and IIT-JEE Coaching in Gouda
                  basti, Gaddiannaram, Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.883564697141!2d78.52246989999999!3d17.3693349!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99d22f7f1295%3A0x3c0d8f2f07b1f7af!2sRANKRISE%20-%20Best%20INTERMEDIATE%20(Junior%20College)%20with%20NEET%20and%20IIT-JEE%20Coaching%20in%20Gouda%20basti%2C%20Gaddiannaram%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1764833810485!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                ] <p className="mb-1">RANKRISE - Best INTERMEDIATE (Junior Colleges) with NEET | IIT-JEE | EAMCET Coaching
                  in
                  Kphb Main Road,Hyderabad.</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7610.558120770549!2d78.39186877012253!3d17.49418726458636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f3e95148b3%3A0x8ad34a6357f2398a!2sRANKRISE%20-%20Best%20INTERMEDIATE%20(Junior%20Colleges)%20with%20NEET%20%7C%20IIT-JEE%20%7C%20EAMCET%20Coaching%20in%20Kphb%20Main%20Road%2CHyderabad.!5e0!3m2!1sen!2sin!4v1764834923082!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best INTERMEDIATE Colleges with NEET and IIT-JEE Coaching in
                  Dilsukhnagar,Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d974827.3663708428!2d78.530993!3d17.367611!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99440e79aed7%3A0xf90d2ce7d777c1c0!2sRANKRISE%20-%20Best%20NEET%20%7C%20IIT-JEE%20%7C%20EAMCET%20Long%20Term%20%26%20Short%20Term%20Coaching%20Centres%20in%20Dilsukhnagar%2CHyderabad!5e0!3m2!1sen!2sin!4v1764833523660!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best INTERMEDIATE with NEET(BIPC) and IIT-JEE (MPC) Junior College in Gokul
                  Plots,Kphb,Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15222.231098359616!2d78.35968765541993!3d17.480867800000023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93f6e6e4d1ff%3A0xa1369abe0798c17e!2sRANKRISE%20-%20Best%20INTERMEDIATE%20with%20NEET(BIPC)%20and%20IIT-JEE%20(MPC)%20Junior%20College%20in%20Gokul%20Plots%2CKphb%2CHyderabad!5e0!3m2!1sen!2sin!4v1764835096730!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col-md-6">
          <div className="card shadow p-3" style={{borderRadius: 12}}>
            <div className="row  align-items-center">
              <div className="col-md-6">
                <p className="mb-1">RANKRISE - Best Junior Inter college with NEET, IIT-JEE &amp; EAMCET Coaching in Miyapur,
                  Hyderabad</p>
                <p className="mb-1"><strong className="subHcolor">Admission Support:</strong> 9948962952</p>
                <p className="mb-3"><strong>Email:</strong>
                  <a href="mailto:info@rankrise.in" style={{textDecoration: 'none'}}>info@rankrise.in</a>
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="fw-bold">Our Location:</h6>
                <div className="map-container" style={{borderRadius: 10, overflow: 'hidden'}}>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.229830283775!2d78.37049737377289!3d17.496538899654233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb939341daef15%3A0x90d3d4a3a97f6ea8!2sRANKRISE%20-%20Best%20Junior%20Inter%20college%20with%20NEET%2C%20IIT-JEE%20%26%20EAMCET%20Coaching%20in%20Miyapur%2C%20Hyderabad!5e0!3m2!1sen!2sin!4v1764835171152!5m2!1sen!2sin" width="100%" height={200} style={{border: 0}} allowFullScreen loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

  </div>
  );
};

export default Contact;
