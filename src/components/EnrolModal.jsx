import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, MapPin, Hash, ShieldCheck, Check, Loader2,
  ArrowRight, Sparkles, BadgeCheck, PartyPopper, GraduationCap,
} from "lucide-react";
import { startPayment } from "../payments/razorpay.js";
import { useAuth } from "../auth/AuthContext.jsx";

/* ─────────────────────────────────────────────────────────
   Plan catalogue (must match server/routes/payment.js)
   ───────────────────────────────────────────────────────── */
const PLAN_META = {
  "josaa": {
    amount: 299,
    old: 1999,
    title: "JoSAA + CSAB 2026 Counselling",
    band: "Strong ranks · IITs / NITs / IIITs",
  },
  "all-colleges": {
    amount: 499,
    old: 1999,
    title: "All Colleges Counselling",
    band: "Any rank · State / Private / Deemed + NITs",
  },
  // ── Mentorship plans ──
  "mentor-jee-2027": {
    amount: 2499, old: 7999, kind: "mentorship", targetExam: "JEE 2027",
    title: "JEE 2027 Mentorship Program",
    band: "1-on-1 IITian mentor · Class 12 / Droppers",
  },
  "mentor-neet-2027": {
    amount: 1, old: 7999, kind: "mentorship", targetExam: "NEET 2027",
    title: "NEET 2027 Mentorship Program",
    band: "1-on-1 doctor mentor · Class 12 / Droppers",
  },
  "mentor-jee-2028": {
    amount: 2499, old: 7999, kind: "mentorship", targetExam: "JEE 2028",
    title: "JEE 2028 Mentorship (2-Year)",
    band: "2-year IITian mentorship · Class 11",
  },
  "mentor-neet-2028": {
    amount: 1, old: 7999, kind: "mentorship", targetExam: "NEET 2028",
    title: "NEET 2028 Mentorship (2-Year)",
    band: "2-year doctor mentorship · Class 11",
  },
  "mentor-foundation": {
    amount: 2499, old: 5999, kind: "mentorship", targetExam: "Foundation (JEE/NEET)",
    title: "Foundation Mentorship (Class 9–10)",
    band: "1-on-1 mentor · Shared JEE + NEET base",
  },
};

const CLASS_OPTIONS = ["Class 9", "Class 10", "Class 11", "Class 12", "Dropper / Repeater"];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Dadra & Nagar Haveli and Daman & Diu","Delhi",
  "Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

/* ─────────────────────────────────────────────────────────
   Context — open the modal from anywhere
   ───────────────────────────────────────────────────────── */
const EnrolCtx = createContext(null);
export const useEnrol = () => useContext(EnrolCtx);

export function EnrolProvider({ children }) {
  const [plan, setPlan] = useState(null);
  const { isLoggedIn, openLogin } = useAuth() || {};
  // Purchasing requires an account (the enrolment is tied to the logged-in
  // user). Guests who tap "Enrol" are sent to log in first, then can retry.
  const open = useCallback((planKey) => {
    if (!isLoggedIn) { openLogin?.(); return; }
    setPlan(planKey);
  }, [isLoggedIn, openLogin]);
  const close = useCallback(() => setPlan(null), []);
  return (
    <EnrolCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {plan && <EnrolModal plan={plan} onClose={close} />}
      </AnimatePresence>
    </EnrolCtx.Provider>
  );
}

/* ─────────────────────────────────────────────────────────
   The modal
   ───────────────────────────────────────────────────────── */
const EMPTY = {
  name: "", email: "", phone: "", homeState: "", currentClass: "",
  parentEmail: "",
  jeeMainCrlRank: "", jeeMainCategoryRank: "",
  jeeAdvCrlRank: "", jeeAdvCategoryRank: "",
};

function EnrolModal({ plan, onClose }) {
  const meta = PLAN_META[plan] || PLAN_META["josaa"];
  const isMentorship = meta.kind === "mentorship";
  // Pre-fill contact details straight from the logged-in account — the student
  // can still edit any of them before paying.
  const { user, token } = useAuth() || {};
  const [f, setF] = useState(() => ({
    ...EMPTY,
    name:      user?.name      || "",
    email:     user?.email     || "",
    phone:     user?.phone     || "",
    homeState: user?.homeState || "",
  }));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [topError, setTopError] = useState("");
  const [done, setDone] = useState(null); // { paymentId }

  const set = (k) => (e) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setErrors((s) => ({ ...s, [k]: undefined }));
  };

  function validate() {
    const er = {};
    if (!f.name.trim()) er.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = "Enter a valid email";
    if (!/^[0-9]{10}$/.test(f.phone.replace(/\D/g, "").slice(-10)))
      er.phone = "Enter a valid 10-digit number";
    if (!f.homeState) er.homeState = "Select your home state";
    if (isMentorship) {
      if (!f.currentClass) er.currentClass = "Select your current class";
      if (!/^\S+@\S+\.\S+$/.test(f.parentEmail.trim())) er.parentEmail = "Enter a valid parent's email";
    } else if (!f.jeeMainCrlRank.trim() && !f.jeeAdvCrlRank.trim()) {
      er.jeeMainCrlRank = "Enter at least your JEE Main CRL rank";
    }
    setErrors(er);
    return Object.keys(er).length === 0;
  }

  async function handlePay() {
    setTopError("");
    if (!validate()) return;
    setBusy(true);
    try {
      const { paymentId } = await startPayment({ plan, targetExam: meta.targetExam || "", ...f }, token);
      setDone({ paymentId });
    } catch (e) {
      if (e.message !== "CANCELLED")
        setTopError(e.message || "Payment failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 4000, display: "grid", placeItems: "center",
        background: "rgba(20,12,4,.62)", backdropFilter: "blur(6px)", padding: 16, overflowY: "auto",
      }}
    >
      <motion.div
        initial={{ y: 28, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 20, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{
          width: "100%", maxWidth: 560, background: "var(--page-bg)", borderRadius: 22,
          boxShadow: "0 30px 80px rgba(20,12,4,.45)", overflow: "hidden", position: "relative",
          margin: "auto",
        }}
      >
        {/* close */}
        <button onClick={onClose} aria-label="Close" disabled={busy}
          style={{
            position: "absolute", top: 14, right: 14, zIndex: 3, width: 36, height: 36,
            borderRadius: "50%", border: "none", background: "rgba(255,255,255,.18)",
            color: "#fff", cursor: busy ? "not-allowed" : "pointer", display: "grid", placeItems: "center",
          }}>
          <X size={18} />
        </button>

        {done ? (
          <SuccessView meta={meta} plan={plan} paymentId={done.paymentId} onClose={onClose} />
        ) : (
          <>
            {/* ── Header with price ── */}
            <div style={{
              background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff",
              padding: "26px 28px 24px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -30, right: -10, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,255,255,.18),transparent 70%)" }} />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, background: "rgba(255,255,255,.18)", padding: "5px 12px", borderRadius: 50 }}>
                <Sparkles size={13} /> {meta.band}
              </span>
              <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.35rem", margin: "12px 0 4px", position: "relative" }}>
                {meta.title}
              </h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                <span style={{ fontSize: 16, opacity: .7, textDecoration: "line-through" }}>₹{meta.old}</span>
                <span style={{ fontSize: 34, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif" }}>₹{meta.amount}</span>
                <span style={{ fontSize: 13, opacity: .9 }}>one-time · all rounds</span>
              </div>
            </div>

            {/* ── Form ── */}
            <div style={{ padding: "22px 28px 26px", maxHeight: "min(62vh, 560px)", overflowY: "auto" }}>
              {topError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", padding: "10px 12px", borderRadius: 10, fontSize: 13.5, marginBottom: 14, fontWeight: 600 }}>
                  {topError}
                </div>
              )}

              {user && (
                <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#f0faf4", border: "1px solid #bbf7d0", color: "#15803d", padding: "9px 12px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, marginBottom: 14 }}>
                  <BadgeCheck size={15} color="#16a34a" /> Auto-filled from your account — edit any field if needed.
                </div>
              )}

              <Field label="Full name" icon={User} value={f.name} onChange={set("name")} error={errors.name} placeholder="Your name" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Email" icon={Mail} type="email" value={f.email} onChange={set("email")} error={errors.email} placeholder="you@email.com" />
                <Field label="Phone" icon={Phone} type="tel" value={f.phone} onChange={set("phone")} error={errors.phone} placeholder="10-digit mobile" />
              </div>

              <SelectField label="Home state" icon={MapPin} value={f.homeState} onChange={set("homeState")} error={errors.homeState} options={INDIAN_STATES} />

              {isMentorship ? (
                <>
                  <Divider label="Mentorship details" />
                  <SelectField
                    label="Current class"
                    icon={GraduationCap}
                    value={f.currentClass}
                    onChange={set("currentClass")}
                    error={errors.currentClass}
                    options={CLASS_OPTIONS}
                    placeholder="Select your current class…"
                  />
                  <Field label="Parent's email" icon={Mail} type="email" value={f.parentEmail} onChange={set("parentEmail")} error={errors.parentEmail} placeholder="parent@email.com" />
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: -6, marginBottom: 4, fontSize: 12, color: "#15803d", fontWeight: 600 }}>
                    <Mail size={13} color="#16a34a" /> We email a weekly progress report here.
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--page-bg)", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 12px", fontSize: 12.5, color: "#9a3412", fontWeight: 600 }}>
                    <BadgeCheck size={15} color="#FF693D" /> Target: {meta.targetExam}
                  </div>
                </>
              ) : (
                <>
                  <Divider label="JEE Main rank" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="CRL rank" icon={Hash} value={f.jeeMainCrlRank} onChange={set("jeeMainCrlRank")} error={errors.jeeMainCrlRank} placeholder="e.g. 45000" inputMode="numeric" />
                    <Field label="Category rank" icon={Hash} value={f.jeeMainCategoryRank} onChange={set("jeeMainCategoryRank")} placeholder="Optional" inputMode="numeric" />
                  </div>

                  <Divider label="JEE Advanced rank" hint="(if qualified)" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Field label="CRL rank" icon={Hash} value={f.jeeAdvCrlRank} onChange={set("jeeAdvCrlRank")} placeholder="Optional" inputMode="numeric" />
                    <Field label="Category rank" icon={Hash} value={f.jeeAdvCategoryRank} onChange={set("jeeAdvCategoryRank")} placeholder="Optional" inputMode="numeric" />
                  </div>
                </>
              )}

              <button onClick={handlePay} disabled={busy}
                style={{
                  width: "100%", marginTop: 20, padding: "15px", border: "none", borderRadius: 14,
                  background: busy ? "#f9a25e" : "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff",
                  fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 16, cursor: busy ? "wait" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
                  boxShadow: "0 10px 26px rgba(255, 105, 61,.4)",
                }}>
                {busy ? <><Loader2 size={18} className="enrol-spin" /> Processing…</>
                      : <>Pay ₹{meta.amount} & Enrol <ArrowRight size={18} /></>}
              </button>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                  <ShieldCheck size={14} color="#22c55e" /> Secure payment by Razorpay
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
                  <BadgeCheck size={14} color="#FF693D" /> Mentor assigned within hours
                </span>
              </div>
            </div>
          </>
        )}
      </motion.div>

      <style>{`@keyframes enrolspin{to{transform:rotate(360deg)}}.enrol-spin{animation:enrolspin .8s linear infinite}`}</style>
    </motion.div>,
    document.body
  );
}

/* ── Success screen ── */
function SuccessView({ meta, plan, paymentId, onClose }) {
  const wa = `https://wa.me/917877596464?text=` + encodeURIComponent(
    `Hi! I just enrolled in the ₹${meta.amount} ${meta.title} plan. Payment ID: ${paymentId}`
  );
  return (
    <div style={{ padding: "44px 30px 34px", textAlign: "center" }}>
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}
        style={{ width: 78, height: 78, borderRadius: "50%", background: "rgba(34,197,94,.12)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#22c55e", display: "grid", placeItems: "center" }}>
          <Check size={32} color="#fff" strokeWidth={3} />
        </div>
      </motion.div>
      <h2 style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#1a1a2e", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <PartyPopper size={22} color="#FF693D" /> You're enrolled!
      </h2>
      <p style={{ color: "#4b5563", fontSize: 15, lineHeight: 1.6, maxWidth: 380, margin: "0 auto 6px" }}>
        Payment successful for the <strong>{meta.title}</strong> plan. Our team will reach out on WhatsApp within a few hours to begin.
      </p>
      <p style={{ color: "#9ca3af", fontSize: 12.5, marginBottom: 22 }}>Payment ID: {paymentId}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
        <a href={wa} target="_blank" rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#25D366", color: "#fff", padding: "13px 22px", borderRadius: 12, fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk',sans-serif" }}>
          Message us on WhatsApp <ArrowRight size={17} />
        </a>
        <button onClick={onClose}
          style={{ padding: "12px", border: "1.5px solid rgba(0,0,0,.12)", borderRadius: 12, background: "var(--page-bg)", color: "#1a1a2e", fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif" }}>
          Done
        </button>
      </div>
    </div>
  );
}

/* ── Small field primitives ── */
function Field({ label, icon: Icon, error, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        {Icon && <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />}
        <input {...rest}
          style={{
            width: "100%", padding: Icon ? "11px 12px 11px 36px" : "11px 12px", fontSize: 14.5,
            borderRadius: 10, border: `1.5px solid ${error ? "#fca5a5" : "rgba(0,0,0,.13)"}`,
            outline: "none", background: error ? "#fffafa" : "#fff", color: "#1a1a2e",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#FF693D")}
          onBlur={(e) => (e.target.style.borderColor = error ? "#fca5a5" : "rgba(0,0,0,.13)")}
        />
      </span>
      {error && <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 600, marginTop: 4, display: "block" }}>{error}</span>}
    </label>
  );
}

function SelectField({ label, icon: Icon, error, options, placeholder, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>{label}</span>
      <span style={{ position: "relative", display: "block" }}>
        {Icon && <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", zIndex: 1 }} />}
        <select {...rest}
          style={{
            width: "100%", padding: "11px 12px 11px 36px", fontSize: 14.5, borderRadius: 10,
            border: `1.5px solid ${error ? "#fca5a5" : "rgba(0,0,0,.13)"}`, outline: "none",
            background: "var(--page-bg)", color: rest.value ? "#1a1a2e" : "#9ca3af", appearance: "none", cursor: "pointer",
          }}>
          <option value="">{placeholder || "Select your state…"}</option>
          {options.map((o) => <option key={o} value={o} style={{ color: "#1a1a2e" }}>{o}</option>)}
        </select>
      </span>
      {error && <span style={{ fontSize: 11.5, color: "#dc2626", fontWeight: 600, marginTop: 4, display: "block" }}>{error}</span>}
    </label>
  );
}

function Divider({ label, hint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "6px 0 12px" }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#FF693D", textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</span>
      {hint && <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>{hint}</span>}
      <span style={{ flex: 1, height: 1, background: "rgba(0,0,0,.08)" }} />
    </div>
  );
}
