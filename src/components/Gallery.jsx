import { useState } from "react";
import { X } from "lucide-react";
import { photosForCollege } from "../data/gallery.js";

const FALLBACK = ["linear-gradient(135deg,#1c1c28,#2EC4B6)", "linear-gradient(135deg,#FF693D,#F4A261)", "linear-gradient(135deg,#2a2a3c,#0EA5A4)", "linear-gradient(135deg,#2d6a4f,#2EC4B6)"];

export default function Gallery({ slug, accent = "#1c1c28" }) {
  const photos = photosForCollege(slug, 6);
  const [open, setOpen] = useState(null);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {photos.map((p, i) => (
          <button key={i} onClick={() => setOpen(p)} style={{ position: "relative", borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", background: FALLBACK[i % FALLBACK.length] }}>
            <img
              src={p.url} alt={p.caption} loading="lazy"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 10px 8px", color: "#fff", fontSize: 12, fontWeight: 600, textAlign: "left", background: "linear-gradient(transparent, rgba(0,0,0,.6))" }}>{p.caption}</span>
          </button>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>Representative campus photos from Unsplash — replace with the institute's official images.</p>

      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,.8)", zIndex: 90, display: "grid", placeItems: "center", padding: 20 }}>
          <button onClick={() => setOpen(null)} aria-label="Close" style={{ position: "absolute", top: 18, right: 18, color: "#fff" }}><X size={28} /></button>
          <figure onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900, width: "100%" }}>
            <img src={open.url} alt={open.caption} style={{ width: "100%", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} />
            <figcaption style={{ color: "#fff", textAlign: "center", marginTop: 12, fontSize: 14 }}>{open.caption}</figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
