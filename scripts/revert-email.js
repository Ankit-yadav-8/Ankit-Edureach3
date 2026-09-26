import fs from 'fs';
import path from 'path';

const searchDirs = ['src'];
const skipDirs = ['node_modules', '.git', 'dist'];
const exts = ['.js', '.jsx'];

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
      if (exts.includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        let newContent = content.replace(/campuspoint6@gmail\.com/g, 'campuspath6@gmail.com');
          
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Reverted', fullPath);
        }
      }
    }
  }
}

searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) walkAndReplace(dir);
});

console.log('Done reverting email!');

