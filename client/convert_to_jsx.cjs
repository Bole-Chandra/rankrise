const fs = require('fs');
const path = require('path');
const HTMLtoJSX = require('htmltojsx');

const converter = new HTMLtoJSX({
  createClass: false,
});

const pagesDir = path.join(__dirname, 'src', 'pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find the dangerouslySetInnerHTML block
  const startTag = '<div dangerouslySetInnerHTML={{ __html: `';
  const endTag = '` }} />';
  
  const startIndex = content.indexOf(startTag);
  if (startIndex === -1) {
    return; // Already converted or doesn't use it
  }
  
  const endIndex = content.indexOf(endTag, startIndex);
  if (endIndex === -1) {
    console.warn(`Could not find end tag in ${filePath}`);
    return;
  }
  
  let htmlContent = content.substring(startIndex + startTag.length, endIndex);
  
  // Clean up HTML before conversion
  // Remove HTML comments
  htmlContent = htmlContent.replace(/<!--[\s\S]*?-->/g, '');
  
  // Fix paths: remove .html from internal links
  // E.g. href="aboutus.html" -> href="/about"
  const routeMap = {
    'index.html': '/',
    'aboutus.html': '/about',
    'conatct.html': '/contact',
    'contact.html': '/contact',
    'blog.html': '/blog',
    'gallery.html': '/gallery',
    'privacy-policy.html': '/privacy-policy',
    'terms-conditions.html': '/terms-conditions',
    'best-iit-coaching-in-hyderabad.html': '/courses/iit-jee',
    'best-neet-coaching-in-hyderabad.html': '/courses/neet',
    'best-eamcet-coaching-in-hyderabad.html': '/courses/eamcet',
    'best-bitsat-coaching-in-hyderabad.html': '/courses/bitsat',
    'mpc-with-iit-coaching-hyderabad.html': '/college/mpc-iit',
    'bipc-with-neet-coaching-hyderabad.html': '/college/bipc-neet',
    'mpc-with-eamcet-coaching-hyderabad.html': '/college/mpc-eamcet',
    'Top-IIT-Coaching-Institutes-in-Hyderabad.html': '/top-iit-institutes',
    'Top-NEET-Coaching-Institute-in-Hyderabad.html': '/top-neet-institutes',
    'Top-EAMCET-Coaching-Institutes-in-Hyderabad.html': '/top-eamcet-institutes'
  };

  for (const [oldPath, newPath] of Object.entries(routeMap)) {
    // Regex to match href="oldPath" or href="/oldPath"
    const regex = new RegExp(`href=["']/?${oldPath.replace('.', '\\.')}["']`, 'g');
    htmlContent = htmlContent.replace(regex, `href="${newPath}"`);
  }
  
  // Fix backslashes from template literal escaping
  htmlContent = htmlContent.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  
  // Convert to JSX
  let jsxContent;
  try {
    jsxContent = converter.convert(htmlContent);
  } catch (err) {
    console.error(`Failed to parse HTML in ${filePath}: ${err.message}`);
    return;
  }
  
  // Clean up the output from htmltojsx (it wraps in a div if multiple elements, which is fine)
  // Let's replace <a> with <Link> for internal paths
  // Only internal paths starting with /
  jsxContent = jsxContent.replace(/<a([^>]+)href="(\/[^"]*)"([^>]*)>/g, '<Link$1to="$2"$3>');
  jsxContent = jsxContent.replace(/<\/a>/g, '</Link>');
  
  // If we used Link, we need to ensure it's imported
  let newFileContent = content.substring(0, startIndex) + jsxContent + content.substring(endIndex + endTag.length);
  
  if (jsxContent.includes('<Link') && !newFileContent.includes("import { Link } from 'react-router-dom';")) {
    newFileContent = `import { Link } from 'react-router-dom';\n` + newFileContent;
  }
  
  fs.writeFileSync(filePath, newFileContent);
  console.log(`Successfully converted ${path.basename(filePath)}`);
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

traverseDir(pagesDir);
console.log('Done processing pages.');
