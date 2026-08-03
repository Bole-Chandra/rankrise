const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

function processCssFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const basename = path.basename(filePath);
  
  // Get the page scope class from the filename (e.g., NEET.css -> .neet-page)
  const name = basename.replace('.css', '');
  
  // Fix 1: Remove bare * { margin: 0; padding: 0; } that kills Bootstrap
  content = content.replace(/^\s*\*\s*\{[^}]*margin:\s*0;[^}]*padding:\s*0;[^}]*\}/gm, '/* removed bare * reset */');
  
  // Fix 2: Remove bare body { ... } rules that override global styles
  content = content.replace(/^body\s*\{[^}]*\}/gm, '/* removed bare body rule */');
  
  // Fix 3: Remove duplicate @import statements (they all load the same fonts already in index.html)
  content = content.replace(/@import url\([^)]+\);\s*/g, '');
  
  // Fix 4: Remove bare @font-face declarations
  content = content.replace(/@font-face\s*\{[^}]*\}/g, '');
  
  // Fix 5: Fix broken comment-based selectors like ".neet-page /* comment */\n.section-title"
  // These create rules that apply globally instead of being scoped
  content = content.replace(/(\.[a-z_-]+-page)\s*\/\*[^*]*\*\/\s*\n\./g, '$1 .');
  
  // Fix 6: Fix inline comment selectors like ".neet-page /* comment */\n.classname {"  
  content = content.replace(/(\.[a-z_-]+-page)\s*\/\*[^*]*\*\/\s*\n/g, '$1 ');
  
  fs.writeFileSync(filePath, content);
  console.log(`Fixed: ${basename} (${content.length} bytes)`);
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.css')) {
      processCssFile(fullPath);
    }
  }
}

traverseDir(pagesDir);
console.log('\nDone fixing CSS files.');
