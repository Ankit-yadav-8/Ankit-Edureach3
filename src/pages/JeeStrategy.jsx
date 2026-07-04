import { useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";
import Seo from "../components/Seo.jsx";
import PremiumHero from "../components/PremiumHero.jsx";
import { StrategyReveal, AnimatedWidth, AnimatedHeight } from "../components/StrategyReveal.jsx";
import { Atom, FlaskConical, Sigma } from "lucide-react";

export default function JeeStrategy() {
  const heroProps = {
    badgeText: "EXAM MASTERY — JEE",
    titlePart1: "The ultimate strategy.",
    titlePart2: "Study ",
    highlight1: "smart",
    titlePart3: ", score ",
    highlight2: "higher.",
    description: "Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, and AI Insights. Quality beats quantity.",
    stats: [
      { value: "Top 1%", label: "target", color: "#f59e0b" },
      { value: "4", label: "prep phases", color: "#0f172a" },
      { value: "300+", label: "mock hours", color: "#0f172a" }
    ],
    primaryButton: { text: "Read Playbook", onClick: () => { window.scrollTo({top: 800, behavior: 'smooth'}) } },
    secondaryButton: { text: "View Timeline", onClick: () => { window.scrollTo({top: 1500, behavior: 'smooth'}) } },
    chartPercentage: 99,
    chartLabel: "percentile\ngoal",
    floatingCards: [
      { title: "Chemistry", subtitle: "Reactions", icon: FlaskConical, color: "#ef4444", progress: 85, pos: { top: "15%", right: "5%" } },
      { title: "Mathematics", subtitle: "15-20 Qs/day", icon: Sigma, color: "#f59e0b", progress: 65, pos: { bottom: "10%", left: "20%" } }
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
        title="JEE Exam Strategy & Roadmap" 
        description="Master JEE Main & Advanced with Proven Roadmaps, Topper Frameworks, AI Insights & Smart Preparation" 
        path="/jee-strategy" 
      />

      <motion.div 
        className="progress-bar" 
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }} 
      />

      <nav className="topnav">
        <div className="brand"><span className="dot"></span>JEE Deep Dive</div>
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

      <section className="hero" id="overview" style={{ padding: "40px 6vw", maxWidth: 1180, margin: "0 auto", paddingBottom: "100px" }}>
        <PremiumHero {...heroProps} />
      </section>

      <section id="overview-detail">
        <StrategyReveal>
          <span className="section-kicker">Part 01</span>
          <h2 className="section-title">Understanding the exam at a structural level</h2>
          <p className="section-intro">Main and Advanced are not the same exam wearing two names — they reward different skills, and your last two months of prep should look different depending on which one you're optimizing for.</p>
        </StrategyReveal>

        <div className="compare-grid">
          <StrategyReveal delay={0.1} className="exam-card main">
            <span className="tag">JEE Main</span>
            <h3>Speed + accuracy on well-defined problems</h3>
            <div className="stat-row"><span className="k">Sessions per year</span><span className="v">2 (Jan & Apr)</span></div>
            <div className="stat-row"><span className="k">Questions · Paper 1</span><span className="v">90</span></div>
            <div className="stat-row"><span className="k">Total marks</span><span className="v">300</span></div>
            <div className="stat-row"><span className="k">Duration</span><span className="v">3 hours</span></div>
            <div className="stat-row"><span className="k">MCQ marking</span><span className="v">+4 / −1</span></div>
            <div className="stat-row"><span className="k">Numerical-value marking</span><span className="v">+4 / no negative</span></div>
            <div className="stat-row"><span className="k">Scoring basis</span><span className="v">Shift percentile</span></div>
          </StrategyReveal>
          <StrategyReveal delay={0.2} className="exam-card adv">
            <span className="tag">JEE Advanced</span>
            <h3>Depth + comfort with ambiguity</h3>
            <div className="stat-row"><span className="k">Eligibility</span><span className="v">Top ~2.5L Main rankers</span></div>
            <div className="stat-row"><span className="k">Papers</span><span className="v">2 (both compulsory)</span></div>
            <div className="stat-row"><span className="k">Duration</span><span className="v">3 hours each</span></div>
            <div className="stat-row"><span className="k">Question types</span><span className="v">Rotates yearly</span></div>
            <div className="stat-row"><span className="k">Multi-correct marking</span><span className="v">Partial, heavy penalty</span></div>
            <div className="stat-row"><span className="k">Format intent</span><span className="v">Defeats rote memorization</span></div>
            <div className="stat-row"><span className="k">Skipping either paper</span><span className="v">Disqualifies</span></div>
          </StrategyReveal>
        </div>

        <StrategyReveal delay={0.3} className="callout">
          <div className="icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.9 4.9l2.8 2.8"/><path d="M16.3 16.3l2.8 2.8"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.9 19.1l2.8-2.8"/><path d="M16.3 7.7l2.8-2.8"/></svg>
          </div>
          <p><strong>The practical takeaway:</strong> a student who prepares only with Main-level MCQ practice often struggles in Advanced not from lacking knowledge, but from never practicing holding two or three concepts in their head at once under pressure. The last 60 days before Advanced should shift almost entirely to previous-year Advanced papers, not more Main-style sets.</p>
        </StrategyReveal>
      </section>

      <section id="weightage">
        <StrategyReveal>
          <span className="section-kicker">Part 02</span>
          <h2 className="section-title">Chapter-wise weightage reality</h2>
          <p className="section-intro">No official weightage is published, but multi-year PYQ analysis converges on the same high-yield zones year after year. Treat this as directional priority, not gospel — Advanced especially can still ask a hard question from a "minor" chapter.</p>
        </StrategyReveal>

        <div className="weight-grid">
          <StrategyReveal delay={0.1} className="weight-card physics">
            <div className="wtitle"><span className="wicon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9.5" ry="4"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)"/></svg></span>Physics</div>
            <div className="chip-list">
              <span className="chip">Mechanics</span><span className="chip">Electrodynamics</span><span className="chip">Modern Physics</span><span className="chip">Thermodynamics</span><span className="chip">Waves / SHM</span><span className="chip">Optics</span>
            </div>
          </StrategyReveal>
          <StrategyReveal delay={0.2} className="weight-card chem">
            <div className="wtitle"><span className="wicon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 2h6"/><path d="M10 2v6.2L4.6 17a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 8.2V2"/><path d="M7.5 14.5h9"/></svg></span>Chemistry</div>
            <div className="chip-list">
              <span className="chip">Mole Concept</span><span className="chip">Equilibrium</span><span className="chip">Electrochemistry</span><span className="chip">Periodic Trends</span><span className="chip">Coordination Cmpds</span><span className="chip">GOC</span><span className="chip">Carbonyl Chem</span>
            </div>
          </StrategyReveal>
          <StrategyReveal delay={0.3} className="weight-card math">
            <div className="wtitle"><span className="wicon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 20 L12 4 L20 20"/><path d="M7.5 13h9"/></svg></span>Mathematics</div>
            <div className="chip-list">
              <span className="chip">Calculus</span><span className="chip">Complex Numbers</span><span className="chip">P&C · Probability</span><span className="chip">Matrices</span><span className="chip">Coordinate Geo</span><span className="chip">Vectors / 3D</span>
            </div>
          </StrategyReveal>
        </div>

        <StrategyReveal delay={0.4} className="priority-strip">
          <div className="ptitle">Marks per hour of revision — descending priority</div>
          <div className="priority-flow">
            <span className="pnode">Inorganic Chem</span><span className="parrow">→</span>
            <span className="pnode">Coord. Geo / Algebra</span><span className="parrow">→</span>
            <span className="pnode">Physical Chem</span><span className="parrow">→</span>
            <span className="pnode">Mechanics / E&M</span><span className="parrow">→</span>
            <span className="pnode">Organic Chem</span><span className="parrow">→</span>
            <span className="pnode">Calculus depth</span>
          </div>
        </StrategyReveal>
      </section>

      <section id="playbook">
        <StrategyReveal>
          <span className="section-kicker">Part 03</span>
          <h2 className="section-title">The real toppers' playbook, expanded</h2>
          <p className="section-intro">Patterns that repeat across AIR 1–100 interviews year after year, distilled into five habits.</p>
        </StrategyReveal>

        <div className="playbook-grid">
          <StrategyReveal delay={0.1} className="habit-card"><div className="habit-num">01</div><h3>NCERT is non-negotiable</h3><p>Inorganic and parts of Physical Chemistry draw heavily, sometimes verbatim, from NCERT phrasing — including footnotes and exceptions. Top scorers read it cover to cover 5–8+ times, treating it as a document to memorize precisely, not just a textbook.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="habit-card"><div className="habit-num">02</div><h3>One primary source, enforced</h3><p>"I collected too many books and finished none properly" is the most common regret. Pick one standard reference per subject, master it fully, and only supplement for a specific weak topic — never swap it wholesale mid-year.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="habit-card"><div className="habit-num">03</div><h3>The error log</h3><p>After every test, log the <em>root cause</em> — conceptual gap, calculation slip, misread question, time pressure, or lucky/unlucky guess. Reviewed weekly, it becomes a personalized map of exactly where marks are lost.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="habit-card"><div className="habit-num">04</div><h3>Spaced revision cycles</h3><p>Learn → re-solve without the solution 30–45 days later, building one-page notes → in the final weeks, revise only those condensed notes and the error log. Spacing beats massed re-reading for long-term retention.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="habit-card"><div className="habit-num">05</div><h3>Protected sleep</h3><p>Nearly every high-ranker interview mentions a fixed 6.5–7.5 hour sleep schedule as non-negotiable — working memory and calculation speed both degrade measurably under sleep debt. All-nighters are described as counterproductive, not heroic.</p></StrategyReveal>
        </div>
      </section>

      <section id="subjects">
        <StrategyReveal>
          <span className="section-kicker">Part 04</span>
          <h2 className="section-title">Subject-wise deep strategy</h2>
        </StrategyReveal>

        <StrategyReveal delay={0.1} className="subject-panel physics">
          <div className="subj-head">
            <div className="sicon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="9.5" ry="4"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(120 12 12)"/></svg></div>
            <h3>Physics</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li><strong>Derive, don't memorize</strong> — Advanced often twists a standard setup just enough that a memorized formula stops applying, but a student who knows the derivation adapts in real time.</li>
              <li>Build strong <strong>dimensional analysis</strong> intuition — a fast way to sanity-check a derived formula or answer, catching a large share of silly errors instantly.</li>
              <li>Numerical-value questions need different practice: since Main doesn't penalize them, aim for <strong>directionally close, fast</strong>; for Advanced, precision matters since they're graded fully right or wrong.</li>
              <li>Deliberately practice <strong>multi-concept problems</strong> for Advanced — rotational dynamics plus energy conservation, or E&M plus mechanics, is the house style.</li>
            </ul>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.2} className="subject-panel chem">
          <div className="subj-head">
            <div className="sicon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 2h6"/><path d="M10 2v6.2L4.6 17a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3L14 8.2V2"/><path d="M7.5 14.5h9"/></svg></div>
            <h3>Chemistry</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li>Treat <strong>Physical Chemistry like Math</strong> — formula-driven and trainable through repetition. Mole Concept, Equilibrium, Thermodynamics, and Electrochemistry are the backbone.</li>
              <li>Treat <strong>Inorganic Chemistry</strong> as memorization plus pattern recognition — periodic trends and their exceptions come up constantly; coordination compound theory leans more Advanced.</li>
              <li>Treat <strong>Organic Chemistry</strong> as electron-movement logic, not isolated reaction memorization — understanding mechanism categories lets you predict outcomes of reactions you've never seen.</li>
              <li>Chemistry is usually the <strong>fastest section to attempt</strong> in Main — many high scorers deliberately do it first to bank quick marks and settle nerves.</li>
            </ul>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.3} className="subject-panel math">
          <div className="subj-head">
            <div className="sicon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 20 L12 4 L20 20"/><path d="M7.5 13h9"/></svg></div>
            <h3>Mathematics</h3>
          </div>
          <div className="subj-body">
            <ul>
              <li><strong>Calculus and Algebra</strong> together typically make up more than half the Math weightage — prioritize mastery here over exotic, low-frequency topics.</li>
              <li><strong>Coordinate Geometry and Vectors/3D</strong> are comparatively fast once internalized — good candidates to attempt early and build a time buffer.</li>
              <li>Most lost marks aren't from lacking knowledge — they're <strong>sign errors and missed edge cases</strong>. Build a 10-second final sanity check: does the sign, magnitude, or domain make sense?</li>
            </ul>
          </div>
        </StrategyReveal>
      </section>

      <section id="time">
        <StrategyReveal>
          <span className="section-kicker">Part 05</span>
          <h2 className="section-title">Time management — the full framework</h2>

          <p className="section-intro"><strong style={{color:"var(--ink)"}}>The 3-pass exam technique</strong> — split your exam time by difficulty, not by subject, so one stuck problem never costs you five easy ones.</p>
        </StrategyReveal>
        
        <div className="pass-bar">
          <AnimatedWidth width={40} className="pass-seg p1">Pass 1 · &lt;90s each</AnimatedWidth>
          <AnimatedWidth width={40} delay={0.2} className="pass-seg p2">Pass 2 · 2–4 min</AnimatedWidth>
          <AnimatedWidth width={20} delay={0.4} className="pass-seg p3">Pass 3 · hardest left</AnimatedWidth>
        </div>

        <StrategyReveal delay={0.1}>
          <p className="section-intro" style={{marginTop:"34px"}}><strong style={{color:"var(--ink)"}}>Recommended subject attempt order for Main</strong> — bank the fastest, most confident marks first.</p>
          <div className="flow-row">
            <span className="flow-pill c1">Chemistry</span><span className="parrow">→</span>
            <span className="flow-pill c2">Mathematics</span><span className="parrow">→</span>
            <span className="flow-pill c3">Physics</span>
          </div>
        </StrategyReveal>

        <StrategyReveal delay={0.2} className="daily-bar">
          <div className="dtitle">A realistic daily study structure (10 hours)</div>
          <div className="stacked">
            <AnimatedWidth width={30} className="s-phy">Physics 3h</AnimatedWidth>
            <AnimatedWidth width={30} delay={0.1} className="s-chem">Chemistry 3h</AnimatedWidth>
            <AnimatedWidth width={30} delay={0.2} className="s-math">Maths 3h</AnimatedWidth>
            <AnimatedWidth width={10} delay={0.3} className="s-log">Log 1h</AnimatedWidth>
          </div>
          <div className="legend">
            <span><i style={{background:"var(--violet)"}}></i>Physics</span>
            <span><i style={{background:"var(--coral)"}}></i>Chemistry</span>
            <span><i style={{background:"var(--amber)"}}></i>Mathematics</span>
            <span><i style={{background:"var(--green)"}}></i>Error-log review</span>
          </div>
        </StrategyReveal>

        <div className="two-col-callout">
          <StrategyReveal delay={0.3} className="callout" style={{marginTop:0}}>
            <div className="icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
            <p><strong>Pomodoro-style blocks:</strong> 45–50 minutes of focused study with 5–10 minute breaks — sustained focus tends to degrade noticeably after 60–90 minutes.</p>
          </StrategyReveal>
          <StrategyReveal delay={0.4} className="callout" style={{marginTop:0}}>
            <div className="icon" style={{background:"var(--coral-tint)",color:"var(--coral-ink)"}}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <p><strong>The final 30 days:</strong> no new topics, ever. Pure revision of condensed notes and the error log, timed mocks, and sleep discipline — cramming new chapters tends to raise anxiety without raising score.</p>
          </StrategyReveal>
        </div>
      </section>

      <section id="psychology">
        <StrategyReveal>
          <span className="section-kicker">Part 06</span>
          <h2 className="section-title">Psychology and exam-day management</h2>
        </StrategyReveal>
        <div className="psych-grid">
          <StrategyReveal delay={0.1} className="psych-card"><p><strong>Anxiety is normal, even for toppers.</strong> The differentiator isn't calm nerves — it's a rehearsed routine, built through mocks, that the mind defaults to under pressure.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="psych-card"><p><strong>Don't pace against your neighbor.</strong> Everyone attempts questions in a different order; someone finishing early is not useful information and can trigger unnecessary panic.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="psych-card"><p><strong>Stuck for 2–3 minutes past budget? Move on.</strong> Every extra minute on one problem is a minute stolen from two or three solvable ones elsewhere.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="psych-card"><p><strong>Exam-day routine matters</strong> — a light, familiar breakfast, arriving with buffer time, and a few minutes of calm breathing before the exam starts.</p></StrategyReveal>
        </div>
      </section>

      <section id="mistakes">
        <StrategyReveal>
          <span className="section-kicker">Part 07</span>
          <h2 className="section-title">Common mistakes that cost ranks</h2>
        </StrategyReveal>
        <div className="mistake-list">
          <StrategyReveal delay={0.1} className="mistake-item"><div className="mistake-num">1</div><p>Guessing blindly on MCQs without eliminating at least one option first — ruling out even one wrong option meaningfully changes the expected value of a guess.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="mistake-item"><div className="mistake-num">2</div><p>Dismissing NCERT as "too basic," especially for Chemistry — a large, avoidable chunk of Main-level marks is lost this way every year.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="mistake-item"><div className="mistake-num">3</div><p>Repeatedly practicing favorite topics while avoiding weak chapters — the error log exists specifically to make this bias visible.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="mistake-item"><div className="mistake-num">4</div><p>Switching primary study material repeatedly in the final months, fragmenting revision and wasting time re-adapting to new formats.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="mistake-item"><div className="mistake-num">5</div><p>Treating rest and sleep as wasted time — burnout in the final 60 days is one of the most cited reasons for underperforming your own mock average.</p></StrategyReveal>
          <StrategyReveal delay={0.6} className="mistake-item"><div className="mistake-num">6</div><p>Leaving Advanced-specific formats (multiple-correct, matrix-match) until very late — these need dedicated, distinct practice from single-correct MCQs.</p></StrategyReveal>
        </div>
      </section>

      <section id="timeline">
        <StrategyReveal>
          <span className="section-kicker">Part 08</span>
          <h2 className="section-title">A realistic month-by-month timeline</h2>
        </StrategyReveal>
        <div className="timeline">
          <AnimatedHeight height="100%" className="tl-progress" />
          <StrategyReveal delay={0.1} className="tl-item"><div className="tl-dot"></div><h4>8–6 months out</h4><p>Complete the first full pass of the syllabus chapter by chapter; start chapter-wise tests immediately after each chapter rather than waiting for the whole syllabus.</p></StrategyReveal>
          <StrategyReveal delay={0.2} className="tl-item"><div className="tl-dot"></div><h4>6–4 months out</h4><p>Begin 2–3 subject mixed tests; start and rigorously maintain the error log from this point onward.</p></StrategyReveal>
          <StrategyReveal delay={0.3} className="tl-item"><div className="tl-dot"></div><h4>4–2 months out</h4><p>Weekly full-length 3-hour Main-pattern mocks; if targeting Advanced, shift a portion of Physics/Math practice to Advanced-level previous year papers.</p></StrategyReveal>
          <StrategyReveal delay={0.4} className="tl-item"><div className="tl-dot"></div><h4>2–1 months out</h4><p>Full mocks twice weekly; condensed-notes revision begins in earnest; target your 3–5 weakest chapters using error-log data.</p></StrategyReveal>
          <StrategyReveal delay={0.5} className="tl-item"><div className="tl-dot"></div><h4>Final month</h4><p>No new topics, under any circumstance. Pure revision, timed mocks, sleep discipline, tapering mock frequency in the final week to avoid exhaustion.</p></StrategyReveal>
          <StrategyReveal delay={0.6} className="tl-item"><div className="tl-dot"></div><h4>Final week</h4><p>Light revision only — short notes, formula sheets, previously-wrong questions. No new full mock in the last 2 days; protect rest and mental steadiness.</p></StrategyReveal>
        </div>
      </section>

      <section id="closing">
        <StrategyReveal className="closing">
          <p className="quote">"Rank is very often a function of consistency compounded over 12–18 months — a narrow, well-mastered set of resources, honest self-correction through an error log, and protected sleep — more than any single hack discovered in the last month."</p>
          <div className="sig">— Closing note</div>
        </StrategyReveal>
      </section>

      <footer>JEE STRATEGY DEEP DIVE · BUILT FOR CONSISTENT, HONEST PREP</footer>

      <div className={`to-top ${showToTop ? 'show' : ''}`} onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
      </div>
    </div>
  );
}
