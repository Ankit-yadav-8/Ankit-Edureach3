import { ShieldCheck } from "lucide-react";
import Seo from "../components/Seo.jsx";
import Reveal from "../components/Reveal.jsx";

const UPDATED = "14 June 2026";

const SECTIONS = [
  {
    h: "1. Introduction",
    p: [
      "College Parichay (“we”, “us”, “our”) operates the website collegeparichay.in (the “Platform”), which provides rank prediction, college discovery, cutoff insights and counselling guidance for engineering and medical aspirants in India.",
      "This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using the Platform you agree to the practices described here.",
    ],
  },
  {
    h: "2. Information we collect",
    list: [
      "Account details you provide — name, email, phone number, home state, exam ranks and coaching, when you sign up or enrol.",
      "Inputs you enter into tools — expected marks, rank, category and preferences used by the rank and college predictors.",
      "Usage data — pages visited, features used, device and browser type, collected to improve the Platform.",
      "Communications — messages you send us via WhatsApp, email or contact forms.",
    ],
  },
  {
    h: "3. How we use your information",
    list: [
      "To generate your rank/college predictions and personalised college shortlists.",
      "To provide counselling guidance and respond to your queries.",
      "To operate, maintain, secure and improve the Platform.",
      "To send important service updates (you can opt out of non-essential messages at any time).",
    ],
  },
  {
    h: "4. Data sharing",
    p: [
      "We do not sell your personal data. We share information only with service providers who help us run the Platform (for example, hosting, analytics and payment processing) under appropriate confidentiality obligations, or where required by law.",
    ],
  },
  {
    h: "5. Data security & retention",
    p: [
      "We use reasonable technical and organisational measures to protect your data. No method of transmission over the internet is fully secure, so we cannot guarantee absolute security.",
      "We retain personal data only for as long as needed to provide our services or as required by law.",
    ],
  },
  {
    h: "6. Your rights",
    p: [
      "You can request access to, correction of, or deletion of your personal data by contacting us. You may also withdraw consent for non-essential communications at any time.",
    ],
  },
  {
    h: "7. Estimates & third-party links",
    p: [
      "Predictions, cutoffs and dates shown on the Platform are indicative estimates modelled on historical data and may not match official figures. Always verify with official sources. The Platform may link to third-party websites whose privacy practices we do not control.",
    ],
  },
  {
    h: "8. Contact",
    p: [
      "For any privacy questions or requests, email us at aycollegeparichay@gmail.com.",
    ],
  },
];

export default function Privacy() {
  return (
    <div className="page">
      <Seo
        title="Privacy Policy — College Parichay"
        description="How College Parichay collects, uses and protects your personal information when you use our rank predictor, college discovery and counselling tools."
        path="/privacy"
      />
      <section className="warm-page-header" style={{ padding: "48px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 55% 65% at 100% 20%, rgba(249,115,22,.18) 0%, transparent 60%)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <span className="eyebrow"><ShieldCheck size={13} style={{ marginRight: 5, verticalAlign: "-2px" }} /> Legal</span>
          <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", margin: "8px 0 4px", color: "#1c1c28" }}>Privacy Policy</h1>
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
