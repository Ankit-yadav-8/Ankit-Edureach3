import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';

// Generate a full-bleed circular SVG
const svgString = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#F47B20"/>
  <text x="256" y="275" text-anchor="middle" dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif" font-size="240" font-weight="900"
        letter-spacing="-10" fill="#ffffff">CP</text>
</svg>
`;

const publicDir = path.resolve('public');
const sizes = [32, 48, 96, 192, 512];

async function generateFavicons() {
  try {
    console.log('Generating base PNGs from SVG...');
    for (const size of sizes) {
      const filename = size === 192 || size === 512 ? `icon-${size}.png` : `favicon-${size}.png`;
      await sharp(Buffer.from(svgString))
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, filename));
      console.log(`Generated ${filename}`);
    }
    
    // Apple touch icon (usually 180x180)
    await sharp(Buffer.from(svgString))
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log(`Generated apple-touch-icon.png`);
    
    // Generate .ico using png-to-ico (needs the PNG buffer)
    console.log('Generating favicon.ico...');
    const buf32 = await sharp(Buffer.from(svgString)).resize(32, 32).png().toBuffer();
    const buf48 = await sharp(Buffer.from(svgString)).resize(48, 48).png().toBuffer();
    
    // Temporarily write the buffers to disk for png-to-ico
    fs.writeFileSync('temp32.png', buf32);
    fs.writeFileSync('temp48.png', buf48);
    
    const icoBuffer = await pngToIco(['temp32.png', 'temp48.png']);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
    console.log('Generated favicon.ico');
    
    // Clean up
    fs.unlinkSync('temp32.png');
    fs.unlinkSync('temp48.png');
    
    // Overwrite the SVG just so they have it
    fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgString.trim());
    console.log('Generated favicon.svg');
    
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons();
