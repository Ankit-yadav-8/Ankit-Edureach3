import fs from 'fs';
import path from 'path';

const searchDirs = ['src', 'public'];
const skipDirs = ['node_modules', '.git', 'dist'];
const exts = ['.js', '.jsx', '.css', '.html', '.md', '.json', '.webmanifest'];

function walkAndReplace(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!skipDirs.includes(file)) {
        walkAndReplace(fullPath);
      }
    } else {
      const ext = path.extname(file);
      if (exts.includes(ext) || file === 'index.html') {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Exclude specific files like config or specific domains if we had campuspath in URLs
        // e.g. campuspath6@gmail.com shouldn't be changed to campuspoint6@gmail.com unless requested? The user just says 'campus path name to Campus point'
        // Let's replace:
        // Campus Path -> Campus Point
        // CampusPath -> CampusPoint
        // Campus path -> Campus point
        
        let newContent = content
          .replace(/Campus Path/g, 'Campus Point')
          .replace(/CampusPath/g, 'CampusPoint')
          .replace(/Campus path/g, 'Campus point');
          
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Updated', fullPath);
        }
      }
    }
  }
}

// Also check root files
let idx = fs.readFileSync('index.html', 'utf8');
let newIdx = idx
  .replace(/Campus Path/g, 'Campus Point')
  .replace(/CampusPath/g, 'CampusPoint')
  .replace(/Campus path/g, 'Campus point');
if (idx !== newIdx) {
  fs.writeFileSync('index.html', newIdx, 'utf8');
  console.log('Updated index.html');
}

searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) walkAndReplace(dir);
});

console.log('Done replacing Campus Path with Campus Point!');

