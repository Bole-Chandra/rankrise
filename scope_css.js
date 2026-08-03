const fs = require('fs');
const path = require('path');

const styleCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'style.css'), 'utf-8');
const testimonialCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'testimonial.css'), 'utf-8');
const aboutusCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'aboutus.css'), 'utf-8');
const blogCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'blog.css'), 'utf-8');
const floatingbtnsCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'floatingbtns.css'), 'utf-8');
const downloadCSS = fs.readFileSync(path.join(__dirname, 'client', 'public', 'assets', 'styles', 'download.css'), 'utf-8');

function scopeCSS(css, prefix) {
  let output = '';
  let i = 0;
  let currentSelector = '';
  let inRules = false;
  let braceCount = 0;

  while (i < css.length) {
    const char = css[i];

    if (char === '@') {
      let endHeader = css.indexOf('{', i);
      if (endHeader === -1) {
        output += css.substring(i);
        break;
      }
      const header = css.substring(i, endHeader).trim();
      if (header.startsWith('@media')) {
        output += header + ' {\n';
        i = endHeader + 1;
        let mediaBraceCount = 1;
        let mediaContent = '';
        while (i < css.length && mediaBraceCount > 0) {
          if (css[i] === '{') mediaBraceCount++;
          if (css[i] === '}') mediaBraceCount--;
          if (mediaBraceCount > 0) {
            mediaContent += css[i];
          }
          i++;
        }
        output += scopeCSS(mediaContent, prefix) + '\n}\n';
        continue;
      } else {
        // keyframes or font-face, keep as is
        let keyframeBraceCount = 0;
        let keyframeContent = '';
        while (i < css.length) {
          keyframeContent += css[i];
          if (css[i] === '{') keyframeBraceCount++;
          if (css[i] === '}') {
            keyframeBraceCount--;
            if (keyframeBraceCount === 0) {
              i++;
              break;
            }
          }
          i++;
        }
        output += keyframeContent + '\n';
        continue;
      }
    }

    if (char === '{') {
      inRules = true;
      braceCount++;
      const prefixed = currentSelector.split(',').map(sel => {
        const trimmed = sel.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('@')) return trimmed;
        if (trimmed === 'body' || trimmed === 'html') return prefix;
        if (trimmed.startsWith('body ')) return trimmed.replace('body', prefix);
        if (trimmed.startsWith('html ')) return trimmed.replace('html', prefix);
        return `${prefix} ${trimmed}`;
      }).filter(Boolean).join(', ');

      output += prefixed + ' {';
      currentSelector = '';
      i++;
      continue;
    }

    if (char === '}') {
      braceCount--;
      inRules = false;
      output += '}';
      i++;
      continue;
    }

    if (inRules) {
      output += char;
    } else {
      currentSelector += char;
    }
    i++;
  }

  return output;
}

// Generate Scoped CSS files
const targets = [
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Home.css'), css: styleCSS + '\n' + testimonialCSS, prefix: '.home-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'About.css'), css: aboutusCSS, prefix: '.about-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Contact.css'), css: aboutusCSS, prefix: '.contact-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Admissions.css'), css: aboutusCSS, prefix: '.admissions-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Blogs.css'), css: blogCSS, prefix: '.blogs-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'BlogPostView.css'), css: blogCSS, prefix: '.blogpost-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Gallery.css'), css: styleCSS, prefix: '.gallery-page' },
  
  // Courses
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'IITJEE.css'), css: styleCSS, prefix: '.iitjee-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'NEET.css'), css: styleCSS, prefix: '.neet-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'EAMCET.css'), css: styleCSS, prefix: '.eamcet-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'Courses', 'BITSAT.css'), css: styleCSS, prefix: '.bitsat-page' },
  
  // College
  { file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'MPC_IIT.css'), css: styleCSS, prefix: '.mpciit-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'BiPC_NEET.css'), css: styleCSS, prefix: '.bipcneet-page' },
  { file: path.join(__dirname, 'client', 'src', 'pages', 'College', 'MPC_EAMCET.css'), css: styleCSS, prefix: '.mpceamcet-page' },
];

targets.forEach(t => {
  const scoped = scopeCSS(t.css, t.prefix);
  fs.writeFileSync(t.file, scoped);
  console.log(`Generated scoped css: ${t.file}`);
});

console.log('All CSS Scoped Successfully!');
