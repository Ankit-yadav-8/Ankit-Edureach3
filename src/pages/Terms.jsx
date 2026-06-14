import { FileText } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Reveal from "../components/Reveal.jsx";

const UPDATED = "14 June 2026";

const SECTIONS = [
  {
    h: "1. Acceptance of terms",
    p: [
      "These Terms of Use govern your access to and use of collegeparichay.in (the “Platform”) operated by College Parichay. By using the Platform you agree to these Terms. If you do not agree, please do not use the Platform.",
    ],
  },
  {
    h: "2. What we provide",
    p: [
      "College Parichay offers informational tools — including rank prediction, college discovery, cutoff trends and counselling guidance — to help students make admission decisions. All outputs are indicative estimates intended for guidance only.",
    ],
  },
  {
    h: "3. No guarantee of accuracy",
    list: [
      "Predictions, cutoffs, fees, placements and dates are modelled on historical and publicly available data and may differ from official figures.",
      "We do not guarantee admission to any college or any specific rank, score or outcome.",
      "Always verify critical information with official sources (e.g. NTA, JoSAA, CSAB and individual institutes) before acting.",
    ],
  },
  {
    h: "4. Acceptable use",
    list: [
      "Use the Platform only for lawful, personal, non-commercial purposes.",
      "Do not scrape, copy, resell or redistribute our content or data without permission.",
      "Do not attempt to disrupt, reverse-engineer or gain unauthorised access to the Platform.",
    ],
  },
  {
    h: "5. Accounts",
    p: [
      "You are responsible for the accuracy of the information you provide and for maintaining the confidentiality of your account. You must notify us of any unauthorised use of your account.",
    ],
  },
  {
    h: "6. Payments & mentorship",
    p: [
      "Paid plans and mentorship programmes, where offered, are described at the point of purchase. Fees, inclusions and any refund terms shown at checkout apply to that purchase.",
    ],
  },
  {
    h: "7. Intellectual property",
    p: [
      "All content, design, branding and software on the Platform are owned by College Parichay or its licensors and are protected by applicable laws. You may not use them without prior written consent.",
    ],
  },
  {
    h: "8. Limitation of liability",
    p: [
      "To the maximum extent permitted by law, College Parichay is not liable for any indirect, incidental or consequential damages arising from your use of, or reliance on, the Platform or its estimates.",
    ],
  },
  {
    h: "9. Changes to these terms",
    p: [
      "We may update these Terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms.",
    ],
  },
  {
    h: "10. Contact",
    p: [
      "Questions about these Terms? Email us at aycollegeparichay@gmail.com.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="page">
      <Seo
        title="Terms of Use — College Parichay"
        description="The terms governing your use of College Parichay's rank predictor, college discovery and counselling tools, including accuracy disclaimers and acceptable use."
        path="/terms"
      />
      <section className="warm-page-header" style={{ padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 20%, rgba(249,115,22,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow"><FileText size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} /> Legal</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px", color: "#1c1c28" }}>Terms of Use</h1>
          <p style={{ color: "rgba(28,28,40,.62)" }}>Last updated: {UPDATED}</p>
        </div>
      </section>

      <div className="container section" style={{ maxWidth: 860 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {SECTIONS.map((s, i) => (
            <Reveal key={s.h} delay={(i % 4) * 0.05}>
              <div className="card" style={{ padding: "22px 24px" }}>
                <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 700, fontSize: "1.12rem", color: "var(--navy)", marginBottom: 12 }}>{s.h}</h2>
                {s.p && s.p.map((para, j) => (
                  <p key={j} style={{ color: "#4b5563", fontSize: 14.5, lineHeight: 1.75, marginBottom: 10 }}>{para}</p>
                ))}
                {s.list && (
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                    {s.list.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, fontSize: 14.5, color: "#374151", lineHeight: 1.6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--coral)", marginTop: 8, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
