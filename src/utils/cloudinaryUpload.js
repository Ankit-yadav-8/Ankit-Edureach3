import { apiCommunitySignUpload } from "../auth/api.js";

// Largest file we let a student attach. Cloudinary's free tier accepts videos,
// but keeping a sane cap avoids slow uploads on patchy mobile connections.
export const MAX_IMAGE_MB = 15;
export const MAX_VIDEO_MB = 40;

export function validateFile(file) {
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) return "Only images and videos can be attached.";
  const mb = file.size / (1024 * 1024);
  if (isVideo && mb > MAX_VIDEO_MB) return `Video is too large (max ${MAX_VIDEO_MB} MB).`;
  if (isImage && mb > MAX_IMAGE_MB) return `Image is too large (max ${MAX_IMAGE_MB} MB).`;
  return null;
}

// Downscale + re-encode large photos in the browser so uploads are fast and
// light — a 5 MB phone photo becomes ~300–600 KB with no visible quality loss
// for a doubt screenshot. Videos & GIFs pass through untouched.
export async function compressImage(file, { maxDim = 1600, quality = 0.82 } = {}) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const longest = Math.max(bitmap.width, bitmap.height);
    const scale = Math.min(1, maxDim / longest);
    // Already small enough — don't waste time re-encoding.
    if (scale === 1 && file.size < 700 * 1024) { bitmap.close?.(); return file; }
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file; // no real gain
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // HEIC / decode failure → upload the original, Cloudinary copes
  }
}

// Fetch one signed payload and reuse it for every file in a batch: we only sign
// folder + timestamp, so a single signature covers many parallel uploads.
// `signFn` lets callers swap the endpoint (batch vs public community); it
// defaults to the per-batch signer. `plan` scopes the batch signer's folder.
export async function getUploadSignature(token, signFn = apiCommunitySignUpload, plan) {
  return signFn(token, plan);
}

// Largest PDF we accept for a test paper / answer key.
export const MAX_PDF_MB = 25;

export function validatePdf(file) {
  const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");
  if (!isPdf) return "Please choose a PDF file.";
  if (file.size / (1024 * 1024) > MAX_PDF_MB) return `PDF is too large (max ${MAX_PDF_MB} MB).`;
  return null;
}

// Upload a PDF (test paper / answer key) to Cloudinary and return its URL.
// Uses the same signed direct-upload flow; only the secure_url matters here.
export async function uploadPdf(file, sig, onProgress) {
  const { signature, timestamp, apiKey, cloudName, folder } = sig;
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const res = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data?.error?.message || "Upload failed"));
      } catch { reject(new Error("Upload failed")); }
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
    xhr.send(form);
  });
  return res.secure_url;
}

// Upload one file straight to Cloudinary with a pre-fetched signature.
// The file bytes go browser → Cloudinary directly; our API only sees the URL.
export async function uploadToCloudinary(file, sig, onProgress) {
  const { signature, timestamp, apiKey, cloudName, folder } = sig;

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("signature", signature);
  form.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

  const res = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(data);
        else reject(new Error(data?.error?.message || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your connection."));
    xhr.send(form);
  });

  const isVideo = res.resource_type === "video";
  return {
    url: res.secure_url,
    type: isVideo ? "video" : "image",
    width: res.width,
    height: res.height,
    // Cloudinary serves a still-frame thumbnail for videos via a .jpg extension.
    poster: isVideo ? res.secure_url.replace(/\.[a-z0-9]+$/i, ".jpg") : undefined,
  };
}
