import { useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarClock, ExternalLink } from "lucide-react";
import { RADAR } from "../../data/counselling.js";

const TONE = {
  red: { bg: "#fdecec", fg: "#F97316", dot: "#F97316" },
  orange: { bg: "#fff3e6", fg: "#F97316", dot: "#F97316" },
  teal: { bg: "#e7f8f5", fg: "#0b8f80", dot: "#2EC4B6" },
};

export default function ApplicationRadar() {
  const scroller = useRef(null);
  const scroll = (dir) => scroller.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="section" id="radar" style={{ background: "var(--sky)" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span className="eyebrow">Live Deadlines</span>
            <h2 className="section-title">Application & Counselling Radar</h2>
            <p className="section-sub" style={{ marginLeft: 0 }}>Never miss a date — every major counselling and application window in one timeline.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" style={{ padding: 10 }} onClick={() => scroll(-1)} aria-label="Scroll left"><ChevronLeft size={18} /></button>
            <button className="btn btn-ghost" style={{ padding: 10 }} onClick={() => scroll(1)} aria-label="Scroll right"><ChevronRight size={18} /></button>
          </div>
        </div>

        <div ref={scroller} style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, marginTop: 22, scrollSnapType: "x mandatory" }}>
          {RADAR.map((r) => {
            const t = TONE[r.tone] || TONE.teal;
            return (
              <div key={r.name} className="card" style={{ minWidth: 270, scrollSnapAlign: "start", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: t.bg, color: t.fg, fontWeight: 700, fontSize: 11, padding: "5px 10px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot }} /> {r.status}
                  </span>
                  <CalendarClock size={18} color="var(--muted)" />
                </div>
                <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: "1.02rem", lineHeight: 1.3 }}>{r.name}</h3>
                <div style={{ fontSize: 13, color: "var(--muted)" }}>Deadline: <strong style={{ color: "var(--navy)" }}>{r.deadline}</strong></div>
                <a href={r.url} target="_blank" rel="noreferrer" className="btn full" style={{ justifyContent: "center", background: t.fg, color: "#fff", marginTop: 4 }}>
                  Apply Now <ExternalLink size={15} />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
