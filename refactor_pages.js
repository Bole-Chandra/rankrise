const fs = require('fs');
const path = require('path');

const targets = [
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'IITJEE.jsx'),
    oldName: 'BestIIT',
    newName: 'IITJEE',
    cssImport: "import './IITJEE.css';",
    wrapperClass: 'iitjee-page',
    title: 'IIT-JEE'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'NEET.jsx'),
    oldName: 'BestNEET',
    newName: 'NEET',
    cssImport: "import './NEET.css';",
    wrapperClass: 'neet-page',
    title: 'NEET'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'EAMCET.jsx'),
    oldName: 'BestEAMCET',
    newName: 'EAMCET',
    cssImport: "import './EAMCET.css';",
    wrapperClass: 'eamcet-page',
    title: 'EAMCET'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'BITSAT.jsx'),
    oldName: 'BestBITSAT',
    newName: 'BITSAT',
    cssImport: "import './BITSAT.css';",
    wrapperClass: 'bitsat-page',
    title: 'BITSAT'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'MPC_IIT.jsx'),
    oldName: 'MPCIIT',
    newName: 'MPC_IIT',
    cssImport: "import './MPC_IIT.css';",
    wrapperClass: 'mpciit-page',
    title: 'MPC with IIT-JEE'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'BiPC_NEET.jsx'),
    oldName: 'BiPCNEET',
    newName: 'BiPC_NEET',
    cssImport: "import './BiPC_NEET.css';",
    wrapperClass: 'bipcneet-page',
    title: 'BiPC with NEET'
  },
  {
    file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'MPC_EAMCET.jsx'),
    oldName: 'MPCEAMCET',
    newName: 'MPC_EAMCET',
    cssImport: "import './MPC_EAMCET.css';",
    wrapperClass: 'mpceamcet-page',
    title: 'MPC with EAMCET'
  }
];

targets.forEach(t => {
  if (!fs.existsSync(t.file)) {
    console.log(`Skipping: ${t.file} (does not exist)`);
    return;
  }

  let code = fs.readFileSync(t.file, 'utf-8');

  // Replace old component name with new component name
  const classDeclarationRegex = new RegExp(`const\\s+${t.oldName}\\s*=`, 'g');
  code = code.replace(classDeclarationRegex, `const ${t.newName} =`);

  const exportRegex = new RegExp(`export\\s+default\\s+${t.oldName}`, 'g');
  code = code.replace(exportRegex, `export default ${t.newName}`);

  // Add CSS Import
  code = code.replace("import { Helmet } from 'react-helmet-async';", `import { Helmet } from 'react-helmet-async';\n${t.cssImport}`);

  // Replace wrapper tags (wrap returned div in class)
  code = code.replace('return (\r\n    <>', `return (\r\n    <div className="${t.wrapperClass}">`);
  code = code.replace('return (\n    <>', `return (\n    <div className="${t.wrapperClass}">`);
  
  code = code.replace('</>\r\n  );', `</div>\r\n  );`);
  code = code.replace('</>\n  );', `</div>\n  );`);

  // Update SEO title
  const titleRegex = new RegExp(`<title>.*</title>`, 'g');
  code = code.replace(titleRegex, `<title>${t.title} Coaching | Rankrise</title>`);

  fs.writeFileSync(t.file, code);
  console.log(`Refactored page: ${t.file}`);
});

console.log('All pages refactored successfully!');
