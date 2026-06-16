import { apiCommunitySignUpload } from "../auth/api.js";

// Largest file we let a student attach. Cloudinary's free tier accepts videos,
// but keeping a sane cap avoids slow uploads on patchy mobile connections.
export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 100;

export function validateFile(file) {
  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) return "Only images and videos can be attached.";
  const mb = file.size / (1024 * 1024);
  if (isVideo && mb > MAX_VIDEO_MB) return `Video is too large (max ${MAX_VIDEO_MB} MB).`;
  if (isImage && mb > MAX_IMAGE_MB) return `Image is too large (max ${MAX_IMAGE_MB} MB).`;
  return null;
}

// Upload one file straight to Cloudinary using a server-signed payload.
// The file bytes go browser → Cloudinary directly; our API only ever sees the
// resulting URL. Returns a media object ready to attach to a post/reply.
export async function uploadToCloudinary(file, token, onProgress) {
  const sig = await apiCommunitySignUpload(token);
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
