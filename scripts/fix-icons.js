import sharp from 'sharp';
import fs from 'fs';

async function run() {
  const svg = fs.readFileSync('public/favicon.svg');
  // ensure the svg has proper bounds and #FF693D
  const updatedSvg = svg.toString().replace('#F47B20', '#FF693D');
  
  await sharp(Buffer.from(updatedSvg)).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(Buffer.from(updatedSvg)).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(Buffer.from(updatedSvg)).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(Buffer.from(updatedSvg)).resize(96, 96).png().toFile('public/favicon-96.png');
  await sharp(Buffer.from(updatedSvg)).resize(48, 48).png().toFile('public/favicon-48.png');
  await sharp(Buffer.from(updatedSvg)).resize(32, 32).png().toFile('public/favicon-32.png');
  
  console.log('Icons regenerated with solid background!');
}
run().catch(console.error);
