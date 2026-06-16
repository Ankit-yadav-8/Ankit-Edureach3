import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudinary signed direct-upload helper.
// The browser uploads files STRAIGHT to Cloudinary using a short-lived signature
// we generate here — the file bytes never touch our API (which caps JSON at
// 16 kb). The api_secret stays on the server and is never sent to the client.
//
// IMPORTANT: env is read LAZILY (at call time), not into module-level consts.
// In server/index.js the route imports run before dotenv.config(), so capturing
// process.env at module load would freeze these as undefined in local dev.
// ─────────────────────────────────────────────────────────────────────────────
const cfg = () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryReady = () => {
  const { cloudName, apiKey, apiSecret } = cfg();
  return Boolean(cloudName && apiKey && apiSecret);
};

// Sign exactly the params the browser will send (folder + timestamp), so a
// client can't smuggle extra transformations or overwrite other assets.
export function signUpload({ folder }) {
  const { cloudName, apiKey, apiSecret } = cfg();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");
  return { signature, timestamp, apiKey, cloudName, folder };
}

// Only ever trust media URLs that actually live on our own Cloudinary account —
// stops a tampered request from posting arbitrary external links as "media".
export function isOurCloudinaryUrl(url) {
  const { cloudName } = cfg();
  return typeof url === "string" && !!cloudName && url.startsWith(`https://res.cloudinary.com/${cloudName}/`);
}
