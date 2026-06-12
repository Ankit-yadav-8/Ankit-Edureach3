import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarClock, ExternalLink } from "lucide-react";
import { RADAR } from "../../data/counselling.js";

const TONE = {
  red:    { bg: "rgba(239,68,68,.18)",   fg: "#fca5a5", dot: "#ef4444", glow: "rgba(239,68,68,.55)",  border: "rgba(239,68,68,.38)",  pulse: true  },
  orange: { bg: "rgba(244,123,32,.18)",  fg: "#fdba74", dot: "#F47B20", glow: "rgba(244,123,32,.50)", border: "rgba(244,123,32,.38)", pulse: true  },
  teal:   { bg: "rgba(14,165,164,.15)",  fg: "#5eead4", dot: "#0ea5a4", glow: "rgba(14,165,164,.32)", border: "rgba(14,165,164,.30)", pulse: false },
};

export default function ApplicationRadar() {
  const scroller = useRef(null);
  const posRef   = useRef(0);
  const paused   = useRef(false);
  const frameRef = useRef(null);

  /* ── seamless auto-scroll ── */
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const SPEED = 0.45; // px / frame (~27 px/s at 60 fps)
    const tick = () => {
      if (!paused.current && el.scrollWidth > el.clientWidth) {
        posRef.current += SPEED;
        const half = el.scrollWidth / 2;
        if (posRef.current >= half) posRef.current -= half;
        el.scrollLeft = posRef.current;
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const scrollManual = (dir) => {
    const el = scroller.current;
    posRef.current += dir * 300;
    if (el) {
      const half = el.scrollWidth / 2;
      posRef.current = ((posRef.current % half) + half) % half;
      el.scrollLeft = posRef.current;
    }
  };

  /* duplicate items for seamless infinite loop */
  const items = [...RADAR, ...RADAR];

  return (
    <section
      id="radar"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #ffffff 30%, #ffffff 60%, #ffffff 100%)",
        padding: "72px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── mesh grid overlay ── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(244,123,32,.04) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(244,123,32,.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      {/* ── ambient glow orbs ── */}

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Section header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 36 }}>
          <div>
            <span
              className="eyebrow"
              style={{
                background: "rgba(244,123,32,.1)",
                border: "1px solid rgba(244,123,32,.28)",
                color: "#c2540a",
                gap: 8,
              }}
            >
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#22c55e", boxShadow: "0 0 8px #22c55e",
                animation: "livePulse 2s infinite", display: "inline-block", flexShrink: 0,
              }} />
              Live Deadlines
            </span>
            <h2 className="section-title" style={{ color: "#1a1a2e", letterSpacing: "-1px", marginTop: 10 }}>
              Application &amp; Counselling{" "}
              <span style={{ color: "#F47B20" }}>Radar</span>
            </h2>
            <p className="section-sub" style={{ marginLeft: 0, color: "#4b5563" }}>
              Never miss a date — every major counselling and application window in one timeline.
            </p>
          </div>

          {/* Manual scroll buttons */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {[-1, 1].map((dir) => (
              <button
                key={dir}
                onClick={() => scrollManual(dir)}
                aria-label={dir < 0 ? "Scroll left" : "Scroll right"}
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "rgba(244,123,32,.12)",
                  border: "1.5px solid rgba(244,123,32,.35)",
                  color: "#F47B20",
                  display: "grid", placeItems: "center",
                  cursor: "pointer", transition: "all .22s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = "rgba(244,123,32,.26)";
                  e.currentTarget.style.borderColor  = "rgba(244,123,32,.60)";
                  e.currentTarget.style.boxShadow    = "0 0 18px rgba(244,123,32,.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background   = "rgba(244,123,32,.12)";
                  e.currentTarget.style.borderColor  = "rgba(244,123,32,.35)";
                  e.currentTarget.style.boxShadow    = "";
                }}
              >
                {dir < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scroller track with fade-edge masks ── */}
        <div style={{ position: "relative" }}>
          {/* left fade */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: 80,
            background: "linear-gradient(to right, #0d0800 20%, transparent)",
            pointerEvents: "none", zIndex: 2,
          }} />
          {/* right fade */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: 80,
            background: "linear-gradient(to left, #1c0e00 20%, transparent)",
            pointerEvents: "none", zIndex: 2,
          }} />

          <div
            ref={scroller}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
            style={{
              display: "flex", gap: 16,
              overflowX: "auto", paddingBottom: 8,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {items.map((r, idx) => {
              const t = TONE[r.tone] || TONE.teal;
              return (
                <div
                  key={`${r.name}-${idx}`}
                  style={{
                    minWidth: 276, maxWidth: 276, flexShrink: 0,
                    background: "#fff",
                    border: `1px solid ${t.border}`,
                    borderRadius: 18,
                    padding: "20px 20px 18px",
                    display: "flex", flexDirection: "column", gap: 12,
                    boxShadow: "0 2px 16px rgba(0,0,0,.07)",
                    position: "relative", overflow: "hidden",
                    transition: "transform .26s ease, box-shadow .26s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform   = "translateY(-5px)";
                    e.currentTarget.style.boxShadow   = `0 12px 40px ${t.glow}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform   = "";
                    e.currentTarget.style.boxShadow   = "0 2px 16px rgba(0,0,0,.07)";
                  }}
                >
                  {/* top colour line */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${t.dot}, transparent)`,
                  }} />

                  {/* status badge + calendar */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{
                      background: t.bg, color: t.fg,
                      fontWeight: 700, fontSize: 10.5,
                      padding: "5px 11px", borderRadius: 20,
                      display: "inline-flex", alignItems: "center", gap: 6,
                      border: `1px solid ${t.border}`, letterSpacing: "0.5px",
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: t.dot, boxShadow: `0 0 7px ${t.dot}`,
                        flexShrink: 0, display: "inline-block",
                        animation: t.pulse ? "livePulse 2s infinite" : "none",
                      }} />
                      {r.status}
                    </span>
                    <CalendarClock size={16} color="#9ca3af" />
                  </div>

                  {/* name */}
                  <h3 style={{
                    fontFamily: "Sora", fontWeight: 700,
                    fontSize: "0.97rem", lineHeight: 1.3, color: "#1a1a2e",
                  }}>
                    {r.name}
                  </h3>

                  {/* deadline */}
                  <div style={{ fontSize: 12.5, color: "#6b7280" }}>
                    Deadline:{" "}
                    <strong style={{ color: t.fg }}>{r.deadline}</strong>
                  </div>

                  {/* apply CTA */}
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "10px 14px", borderRadius: 12, marginTop: 2,
                      background: `linear-gradient(135deg, ${t.dot}, ${t.dot}bb)`,
                      color: "#fff", fontSize: 12.5, fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: `0 4px 18px ${t.glow}`,
                      transition: "all .2s",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter    = "brightness(1.15)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = `0 8px 28px ${t.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter    = "";
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = `0 4px 18px ${t.glow}`;
                    }}
                  >
                    Apply Now <ExternalLink size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
