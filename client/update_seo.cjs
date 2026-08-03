/**
 * Updates Helmet SEO tags in all JSX page files with proper, unique meta descriptions,
 * keywords, canonical URLs, and Open Graph tags.
 */
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const baseUrl = 'https://rankrise.in';

// SEO data for each page
const seoData = {
  'Home.jsx': {
    title: 'Rankrise Educational Institutions | Best IIT-JEE, NEET & EAMCET Coaching in Hyderabad',
    description: 'Rankrise is a leading coaching institute in Hyderabad since 2011, offering IIT-JEE, NEET, EAMCET & BITSAT coaching with proven results. Join 15,000+ successful students.',
    keywords: 'IIT JEE coaching Hyderabad, NEET coaching Hyderabad, EAMCET coaching, best coaching institute Hyderabad, Rankrise',
    path: '/'
  },
  'About.jsx': {
    title: 'About Rankrise | Our Mission, Vision & Legacy Since 2011',
    description: 'Learn about Rankrise Educational Institutions - Hyderabad\'s trusted coaching center since 2011. Our expert faculty, proven methodology, and 15,000+ trained students.',
    keywords: 'about Rankrise, coaching institute history, Rankrise mission, best teachers Hyderabad',
    path: '/about'
  },
  'Contact.jsx': {
    title: 'Contact Us | Rankrise Coaching Centers Hyderabad',
    description: 'Get in touch with Rankrise Educational Institutions. Visit our campus, call us at +91 9948962952, or fill our enquiry form for IIT-JEE, NEET & EAMCET coaching details.',
    keywords: 'Rankrise contact, coaching center address Hyderabad, Rankrise phone number',
    path: '/contact'
  },
  'Admissions.jsx': {
    title: 'Admissions Open 2026-2027 | Rankrise Coaching Centers',
    description: 'Apply now for IIT-JEE, NEET, EAMCET & BITSAT coaching at Rankrise. Admissions open for 2026-2027 session. Scholarships available for meritorious students.',
    keywords: 'Rankrise admissions, coaching admission 2026, IIT JEE admission Hyderabad, NEET coaching enrollment',
    path: '/admissions'
  },
  'Blogs.jsx': {
    title: 'Blog | Rankrise - Study Tips, Exam Updates & Coaching Insights',
    description: 'Read Rankrise\'s blog for IIT-JEE, NEET & EAMCET preparation tips, exam updates, study strategies, and success stories from our top rankers.',
    keywords: 'IIT JEE tips, NEET preparation blog, EAMCET study material, coaching blog Hyderabad',
    path: '/blog'
  },
  'Gallery.jsx': {
    title: 'Campus Gallery | Rankrise Educational Institutions',
    description: 'Explore Rankrise campus life, student achievements, AIR rankers, lab facilities, classroom infrastructure, and events across our Hyderabad coaching centers.',
    keywords: 'Rankrise gallery, coaching campus Hyderabad, IIT JEE rankers, NEET results, coaching photos',
    path: '/gallery'
  },
  'PrivacyPolicy.jsx': {
    title: 'Privacy Policy | Rankrise Educational Institutions',
    description: 'Read the privacy policy of Rankrise Educational Institutions. Learn how we handle your personal data and protect your privacy.',
    keywords: 'Rankrise privacy policy',
    path: '/privacy-policy'
  },
  'TermsConditions.jsx': {
    title: 'Terms & Conditions | Rankrise Educational Institutions',
    description: 'Read the terms and conditions of Rankrise Educational Institutions for enrollment, coaching services, and website usage.',
    keywords: 'Rankrise terms, coaching terms and conditions',
    path: '/terms-conditions'
  },
  'IITJEE.jsx': {
    title: 'Best IIT-JEE Coaching in Hyderabad | Rankrise',
    description: 'Join Rankrise for the best IIT-JEE coaching in Hyderabad. Expert faculty, comprehensive study material, and proven track record with AIR 69, 85+ rankers.',
    keywords: 'IIT JEE coaching Hyderabad, best JEE institute, IIT coaching center, JEE Advanced preparation',
    path: '/courses/iit-jee'
  },
  'NEET.jsx': {
    title: 'Best NEET Coaching in Hyderabad | Rankrise',
    description: 'Rankrise offers the best NEET coaching in Hyderabad with expert Biology, Chemistry & Physics faculty. Structured curriculum for medical entrance exam success.',
    keywords: 'NEET coaching Hyderabad, best NEET institute, medical entrance coaching, NEET preparation',
    path: '/courses/neet'
  },
  'EAMCET.jsx': {
    title: 'Best EAMCET Coaching in Hyderabad | Rankrise',
    description: 'Top EAMCET coaching institute in Hyderabad. Rankrise provides comprehensive TS/AP EAMCET preparation with expert faculty and result-oriented methodology.',
    keywords: 'EAMCET coaching Hyderabad, best EAMCET institute, TS EAMCET preparation, AP EAMCET coaching',
    path: '/courses/eamcet'
  },
  'BITSAT.jsx': {
    title: 'Best BITSAT Coaching in Hyderabad | Rankrise',
    description: 'Excel in BITSAT with Rankrise\'s specialized coaching in Hyderabad. Targeted preparation for BITS Pilani admission with mock tests and expert guidance.',
    keywords: 'BITSAT coaching Hyderabad, BITS Pilani preparation, BITSAT coaching center',
    path: '/courses/bitsat'
  },
  'MPC_IIT.jsx': {
    title: 'MPC with IIT-JEE Integrated Course | Rankrise Jr College',
    description: 'Rankrise offers Intermediate MPC with IIT-JEE integrated coaching in Hyderabad. Complete 2-year program covering board exams and JEE preparation simultaneously.',
    keywords: 'MPC IIT JEE Hyderabad, intermediate with JEE coaching, junior college IIT',
    path: '/college/mpc-iit'
  },
  'BiPC_NEET.jsx': {
    title: 'BiPC with NEET Integrated Course | Rankrise Jr College',
    description: 'Rankrise BiPC with NEET integrated coaching in Hyderabad. 2-year Intermediate + NEET program with expert Biology faculty and medical entrance preparation.',
    keywords: 'BiPC NEET Hyderabad, intermediate with NEET, junior college NEET coaching',
    path: '/college/bipc-neet'
  },
  'MPC_EAMCET.jsx': {
    title: 'MPC with EAMCET Integrated Course | Rankrise Jr College',
    description: 'Rankrise MPC with EAMCET integrated coaching in Hyderabad. 2-year program for Intermediate board + TS/AP EAMCET engineering entrance preparation.',
    keywords: 'MPC EAMCET Hyderabad, intermediate with EAMCET, junior college EAMCET',
    path: '/college/mpc-eamcet'
  },
  'TopIIT.jsx': {
    title: 'Top IIT Coaching Institutes in Hyderabad | Compare & Choose',
    description: 'Compare the top IIT-JEE coaching institutes in Hyderabad. Find the best coaching center for your JEE preparation with rankings, reviews, and fee comparison.',
    keywords: 'top IIT coaching Hyderabad, best JEE institutes comparison, IIT coaching ranking',
    path: '/top-iit-coaching'
  },
  'TopNEET.jsx': {
    title: 'Top NEET Coaching Institutes in Hyderabad | Compare & Choose',
    description: 'Compare the top NEET coaching institutes in Hyderabad. Find the best coaching center for medical entrance preparation.',
    keywords: 'top NEET coaching Hyderabad, best NEET institutes comparison',
    path: '/top-neet-coaching'
  },
  'TopEAMCET.jsx': {
    title: 'Top EAMCET Coaching Institutes in Hyderabad | Compare & Choose',
    description: 'Compare the top EAMCET coaching institutes in Hyderabad for TS/AP EAMCET engineering entrance exam preparation.',
    keywords: 'top EAMCET coaching Hyderabad, best EAMCET institutes comparison',
    path: '/top-eamcet-coaching'
  }
};

function processFile(filePath) {
  const basename = path.basename(filePath);
  const data = seoData[basename];
  if (!data) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  // Build the new Helmet block
  const newHelmet = `<Helmet>
        <title>${data.title}</title>
        <meta name="description" content="${data.description}" />
        <meta name="keywords" content="${data.keywords}" />
        <link rel="canonical" href="${baseUrl}${data.path}" />
        <meta property="og:title" content="${data.title}" />
        <meta property="og:description" content="${data.description}" />
        <meta property="og:url" content="${baseUrl}${data.path}" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Rankrise Educational Institutions" />
      </Helmet>`;

  // Replace existing Helmet block
  content = content.replace(/<Helmet>[\s\S]*?<\/Helmet>/, newHelmet);

  fs.writeFileSync(filePath, content);
  console.log(`SEO updated: ${basename}`);
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (file.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir(pagesDir);
console.log('\nDone. All pages have full SEO meta tags.');
