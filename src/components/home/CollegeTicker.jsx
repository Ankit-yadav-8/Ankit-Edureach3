/* CollegeTicker — horizontal auto-scrolling strip showing college stats */
import { motion } from "framer-motion";

const ITEMS = [
  { name: "IIT Bombay",       stat: "Avg ₹31.8L",  color: "#6366f1" },
  { name: "IIT Delhi",        stat: "NIRF #2",      color: "#F97316" },
  { name: "IIT Madras",       stat: "Avg ₹34.4L",  color: "#0ea5a4" },
  { name: "NIT Trichy",       stat: "92% Placed",   color: "#8b5cf6" },
  { name: "IIIT Hyderabad",   stat: "Avg ₹18.6L",  color: "#10b981" },
  { name: "IIT Kanpur",       stat: "NIRF #5",      color: "#f59e0b" },
  { name: "VIT Vellore",      stat: "Avg ₹8.8L",   color: "#2a2a3c" },
  { name: "BITS Pilani",      stat: "Avg ₹18L",    color: "#1a3a5c" },
  { name: "NIT Warangal",     stat: "NIRF #26",     color: "#3b3b98" },
  { name: "IIT Roorkee",      stat: "NIRF #6",      color: "#dc2626" },
  { name: "Manipal IT",       stat: "Avg ₹9.2L",   color: "#0b525b" },
  { name: "SRM Chennai",      stat: "85% Placed",   color: "#3b3b98" },
  { name: "Thapar Patiala",   stat: "Avg ₹12L",    color: "#1d3557" },
  { name: "KIIT Bhubaneswar", stat: "87% Placed",   color: "#2d6a4f" },
  { name: "NIT Surathkal",    stat: "NIRF #27",     color: "#0d3340" },
];

/* Duplicate for seamless loop */
const ALL = [...ITEMS, ...ITEMS];

export default function CollegeTicker() {
  return (
    <div style={{
      background: "linear-gradient(135deg, #fff7f0 0%, #fef3e8 100%)",
      borderTop: "1px solid rgba(244,123,32,.18)",
      borderBottom: "1px solid rgba(244,123,32,.18)",
      padding: "14px 0",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Left fade */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #fff7f0, transparent)", zIndex: 2, pointerEvents: "none" }} />
      {/* Right fade */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #fff7f0, transparent)", zIndex: 2, pointerEvents: "none" }} />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        style={{ display: "flex", gap: 0, width: "max-content" }}
      >
        {ALL.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "0 24px",
              borderRight: "1px solid rgba(244,123,32,.12)",
              whiteSpace: "nowrap",
            }}
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
          </div>
        ))}
      </motion.div>
    </div>
  );
}
