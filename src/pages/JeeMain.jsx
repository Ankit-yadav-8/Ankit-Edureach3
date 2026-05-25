import { EXAM_BY_SLUG } from "../data/exams.js";
import RankPredictorTool from "../components/predictor/RankPredictorTool.jsx";
import CollegePredictorTool from "../components/predictor/CollegePredictorTool.jsx";
import { DifficultyAnalysis, PapersGrid, EligibilityCards, RankingsTable } from "../components/predictor/AnalysisSections.jsx";
import { Trend } from "../components/Charts.jsx";
import Reveal from "../components/Reveal.jsx";
import { Info } from "lucide-react";

function Block({ id, eyebrow, title, sub, children }) {
  return (
    <section id={id} className="section" style={{ scrollMarginTop: 90 }}>
      <div className="container">
        <div className="title-bar">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title">{title}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </div>
        <Reveal>{children}</Reveal>
      </div>
    </section>
  );
}

export default function JeeMain() {
  const exam = EXAM_BY_SLUG["jee-main"];
  const trend = exam.cutoffTrend;

  return (
    <div className="page">
      {/* page hero */}
      <section style={{ background: "linear-gradient(135deg,#fff7f0,#ffe8d6)", color: "var(--ink)", padding: "48px 0" }}>
        <div className="container">
          <span className="badge orange">JEE Main 2026</span>
          <h1 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "10px 0 6px" }}>JEE Main — Rank & College Predictor Hub</h1>
          <p style={{ color: "var(--muted)", maxWidth: 620 }}>Predict your rank, find every NIT / IIIT / GFTI you can get into across all counselling rounds, and analyse shift-wise difficulty.</p>
        </div>
      </section>

      <div className="container" style={{ marginTop: 18 }}>
        <div className="info-banner"><Info size={18} /> Data shown is illustrative for 2026 and modelled on past trends. Always cross-check with official sources (jeemain.nta.ac.in, josaa.nic.in, csab.nic.in).</div>
      </div>

      <Block id="rank" eyebrow="Tool 1" title="JEE Main Rank Predictor" sub="Convert your expected marks into an All-India rank, percentile and category rank.">
        <RankPredictorTool accent="#F97316" />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="college" eyebrow="Tool 2" title="JEE Main College Predictor" sub="Enter your rank to see every eligible college & branch — with all JoSAA (and CSAB for NITs/IIITs) round cutoffs.">
          <CollegePredictorTool basePath="/jee-main" />
        </Block>
      </div>

      <Block id="analysis" eyebrow="Result Analysis" title="Shift-wise difficulty & subject analysis" sub="Subject-level difficulty index for each session and shift.">
        <DifficultyAnalysis />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="trend" eyebrow="Cutoff Trends" title="5-year qualifying percentile trend" sub="How the JEE Main qualifying cutoff has moved across categories.">
          <div className="card">
            <Trend data={trend} lines={[
              { key: "open", label: "General", color: "#1c1c28" },
              { key: "obc", label: "OBC-NCL", color: "#F4A261" },
              { key: "sc", label: "SC", color: "#2EC4B6" },
              { key: "st", label: "ST", color: "#F97316" },
            ]} height={320} />
          </div>
        </Block>
      </div>

      <Block id="papers" eyebrow="Question Papers" title="Shift-wise papers, keys & solutions" sub="Download links for every session and shift (opens official portal).">
        <PapersGrid exam={exam} />
      </Block>

      <div style={{ background: "var(--sky)" }}>
        <Block id="eligibility" eyebrow="Eligibility" title="Who can appear for JEE Main?" sub="Key eligibility criteria at a glance.">
          <EligibilityCards exam={exam} />
        </Block>
      </div>

      <Block id="nit-rankings" eyebrow="NIRF Rankings" title="Top NITs by ranking & placements" sub="Sort by NIRF rank, average package or placement percentage.">
        <RankingsTable type="NIT" />
      </Block>
    </div>
  );
}
