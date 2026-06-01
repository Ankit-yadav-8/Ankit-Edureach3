import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, Star, ShieldCheck, Phone, MessageCircle, Clock, FileText, Target,
  TrendingUp, Users, ChevronDown, Sparkles, Award, ArrowRight, BadgeCheck,
  Search, HelpCircle, ListChecks, Layers, Wallet, BookMarked,
} from "lucide-react";
import Reveal from "../components/Reveal.jsx";

/* 👉 Replace with your real payment link (Razorpay/PhonePe) and WhatsApp number. */
const PAY_LINK = "https://forms.gle/bgtSMjr1QXJytXHDA"; // Google Form — enrolment
const WA = "https://wa.me/917877596464?text=" + encodeURIComponent("Hi! I want to enrol in the JoSAA 2026 ₹249 counselling plan.");

const INCLUDES = [
  { icon: Target, t: "Personalised choice list", d: "A ranked, college-by-college JoSAA choice-filling sheet built around your rank, category & preferences." },
  { icon: Phone, t: "1-on-1 expert call", d: "A 45-min video call with a mentor who has cleared JEE & been through counselling." },
  { icon: TrendingUp, t: "Predicted allotment", d: "Round-wise probability of what you'll likely be allotted — Safe / Moderate / Reach." },
  { icon: FileText, t: "Document checklist", d: "Everything you need ready before reporting, so you never miss a deadline." },
  { icon: MessageCircle, t: "WhatsApp support", d: "Direct line to your mentor through all rounds of JoSAA + CSAB." },
  { icon: ShieldCheck, t: "Mistake-proofing", d: "We review your filled choices and flag risky ordering before you lock." },
];

const STEPS = [
  { n: "1", t: "Enrol for ₹249", d: "Secure your slot — limited mentors per cycle." },
  { n: "2", t: "Share your scorecard", d: "Rank, category, home state & branch preferences." },
  { n: "3", t: "Get your plan + call", d: "Personalised choice list and a 1:1 mentor call." },
  { n: "4", t: "Fill with confidence", d: "We support you through every JoSAA & CSAB round." },
];

/* ── Large, categorised FAQ knowledge base for JEE / JoSAA 2026 counselling ── */
const FAQ_GROUPS = [
  {
    id: "basics",
    label: "Counselling basics",
    icon: HelpCircle,
    items: [
      ["What is JoSAA counselling?", "JoSAA (Joint Seat Allocation Authority) runs a single, combined counselling process that allots seats across all 23 IITs, 31 NITs, 26 IIITs and 40+ GFTIs based on your JEE Main and JEE Advanced ranks. You register once, fill an ordered list of college-and-branch choices, and a computer allots seats round by round strictly by your rank, category and choice order."],
      ["When will JoSAA 2026 counselling start?", "JoSAA registration usually opens within a few days of the JEE Advanced result — historically mid-June. Expect roughly 5–6 main rounds spread across June–July 2026, followed by CSAB special rounds. Exact dates are announced on josaa.nic.in; we alert enrolled students the moment the schedule drops so you never miss day one."],
      ["What is the difference between JoSAA and CSAB?", "JoSAA conducts the common counselling for all IITs, NITs, IIITs and GFTIs across its main rounds. After JoSAA ends, CSAB conducts special rounds to fill seats left vacant in NITs, IIITs and GFTIs — IITs do NOT take part in CSAB. We guide you through both so you never miss a late upgrade."],
      ["Who is eligible for JoSAA 2026 counselling?", "Anyone with a valid JEE Main rank can participate for NIT/IIIT/GFTI seats. To be eligible for IIT seats you must also qualify JEE Advanced. You also need to meet the Class XII eligibility criteria (subject and percentage/percentile norms) set for the year."],
      ["Is JoSAA registration free?", "Yes — registering and filling choices on the JoSAA portal is free. You only pay a Seat Acceptance Fee once a seat is allotted and you choose to accept it (₹35,000 for OPEN/OBC-NCL/EWS and ₹15,000 for SC/ST/PwD in recent years, adjusted later against admission fees)."],
    ],
  },
  {
    id: "choices",
    label: "Choice filling",
    icon: ListChecks,
    items: [
      ["How does choice filling work?", "After registering you build an ordered list of every college-and-branch combination you'd accept — from dream to safe. The software always tries to give you the highest choice in your list your rank can reach, so the ORDER is a strategy, not a wishlist."],
      ["How many choices should I fill?", "There is effectively no upper limit — many students fill 50–200+ choices. More well-ordered choices means more chances to be allotted something good and more room to upgrade in later rounds. Filling too few is one of the most common, costly mistakes."],
      ["Why does choice order matter so much?", "Because allotment is done strictly top-down by your list. Place an unrealistic 'dream' choice above a reachable one and you can be locked into a seat you didn't want, or miss a better branch sitting lower. Getting the order right is exactly what our plan does for you."],
      ["Should I fill only dream colleges?", "No. A safe list mixes reach, moderate and safe options. Filling only top colleges risks 'no allotment' entirely. We build a balanced, rank-backed list so you always secure something good while staying in the running for an upgrade."],
      ["Can I edit or lock my choices?", "You can edit choices freely until the locking deadline; after that they're frozen for that round. If you don't lock manually, the system auto-locks your last saved list at the deadline. We review and flag risky ordering before you lock."],
      ["What are mock allotments?", "Before choices freeze, JoSAA publishes 1–2 mock rounds showing where you'd likely land with your current list. They're a free preview — we read these signals with you and fine-tune your ordering while there's still time to change it."],
    ],
  },
  {
    id: "rounds",
    label: "Rounds & seat actions",
    icon: Layers,
    items: [
      ["How many rounds are there in JoSAA 2026?", "JoSAA typically runs 5–6 main rounds, followed by CSAB special rounds. In each round you can Freeze, Float or Slide your allotted seat. The wrong action can lock you too early or risk a confirmed seat — we tell you exactly what to pick each round."],
      ["What is Freeze, Float and Slide?", "Freeze = accept the allotted seat and stop participating further. Float = keep the current seat but stay in the running for anything higher in your list. Slide = stay only for a better branch within the same institute. Choosing correctly each round is the single most important decision in counselling."],
      ["What happens if I don't report after an allotment?", "If you're allotted a seat and neither accept (pay the fee + report) nor it carries forward correctly, your seat can be cancelled and you may exit the process. Deadlines are strict and unforgiving — our checklist is tagged to every reporting cut-off."],
      ["What is the Seat Acceptance Fee and is it refundable?", "It's a one-time fee paid online to confirm acceptance of an allotted seat (recently ₹35,000 general / ₹15,000 reserved). It's adjusted against your admission fee at the institute. If you withdraw within the allowed window, a partial refund applies as per JoSAA's withdrawal rules."],
      ["Can I withdraw a seat I've accepted?", "Yes, JoSAA allows seat withdrawal up to a published round/deadline. Withdrawing exits you from further rounds, so it's a serious decision — usually only sensible if you've secured a seat elsewhere. We help you weigh it before you click."],
    ],
  },
  {
    id: "quota",
    label: "Seats, category & quota",
    icon: Users,
    items: [
      ["Do you help with home-state quota?", "Yes. NITs, IIITs and GFTIs reserve a large share of seats for home-state candidates (the 'HS' quota), with the rest under 'OS'/All-India. Your domicile dramatically changes which choices are realistic — we factor it into every list."],
      ["How do category seats (OBC-NCL / SC / ST / EWS) work?", "Seats are reserved per category with separate closing ranks, which are usually lower than OPEN. We use your exact category to map realistic targets and make sure you don't under- or over-shoot your list."],
      ["What are gender-neutral and female-only seats?", "Each institute has gender-neutral seats (open to all) plus a supernumerary pool of female-only seats to improve diversity. Female candidates are considered for both, which often unlocks better branches — we order choices to use this fully."],
      ["What is the difference between AI quota and HS quota in NITs?", "In NITs, ~50% of seats in each state's NIT go to Home State (HS) candidates and ~50% to Other State / All India (OS) candidates. Closing ranks for HS are usually far more favourable — knowing which quota you fall under is essential to a realistic list."],
      ["I have a low rank — is counselling still worth it?", "Absolutely. Lower ranks have MORE options across NITs, IIITs, GFTIs, home-state quotas and CSAB — which means more ways to go wrong, and more room to upgrade with a smart list. A well-ordered list often lands students a far better seat than they expected."],
    ],
  },
  {
    id: "csab",
    label: "CSAB & special rounds",
    icon: TrendingUp,
    items: [
      ["What are CSAB special rounds?", "After JoSAA closes, CSAB (Central Seat Allocation Board) opens additional rounds to fill NIT, IIIT and GFTI seats left vacant — often where the biggest last-minute upgrades happen. It needs a fresh registration and a new ordered choice list."],
      ["Should I join CSAB if I already have a JoSAA seat?", "Often yes — you can hold your JoSAA seat as a 'float' safety net while trying for an upgrade in CSAB. But the rules around carrying a seat into CSAB are nuanced; we walk you through exactly how to participate without losing what you already have."],
      ["Do IITs participate in CSAB?", "No. CSAB special rounds cover only NITs, IIITs and GFTIs. IIT seats are allotted solely through JoSAA's main rounds, so any IIT upgrade must happen within JoSAA itself."],
    ],
  },
  {
    id: "docs",
    label: "Documents & reporting",
    icon: FileText,
    items: [
      ["What documents will I need during counselling?", "Typically: JEE scorecard / rank card, Class X & XII marksheets and certificates, category & PwD certificates (if applicable), a domicile certificate for home-state quota, photo ID (Aadhaar), passport photos, and the seat-acceptance fee receipt. We send a complete, deadline-tagged checklist so nothing is missing at reporting."],
      ["What is online vs physical reporting?", "After accepting a seat you complete reporting — in recent years this is largely online (document upload + verification) with a Reporting Centre fallback. Each allotment has its own reporting window; miss it and the seat can be cancelled."],
      ["What if there's a discrepancy in my documents?", "Minor issues (name spelling, certificate format) can usually be resolved if caught early, but they can also delay or cancel a seat at verification. We pre-check your documents against requirements before reporting so surprises don't cost you the seat."],
      ["When should I keep my documents ready?", "Before counselling even begins. Verification windows are short and overlap with allotment deadlines, so scrambling for a domicile or category certificate mid-process is a classic way to lose a seat. Our checklist tells you what to arrange in advance."],
    ],
  },
  {
    id: "plan",
    label: "Our ₹249 plan",
    icon: Wallet,
    items: [
      ["Is ₹249 a one-time fee?", "Yes — one payment covers your full JoSAA + CSAB 2026 counselling support across all rounds. There are no per-round or hidden charges."],
      ["Who are the mentors?", "Students and alumni from IITs/NITs who have personally cleared JEE and been through counselling themselves — so the advice is lived, not theoretical."],
      ["What if my rank changes after a round?", "Your plan is revised each round at no extra cost — that's the whole point of ongoing support. Float/slide advice is updated to your latest position."],
      ["Do you guarantee a specific college?", "No one honestly can — the allotment is done by JoSAA's software. What we guarantee is a data-driven, mistake-proofed choice list that maximises your chances and never leaves an easy upgrade on the table."],
      ["How do I get started?", "Click Enrol, complete the ₹249 payment, and you'll get a WhatsApp message within hours to begin. Share your scorecard and preferences, and your mentor builds your plan."],
    ],
  },
];

/* Flattened list (with category) for search */
const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items.map(([q, a]) => ({ q, a, cat: g.id, catLabel: g.label })));

/* In-depth explainer cards for how counselling actually works */
const EXPLAINER = [
  ["What is JoSAA counselling?", "JoSAA (Joint Seat Allocation Authority) runs a single, combined counselling process that allocates seats in all IITs, NITs, IIITs and GFTIs based on your JEE Main and JEE Advanced ranks. You register once, fill an ordered list of college-and-branch choices, and a computer allots seats round by round strictly according to your rank, category and the order of your choices."],
  ["Why choice order decides everything", "The software always tries to give you the highest choice in your list that your rank can reach. That means if you place a 'dream' college above a realistic one, you can be locked into a seat you didn't actually want — or miss a better branch sitting lower in your list. The order is not a wishlist; it is a strategy. Getting it right is exactly what our plan does for you."],
  ["JoSAA vs CSAB — the full picture", "JoSAA handles the main rounds for all institute types. Once JoSAA closes, CSAB conducts special rounds to fill remaining NIT, IIIT and GFTI seats — often where the biggest last-minute upgrades happen. Many students stop after JoSAA and never realise they could have moved up in CSAB. We track both for you, end to end."],
];

/* Counselling timeline / round-by-round roadmap */
const TIMELINE = [
  ["Registration & choice filling", "Create your JoSAA account, then lock in a carefully ordered list of every college-branch combination you'd accept — from dream to safe. This is the most decisive step of the entire process."],
  ["Mock allotments", "Before choices are frozen, JoSAA publishes 1–2 mock rounds showing where you'd land with your current list. We read these signals with you and fine-tune your ordering while there's still time."],
  ["Round-wise seat allotment", "Across 5–6 rounds, seats are allotted by rank. After each round you decide Freeze, Float or Slide, pay the seat-acceptance fee, and complete online reporting to hold your seat."],
  ["CSAB special rounds", "After JoSAA, CSAB opens additional rounds for vacant NIT/IIIT/GFTI seats. We help you decide whether to participate and how to order fresh choices for a final upgrade."],
  ["Document verification & reporting", "Physical or online verification of your documents and final admission at the allotted institute. We give you a deadline-tagged checklist so nothing trips you up at the finish line."],
];

/* Who this plan is built for */
const AUDIENCE = [
  ["JEE Main qualifiers", "Targeting NITs, IIITs and GFTIs and want a choice list ordered around your exact rank, category and home state."],
  ["JEE Advanced qualifiers", "Aiming for IITs and need help balancing branch vs institute and reading IIT closing-rank trends across rounds."],
  ["Borderline & dropper ranks", "Where smart float/slide decisions and CSAB rounds make the biggest difference between an average and a great seat."],
  ["Confused first-timers", "Anyone who finds the JoSAA portal, rounds and reporting deadlines overwhelming and wants a mentor in their corner."],
];

/* Highlight matched search term inside a string */
function highlight(text, term) {
  if (!term) return text;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i === -1) return text;
  return (<>
    {text.slice(0, i)}
    <mark style={{ background: "rgba(244,123,32,.22)", color: "#c2410c", borderRadius: 3, padding: "0 2px" }}>{text.slice(i, i + term.length)}</mark>
    {text.slice(i + term.length)}
  </>);
}

function Faq({ q, a, term, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="faq-card"
      onClick={() => setOpen((o) => !o)}
      style={{ borderColor: open ? "rgba(244,123,32,.45)" : "rgba(0,0,0,.08)" }}
    >
      <div className="faq-card__head">
        <span className="faq-card__q">{highlight(q, term)}</span>
        <span className="faq-card__chev" style={{ transform: open ? "rotate(180deg)" : "none" }}>
          <ChevronDown size={18} />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <p className="faq-card__a">{highlight(a, term)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Full categorised + searchable FAQ block */
function FaqSection() {
  const [active, setActive] = useState("all");
  const [query, setQuery]   = useState("");
  const term = query.trim();

  const results = useMemo(() => {
    let list = active === "all" ? ALL_FAQS : ALL_FAQS.filter((f) => f.cat === active);
    if (term) {
      const t = term.toLowerCase();
      list = list.filter((f) => f.q.toLowerCase().includes(t) || f.a.toLowerCase().includes(t));
    }
    return list;
  }, [active, term]);

  const tabs = [{ id: "all", label: "All", icon: BookMarked, count: ALL_FAQS.length },
    ...FAQ_GROUPS.map((g) => ({ id: g.id, label: g.label, icon: g.icon, count: g.items.length }))];

  return (
    <>
      {/* search */}
      <div className="faq-search">
        <Search size={18} className="faq-search__icon" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search counselling questions…"
          aria-label="Search FAQs"
        />
        {query && (
          <button className="faq-search__clear" onClick={() => setQuery("")} aria-label="Clear search">×</button>
        )}
      </div>

      {/* category chips */}
      <div className="faq-chips">
        {tabs.map(({ id, label, icon: I, count }) => (
          <button
            key={id}
            className={"faq-chip" + (active === id ? " is-active" : "")}
            onClick={() => setActive(id)}
          >
            <I size={14} /> {label}
            <span className="faq-chip__count">{count}</span>
          </button>
        ))}
      </div>

      {/* results */}
      {results.length > 0 ? (
        <div className="faq-list">
          {results.map((f, i) => (
            <Faq key={f.q} q={f.q} a={f.a} term={term} defaultOpen={!!term && i === 0} />
          ))}
        </div>
      ) : (
        <div className="faq-empty">
          <HelpCircle size={30} color="var(--coral)" />
          <p>No questions match "<strong>{term}</strong>".</p>
          <a href={WA} target="_blank" rel="noreferrer" className="btn btn-coral" style={{ fontSize: 14 }}>
            <MessageCircle size={16} /> Ask us on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}

export default function Josaa2026() {
  return (
    <div className="page">
      {/* HERO */}
      <section className="warm-page-header" style={{ padding: "110px 0 70px" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 70% at 100% 20%, rgba(249,115,22,.22) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 50% at 0% 80%, rgba(244,162,97,.20) 0%, transparent 60%)" }} />
        <div className="container josaa-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 40, alignItems: "center", position: "relative", zIndex: 1 }}>
          <div>
            <span className="pill" style={{ background: "rgba(244,123,32,.12)", color: "#c75b0a", border: "1px solid rgba(244,123,32,.38)" }}>
              <Sparkles size={13} /> JoSAA + CSAB 2026 Counselling
            </span>
            <h1 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "clamp(2rem,4.5vw,3.1rem)", lineHeight: 1.12, margin: "16px 0 14px", color: "#1c1c28" }}>
              Don't lose your dream college to a <span style={{ color: "#F47B20" }}>wrong choice list</span>.
            </h1>
            <p style={{ color: "rgba(28,28,40,.65)", fontSize: "1.1rem", maxWidth: 540, lineHeight: 1.6 }}>
              Get a personalised, data-backed JoSAA choice-filling plan and 1-on-1 mentorship from people who've done it — for just ₹249.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-coral" style={{ fontSize: 16, padding: "14px 26px" }}>Enrol now — ₹249 <ArrowRight size={18} /></a>
              <a href={WA} target="_blank" rel="noreferrer" className="btn btn-ghost" style={{ fontSize: 15, padding: "14px 22px" }}><MessageCircle size={17} /> Talk on WhatsApp</a>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap", fontSize: 13.5, color: "rgba(28,28,40,.65)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><BadgeCheck size={15} color="#F47B20" /> Built by IITians</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Users size={15} color="#F47B20" /> 2,000+ students guided</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Star size={15} color="#F47B20" fill="#F47B20" /> 4.8/5 rating</span>
            </div>
          </div>

          {/* Price card */}
          <Reveal>
            <div className="josaa-price-card">
              {/* animated colour aura behind the card */}
              <span className="josaa-price-aura" aria-hidden="true" />
              {/* corner discount ribbon */}
              <span className="josaa-ribbon">87% OFF</span>

              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center" }}>
                  <span className="badge orange" style={{ animation: "borderFlash 2.2s ease-in-out infinite" }}>🔥 Limited slots this cycle</span>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 10, marginTop: 16 }}>
                    <span style={{ fontSize: 20, color: "var(--muted)", textDecoration: "line-through" }}>₹1,999</span>
                    <span className="josaa-price-amt">₹249</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, marginBottom: 18 }}>one-time · all rounds covered</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {["Personalised choice list", "1-on-1 mentor call (45 min)", "Round-wise allotment prediction", "WhatsApp support till seat locked", "Document & deadline checklist"].map((x, i) => (
                    <span key={x} className="josaa-feat" style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 14.5, animationDelay: `${0.15 + i * 0.08}s` }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(34,197,94,.14)", display: "grid", placeItems: "center", flexShrink: 0 }}><Check size={14} color="var(--green)" /></span>
                      {x}
                    </span>
                  ))}
                </div>
                <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-coral josaa-cta" style={{ width: "100%", justifyContent: "center", marginTop: 20, fontSize: 16, padding: "13px" }}>Enrol now — ₹249 <ArrowRight size={18} /></a>
                <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ShieldCheck size={13} /> Secure payment · mentor assigned within hours</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Why it matters</span><h2 className="section-title">One wrong choice order can cost you a <span className="accent">whole branch</span></h2></div>
          <div className="grid-3">
            {[
              ["Filling choices randomly", "Most students order colleges by 'name', not by realistic cutoffs — and lose a better seat."],
              ["Ignoring later rounds & CSAB", "Float/slide and CSAB special rounds confuse everyone. Miss them and you miss upgrades."],
              ["No backup strategy", "Filling only dream colleges with no safe options means risking no allotment at all."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="card" style={{ height: "100%", borderTop: "3px solid var(--coral)" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EXPLAINER — what counselling actually is */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Understand the process</span><h2 className="section-title">What JoSAA &amp; CSAB <span className="accent">counselling</span> really is</h2></div>
          <p style={{ color: "var(--muted)", maxWidth: 760, lineHeight: 1.7, fontSize: "1.05rem", marginBottom: 28 }}>
            Clearing JEE gets you a rank — but it's <strong>counselling</strong> that turns that rank into an actual seat. JoSAA 2026 is where lakhs of students compete for limited seats across the IITs, NITs, IIITs and GFTIs, and the difference between a great college and a disappointing one often comes down to <strong>how you fill and order your choices</strong>, not just your rank. Here's how the process works, in plain language.
          </p>
          <div className="grid-3">
            {EXPLAINER.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 8, color: "var(--navy)" }}>{t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: 14.5 }}>{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDES */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">What you get</span><h2 className="section-title">Everything you need to fill choices right</h2></div>
          <div className="grid-3">
            {INCLUDES.map((f, i) => (
              <Reveal key={f.t} delay={(i % 3) * 0.06}>
                <div className="card" style={{ height: "100%" }}>
                  <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(249,115,22,.12)" }}><f.icon size={22} color="var(--coral)" /></span>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, margin: "12px 0 6px", color: "var(--navy)" }}>{f.t}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.55, fontSize: 14.5 }}>{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — round-by-round roadmap */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">The roadmap</span><h2 className="section-title">Your JoSAA 2026 counselling <span className="accent">timeline</span></h2></div>
          <p style={{ color: "var(--muted)", maxWidth: 720, lineHeight: 1.7, marginBottom: 28 }}>
            Counselling isn't a single day — it's a multi-week marathon of registration, mock rounds, allotments, reporting and CSAB. Miss one deadline and you can lose a seat you'd already earned. Here's every stage you'll go through, and where we're with you at each step.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {TIMELINE.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="card" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--coral)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, flexShrink: 0, fontSize: 17 }}>{i + 1}</div>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 5, color: "var(--navy)" }}>{t}</h3>
                    <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: 14.5 }}>{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">How it works</span><h2 className="section-title">From enrol to allotment in 4 steps</h2></div>
          <div className="grid-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <div className="card" style={{ height: "100%", textAlign: "center" }}>
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--coral)", color: "#fff", display: "grid", placeItems: "center", fontFamily: "Sora", fontWeight: 800, margin: "0 auto 12px", fontSize: 20 }}>{s.n}</div>
                  <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 6, color: "var(--navy)" }}>{s.t}</h3>
                  <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.5 }}>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE — who this is for */}
      <section className="section section--sky">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Who it's for</span><h2 className="section-title">Built for every kind of <span className="accent">JEE counselling candidate</span></h2></div>
          <p style={{ color: "var(--muted)", maxWidth: 720, lineHeight: 1.7, marginBottom: 28 }}>
            Whether you're chasing a top IIT branch or trying to make the most of a borderline rank, the choices you make in JoSAA decide the next four years. This plan is designed for:
          </p>
          <div className="grid-2">
            {AUDIENCE.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <div className="card" style={{ height: "100%", display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(249,115,22,.12)", flexShrink: 0 }}><Users size={20} color="var(--coral)" /></span>
                  <div>
                    <h3 style={{ fontFamily: "Sora", fontWeight: 700, marginBottom: 5, color: "var(--navy)" }}>{t}</h3>
                    <p style={{ color: "var(--muted)", lineHeight: 1.6, fontSize: 14.5 }}>{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="title-bar"><span className="eyebrow">Student results</span><h2 className="section-title">They filled smart — and upgraded</h2></div>
          <div className="grid-3">
            {[
              ["Got CSE at a top NIT in CSAB round 2 — I'd never have filled those choices myself.", "Rahul, NIT"],
              ["The mentor call cleared all my float/slide doubts in 30 minutes. Worth way more than ₹249.", "Ishita, IIIT"],
              ["Predicted allotment was almost exactly what I got. Took all the stress out.", "Aman, GFTI→NIT"],
            ].map(([t, n], i) => (
              <Reveal key={n} delay={i * 0.07}>
                <div className="card" style={{ height: "100%" }}>
                  <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>{[1,2,3,4,5].map((s) => <Star key={s} size={15} fill="#F4A261" color="#F4A261" />)}</div>
                  <p style={{ color: "var(--ink)", lineHeight: 1.6, fontStyle: "italic" }}>"{t}"</p>
                  <div style={{ fontWeight: 700, color: "var(--navy)", marginTop: 10, fontFamily: "Sora" }}>{n}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--sky">
        <div className="container" style={{ maxWidth: 880 }}>
          <div className="title-bar">
            <span className="eyebrow"><HelpCircle size={13} /> FAQ</span>
            <h2 className="section-title">JEE 2026 counselling, <span className="accent">answered</span></h2>
            <p className="section-sub">
              {ALL_FAQS.length}+ of the most-asked questions about JoSAA &amp; CSAB 2026 — search, or browse by topic.
            </p>
          </div>
          <FaqSection />
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: "linear-gradient(135deg,var(--coral),#ea580c)", color: "#fff", padding: "56px 0", textAlign: "center" }}>
        <div className="container">
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "clamp(1.6rem,3.5vw,2.3rem)", marginBottom: 10 }}>Counselling opens soon. Be ready.</h2>
          <p style={{ color: "rgba(255,255,255,.9)", maxWidth: 560, margin: "0 auto 22px" }}>Lock your ₹249 plan now and get your personalised choice list before the rush.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={PAY_LINK} target="_blank" rel="noreferrer" className="btn btn-light" style={{ fontSize: 16, padding: "14px 28px", background: "#fff", color: "var(--coral)", border: "none" }}>Enrol now — ₹249</a>
            <a href={WA} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 15, padding: "14px 22px", background: "rgba(255,255,255,.15)", color: "#fff", border: "1px solid rgba(255,255,255,.5)" }}><MessageCircle size={17} /> Ask on WhatsApp</a>
          </div>
        </div>
      </section>
    </div>
  );
}
