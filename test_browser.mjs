import puppeteer from 'puppeteer';
import { spawn } from 'child_process';

(async () => {
  console.log("Starting preview server...");
  const server = spawn('npm', ['run', 'preview'], { stdio: 'pipe' });
  
  // wait a bit for server to start
  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  console.log("Navigating to http://localhost:4173/");
  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
    console.log("Navigation successful.");
  } catch (e) {
    console.log("Navigation failed:", e.message);
  }

  console.log("Navigating to dashboard...");
  try {
    await page.goto('http://localhost:4173/dashboard', { waitUntil: 'networkidle0' });
  } catch (e) {
    console.log("Dashboard Navigation failed:", e.message);
  }
  
  await browser.close();
  server.kill();
  process.exit(0);
})();
