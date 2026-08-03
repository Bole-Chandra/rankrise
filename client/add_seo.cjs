const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (content.includes('<Helmet>') && !content.includes('<meta name="description"')) {
    const pageName = path.basename(filePath, '.jsx');
    const desc = `Rankrise Coaching Centers - Best institute in Hyderabad for ${pageName}. Get top ranks in IIT-JEE, NEET, and EAMCET.`;
    
    // Insert meta description after <title>
    content = content.replace(/(<title>.*?<\/title>)/, `$1\n        <meta name="description" content="${desc}" />`);
    
    fs.writeFileSync(filePath, content);
    console.log(`Added SEO meta description to ${pageName}`);
  }
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
console.log('Done SEO updates.');
