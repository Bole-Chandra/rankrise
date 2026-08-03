const fs = require('fs');
const path = require('path');

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
  { in: '../Top-EAMCET-Coaching-Institutes-in-Hyderabad.html', out: 'TopEAMCET.jsx', name: 'TopEAMCET' }
];

function extractAndWrap() {
  for (const page of pages) {
    const inPath = path.join(__dirname, page.in);
    const outPath = path.join(__dirname, 'frontend', 'src', 'pages', page.out);
    
    if (!fs.existsSync(inPath)) {
      console.log(`Skipping ${inPath} (not found)`);
      continue;
    }

    const html = fs.readFileSync(inPath, 'utf-8');
    
    // Find where the unique content starts (after nav)
    let startIndex = html.indexOf('</nav>');
    if (startIndex !== -1) {
      startIndex = html.indexOf('>', startIndex) + 1;
    } else {
      startIndex = html.indexOf('<body>') + 6;
    }

    // Find where it ends (before footer)
    let endIndex = html.indexOf('<footer');
    if (endIndex === -1) endIndex = html.indexOf('<section class="bg-light py-5">'); // Get in touch section
    if (endIndex === -1) endIndex = html.lastIndexOf('</body>');
    
    let content = html.substring(startIndex, endIndex).trim();
    
    // Clean up forms since they might submit directly.
    // We will let them be, but ideally they should be handled by React.
    // For now, perfect UI match is priority.
    
    // Escape backticks and $ for template literal
    content = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    
    const jsx = `import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const ${page.name} = () => {
  useEffect(() => {
    // Intercept internal links to use React Router if needed, or let them reload.
    // We'll let them reload normally to ensure everything works perfectly as HTML.
    window.scrollTo(0, 0);
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
    console.log(`Generated ${outPath}`);
  }
}

extractAndWrap();
