import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Seo from "../components/Seo.jsx";
import PremiumHero from "../components/PremiumHero.jsx";
import { StrategyReveal, AnimatedWidth, AnimatedHeight } from "../components/StrategyReveal.jsx";
import { Zap, Stethoscope, Microscope, Target } from "lucide-react";

export default function NeetStrategy() {
  const heroProps = {
    badgeText: "EXAM MASTERY — NEET",
    titlePart1: "The ultimate strategy.",
    titlePart2: "Study ",
    highlight1: "smart",
    titlePart3: ", rank ",
    highlight2: "higher.",
    description: "Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation. Every mark shifts your rank.",
    stats: [
      { value: "720", label: "target score", color: "#f59e0b" },
      { value: "38", label: "bio chapters", color: "#0f172a" },
      { value: "300+", label: "mock hours", color: "#0f172a" }
    ],
    primaryButton: { text: "Read Playbook", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "View Timeline", onClick: () => { window.scrollTo({top: 1500, behavior: 'smooth'}) } },
    chartPercentage: 99,
    chartLabel: "percentile\ngoal",
    floatingCards: [
      { title: "Biology", subtitle: "NCERT Mastery", icon: Stethoscope, color: "#10b981", progress: 95 },
      { title: "Chemistry", subtitle: "Physical + Org", icon: Microscope, color: "#ef4444", progress: 85 },
      { title: "Physics", subtitle: "Formulas", icon: Zap, color: "#f59e0b", progress: 75 },
      { title: "Mock Tests", subtitle: "300+ hours", icon: Target, color: "#6366f1", progress: 55 }
    ]
  };

  const { scrollYProgress } = useScroll();
  const [showToTop, setShowToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="page strategy-wrapper" style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Seo 
        title="NEET Exam Strategy & Roadmap" 
        description="Master Biology, Maximize Accuracy & Build a Medical Rank with Smart Preparation." 
        path="/neet-strategy" 
      />

      <motion.div 
        className="progress-bar" 
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }} 
      />

      <nav className="topnav">
        <div className="brand"><span className="dot"></span>NEET Deep Dive</div>
        <div className="navlinks">
          <a href="#overview-detail">Overview</a>
          <a href="#weightage">Weightage</a>
          <a href="#playbook">Playbook</a>
          <a href="#subjects">Subjects</a>
          <a href="#time">Time</a>
          <a href="#mistakes">Mistakes</a>
          <a href="#timeline">Timeline</a>
        </div>
      </nav>

      <div id="overview">
        <PremiumHero {...heroProps} />
      </div>

      <section id="overview-detail">
        <StrategyReveal>
          <span className="section-kicker">Part 01</span>
          <h2 className="section-title">Understanding the exam at a structural level</h2>
          <p className="section-intro">NEET-UG is a single-attempt-per-year exam conducted by NTA, 3 hours 20 minutes long, entirely MCQ-based — no numerical-value questions like JEE, which changes the risk calculus of guessing.</p>
        </StrategyReveal>

        <div className="compare-grid">
          <StrategyReveal delay={0.1} className="exam-card main" style={{borderColor: "var(--green)"}}>
            <span className="tag" style={{background: "var(--green-tint)", color: "var(--green-ink)"}}>Biology Dominance</span>
            <h3>Half the exam rests on one subject</h3>
            <div className="stat-row"><span className="k">Biology (Botany + Zoology)</span><span className="v">360 Marks</span></div>
            <div className="stat-row"><span className="k">Physics</span><span className="v">180 Marks</span></div>
            <div className="stat-row"><span className="k">Chemistry</span><span className="v">180 Marks</span></div>
            <div className="stat-row"><span className="k">Total Duration</span><span className="v">3 hrs 20 mins</span></div>
            <div className="stat-row"><span className="k">Questions Attempted</span><span className="v">180 out of 200</span></div>
            <div className="stat-row"><span className="k">Marking Scheme</span><span className="v">+4 / −1</span></div>
          </StrategyReveal>
          
          <StrategyReveal delay={0.2} className="callout" style={{flexDirection: "column"}}>
            <div style={{display: "flex", gap: "16px"}}>
              <div className="icon">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.9 19.1l2.8-2.8"/><path d="M16.3 7.7l2.8-2.8"/></svg>
              </div>
              <div>
                <p><strong>Why NEET is fundamentally a Biology exam:</strong> A student who is excellent in Biology but only average in Physics and Chemistry has a realistic path to a strong rank. The reverse — excellent Physics/Chemistry but weak Biology — almost never produces a competitive score.</p>
              </div>
            </div>
            <div style={{display: "flex", gap: "16px", marginTop: "16px"}}>
              <div className="icon" style={{background: "var(--coral-tint)", color: "var(--coral-ink)"}}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div>
                <p><strong>Single Attempt Stakes:</strong> Unlike JEE Main's two sessions, NEET gives you one shot annually. This raises the value of genuine long-term retention and full-length mock stamina training over short intense sprints.</p>
              </div>
            </div>
          </StrategyReveal>
        </div>
      </section>

      <section id="weightage">
        <StrategyReveal>
          <span className="section-kicker">Part 02</span>
          <h2 className="section-title">Chapter-wise weightage reality</h2>
          <p className="section-intro">No official weightage is published, but multi-year PYQ pattern analysis converges consistently on the following high-yield zones.</p>
        </StrategyReveal>

        <div className="weight-grid">
          <StrategyReveal delay={0.1} className="weight-card physics" style={{borderTop: "4px solid var(--green)"}}>
            <div className="wtitle"><span className="wicon" style={{background: "var(--green-tint)", color: "var(--green-ink)"}}><Stethoscope size={18} /></span>Biology</div>
            <div className="chip-list">
              <span className="chip">Genetics & Evolution</span><span className="chip">Human Physiology</span><span className="chip">Plant Physiology</span><span className="chip">Cell Biology</span><span className="chip">Reproduction</span><span className="chip">Biotech</span>
            </div>
          </StrategyReveal>
          <StrategyReveal delay={0.2} className="weight-card chem" style={{borderTop: "4px solid var(--coral)"}}>
            <div className="wtitle"><span className="wicon"><Microscope size={18} /></span>Chemistry</div>
            <div className="chip-list">
              <span className="chip">Mole Concept</span><span className="chip">Equilibrium</span><span className="chip">Periodic Trends</span><span className="chip">Coordination Cmpds</span><span className="chip">GOC</span><span className="chip">Biomolecules</span>
            </div>
          </StrategyReveal>
          <StrategyReveal delay={0.3} className="weight-card math" style={{borderTop: "4px solid var(--amber)"}}>
            <div className="wtitle"><span className="wicon"><Zap size={18} /></span>Physics</div>
            <div className="chip-list">
              <span className="chip">Mechanics</span><span className="chip">Electrodynamics</span><span className="chip">Optics</span><span className="chip">Modern Physics</span><span className="chip">Thermodynamics</span>
            </div>
          </StrategyReveal>
        </div>

        <StrategyReveal delay={0.4} className="priority-strip">
          <div className="ptitle">Time allocation — a defensible default split</div>
          <div className="priority-flow">
            <span className="pnode" style={{background: "var(--green-tint)", color: "var(--green-ink)"}}>Biology 45–50%</span><span className="parrow">+</span>
            <span className="pnode" style={{background: "var(--coral-tint)", color: "var(--coral-ink)"}}>Chemistry 25–30%</span><span className="parrow">+</span>
            <span className="pnode" style={{background: "var(--amber-tint)", color: "var(--amber-ink)"}}>Physics 20–25%</span>
          </div>
        </StrategyReveal>
      </section>

      <section id="playbook">
        <StrategyReveal>
          <span className="section-kicker">Part 03</span>
          <h2 className="section-title">The real toppers' playbook, expanded</h2>
          <p className="section-intro">Patterns that repeat across high-ranking NEET interviews year after year, distilled into five habits.</p>
        </StrategyReveal>

        <div className="playbook-grid">
          <StrategyReveal delay={0.1} className="habit-card"><div className="habit-num">01</div><h3>NCERT as scripture</h3><p>80–90% of biology questions are traceable directly to NCERT lines, including footnotes and exceptions. Top scorers read it cover to cover 10+ times, treating it as a document to memorize precisely.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="habit-card"><div className="habit-num">02</div><h3>Diagram-based revision</h3><p>Human Physiology and Reproduction are frequently tested via labeled diagrams. A well-reported technique: close the book and redraw and label key NCERT diagrams from memory repeatedly.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="habit-card"><div className="habit-num">03</div><h3>Line-by-line reading</h3><p>Read NCERT Biology with a highlighter, flagging every italicized term, footnote, and example. Create a separate "facts I almost skipped" list to revise in the last two weeks.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="habit-card"><div className="habit-num">04</div><h3>Daily revision streaks</h3><p>Because the NEET syllabus is massive and it's a single annual attempt, toppers emphasize daily "touch and review" of previously covered chapters rather than saving all revision for the final months.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="habit-card"><div className="habit-num">05</div><h3>PYQs as study material</h3><p>NEET Biology has a pattern of recycling concepts. Chapter-wise PYQ practice reveals exactly which fact-level details NEET setters return to again and again.</p></StrategyReveal>
        </div>
      </section>

      <section id="subjects">
        <StrategyReveal>
          <span className="section-kicker">Part 04</span>
          <h2 className="section-title">Subject-wise deep strategy</h2>
        </StrategyReveal>

        <StrategyReveal delay={0.1} className="subject-panel bio">
          <div className="subj-head">
            <div className="sicon"><Stethoscope size={20} /></div>
            <h3>Biology</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li><strong>Build one-page chapter summaries</strong> immediately after finishing each NCERT chapter — flowcharts work especially well for sequential physiological processes.</li>
              <li>Don't let Botany lag behind Zoology or vice versa — both carry comparable weightage, but students often neglect the one they find less "interesting."</li>
              <li>Treat <strong>Genetics numericals</strong> (cross ratios, pedigree analysis) as a distinct skill requiring practice, not just theory reading — these behave more like Math.</li>
              <li>Pay special attention to scientific names, years of discoveries, and plant families.</li>
            </ul>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.2} className="subject-panel chem">
          <div className="subj-head">
            <div className="sicon"><Microscope size={20} /></div>
            <h3>Chemistry</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li>Treat <strong>Physical Chemistry like Math</strong> — formula-driven and trainable through repetition. NEET's numericals are generally more direct, formula-plug style.</li>
              <li>Treat <strong>Inorganic Chemistry</strong> as memorization plus pattern recognition — periodic trends and their exceptions come up constantly.</li>
              <li>Treat <strong>Organic Chemistry</strong> as electron-movement logic — pitched at a less complex depth than JEE Advanced, rarely demanding multi-step synthesis reasoning.</li>
            </ul>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.3} className="subject-panel math" style={{borderLeftColor: "var(--amber)"}}>
          <div className="subj-head">
            <div className="sicon" style={{background: "var(--amber-tint)", color: "var(--amber-ink)"}}><Zap size={20} /></div>
            <h3>Physics</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li>NEET Physics questions are generally <strong>more direct and single-concept</strong> than JEE.</li>
              <li>Once a formula is internalized, the main skill to build is <strong>fast, accurate recall</strong> rather than complex multi-step problem-solving.</li>
              <li>Optics and Modern Physics are comparatively compact syllabus areas with strong scoring density — high return on focused revision time.</li>
            </ul>
          </div>
        </StrategyReveal>
      </section>

      <section id="time">
        <StrategyReveal>
          <span className="section-kicker">Part 05</span>
          <h2 className="section-title">Time management — the full framework</h2>
          <p className="section-intro"><strong style={{color:"var(--ink)"}}>The 3-pass exam technique</strong> — split your exam time by difficulty, so one stuck problem never costs you five easy ones.</p>
        </StrategyReveal>
        
        <div className="pass-bar">
          <AnimatedWidth width={50} className="pass-seg p1" style={{background: "var(--green)"}}>Pass 1: Biology (40-45m)</AnimatedWidth>
          <AnimatedWidth width={25} delay={0.2} className="pass-seg p2">Pass 2: Chemistry (45-50m)</AnimatedWidth>
          <AnimatedWidth width={25} delay={0.4} className="pass-seg p3" style={{background: "var(--amber)"}}>Pass 3: Physics (60m+)</AnimatedWidth>
        </div>

        <StrategyReveal delay={0.1}>
          <p className="section-intro" style={{marginTop:"34px"}}><strong style={{color:"var(--ink)"}}>Recommended subject attempt order</strong> — bank the 50% weightage first.</p>
          <div className="flow-row">
            <span className="flow-pill c4">Biology</span><span className="parrow">→</span>
            <span className="flow-pill c1">Chemistry</span><span className="parrow">→</span>
            <span className="flow-pill c2">Physics</span>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.2} className="daily-bar">
          <div className="dtitle">A realistic daily study structure (10 hours)</div>
          <div className="stacked">
            <AnimatedWidth width={45} className="s-bio">Biology 4.5h</AnimatedWidth>
            <AnimatedWidth width={25} delay={0.1} className="s-chem">Chemistry 2.5h</AnimatedWidth>
            <AnimatedWidth width={20} delay={0.2} className="s-math">Physics 2h</AnimatedWidth>
            <AnimatedWidth width={10} delay={0.3} className="s-log">Log 1h</AnimatedWidth>
          </div>
          <div className="legend">
            <span><i style={{background:"var(--green)"}}></i>Biology</span>
            <span><i style={{background:"var(--coral)"}}></i>Chemistry</span>
            <span><i style={{background:"var(--amber)"}}></i>Physics</span>
            <span><i style={{background:"var(--ink)"}}></i>Error-log & Mocks</span>
          </div>
        </StrategyReveal>

        <div className="two-col-callout">
          <StrategyReveal delay={0.3} className="callout" style={{marginTop:0}}>
            <div className="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
            <p><strong>OMR Filling Strategy:</strong> Never leave OMR filling for the last 15 minutes. Either bubble after every question, or bubble page-by-page. A single misalignment at the end can cost 40+ marks.</p>
          </StrategyReveal>
          <StrategyReveal delay={0.4} className="callout" style={{marginTop:0}}>
            <div className="icon" style={{background:"var(--coral-tint)",color:"var(--coral-ink)"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <p><strong>The final 30 days:</strong> No new topics. Pure revision of NCERT Biology lines, Physics formula sheets, and timed 2PM-5:20PM mocks to train your biological clock.</p>
          </StrategyReveal>
        </div>
      </section>

      <section id="psychology">
        <StrategyReveal>
          <span className="section-kicker">Part 06</span>
          <h2 className="section-title">Psychology and exam-day management</h2>
        </StrategyReveal>
        <div className="psych-grid">
          <StrategyReveal delay={0.1} className="psych-card"><p><strong>The 2 PM Slump:</strong> NEET is conducted in the afternoon (2:00 PM - 5:20 PM). You must condition your body to be at peak alertness during this time. Stop taking afternoon naps at least 2 months before the exam.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="psych-card"><p><strong>Biology Panic:</strong> If the Biology section starts with a few tough bouncers, don't panic. The paper is designed to test your nerve. Skip them and find the easy NCERT-line questions to build momentum.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="psych-card"><p><strong>Anxiety is normal, even for toppers.</strong> The differentiator isn't calm nerves — it's a rehearsed routine, built through mocks, that the mind defaults to under pressure.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="psych-card"><p><strong>Stuck for 2 minutes? Move on.</strong> In NEET, speed is king. Every extra minute on a tough Physics numerical is a minute stolen from two easy Biology questions elsewhere.</p></StrategyReveal>
        </div>
      </section>

      <section id="mistakes">
        <StrategyReveal>
          <span className="section-kicker">Part 07</span>
          <h2 className="section-title">Common mistakes that cost ranks</h2>
        </StrategyReveal>
        <div className="mistake-list">
          <StrategyReveal delay={0.1} className="mistake-item"><div className="mistake-num">1</div><p>Ignoring NCERT diagrams and summary texts in Biology — NTA frequently pulls tricky statements directly from the chapter summaries.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="mistake-item"><div className="mistake-num">2</div><p>Spending 60% of study time on Physics despite it being only 25% of the weightage, simply because it feels harder.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="mistake-item"><div className="mistake-num">3</div><p>Not practicing OMR bubbling during mock tests at home, leading to time mismanagement on the actual exam day.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="mistake-item"><div className="mistake-num">4</div><p>Guessing blindly on MCQs without eliminating at least one option first — ruling out even one wrong option meaningfully changes the expected value of a guess.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="mistake-item"><div className="mistake-num">5</div><p>Treating rest and sleep as wasted time — burnout in the final 60 days is one of the most cited reasons for underperforming your own mock average.</p></StrategyReveal>
        </div>
      </section>

      <section id="timeline">
        <StrategyReveal>
          <span className="section-kicker">Part 08</span>
          <h2 className="section-title">A realistic month-by-month timeline</h2>
        </StrategyReveal>
        <div className="timeline">
          <AnimatedHeight height="100%" className="tl-progress" />
          <StrategyReveal delay={0.1} className="tl-item"><div className="tl-dot"></div><h4>8–6 months out</h4><p>First reading of NCERT. Focus on conceptual clarity in Physics and Physical Chemistry. Begin building your error log.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="tl-item"><div className="tl-dot"></div><h4>6–4 months out</h4><p>Second pass of NCERT Biology (start highlighting). Begin solving 15 years of chapter-wise PYQs. Start part-syllabus mock tests.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="tl-item"><div className="tl-dot"></div><h4>4–2 months out</h4><p>Third pass of NCERT. Transition from chapter-wise tests to weekly full-length 3hr 20min mocks. Strictly attempt mocks between 2 PM and 5:20 PM.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="tl-item"><div className="tl-dot"></div><h4>2–1 months out</h4><p>Full mocks twice weekly; condensed-notes revision begins in earnest. Focus heavily on Botany and Zoology diagrams and examples.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="tl-item"><div className="tl-dot"></div><h4>Final month</h4><p>No new topics. Pure revision of highlighted NCERT lines, Physics formula sheets, and the error log. Taper mock frequency in the final week to avoid exhaustion.</p></StrategyReveal>
          <StrategyReveal delay={0.6} className="tl-item"><div className="tl-dot"></div><h4>Final week</h4><p>Light revision only — short notes, formula sheets, previously-wrong questions. Protect your sleep schedule and mental steadiness.</p></StrategyReveal>
        </div>
      </section>

      <section id="closing">
        <StrategyReveal className="closing" style={{border: "1px solid var(--green-tint)"}}>
          <p className="quote">"NEET is an exam of discipline, not just intelligence. The rank goes to the student who reads NCERT one more time, takes one more mock test, and reviews one more mistake when everyone else is tired."</p>
          <div className="sig">— Closing note</div>
        </StrategyReveal>
      </section>

      <footer>NEET STRATEGY DEEP DIVE · BUILT FOR CONSISTENT, HONEST PREP</footer>

      <div className={`to-top ${showToTop ? 'show' : ''}`} onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
      </div>
    </div>
  );
}
