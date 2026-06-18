/* CollegeTicker — horizontal auto-scrolling strip of clickable colleges.
   Each item links to its detail page; the track pauses on hover so the
   moving links are easy to click. */
import { Link } from "react-router-dom";

const ITEMS = [
  { name: "IIT Bombay",       stat: "Avg ₹31.8L",  color: "#6366f1", to: "/colleges/iit-bombay" },
  { name: "IIT Delhi",        stat: "NIRF #2",      color: "#F15A38", to: "/colleges/iit-delhi" },
  { name: "IIT Madras",       stat: "Avg ₹34.4L",  color: "#0ea5a4", to: "/colleges/iit-madras" },
  { name: "NIT Trichy",       stat: "92% Placed",   color: "#8b5cf6", to: "/colleges/nit-trichy" },
  { name: "IIIT Hyderabad",   stat: "Avg ₹18.6L",  color: "#10b981", to: "/colleges/iiit-hyderabad" },
  { name: "IIT Kanpur",       stat: "NIRF #5",      color: "#f59e0b", to: "/colleges/iit-kanpur" },
  { name: "VIT Vellore",      stat: "Avg ₹8.8L",   color: "#2a2a3c", to: "/private/vit" },
  { name: "BITS Pilani",      stat: "Avg ₹18L",    color: "#1a3a5c", to: "/private/bits-pilani" },
  { name: "NIT Warangal",     stat: "NIRF #26",     color: "#3b3b98", to: "/colleges/nit-warangal" },
  { name: "IIT Roorkee",      stat: "NIRF #6",      color: "#dc2626", to: "/colleges/iit-roorkee" },
  { name: "Manipal IT",       stat: "Avg ₹9.2L",   color: "#0b525b", to: "/private/manipal" },
  { name: "SRM Chennai",      stat: "85% Placed",   color: "#3b3b98", to: "/private/srm" },
  { name: "Thapar Patiala",   stat: "Avg ₹12L",    color: "#1d3557", to: "/private/thapar" },
  { name: "KIIT Bhubaneswar", stat: "87% Placed",   color: "#2d6a4f", to: "/private/kiit" },
  { name: "NIT Surathkal",    stat: "NIRF #27",     color: "#0d3340", to: "/colleges/nit-surathkal" },
];

/* Duplicate for seamless loop */
const ALL = [...ITEMS, ...ITEMS];

export default function CollegeTicker() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #ffffff 0%, #ffffff 100%)",
      borderTop: "1px solid rgba(244,123,32,.18)",
      borderBottom: "1px solid rgba(244,123,32,.18)",
      padding: "14px 0",
    }}>
      <style>{`
        @keyframes cp-ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .cp-ticker-track {
          display: flex; width: max-content;
          animation: cp-ticker-scroll 38s linear infinite;
        }
        /* Pause the scroll while the user is interacting, so links are clickable */
        .cp-ticker-track:hover { animation-play-state: paused; }
        .cp-ticker-item {
          display: flex; align-items: center; gap: 8px;
          padding: 0 24px; border-right: 1px solid rgba(244,123,32,.12);
          white-space: nowrap; text-decoration: none;
          transition: background .18s;
        }
        .cp-ticker-item:hover { background: rgba(244,123,32,.07); }
        @media (prefers-reduced-motion: reduce) { .cp-ticker-track { animation: none; } }
      `}</style>

      {/* Contained track — items fade & disappear within the padded container */}
      <div className="container" style={{ position: "relative", overflow: "hidden" }}>
        {/* Left fade */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 64, background: "linear-gradient(to right, #ffffff, transparent)", zIndex: 2, pointerEvents: "none" }} />
        {/* Right fade */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 64, background: "linear-gradient(to left, #ffffff, transparent)", zIndex: 2, pointerEvents: "none" }} />

        <div className="cp-ticker-track">
          {ALL.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="cp-ticker-item"
              aria-label={`${item.name} — ${item.stat}`}
            >
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 6px ${item.color}88`,
                flexShrink: 0,
              }} />
              <span style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: "#1a1a2e" }}>
                {item.name}
              </span>
              <span style={{
                padding: "2px 9px", borderRadius: 50,
                background: `${item.color}22`,
                border: `1px solid ${item.color}44`,
                color: item.color, fontSize: 11, fontWeight: 700,
              }}>
                {item.stat}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
