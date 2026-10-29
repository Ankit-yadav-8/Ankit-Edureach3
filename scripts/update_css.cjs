const fs = require('fs');
let content = fs.readFileSync('src/styles/index.css', 'utf8');

// Normalize CRLF to search safely
const needle = "background: #FF693D;\r\n  border-radius: 6px;\r\n}\r\n.cp-custom-scroll::-webkit-scrollbar-thumb:hover,\r\n.adm-main-scroll::-webkit-scrollbar-thumb:hover,\r\n.mentor-main-scroll::-webkit-scrollbar-thumb:hover,\r\n.adm-sidebar::-webkit-scrollbar-thumb:hover,\r\n.sidebar-desktop::-webkit-scrollbar-thumb:hover,\r\n.table-responsive::-webkit-scrollbar-thumb:hover,\r\n.custom-scroll-y::-webkit-scrollbar-thumb:hover {\r\n  background: #e5532b;";

const replacement = "background: transparent !important;\r\n  border-radius: 6px;\r\n}\r\n.cp-custom-scroll::-webkit-scrollbar-thumb:hover,\r\n.adm-main-scroll::-webkit-scrollbar-thumb:hover,\r\n.mentor-main-scroll::-webkit-scrollbar-thumb:hover,\r\n.adm-sidebar::-webkit-scrollbar-thumb:hover,\r\n.sidebar-desktop::-webkit-scrollbar-thumb:hover,\r\n.table-responsive::-webkit-scrollbar-thumb:hover,\r\n.custom-scroll-y::-webkit-scrollbar-thumb:hover {\r\n  background: transparent !important;\r\n}\r\n\r\n/* Modern Dashboard Utilities */\r\n.font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }\r\n.hide-scrollbar::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }\r\n.hide-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }\r\n.shadow-subtle { box-shadow: 0 2px 10px -3px rgba(0, 0, 0, 0.04), 0 1px 4px -2px rgba(0, 0, 0, 0.02) !important; }\r\n.shadow-floating { box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.08) !important; }\r\n.cp-focus-ring:focus {\r\n  outline: none !important;\r\n  border-color: #ff5e36 !important;\r\n  box-shadow: 0 0 0 2px rgba(255, 94, 54, 0.2) !important;\r\n}";

if (content.includes(needle)) {
  content = content.replace(needle, replacement);
  fs.writeFileSync('src/styles/index.css', content, 'utf8');
  console.log('Successfully updated src/styles/index.css');
} else {
  // Try LF variant
  const needleLF = needle.replace(/\r\n/g, '\n');
  const replacementLF = replacement.replace(/\r\n/g, '\n');
  if (content.includes(needleLF)) {
    content = content.replace(needleLF, replacementLF);
    fs.writeFileSync('src/styles/index.css', content, 'utf8');
    console.log('Successfully updated src/styles/index.css with LF');
  } else {
    console.log('Needle not found, appending utilities');
    fs.appendFileSync('src/styles/index.css', '\n\n' + replacementLF, 'utf8');
  }
}
