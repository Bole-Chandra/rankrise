import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import { getImageSrc } from '../utils/imageSrc';
import 'react-quill-new/dist/quill.core.css'; // renders .ql-align-*/.ql-indent-* classes correctly — without this, formatting applied in the editor (alignment, indents) silently doesn't render here
import './BlogPostView.css';

const slugifyHeading = (text) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const BlogPostView = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toc, setToc] = useState([]);
  const [related, setRelated] = useState([]);
  const bodyRef = useRef(null);

  // Static fallback data in case DB is offline or empty
  const fallbackBlogs = {
    'top-iit-coaching-institutes-in-hyderabad': {
      title: 'Top IIT Coaching Institutes in Hyderabad',
      content: `
        <p>Choosing the right IIT coaching institute is one of the most critical decisions for engineering aspirants. With the competition getting tougher every year, students need more than just textbook knowledge—they need a structured strategy, expert mentorship, and a competitive environment to thrive.</p>
        <p>Rankrise has established itself as the leading name for IIT-JEE coaching in Hyderabad. Our integrated curriculum merges intermediate board education with deep JEE syllabus preparation, ensuring that students excel in both their college exams and national-level entrances.</p>
        <h4>What Makes Rankrise the Best for IIT-JEE?</h4>
        <ul>
          <li><strong>Expert Faculty:</strong> Learn from seasoned teachers who have guided hundreds of students to single and double-digit All India Ranks.</li>
          <li><strong>Structured Methodology:</strong> Daily assignments, weekly tests, and detailed concept discussions.</li>
          <li><strong>Personalized Doubt Sessions:</strong> Regular face-to-face sessions to clear individual student queries.</li>
        </ul>
      `,
      summary: 'Discover why Rankrise is the premier choice for IIT-JEE preparation in Hyderabad with expert faculty and proven results.',
      author: 'Ethan Brooks',
      image: '/assets/public/hero-slider1.webp',
      createdAt: 'February 22, 2024'
    },
    'top-neet-coaching-institute-in-hyderabad': {
      title: 'Top NEET Coaching Institute in Hyderabad',
      content: `
        <p>Securing a medical seat requires absolute dedication, clean concepts, and extreme accuracy. At Rankrise, our NEET coaching program is tailored to help students navigate the vast medical syllabus with ease and confidence.</p>
        <p>Our teaching model focuses on conceptual clarity in Biology, Physics, and Chemistry, supplemented with comprehensive study materials, exhaustive test series, and personalized revision tracking.</p>
        <h4>Key Program Highlights:</h4>
        <ul>
          <li><strong>NCERT-Centric Lectures:</strong> Complete alignment with the NCERT curriculum, which forms the bedrock of NEET.</li>
          <li><strong>Regular Mock Tests:</strong> Weekly chapter tests and full-syllabus mock exams designed on the latest NTA patterns.</li>
          <li><strong>Progress Analysis:</strong> Regular performance reviews with students and parents to target weak areas.</li>
        </ul>
      `,
      summary: 'Everything you need to know about preparing for the NEET medical entrance exam with Rankrise.',
      author: 'Dr. Sarah James',
      image: '/assets/public/hero-slider3.webp',
      createdAt: 'March 27, 2024'
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/blogs/${slug}`);
        setBlog(res.data);
        setError(null);

        // Related articles — a few other published posts, for internal
        // linking (helps both SEO and keeps readers on the site longer).
        try {
          const allRes = await api.get('/api/blogs');
          const others = allRes.data.filter((b) => b.slug !== slug).slice(0, 3);
          setRelated(others);
        } catch { /* non-critical — related articles just won't show */ }
      } catch (err) {
        console.warn('Backend API failed, using local fallback data.', err.message);
        // Fallback to static data
        if (fallbackBlogs[slug]) {
          setBlog(fallbackBlogs[slug]);
        } else {
          setError('Blog post not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  // Auto-generate a table of contents from the H2/H3 headings actually
  // present in this post's content — assigns each one an anchor ID so the
  // TOC links jump straight to that section.
  useEffect(() => {
    if (!blog?.content || !bodyRef.current) { setToc([]); return; }
    const headings = bodyRef.current.querySelectorAll('h2, h3');
    const items = [];
    headings.forEach((el, idx) => {
      const text = el.textContent.trim();
      if (!text) return;
      const id = `${slugifyHeading(text)}-${idx}`;
      el.id = id;
      items.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 });
    });
    setToc(items);
  }, [blog]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger">{error || 'Blog post not found.'}</h2>
        <Link to="/blog" className="btn btn-success mt-3">Back to Blog</Link>
      </div>
    );
  }

  const canonicalUrl = `https://rankrise.in/blog/${slug}`;

  return (
    <div className="blogpost-page">
      <Helmet>
        <title>{blog.title} | Rankrise</title>
        <meta name="description" content={blog.summary || 'Rankrise Blog Post'} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${blog.title} | Rankrise`} />
        <meta property="og:description" content={blog.summary || 'Rankrise Blog Post'} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
        {blog.image && <meta property="og:image" content={getImageSrc(blog.image).startsWith('http') ? getImageSrc(blog.image) : `https://rankrise.in${getImageSrc(blog.image)}`} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.summary || 'Rankrise Blog Post'} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: blog.title,
            description: blog.summary || '',
            image: blog.image ? (getImageSrc(blog.image).startsWith('http') ? getImageSrc(blog.image) : `https://rankrise.in${getImageSrc(blog.image)}`) : undefined,
            author: { '@type': 'Person', name: blog.author || 'Rankrise' },
            publisher: {
              '@type': 'Organization',
              name: 'Rankrise Educational Institutions',
              logo: { '@type': 'ImageObject', url: 'https://rankrise.in/assets/public/Rankriselogo.webp' },
            },
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
          })}
        </script>
      </Helmet>

      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <Link to="/blog" className="btn btn-outline-success btn-sm mb-4">
                <i className="fa-solid fa-arrow-left me-1"></i> Back to Blog
              </Link>

              <h1 className="fw-bold mb-3" style={{ color: '#015927' }}>{blog.title}</h1>
              
              <div className="d-flex align-items-center gap-3 text-muted mb-4 pb-3 border-bottom">
                <span><i className="fa-solid fa-user me-1"></i> {blog.author || 'Admin'}</span>
                <span>|</span>
                <span><i className="fa-solid fa-calendar me-1"></i> {new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {blog.image && (
                <img 
                  src={getImageSrc(blog.image)} 
                  alt={blog.title} 
                  className="img-fluid rounded shadow mb-4 w-100" 
                  style={{ maxHeight: '450px', objectFit: 'cover' }} 
                />
              )}

              {blog.summary && (
                <p className="lead text-muted mb-4" style={{ fontSize: '1.15rem' }}>{blog.summary}</p>
              )}

              {toc.length > 1 && (
                <nav className="blog-toc" aria-label="Table of contents">
                  <div className="blog-toc-title">Table of Contents</div>
                  <ol>
                    {toc.map((item) => (
                      <li key={item.id} style={item.level === 3 ? { marginLeft: '16px', listStyleType: 'circle' } : undefined}>
                        <a href={`#${item.id}`}>{item.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              <div ref={bodyRef} className="blog-body fs-5" dangerouslySetInnerHTML={{ __html: blog.content }} />

              {/* Bottom: author, updated date, contact CTA */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-5 pt-4 border-top text-muted small">
                <div>
                  <div><strong>Written by</strong> {blog.author || 'Rankrise'}</div>
                  <div>Last updated: {new Date(blog.updatedAt || blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <Link to="/admissions" className="btn btn-sm fw-bold text-white" style={{ background: '#015927' }}>
                  <i className="fa-solid fa-graduation-cap me-1"></i> Enquire About Admissions
                </Link>
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <div className="mt-5 pt-4">
                  <h3 className="fw-bold mb-4" style={{ color: '#015927', fontSize: '1.3rem' }}>Related Articles</h3>
                  <div className="row g-3">
                    {related.map((r) => (
                      <div key={r._id} className="col-md-4">
                        <Link to={`/blog/${r.slug}`} className="related-article-card">
                          <img
                            src={getImageSrc(r.image)}
                            alt={r.title}
                            style={{ width: '100%', height: '130px', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = '/assets/public/Rankriselogo.webp'; }}
                          />
                          <div className="p-3">
                            <h6 className="fw-bold mb-0" style={{ fontSize: '0.9rem' }}>{r.title}</h6>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostView;
