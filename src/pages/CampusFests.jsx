import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Sparkles, Filter, Ticket, CheckCircle2 } from "lucide-react";
import { FESTS_DB } from "../data/fests";

export default function CampusFests() {
  const [searchQ, setSearchQ] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterInstitute, setFilterInstitute] = useState("All");
  const [booking, setBooking] = useState(null);

  // Filter fests
  const filtered = FESTS_DB.filter((f) => {
    if (filterType !== "All" && f.type !== filterType) return false;
    if (filterInstitute !== "All" && !f.college.includes(filterInstitute)) return false;
    if (searchQ && !f.name.toLowerCase().includes(searchQ.toLowerCase()) && !f.college.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ background: "#FDFDFD", minHeight: "100vh", paddingBottom: 100 }}>
      {/* ── HERO SECTION ── */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #2d2b55 100%)", padding: "120px 24px 80px", textAlign: "center", color: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="container" style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", padding: "8px 16px", borderRadius: 999, fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: 24 }}>
            <Sparkles size={14} color="#FF693D" /> India's largest college fest network
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.03em" }}>
            Campus Fests & Events
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.7)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Discover and book tickets for the biggest cultural nights, flagship hackathons, and technical symposiums across IITs, NITs, and IIITs.
          </motion.p>
        </div>
      </div>

      {/* ── SEARCH & FILTERS ── */}
      <div className="container" style={{ marginTop: "-32px", position: "relative", zIndex: 10, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 800, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Main Search Pill */}
          <div style={{
            display: "flex",
            gap: 6,
            background: "#ffffff",
            padding: "8px",
            borderRadius: 9999,
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
            border: "1px solid rgba(0,0,0,.04)",
          }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, gap: 10, paddingLeft: 24, minWidth: 0 }}>
              <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
              <input 
                value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search by fest name or college..." 
                style={{
                  border: "none",
                  outline: "none",
                  flex: 1,
                  minWidth: 0,
                  fontSize: 15,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  background: "transparent",
                  color: "#111",
                }}
              />
            </div>
            <button
              style={{
                borderRadius: 9999,
                padding: "12px 32px",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "'Inter', system-ui, sans-serif",
                background: "linear-gradient(135deg, #FF693D, #FF4500)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,105,61,0.3)"
              }}
            >
              Search
            </button>
          </div>
          
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", fontSize: "0.9rem", fontWeight: 600, color: "#1a1a2e", cursor: "pointer", outline: "none", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <option value="All">All Types</option>
              <option value="Cultural">Cultural Fests</option>
              <option value="Technical">Technical Fests</option>
            </select>
            <select value={filterInstitute} onChange={(e) => setFilterInstitute(e.target.value)} style={{ padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", fontSize: "0.9rem", fontWeight: 600, color: "#1a1a2e", cursor: "pointer", outline: "none", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <option value="All">All Institutes</option>
              <option value="IIT">IITs</option>
              <option value="NIT">NITs</option>
              <option value="IIIT">IIITs</option>
              <option value="BITS">BITS</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── FESTS GRID ── */}
      <div className="container" style={{ marginTop: 60 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <Filter size={48} color="#ccc" style={{ marginBottom: 16, display: "block", margin: "0 auto 16px auto" }} />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>No fests found</h3>
            <p style={{ color: "#64748b" }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map((fest, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.5) }}
                key={fest.id} 
                style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 12px 32px -12px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", position: "relative" }}
              >
                {/* Image */}
                <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <img src={fest.img} alt={fest.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", padding: "6px 12px", borderRadius: 10, fontSize: "0.75rem", fontWeight: 800, color: fest.type === "Cultural" ? "#e5484d" : "#6366f1" }}>
                    {fest.type}
                  </div>
                </div>
                
                {/* Content */}
                <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: "0.85rem", fontWeight: 600, marginBottom: 8 }}>
                    <MapPin size={14} /> {fest.college}
                  </div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 16, lineHeight: 1.2 }}>{fest.name}</h3>
                  
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                    {fest.tags.map(t => (
                      <span key={t} style={{ background: "#F8F9FA", color: "#475569", padding: "4px 10px", borderRadius: 6, fontSize: "0.75rem", fontWeight: 700 }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <button onClick={() => setBooking(fest)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#1a1a2e", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: "0.95rem" }}>
                      <Ticket size={18} /> Book Tickets / Register
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── BOOKING MODAL (Simulated) ── */}
      <AnimatePresence>
        {booking && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBooking(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 2000 }} />
            <div style={{ position: "fixed", inset: 0, zIndex: 2001, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, pointerEvents: "none" }}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} style={{ width: "min(400px, 100%)", background: "#fff", borderRadius: 24, padding: 32, textAlign: "center", pointerEvents: "auto", boxShadow: "0 32px 64px -16px rgba(0,0,0,0.3)" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#E0F2FE", color: "#0ea5e9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1a1a2e", marginBottom: 12 }}>Redirecting to {booking.name}</h3>
                <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.5, marginBottom: 24 }}>
                  You are being redirected to the official {booking.college} portal to complete your registration for {booking.name}.
                </p>
                <button onClick={() => setBooking(null)} style={{ width: "100%", padding: "14px", borderRadius: 12, background: "#F1F5F9", color: "#334155", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.95rem" }}>
                  Close
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
