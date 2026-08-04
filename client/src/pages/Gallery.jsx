import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getImageSrc } from '../utils/imageSrc';
import './Gallery.css';

const CATEGORIES = ['All', 'Events', 'Campus', 'Results', 'Achievements', 'Other'];

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();

    const fetchImages = async () => {
      try {
        const res = await api.get('/api/gallery');
        setImages(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const filteredImages = filter === 'All'
    ? images
    : images.filter((img) => img.category === filter);

  return (
    <div className="gallery-page">
      <Helmet>
        <title>Campus Gallery | Rankrise Educational Institutions</title>
        <meta name="description" content="Explore Rankrise campus life, student achievements, AIR rankers, lab facilities, classroom infrastructure, and events across our Hyderabad coaching centers." />
        <meta name="keywords" content="Rankrise gallery, coaching campus Hyderabad, IIT JEE rankers, NEET results, coaching photos" />
        <link rel="canonical" href="https://rankrise.in/gallery/photo" />
        <meta property="og:title" content="Campus Gallery | Rankrise Educational Institutions" />
        <meta property="og:description" content="Explore Rankrise campus life, student achievements, AIR rankers, lab facilities, classroom infrastructure, and events across our Hyderabad coaching centers." />
        <meta property="og:url" content="https://rankrise.in/gallery/photo" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'Photo Gallery', item: 'https://rankrise.in/gallery/photo' },
            ],
          })}
        </script>
      </Helmet>

      {/* Hero Banner */}
      <section className="gallery-hero text-center text-white py-5" style={{
        background: 'linear-gradient(135deg, rgba(1,89,39,0.95), rgba(11,107,42,0.9))',
        minHeight: '250px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container">
          <h1 className="fw-bold display-5 mb-3" data-aos="fade-up">
            Campus <span style={{ color: '#f3f001' }}>Gallery</span>
          </h1>
          <p className="fs-5 mb-0 mx-auto" style={{ maxWidth: '600px', opacity: 0.9 }} data-aos="fade-up" data-aos-delay="100">
            A glimpse into our campus life, rank celebrations, world-class facilities, and institutional events.
          </p>
        </div>
      </section>

      {/* Filter & Gallery Grid */}
      <section className="py-5">
        <div className="container">
          {/* Category Filters */}
          <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap" data-aos="fade-up">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`btn px-4 py-2 fw-bold ${filter === cat ? 'active-filter' : 'inactive-filter'}`}
                onClick={() => setFilter(cat)}
                style={{ borderRadius: '25px', fontSize: '14px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted">Loading gallery...</div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="row g-4">
                {filteredImages.map((img, idx) => (
                  <div key={img._id} className="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay={idx * 50}>
                    <div
                      className="gallery-card-item position-relative overflow-hidden rounded-3 shadow-sm"
                      style={{ cursor: 'pointer', height: '240px' }}
                      onClick={() => setLightbox(img)}
                    >
                      <img
                        src={getImageSrc(img.image)}
                        alt={img.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        loading="lazy"
                        onError={(e) => { e.target.src = '/assets/public/Rankriselogo.webp'; }}
                      />
                      <div className="gallery-overlay d-flex flex-column align-items-center justify-content-center text-white p-3">
                        <span className="badge bg-warning text-dark mb-2 px-3 py-1" style={{ fontSize: '11px' }}>{img.category}</span>
                        <h6 className="mb-0 text-center" style={{ fontSize: '13px', fontWeight: 600 }}>{img.title}</h6>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="text-center py-5">
                  <i className="fa-solid fa-images fa-3x text-muted mb-3 d-block"></i>
                  <p className="text-muted fs-5">
                    {images.length === 0 ? 'No photos have been added yet — check back soon!' : 'No images found for this category.'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="gallery-lightbox d-flex align-items-center justify-content-center"
          onClick={() => setLightbox(null)}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">
              <i className="fas fa-times"></i>
            </button>
            <img src={getImageSrc(lightbox.image)} alt={lightbox.title} className="img-fluid rounded-3" />
            <div className="text-center mt-3">
              <h5 className="fw-bold text-white mb-1">{lightbox.title}</h5>
              <span className="badge bg-warning text-dark">{lightbox.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
