const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Blog = require('../models/Blog');

const SITE_URL = 'https://rankrise.in';

// Fixed, non-dynamic pages. Keep this in sync with client/src/routes/AppRoutes.jsx
// if new static pages are added.
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/admissions', changefreq: 'monthly', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/gallery/photo', changefreq: 'monthly', priority: '0.5' },
  { path: '/gallery/video', changefreq: 'monthly', priority: '0.5' },
  { path: '/courses/iit-jee', changefreq: 'monthly', priority: '0.9' },
  { path: '/courses/neet', changefreq: 'monthly', priority: '0.9' },
  { path: '/courses/eamcet', changefreq: 'monthly', priority: '0.9' },
  { path: '/courses/bitsat', changefreq: 'monthly', priority: '0.9' },
  { path: '/college/mpc-iit', changefreq: 'monthly', priority: '0.8' },
  { path: '/college/bipc-neet', changefreq: 'monthly', priority: '0.8' },
  { path: '/college/mpc-eamcet', changefreq: 'monthly', priority: '0.8' },
  { path: '/top-iit-institutes', changefreq: 'monthly', priority: '0.7' },
  { path: '/top-neet-institutes', changefreq: 'monthly', priority: '0.7' },
  { path: '/top-eamcet-institutes', changefreq: 'monthly', priority: '0.7' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-conditions', changefreq: 'yearly', priority: '0.3' },
];

const urlEntry = ({ loc, lastmod, changefreq, priority }) => `  <url>
    <loc>${loc}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

router.get('/sitemap.xml', async (req, res) => {
  try {
    const staticEntries = staticRoutes.map((r) =>
      urlEntry({ loc: `${SITE_URL}${r.path}`, changefreq: r.changefreq, priority: r.priority })
    );

    // Pull in every blog post so new posts show up automatically without
    // needing to touch this file. Degrades gracefully — if the DB is
    // unreachable, the sitemap still returns with just the static pages
    // rather than failing entirely.
    let blogEntries = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const blogs = await Blog.find().select('slug createdAt').lean();
        blogEntries = blogs.map((b) =>
          urlEntry({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: new Date(b.createdAt).toISOString().split('T')[0],
            changefreq: 'monthly',
            priority: '0.6',
          })
        );
      } catch (dbErr) {
        console.warn('⚠️  sitemap.xml: failed to fetch blog posts, serving static routes only:', dbErr.message);
      }
    } else {
      console.warn('⚠️  sitemap.xml: database not connected, serving static routes only.');
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...blogEntries].join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('❌ Failed to generate sitemap.xml:', error.message);
    res.status(500).send('Failed to generate sitemap');
  }
});

module.exports = router;
