const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'client/src/pages/College'),
  path.join(__dirname, 'client/src/pages/Courses'),
  path.join(__dirname, 'client/src/pages') // for Top* pages and Contact
];

function replaceFormInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const formRegex = /<form method="post" action="process_form\.php" id="rankrise_form">[\s\S]*?<\/form>/g;
  
  if (formRegex.test(content)) {
    content = content.replace(formRegex, '<EnquiryForm />');
    
    // Check if EnquiryForm is imported, if not, add it
    if (!content.includes('import EnquiryForm from')) {
      // Determine relative path depth
      const depth = filePath.includes('College') || filePath.includes('Courses') ? '../../components/EnquiryForm' : '../components/EnquiryForm';
      
      const importStatement = `import EnquiryForm from '${depth}';\n`;
      // insert after Helmet or React import
      if (content.includes("import { Helmet } from 'react-helmet-async';")) {
        content = content.replace("import { Helmet } from 'react-helmet-async';", `import { Helmet } from 'react-helmet-async';\n${importStatement}`);
      } else {
        content = importStatement + content;
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated form in ${filePath}`);
  }
}

directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.jsx')) {
        replaceFormInFile(path.join(dir, file));
      }
    });
  }
});
