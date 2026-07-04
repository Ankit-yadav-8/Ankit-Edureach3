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
  return (
    <section id="advanced-predictor" style={{ background: CL.cream, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.55, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <span style={{ ...clEyebrow }}>
            <Building2 size={13} /> JoSAA Engine · JEE Advanced
          </span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.9rem)", color: CL.ink, letterSpacing: "-1.3px", margin: "16px 0 12px", lineHeight: 1.08 }}>
            JEE Advanced Analysis & JoSAA Predictor
          </h2>
          <div style={{ display: "inline-block", background: "#fff", border: `1px solid ${CL.coral}40`, padding: "24px 40px", borderRadius: 16, boxShadow: CL.shadow, marginTop: 24 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: CL.coral, fontFamily: CL.display, marginBottom: 8 }}>
              Coming Soon
            </div>
            <p style={{ color: CL.body, fontSize: 14 }}>
              We're currently processing the latest IIT cutoffs and branch trends. <br/>Check back soon for the most accurate rank prediction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
