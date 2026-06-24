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

// Upload an image buffer to Cloudinary from the server (used for diagram crops
// the vision converter extracts from question pages). Signs folder+timestamp the
// same way as the browser path. Returns the secure URL.
export async function uploadImageBuffer(buffer, { folder = "tests/diagrams" } = {}) {
  const { cloudName, apiKey, apiSecret } = cfg();
  if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary not configured");
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto.createHash("sha1").update(toSign + apiSecret).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "image/png" }), "diagram.png");
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status}): ${(await res.text().catch(() => "")).slice(0, 200)}`);
  const j = await res.json();
  return j.secure_url || j.url || "";
}

// Only ever trust media URLs that actually live on our own Cloudinary account —
// stops a tampered request from posting arbitrary external links as "media".
export function isOurCloudinaryUrl(url) {
  const { cloudName } = cfg();
  return typeof url === "string" && !!cloudName && url.startsWith(`https://res.cloudinary.com/${cloudName}/`);
}
