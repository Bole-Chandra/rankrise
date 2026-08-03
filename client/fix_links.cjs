const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 1. Convert all <Link> back to <a>
  content = content.replace(/<Link([^>]*?)to="([^"]*?)"([^>]*?)>/g, '<a$1href="$2"$3>');
  content = content.replace(/<\/Link>/g, '</a>');
  
  // 2. Safely convert <a> to <Link> for internal links (href starting with /)
  // This uses a non-greedy match for the content inside <a>
  content = content.replace(/<a([^>]*?)href="(\/[^"]*)"([^>]*?)>([\s\S]*?)<\/a>/gi, '<Link$1to="$2"$3>$4</Link>');
  
  // 3. Ensure import { Link } is present if we use <Link>
  if (content.includes('<Link') && !content.includes("import { Link }")) {
    // Insert after the first import
    const importReactIndex = content.indexOf('import React');
    if (importReactIndex !== -1) {
      const endOfLine = content.indexOf('\n', importReactIndex);
      content = content.substring(0, endOfLine + 1) + "import { Link } from 'react-router-dom';\n" + content.substring(endOfLine + 1);
    }
  }
  
  // If no <Link> is used, we might want to remove the import, but it's harmless
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed tags in ${path.basename(filePath)}`);
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
console.log('Done fixing links.');
