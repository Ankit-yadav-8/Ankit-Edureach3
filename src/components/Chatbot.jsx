import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X, Send, Sparkles, ArrowRight } from "lucide-react";
import { search, answerFor } from "../utils/searchIndex.js";

const SUGGESTIONS = ["Top IITs by package", "CSE colleges in Tamil Nadu", "Best NITs for placements", "Cheapest IIITs"];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm the College Parichay assistant. Ask me about colleges, packages, cutoffs or exams — e.g. \"top IITs with package above 20 lakh\"." },
  ]);
  const [input, setInput] = useState("");
  const nav = useNavigate();
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open]);

  const ask = (q) => {
    const query = (q ?? input).trim();
    if (!query) return;
    const results = search(query, 5);
    const answer = answerFor(query, results) || "I couldn't find a match. Try a college name, an exam, or something like \"best NITs for CSE\".";
    setMsgs((m) => [...m, { from: "user", text: query }, { from: "bot", text: answer, results }]);
    setInput("");
  };

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} aria-label="Open assistant"
        style={{ position: "fixed", right: 20, bottom: 20, zIndex: 70, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--coral),var(--coral-light))", color: "#fff", display: "grid", placeItems: "center", boxShadow: "0 10px 28px rgba(230,57,70,.45)" }}>
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div style={{ position: "fixed", right: 20, bottom: 152, zIndex: 69, width: "min(360px, calc(100% - 40px))", height: 480, background: "var(--page-bg)", borderRadius: 18, boxShadow: "0 24px 60px rgba(13,27,62,.3)", border: "1px solid var(--line)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#1c1c28,#2a2a3c)", color: "#fff", padding: "14px 16px", display: "flex", alignItems: "center", gap: 9 }}>
            <Sparkles size={18} color="var(--gold)" />
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 15 }}>College Parichay Assistant</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)" }}>Ask about colleges, exams &amp; cutoffs</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "var(--sky)" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                <div style={{ background: m.from === "user" ? "var(--coral)" : "#fff", color: m.from === "user" ? "#fff" : "var(--ink)", padding: "9px 12px", borderRadius: 12, fontSize: 13.5, lineHeight: 1.5, border: m.from === "bot" ? "1px solid var(--line)" : "none" }}>
                  {m.text}
                </div>
                {m.results?.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
                    {m.results.slice(0, 4).map((r, j) => (
                      <button key={j} onClick={() => { nav(r.to); setOpen(false); }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "var(--page-bg)", border: "1px solid var(--line)", borderRadius: 9, padding: "7px 10px", fontSize: 12.5, textAlign: "left" }}>
                        <span style={{ fontWeight: 600, color: "var(--navy)" }}>{r.title}</span>
                        <ArrowRight size={13} color="var(--coral)" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {msgs.length <= 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="pill" style={{ fontSize: 11.5, cursor: "pointer", background: "var(--page-bg)", border: "1px solid var(--line)", color: "var(--navy)" }}>{s}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid var(--line)" }}>
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Ask a question…" style={{ flex: 1, border: "1px solid var(--line)", borderRadius: 999, padding: "9px 14px", outline: "none", fontFamily: "DM Sans", fontSize: 13.5 }} />
            <button onClick={() => ask()} className="btn btn-coral" style={{ padding: 10, borderRadius: "50%" }} aria-label="Send"><Send size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}
