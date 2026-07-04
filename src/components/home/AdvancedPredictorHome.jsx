/* AdvancedPredictorHome — the JoSAA · JEE Advanced engine embedded on the home
   page. A coral pill toggle switches between the two tools the dedicated
   /jee-advanced page offers, without leaving home:
     • Rank Predictor   — marks (Paper 1 + Paper 2) → All-India CRL + branches
     • College Predictor — enter a rank → every IIT branch within reach
   Both render the exact same components used on /jee-advanced, so the style and
   behaviour stay identical. */
import { useState } from "react";
import { Building2, Gauge, GraduationCap } from "lucide-react";
import RankPredictorTool from "../predictor/RankPredictorTool.jsx";
import CollegeFinderTool from "../predictor/CollegeFinderTool.jsx";
import { CL, clEyebrow } from "./clTheme.js";

const ADV = CL.coral; // coral accent — matches the site theme

const TABS = [
  {
    key: "rank", label: "Rank Predictor", icon: Gauge,
    title: <>Map your marks to your <span style={{ color: ADV, fontStyle: "italic" }}>IIT rank.</span></>,
    sub: "Enter your JEE Advanced Paper 1 + Paper 2 marks and instantly see your estimated All-India CRL, your category rank, the IIT branches within reach and a live list of colleges that close at your rank.",
  },
  {
    key: "college", label: "College Predictor", icon: GraduationCap,
    title: <>Find every <span style={{ color: ADV, fontStyle: "italic" }}>IIT branch</span> your rank can get.</>,
    sub: "Enter your JEE Advanced rank and category to see which IITs and branches you can secure across all 6 JoSAA rounds — with opening & closing ranks, branch-change and dual-degree flexibility.",
  },
];

export default function AdvancedPredictorHome() {
  const [tab, setTab] = useState("rank");
  const active = TABS.find((t) => t.key === tab);

  return (
    <section id="advanced-predictor" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.55, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 28px" }}>
          <span style={{ ...clEyebrow }}>
            <Building2 size={13} /> JoSAA Engine · JEE Advanced
          </span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.9rem)", color: CL.ink, letterSpacing: "-1.3px", margin: "16px 0 12px", lineHeight: 1.08 }}>
            {active.title}
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7, fontStyle: "italic" }}>
            {active.sub}
          </p>
        </div>

        {/* ── Tool toggle ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", gap: 6, background: "#fff", border: `1px solid ${CL.coral}33`, borderRadius: 50, padding: 6, boxShadow: `0 4px 16px ${CL.coral}14` }}>
            {TABS.map((tb) => {
              const on = tb.key === tab;
              const Ic = tb.icon;
              return (
                <button key={tb.key} onClick={() => setTab(tb.key)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px",
                    border: "none", cursor: "pointer", borderRadius: 50, fontFamily: CL.display,
                    fontWeight: 700, fontSize: 14.5, transition: "all .18s",
                    color: on ? "#fff" : CL.coralDk,
                    background: on ? `linear-gradient(135deg, ${CL.coral}, ${CL.coralDk})` : "transparent",
                    boxShadow: on ? `0 6px 16px ${CL.coral}52` : "none",
                  }}>
                  <Ic size={16} /> {tb.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "rank" ? (
          <RankPredictorTool accent={ADV} advanced />
        ) : (
          <>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, maxWidth: 760, margin: "0 auto 18px",
              background: "#fff8ed", border: "1px solid #FF693D", borderRadius: 10, padding: "12px 16px",
              fontSize: 13, color: "#92400e",
            }}>
              <span style={{ fontSize: 18 }}>⏳</span>
              <span>
                <strong>Please wait 1–2 minutes</strong> while colleges load. If your browser shows a
                "Page Unresponsive" pop-up, click <strong>"Wait"</strong> — do <em>not</em> click "Exit Page".
              </span>
            </div>
            <CollegeFinderTool basePath="/jee-advanced" />
          </>
        )}
      </div>
    </section>
  );
}
