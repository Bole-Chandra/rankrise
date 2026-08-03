import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { useUserAuth } from '../context/UserAuthContext';
import { getImageSrc } from '../utils/imageSrc';

const Blogs = () => {
  const { user } = useUserAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.AOS) window.AOS.refresh();

    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="blogs-page">
      <Helmet>
        <title>Blog | Rankrise - Study Tips, Exam Updates & Coaching Insights</title>
        <meta name="description" content="Read Rankrise's blog for IIT-JEE, NEET & EAMCET preparation tips, exam updates, study strategies, and success stories from our top rankers." />
        <meta name="keywords" content="IIT JEE tips, NEET preparation blog, EAMCET study material, coaching blog Hyderabad" />
        <link rel="canonical" href="https://rankrise.in/blog" />
        <meta property="og:title" content="Blog | Rankrise - Study Tips, Exam Updates & Coaching Insights" />
        <meta property="og:description" content="Read Rankrise's blog for IIT-JEE, NEET & EAMCET preparation tips, exam updates, study strategies, and success stories from our top rankers." />
        <meta property="og:url" content="https://rankrise.in/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://rankrise.in/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://rankrise.in/blog' },
            ],
          })}
        </script>
      </Helmet>

      <section className="py-5 bg-light">
        <div className="container">
          <h1>Blogs</h1>
          <h2 className="h5 text-muted fw-normal mb-4">Study tips, exam updates & insights from Rankrise</h2>

          {/* ─── Single, clean login/signup access point ─────────────────── */}
          <div
            className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 mb-4"
            style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}
          >
            {user ? (
              <>
                <div>
                  <span className="fw-bold" style={{ color: '#015927' }}>Welcome back, {user.name}</span>
                  <span className="text-muted small ms-2 text-capitalize">({user.role})</span>
                </div>
                <Link to="/dashboard" className="btn btn-sm fw-bold text-white" style={{ background: '#015927' }}>
                  <i className="fa-solid fa-gauge me-1"></i>My Dashboard
                </Link>
              </>
            ) : (
              <>
                <div className="small text-muted">
                  <i className="fa-solid fa-pen-nib me-2" style={{ color: '#015927' }}></i>
                  Are you a student or teacher? Log in to write and publish articles.
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/login" className="btn btn-sm fw-bold" style={{ border: '1px solid #015927', color: '#015927' }}>
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-sm fw-bold text-white" style={{ background: '#015927' }}>
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* ─── Blog grid ─────────────────────────────────────────────────── */}
          {loading ? (
            <div className="text-center py-5 text-muted">Loading articles...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="fa-solid fa-inbox fa-3x mb-3 d-block"></i>
              <p>No articles published yet — check back soon!</p>
            </div>
          ) : (
            <div className="row py-2 g-4">
              {blogs.map((blog) => (
                <div className="col-md-3 col-sm-6" key={blog._id}>
                  <div className="blog-card h-100">
                    <div className="blog-img">
                      <img src={getImageSrc(blog.image)} alt={blog.title} className="w-100" />
                    </div>
                    <div className="blog-content">
                      <small className="text-muted">
                        {new Date(blog.createdAt).toLocaleDateString()} · {blog.author}
                      </small>
                      <h4 className="mt-2">{blog.title}</h4>
                      {blog.summary && <p>{blog.summary}</p>}
                      <Link to={`/blog/${blog.slug}`} className="read-more">Read more →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
