import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getImageSrc } from '../utils/imageSrc';

const CATEGORIES = ['All', 'General', 'Campus Tour', 'Student Testimonials', 'Events', 'Results', 'Other'];

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();

    const fetchVideos = async () => {
      try {
        const res = await api.get('/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setActiveVideo(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const filteredVideos = filter === 'All'
    ? videos
    : videos.filter((v) => v.category === filter);

  return (
    <>
      <Helmet>
        <title>Video Gallery | Rankrise</title>
        <meta name="description" content="Watch videos of events, student testimonials, and campus tours at Rankrise Coaching Institute." />
        <link rel="canonical" href="https://rankrise.in/gallery/video" />
        <meta property="og:title" content="Video Gallery | Rankrise" />
        <meta property="og:description" content="Watch videos of events, student testimonials, and campus tours at Rankrise Coaching Institute." />
        <meta property="og:url" content="https://rankrise.in/gallery/video" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'Video Gallery', item: 'https://rankrise.in/gallery/video' },
            ],
          })}
        </script>
      </Helmet>

      {/* Header Banner */}
      <div className="inner-banner py-5" style={{ background: 'linear-gradient(rgba(1, 89, 39, 0.9), rgba(1, 89, 39, 0.9)), url("/assets/public/campus/slider1.JPG") center/cover' }}>
        <div className="container text-center text-white py-4">
          <h1 className="fw-bold display-4 mb-3" style={{ color: '#f3f001' }}>Video Gallery</h1>
          <p className="lead">Watch highlights and student experiences at Rankrise</p>
        </div>
      </div>

      <div className="container py-5 my-4">
        {/* Category Filters */}
        <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn px-4 py-2 fw-bold ${filter === cat ? 'text-white' : 'btn-outline-secondary'}`}
              style={filter === cat ? { background: '#015927', borderRadius: '25px', fontSize: '14px' } : { borderRadius: '25px', fontSize: '14px' }}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5 text-muted">Loading videos...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="row">
            <div className="col-12 text-center text-muted py-5 my-5">
              <i className="fa-brands fa-youtube fs-1 text-danger mb-3"></i>
              <h3>{videos.length === 0 ? 'No Videos Yet' : 'No videos in this category'}</h3>
              <p>{videos.length === 0 ? 'Check back soon — we regularly add new campus and event videos!' : 'Try a different category above.'}</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {filteredVideos.map((video) => {
              const ytId = video.type === 'youtube' ? getYouTubeId(video.videoUrl) : null;
              const thumbSrc = video.type === 'youtube'
                ? (video.thumbnail ? getImageSrc(video.thumbnail) : (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null))
                : (video.thumbnail ? getImageSrc(video.thumbnail) : null);

              return (
                <div key={video._id} className="col-md-4 col-sm-6">
                  <div
                    className="position-relative rounded-3 overflow-hidden shadow-sm"
                    style={{ cursor: 'pointer', aspectRatio: '16/9', background: '#000' }}
                    onClick={() => setActiveVideo(video)}
                  >
                    {thumbSrc ? (
                      <img src={thumbSrc} alt={video.title || 'Video thumbnail'} className="w-100 h-100" style={{ objectFit: 'cover' }} loading="lazy" />
                    ) : (
                      <video src={getImageSrc(video.videoUrl)} className="w-100 h-100" style={{ objectFit: 'cover' }} muted preload="metadata" />
                    )}
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <i className="fa-solid fa-circle-play fa-3x text-white" style={{ opacity: 0.9 }}></i>
                    </div>
                    <span
                      className="position-absolute top-0 end-0 m-2 badge"
                      style={{ background: video.type === 'youtube' ? '#ff0000' : '#015927', fontSize: '0.7rem' }}
                    >
                      {video.type === 'youtube' ? 'YouTube' : 'Video'}
                    </span>
                  </div>
                  <h6 className="fw-bold mt-2 mb-0">{video.title}</h6>
                  <span className="text-muted small">{video.category}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.85)', zIndex: 1050 }}
          onClick={() => setActiveVideo(null)}
        >
          <div style={{ width: '90%', maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-end mb-2">
              <button className="btn btn-light btn-sm" onClick={() => setActiveVideo(null)}>
                <i className="fa-solid fa-xmark"></i> Close
              </button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              {activeVideo.type === 'youtube' ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.videoUrl)}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: '10px' }}
                />
              ) : (
                <video
                  src={getImageSrc(activeVideo.videoUrl)}
                  controls
                  autoPlay
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '10px' }}
                />
              )}
            </div>
            <h5 className="text-white fw-bold text-center mt-3">{activeVideo.title}</h5>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoGallery;
