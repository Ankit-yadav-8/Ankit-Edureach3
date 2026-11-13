import React from "react";
import { SEO_KEYWORD_MAP } from "../../data/seoKeywordMap.js";
import { Link } from "react-router-dom";
import Seo from "../../components/Seo.jsx";
import {
  ClusterNav,
  ClusterHero,
  ClusterPricing,
  ClusterFounders,
  ClusterCta,
  ClusterFaq,
  ClusterRelated,
  getOrganizationSchema,
  getArticleSchema
} from "./ClusterShared.jsx";
import {
  UserCheck,
  CheckCircle2,
  Video,
  MessageCircle,
  Calendar,
  Lock,
  Zap,
  ArrowRight
} from "lucide-react";

export default function JeeMentorshipOneToOne() {
  const currentPath = "/jee-mentorship/1-to-1";

  const faqs = [
    {
      q: "What does 1-to-1 JEE mentorship actually include?",
      a: "Unlike group coaching, 1-to-1 mentorship pairs you with a single dedicated IITian mentor who focuses exclusively on your academic journey. It includes weekly private 1-on-1 strategy video calls, direct 24/7 WhatsApp connectivity with your mentor, customized daily study schedules based on your exact strengths, and private mock test error autopsies."
    },
    {
      q: "How does 1-on-1 mentorship compare to hiring a private home tutor?",
      a: "A private tutor usually charges ₹1,000 to ₹2,500 per hour just to teach subject theory. In contrast, an IITian mentor provides comprehensive strategic architecture: tracking daily problem-solving velocity, eliminating test anxiety, planning backlogs, and teaching topper question-selection techniques—for just ₹3,499 for the entire program."
    },
    {
      q: "Can I choose my mentor's IIT or subject background?",
      a: "Yes! During onboarding, we assess your primary exam goal (JEE Main or JEE Advanced), your biggest pain-point subject, and your target stream, and pair you with an IIT Roorkee or top IIT ranker best suited to mentor you."
    },
    {
      q: "What happens during the weekly 1-on-1 video call?",
      a: "Your mentor reviews your past 7 days of study logs, examines your latest mock test mistake report, adjusts your daily timetable for the upcoming week, unblocks doubts, and sets clear, non-negotiable milestones."
    }
  ];

  const jsonLd = [
    getOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      "name": "1-on-1 JEE Mentorship Program",
      "description": "Private, individual 1-to-1 personal mentorship by top IIT rankers featuring weekly video calls, daily WhatsApp access, and custom study plans.",
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

  const keywords = SEO_KEYWORD_MAP["/jee-mentorship/1-to-1"].targetKeywords;

  return (
    <div className="seo-cluster-page">
      <Seo
        title="1-on-1 JEE Mentorship | Personal JEE Mentor & Daily Guidance"
        description="Experience genuine 1-on-1 JEE mentorship by top IITians. Private weekly video calls, customized daily study plans, 24/7 WhatsApp guidance, and individual error reviews."
        path={currentPath}
        keywords={keywords}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "JEE Mentorship", path: "/jee-mentorship" },
          { name: "1-on-1 Mentorship", path: currentPath }
        ]}
        jsonLd={jsonLd}
      />

      <ClusterHero
        badge="⚡ TRUE INDIVIDUAL 1-TO-1 ATTENTION"
        titlePrefix="Private"
        accentWord="1-on-1 JEE Mentorship"
        titleSuffix="by Verified IITians"
        description="No 200-student batches. No generic motivational speeches. Just you and your personal IITian mentor working together daily to engineer your rank in JEE Main and Advanced."
        planKey="mentor-jee-2027-6m"
      />

      <ClusterNav currentPath={currentPath} />

      <main className="scp-container" id="details">
        {/* Why 1-to-1 Beats Batch Coaching */}
        <section className="scp-section" id="why-one-on-one">
          <div className="scp-section-header">
            <span className="scp-kicker">Individualized Acceleration</span>
            <h2 className="scp-h2">Why 1-to-1 Guidance Wins</h2>
            <p className="scp-section-sub">
              Every student has unique strengths and weaknesses. A student who struggles with Rotational Dynamics but excels in Calculus should not follow the same cookie-cutter schedule as everyone else in their coaching center.
            </p>
          </div>

          <div className="scp-grid-3">
            <div className="scp-card">
              <div className="scp-card-icon brand">
                <Video size={22} />
              </div>
              <h3 className="scp-card-h3">Weekly Private Video Audits</h3>
              <p className="scp-card-p">
                Dedicated 1-on-1 screen-share sessions where your mentor inspects your rough sheets, dissects test errors, and sets next week's micro-milestones.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Complete privacy to ask hesitation-free questions</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Direct strategic feedback from an IITian</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon emerald">
                <MessageCircle size={22} />
              </div>
              <h3 className="scp-card-h3">Continuous WhatsApp Access</h3>
              <p className="scp-card-p">
                Whenever you get stuck on a study plan conflict, feel anxious about an upcoming test, or need question advice, your mentor is a single WhatsApp message away.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Real-time unblocking within hours</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Daily accountability check-in at 10:30 PM</li>
              </ul>
            </div>

            <div className="scp-card">
              <div className="scp-card-icon violet">
                <Calendar size={22} />
              </div>
              <h3 className="scp-card-h3">Adaptive Velocity Pacing</h3>
              <p className="scp-card-p">
                If you master Modern Physics in 3 days instead of 6, your mentor advances your schedule. If Organic Chemistry requires extra care, we allocate remedial time immediately.
              </p>
              <ul className="scp-card-list">
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Never lag behind or rush ahead blindly</li>
                <li className="scp-card-list-item"><CheckCircle2 size={16} /> Aligned with your school and coaching exams</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 1-on-1 Mentorship Roadmap */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">The Workflow</span>
            <h2 className="scp-h2">Weekly 1-on-1 Mentorship Routine</h2>
            <p className="scp-section-sub">
              A structured routine that guarantees constant forward momentum throughout your JEE preparation:
            </p>
          </div>

          <div className="scp-table-wrapper">
            <table className="scp-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Core Interaction</th>
                  <th>Student Action Item</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Sunday</strong></td>
                  <td>Weekly 1-on-1 Strategy Video Call</td>
                  <td>Review past week hours, analyze mock test report, finalize 7-day targets.</td>
                </tr>
                <tr>
                  <td><strong>Monday – Thursday</strong></td>
                  <td>Daily Target Execution</td>
                  <td>Complete daily question quota (60-80 Qs); log study hours in student console.</td>
                </tr>
                <tr>
                  <td><strong>Friday</strong></td>
                  <td>Backlog Clearance & Formula Check</td>
                  <td>Address pending topics; WhatsApp check-in with mentor on progress.</td>
                </tr>
                <tr>
                  <td><strong>Saturday</strong></td>
                  <td>Proctored Mock Test & Self-Analysis</td>
                  <td>3-hour CBT simulation test; upload question-level error breakdown.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <ClusterPricing
          planKey="mentor-jee-2027-6m"
          exam="1-on-1 Personal JEE Mentorship"
          sublabel="Till JEE Mains 2027"
        />

        <ClusterFounders />

        {/* FAQs */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">FAQ</span>
            <h2 className="scp-h2">Frequently Asked Questions on 1-to-1 Mentorship</h2>
          </div>
          <ClusterFaq items={faqs} />
        </section>

        {/* Related Topics */}
        <section className="scp-section">
          <div className="scp-section-header">
            <span className="scp-kicker">Related Clusters</span>
            <h2 className="scp-h2">Explore Related Mentorship Tracks</h2>
          </div>
          <ClusterRelated
            currentPath={currentPath}
            selectedPaths={[
              "/jee-mentorship",
              "/jee-mentorship/iitian-mentor",
              "/jee-mentorship/test-analysis",
              "/jee-preparation/study-plan"
            ]}
          />
        </section>
      </main>
    </div>
  );
}

