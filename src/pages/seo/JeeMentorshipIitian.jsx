import React from "react";
import { SEO_KEYWORD_MAP } from "../../data/seoKeywordMap.js";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterCta,
  ClusterFaq,
  ClusterRelated,
  getOrganizationSchema,
  getArticleSchema
} from "./ClusterShared.jsx";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Star,
  Users,
  Compass,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipIitian() {
  const currentPath = "/jee-mentorship/iitian-mentor";

  const faqs = [
    {
      q: "Why is an IITian mentor better than an older coaching teacher?",
      a: "Senior coaching faculty often cleared their exams decades ago when the paper was offline, subjective, and had a vastly different competition landscape. IITian mentors who cleared JEE in the last 1-3 years know the exact realities of NTA Computer Based Tests (CBT), current multi-shift normalisation trends, and modern high-yield PYQ patterns."
    },
    {
      q: "How are CampusPoint mentors verified?",
      a: "Every mentor on CampusPoint is verified with their official IIT student ID card and JEE Advanced scorecard. Over 80% of our mentors are from IIT Roorkee, IIT Delhi, and IIT Bombay with proven All India Ranks in the top 1% of candidates."
    },
    {
      q: "Do the mentors also help with mental stress and burnout?",
      a: "Yes. Having experienced the exact same intense pressure, late-night doubts, and mock test score drops, your IITian mentor provides authentic empathy and actionable mental reframing that older teachers or parents simply cannot provide."
    },
    {
      q: "Can I get guidance on college choice and branch selection from my mentor?",
      a: "Absolutely! After JEE Advanced results are announced, your mentor helps you navigate JoSAA and CSAB counselling, comparing branch vs college choices using CampusPoint's real placement and cutoff insights."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      "name": "JEE Mentorship by IITians",
      "description": "Authentic 1-on-1 JEE mentorship by top rankers and students from IIT Roorkee, IIT Delhi, and premier IITs.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "CampusPoint",
        "url": "https://campuspoint.in"
      },
      "offers": {
        "@type": "Offer",
        "price": "3499",
        "priceCurrency": "INR",
        "url": "https://campuspoint.in/mentorship/jee-2027"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }
  ];

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/iitian-mentor"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="JEE Mentorship by IITians | IIT Roorkee & Top IIT Rankers"
        description="Learn directly from verified IITians. 1-to-1 JEE mentorship by top rankers from IIT Roorkee and premier IITs. Authentic preparation strategies, daily tracking, and exam hacks."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "IITian Mentors", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterNav currentPath={currentPath} />

      <ClusterHero
        badge="AUTHENTIC IIT ROORKEE & TOP IITIAN GUIDANCE"
        title={
          <>
            Genuine <span className="brand-accent">JEE Mentorship by IITians</span> & Top Rankers
          </>
        }
        description="Stop taking advice from people who never cleared the modern JEE. Get guided 1-on-1 by verified IITians from IIT Roorkee and top institutes who conquered the same exam you are preparing for."
        stats={[
          { value: "100%", label: "Verified IIT Credentials", color: "brand" },
          { value: "Top 1%", label: "All India Rankers", color: "emerald" },
          { value: "IIT Roorkee", label: "Core Mentor Network", color: "violet" },
          { value: "₹3,499", label: "Till JEE Mains 2027", color: "brand" }
        ]}
        ctaText="Connect with an IITian Mentor · ₹3,499"
        ctaLink="/mentorship/jee-2027"
        secondaryText="View Mentor Profiles"
        secondaryLink="#mentors"
      />

      <main className="scp-container" id="details">
        {/* Why Learn from an IITian */}
        <section className="scp-section" id="mentors">
          <div className="scp-section-header">
            <span className="scp-kicker">Authentic Experience Matters</span>
            <h2 className="scp-h2">Why Learning from an IITian Changes Everything</h2>
            <p className="scp-section-sub">
              Cracking JEE Advanced is 50% knowledge and 50% psychological execution. An IITian mentor has walked the exact path and understands the nuance between theoretical advice and what actually works inside the exam hall.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <GraduationCap size={22} />
              </div>
              <h3 className="scp-card-h3">Modern CBT Insights</h3>
              <p className="scp-card-p">
                Our mentors navigated the recent NTA test patterns, shift normalisation, and JEE Advanced multi-format questions. They share contemporary hacks that older faculty overlook.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Virtual calculator & CBT interface tactics</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Effective rough sheet layout strategies</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <ShieldCheck size={22} />
              </div>
              <h3 className="scp-card-h3">Zero Fluff, Real Strategy</h3>
              <p className="scp-card-p">
                No unrealistic promises of "study 18 hours every day." IITians teach you how to study with high efficiency for 8-10 focused hours, prioritizing high-weightage chapters and active problem solving.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> High-yield 80/20 rule application</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Realistic revision schedules that stick</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Star size={22} />
              </div>
              <h3 className="scp-card-h3">Relatable Role Model</h3>
              <p className="scp-card-p">
                A mentor who is just 2-3 years older than you speaks your language. You can openly discuss test anxiety, family pressure, or lack of motivation without fear of judgment.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Empathetic stress & burnout support</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Inspiring insider stories of campus life at IIT</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Featured Mentor Cohort */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">IIT Roorkee Leadership</span>
            <h2 className="scp-h2">Meet the Mentors Behind CampusPoint</h2>
            <p className="scp-section-sub">
              Built by IIT Roorkee students and alumni who understand how to take serious aspirants from average mock scores to dream ranks:
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card" style={{ borderTop: "4px solid var(--scp-brand)" }}>
              <h3 className="scp-card-h3">Aman · IIT Delhi</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--scp-brand)", fontWeight: 700, margin: "0 0 10px" }}>
                JEE Advanced AIR 642 · Maths Specialist
              </p>
              <p className="scp-card-p">
                Specializes in transforming students who fear Mathematics by breaking down calculus, vectors, and coordinate geometry into intuitive geometric shortcuts.
              </p>
              <span style={{ fontSize: "0.8rem", color: "var(--scp-faint)", fontWeight: 600 }}>Mentored 120+ Aspirants</span>
            </div>

            <div className="scp-card" style={{ borderTop: "4px solid var(--scp-emerald)" }}>
              <h3 className="scp-card-h3">Saneh · IIT Roorkee</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--scp-emerald)", fontWeight: 700, margin: "0 0 10px" }}>
                JEE Advanced Top Ranker · Physics Coach
              </p>
              <p className="scp-card-p">
                Master of Rotational Motion, Electrodynamics, and multi-concept problem solving. Passionate about eliminating silly mistakes in JEE tests.
              </p>
              <span style={{ fontSize: "0.8rem", color: "var(--scp-faint)", fontWeight: 600 }}>Mentored 150+ Aspirants</span>
            </div>

            <div className="scp-card" style={{ borderTop: "4px solid var(--scp-violet)" }}>
              <h3 className="scp-card-h3">Saket · IIT Roorkee</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--scp-violet)", fontWeight: 700, margin: "0 0 10px" }}>
                JEE Main 99.8%ile · Strategy Lead
              </p>
              <p className="scp-card-p">
                Expert in speed-accuracy optimization, Chemistry NCERT retention frameworks, and 8-month intensive dropper recovery blueprints.
              </p>
              <span style={{ fontSize: "0.8rem", color: "var(--scp-faint)", fontWeight: 600 }}>Mentored 180+ Aspirants</span>
            </div>
          </div>
        </section>

        <ClusterCta
          title="Start Your Journey with an IITian Mentor Today"
          subtitle="Get paired 1-on-1 with an IIT Roorkee ranker who will design your personal daily schedule, monitor your progress, and guide your strategy till JEE Mains 2027."
          primaryText="Enroll with IITian Mentor · ₹3,499"
          primaryLink="/mentorship/jee-2027"
        />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions About IITian Mentors</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Explore Other Mentorship Tracks</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/1-to-1",
              "/jee-mentorship/jee-advanced",
              "/jee-preparation/strategy"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

