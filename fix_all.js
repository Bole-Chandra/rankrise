const fs = require('fs');
const path = require('path');

const originalIndex = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');

function fixAssets(htmlStr) {
  return htmlStr
    .replace(/(src|href|srcset)="(?:\.\.\/)?assets\//g, '$1="/assets/')
    .replace(/(src|href|srcset)='(?:\.\.\/)?assets\//g, "$1='/assets/")
    .replace(/url\(['"]?(?:\.\.\/)?assets\//g, 'url(\'/assets/');
}

function extractSection(startStr, endStr, outputName) {
  let startIndex = originalIndex.indexOf(startStr);
  let endIndex = originalIndex.indexOf(endStr, startIndex) + endStr.length;
  if (startIndex === -1 || endIndex === -1) {
    console.error(`Could not find ${outputName}`);
    return;
  }
  
  let content = originalIndex.substring(startIndex, endIndex);
  content = fixAssets(content);
  content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  
  // Make sure internal links just use regular a tags since we are raw injecting
  // But fix index.html -> /
  content = content.replace(/href="index\.html"/g, 'href="/"');
  // For admissions (used to be careers)
  content = content.replace(/href="careers\.html"/g, 'href="/admissions"');
  
  const jsx = `import React from 'react';
const ${outputName} = () => {
  return <div dangerouslySetInnerHTML={{ __html: \`${content}\` }} />;
};
export default ${outputName};
`;
  
  fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'components', `${outputName}.jsx`), jsx);
  console.log(`Generated ${outputName}.jsx`);
}

// TopInfoBar: <div class="top-bar"> to </div> </div> </div> (it ends right before <!-- Navbar -->)
extractSection('<div class="top-bar">', '<!-- Navbar -->', 'TopInfoBar');
// But the above might include the comment. Let's precise:
function extractByTags(startTag, endTag, outputName) {
  let startIndex = originalIndex.indexOf(startTag);
  let endIndex = originalIndex.indexOf(endTag, startIndex) + endTag.length;
  let content = originalIndex.substring(startIndex, endIndex);
  content = fixAssets(content);
  content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  content = content.replace(/href="index\.html"/g, 'href="/"');
  content = content.replace(/href="careers\.html"/g, 'href="/admissions"');
  const jsx = `import React from 'react';
const ${outputName} = () => {
  return <div dangerouslySetInnerHTML={{ __html: \`${content}\` }} />;
};
export default ${outputName};
`;
  fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'components', `${outputName}.jsx`), jsx);
  console.log(`Generated ${outputName}.jsx`);
}

extractByTags('<div class="top-bar">', '</div>\r\n    </div>\r\n  </div>', 'TopInfoBar');
extractByTags('<nav class="navbar', '</nav>', 'Navbar');
extractByTags('<section class="bg-light py-5">', '</footer>', 'Footer');

// Floating Widgets
extractByTags('<div class="floating-whatsapp">', 'Ask Rankrise\r\n    </a>\r\n  </div>', 'FloatingWidgets');

// Contact Modal
let modalStart = originalIndex.indexOf('<div class="quick-enquiry-tab"');
let modalEnd = originalIndex.indexOf('</div>\r\n      </div>\r\n    </div>\r\n  </div>', modalStart) + 40;
let modalContent = originalIndex.substring(modalStart, modalEnd);
modalContent = fixAssets(modalContent);
modalContent = modalContent.replace(/`/g, '\\`').replace(/\$/g, '\\$');
const modalJsx = `import React from 'react';
const ContactModal = () => {
  return <div dangerouslySetInnerHTML={{ __html: \`${modalContent}\` }} />;
};
export default ContactModal;
`;
fs.writeFileSync(path.join(__dirname, 'frontend', 'src', 'components', 'ContactModal.jsx'), modalJsx);


// Now re-run page extractions with fixAssets
const pages = [
  { in: '../index.html', out: 'Home.jsx', name: 'Home' },
  { in: '../aboutus.html', out: 'About.jsx', name: 'About' },
  { in: '../conatct.html', out: 'Contact.jsx', name: 'Contact' },
  { in: '../blog.html', out: 'Blog.jsx', name: 'Blog' },
  { in: '../best-iit-coaching-in-hyderabad.html', out: 'BestIIT.jsx', name: 'BestIIT' },
  { in: '../best-neet-coaching-in-hyderabad.html', out: 'BestNEET.jsx', name: 'BestNEET' },
  { in: '../best-eamcet-coaching-in-hyderabad.html', out: 'BestEAMCET.jsx', name: 'BestEAMCET' },
  { in: '../best-bitsat-coaching-in-hyderabad.html', out: 'BestBITSAT.jsx', name: 'BestBITSAT' },
  { in: '../mpc-with-iit-coaching-hyderabad.html', out: 'MPCIIT.jsx', name: 'MPCIIT' },
  { in: '../bipc-with-neet-coaching-hyderabad.html', out: 'BiPCNEET.jsx', name: 'BiPCNEET' },
  { in: '../mpc-with-eamcet-coaching-hyderabad.html', out: 'MPCEAMCET.jsx', name: 'MPCEAMCET' },
  { in: '../Top-IIT-Coaching-Institutes-in-Hyderabad.html', out: 'TopIIT.jsx', name: 'TopIIT' },
  { in: '../Top-NEET-Coaching-Institute-in-Hyderabad.html', out: 'TopNEET.jsx', name: 'TopNEET' },
  { in: '../Top-EAMCET-Coaching-Institutes-in-Hyderabad.html', out: 'TopEAMCET.jsx', name: 'TopEAMCET' },
  { in: '../privacy-policy.html', out: 'PrivacyPolicy.jsx', name: 'PrivacyPolicy' },
  { in: '../terms-conditions.html', out: 'TermsConditions.jsx', name: 'TermsConditions' }
];

for (const page of pages) {
  const inPath = path.join(__dirname, page.in);
  const outPath = path.join(__dirname, 'frontend', 'src', 'pages', page.out);
  if (!fs.existsSync(inPath)) continue;

  const html = fs.readFileSync(inPath, 'utf-8');
  let startIndex = html.indexOf('</nav>');
  if (startIndex !== -1) {
    startIndex = html.indexOf('>', startIndex) + 1;
  } else {
    // For privacy policy / terms which have no nav
    startIndex = html.indexOf('<body>') + 6;
    let b = html.indexOf('<div class="top-bar">');
    if(b === -1) startIndex = html.indexOf('<body>') + 6;
  }

  let endIndex = html.indexOf('<footer');
  if (endIndex === -1) endIndex = html.indexOf('<section class="bg-light py-5">'); 
  if (endIndex === -1) endIndex = html.lastIndexOf('</body>');
  
  let content = html.substring(startIndex, endIndex).trim();
  content = fixAssets(content);
  content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
  content = content.replace(/href="index\.html"/g, 'href="/"');
  content = content.replace(/href="careers\.html"/g, 'href="/admissions"');
  
  const jsx = `import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const ${page.name} = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if(window.AOS) window.AOS.refresh();
  }, []);

  return (
    <>
      <Helmet>
        <title>${page.name} | Rankrise Coaching Centers</title>
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: \`${content}\` }} />
    </>
  );
};

export default ${page.name};
`;
  
  fs.writeFileSync(outPath, jsx);
}
console.log("Pages fixed!");
