import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page container" style={{ minHeight: "60vh", display: "grid", placeItems: "center", textAlign: "center" }}>
      <div>
        <Compass size={56} color="var(--coral)" />
        <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2.4rem", margin: "16px 0 6px" }}>404 — Page not found</h1>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>The page you're looking for doesn't exist or has moved.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link to="/" className="btn btn-coral">Go home</Link>
          <Link to="/colleges" className="btn btn-ghost">Explore colleges</Link>
        </div>
      </div>
    </div>
  );
}
