import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary signed direct-upload helper.
// The browser uploads files STRAIGHT to Cloudinary using a short-lived signature
// we generate here — the file bytes never touch our API (which caps JSON at
// 16 kb). The api_secret stays on the server and is never sent to the client.
// ─────────────────────────────────────────────────────────────────────────────
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export const cloudinaryReady = () => Boolean(CLOUD_NAME && API_KEY && API_SECRET);

// Sign exactly the params the browser will send (folder + timestamp), so a
// client can't smuggle extra transformations or overwrite other assets.
export function signUpload({ folder }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + API_SECRET).digest("hex");
  return { signature, timestamp, apiKey: API_KEY, cloudName: CLOUD_NAME, folder };
}

// Only ever trust media URLs that actually live on our own Cloudinary account —
// stops a tampered request from posting arbitrary external links as "media".
export function isOurCloudinaryUrl(url) {
  return typeof url === "string" && url.startsWith(`https://res.cloudinary.com/${CLOUD_NAME}/`);
}
