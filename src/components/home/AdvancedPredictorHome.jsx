/* AdvancedPredictorHome — the JoSAA · JEE Advanced rank predictor embedded on
   the home page. Renders the same RankPredictorTool (advanced) the dedicated
   /jee-advanced page uses, so visitors can map their Paper 1 + Paper 2 marks to
   an All-India IIT rank — with category rank, likely branches and a live IIT
   college preview — without leaving home. Campusloom section header on top. */
import { Building2 } from "lucide-react";
import RankPredictorTool from "../predictor/RankPredictorTool.jsx";
import { CL, clEyebrow } from "./clTheme.js";

const ADV = "#7C3AED"; // JEE Advanced violet — matches the /jee-advanced page

export default function AdvancedPredictorHome() {
  return (
    <section id="advanced-predictor" style={{ background: CL.cream2, padding: "84px 0", scrollMarginTop: 80, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${CL.cream3} 1.2px, transparent 1.2px)`, backgroundSize: "26px 26px", opacity: 0.55, pointerEvents: "none" }} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 36px" }}>
          <span style={{ ...clEyebrow, color: "#5b21b6", background: "rgba(124,58,237,.10)", border: "1px solid rgba(124,58,237,.28)" }}>
            <Building2 size={13} /> JoSAA Engine · JEE Advanced
          </span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.4vw,2.9rem)", color: CL.ink, letterSpacing: "-1.3px", margin: "16px 0 12px", lineHeight: 1.08 }}>
            Map your marks to your <span style={{ color: ADV, fontStyle: "italic" }}>IIT rank.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7, fontStyle: "italic" }}>
            Enter your JEE Advanced Paper 1 + Paper 2 marks and instantly see your estimated All-India CRL,
            your category rank, the IIT branches within reach and a live list of colleges that close at your rank.
          </p>
        </div>

        <RankPredictorTool accent={ADV} advanced />
      </div>
    </section>
  );
}
