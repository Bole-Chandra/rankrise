const fs = require('fs');
const path = require('path');
const components = ['Navbar.jsx', 'Footer.jsx', 'TopInfoBar.jsx', 'FloatingWidgets.jsx'];
const dir = path.join(__dirname, 'src', 'components');

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
  'Top-EAMCET-Coaching-Institutes-in-Hyderabad.html': '/top-eamcet-institutes',
  'careers.html': '/admissions'
};

for (const comp of components) {
  const p = path.join(dir, comp);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    for (const [oldPath, newPath] of Object.entries(routeMap)) {
      const regex = new RegExp(`(href|to)=["']/?${oldPath.replace('.', '\\.')}["']`, 'g');
      content = content.replace(regex, `$1="${newPath}"`);
    }
    fs.writeFileSync(p, content);
    console.log('Fixed links in', comp);
  }
}
