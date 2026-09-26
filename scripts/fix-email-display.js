import fs from 'fs';

// 1. About.jsx
let about = fs.readFileSync('src/pages/About.jsx', 'utf8');
about = about.replace(
  '<Mail size={16} /> campuspath6@gmail.com</a>',
  '<Mail size={16} /> campuspoint6@gmail.com</a>'
);
fs.writeFileSync('src/pages/About.jsx', about, 'utf8');

// 2. Footer.jsx
let footer = fs.readFileSync('src/components/Footer.jsx', 'utf8');
footer = footer.replace(
  '<Mail size={15} /> campuspath6@gmail.com',
  '<Mail size={15} /> campuspoint6@gmail.com'
);
fs.writeFileSync('src/components/Footer.jsx', footer, 'utf8');

// 3. Privacy.jsx
let privacy = fs.readFileSync('src/pages/Privacy.jsx', 'utf8');
privacy = privacy.replace(
  'email us at campuspath6@gmail.com.',
  'email us at campuspoint6@gmail.com.'
);
fs.writeFileSync('src/pages/Privacy.jsx', privacy, 'utf8');

// 4. Terms.jsx
let terms = fs.readFileSync('src/pages/Terms.jsx', 'utf8');
terms = terms.replace(
  'Email us at campuspath6@gmail.com.',
  'Email us at campuspoint6@gmail.com.'
);
fs.writeFileSync('src/pages/Terms.jsx', terms, 'utf8');

console.log('Fixed email display!');
