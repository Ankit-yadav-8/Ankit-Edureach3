import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Square, Sparkles, RotateCcw, User } from "lucide-react";
import { API_BASE } from "../../auth/api.js";
import Markdown from "../ai/Markdown.jsx";
import { ORANGE, GOLD, NAVY, MUTE } from "./communityKit.jsx";

/* Light Markdown theme (mirrors the CP-AI page's `light` palette so
   math, code and tables render correctly inside the community). */
const MD = {
  display: "'Space Grotesk','Sora',sans-serif",
  heading: "#211d2e", body: "#3a352f", bodyDim: "#6b6258", link: "#c2540a",
  inlineCodeBg: "rgba(33,29,46,.07)", inlineCodeFg: "#c2540a",
  codeBg: "#1c1a17", codeHeadBg: "#141210", codeHeadFg: "#b8b0a4",
  codeBorder: "rgba(0,0,0,.12)", codeFg: "#e7e0d4",
  hr: "rgba(33,29,46,.1)", tableHead: "rgba(33,29,46,.04)",
};

const STARTERS = [
  "Explain the working principle behind a Carnot engine.",
  "Solve: ∫ x·eˣ dx step by step.",
  "Why is benzene more stable than expected? (aromaticity)",
  "Derive the time period of a simple pendulum.",
];

export default function AiDoubtSolver({ token, exam = "JEE", subjects = [] }) {
  const [messages, setMessages] = useState([]); // {role, content}
  const [input, setInput] = useState("");
  const [subject, setSubject] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef(null);
  const abortRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const stop = () => { abortRef.current?.abort(); setStreaming(false); };

  const send = useCallback(async (overrideText) => {
    const raw = (overrideText ?? input).trim();
    if (!raw || streaming) return;

    const userMsg = { role: "user", content: raw };
    const base = [...messages, userMsg];
    setMessages([...base, { role: "assistant", content: "" }]);
    setInput(""); setStreaming(true);

    const context =
      `${exam} aspirant asking an academic doubt${subject ? ` in ${subject}` : ""}. ` +
      `Give a clear, numbered step-by-step solution, define any key term briefly, ` +
      `use LaTeX ($...$) for all math, and finish with a bold "Final answer" line.`;

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const resp = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: base, context }),
        signal: controller.signal,
      });
      if (!resp.ok || !resp.body) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error || `Request failed (${resp.status})`);
      }
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "", acc = "";
      const setLast = (content) =>
        setMessages((prev) => {
          const m = [...prev]; m[m.length - 1] = { role: "assistant", content }; return m;
        });
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const parts = buf.split("\n\n");
        buf = parts.pop() || "";
        for (const part of parts) {
          const evt = /event:\s*(\w+)/.exec(part)?.[1];
          const dataLine = part.split("\n").find((l) => l.startsWith("data:"));
          const data = dataLine ? dataLine.slice(5).trim() : "";
          if (evt === "error") { try { acc += `\n\n⚠️ ${JSON.parse(data).error || "AI error."}`; setLast(acc); } catch { /* */ } }
          else if (evt === "done") { /* end */ }
          else if (data && evt !== "meta") { try { const j = JSON.parse(data); if (j.delta) { acc += j.delta; setLast(acc); } } catch { /* */ } }
        }
      }
      if (!acc) setLast("⚠️ No response — please try again.");
    } catch (err) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const m = [...prev]; m[m.length - 1] = { role: "assistant", content: `⚠️ ${err.message}` }; return m;
        });
      }
    } finally { setStreaming(false); abortRef.current = null; }
  }, [input, streaming, messages, exam, subject, token]);

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 20, overflow: "hidden", boxShadow: "0 18px 44px -34px rgba(13,27,62,.4)", display: "flex", flexDirection: "column", height: "min(72vh, 720px)" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: `linear-gradient(135deg,${NAVY},#16224a)`, color: "#fff" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Bot size={22} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.02rem", display: "flex", alignItems: "center", gap: 7 }}>
            College Parichay AI
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 800, color: NAVY, background: GOLD, padding: "2px 8px", borderRadius: 50 }}>
              <Sparkles size={10} /> DOUBT SOLVER
            </span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.72)" }}>Instant step-by-step solutions — physics, chemistry &amp; maths.</div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => { stop(); setMessages([]); }} title="New doubt"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.14)", color: "#fff", border: "1px solid rgba(255,255,255,.2)", borderRadius: 50, padding: "7px 13px", cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
            <RotateCcw size={14} /> New
          </button>
        )}
      </div>

      {/* subject chips */}
      {subjects.length > 0 && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", padding: "11px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: MUTE, alignSelf: "center" }}>Subject:</span>
          {["", ...subjects].map((s) => {
            const on = subject === s;
            return (
              <button key={s || "any"} onClick={() => setSubject(s)}
                style={{ padding: "5px 12px", borderRadius: 50, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? `${ORANGE}14` : "#fff", color: on ? ORANGE : MUTE }}>
                {s || "Any"}
              </button>
            );
          })}
        </div>
      )}

      {/* messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "18px 16px", display: "flex", flexDirection: "column", gap: 16, background: "#FBFCFE" }}>
        {messages.length === 0 ? (
          <div style={{ margin: "auto", textAlign: "center", maxWidth: 460 }}>
            <div style={{ width: 56, height: 56, borderRadius: 17, background: `${ORANGE}14`, display: "grid", placeItems: "center", margin: "0 auto 12px" }}>
              <Bot size={28} color={ORANGE} />
            </div>
            <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.15rem", margin: "0 0 6px" }}>Stuck on a question?</h3>
            <p style={{ color: MUTE, fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>
              Ask College Parichay AI for a clean, step-by-step solution — then discuss it with your batch below.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  style={{ textAlign: "left", background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 12, padding: "11px 14px", cursor: "pointer", fontSize: 13.5, color: NAVY, fontWeight: 600, transition: "border-color .15s, background .15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = ORANGE; e.currentTarget.style.background = `${ORANGE}08`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#eef2f7"; e.currentTarget.style.background = "#fff"; }}>
                  <Sparkles size={13} color={ORANGE} style={{ marginRight: 8, verticalAlign: "-1px" }} />{s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              style={{ display: "flex", gap: 10, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: "grid", placeItems: "center",
                background: m.role === "user" ? `${ORANGE}18` : `${NAVY}12` }}>
                {m.role === "user" ? <User size={17} color={ORANGE} /> : <Bot size={17} color={NAVY} />}
              </div>
              <div style={{ maxWidth: "82%", background: m.role === "user" ? `${ORANGE}12` : "#fff",
                border: `1px solid ${m.role === "user" ? `${ORANGE}28` : "#eef2f7"}`, borderRadius: 14,
                padding: m.role === "user" ? "10px 14px" : "12px 16px", color: NAVY, fontSize: 14, lineHeight: 1.6 }}>
                {m.role === "user"
                  ? <span style={{ whiteSpace: "pre-wrap" }}>{m.content}</span>
                  : (m.content
                      ? <Markdown text={m.content} theme={MD} />
                      : <TypingDots />)}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* composer */}
      <div style={{ borderTop: "1px solid #eef2f7", padding: "12px 14px", background: "var(--page-bg)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, background: "#F7F9FC", border: "1.5px solid #e5e7eb", borderRadius: 16, padding: "8px 8px 8px 14px" }}>
          <textarea
            ref={taRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
            rows={1} placeholder="Type your doubt…  (Enter to send · Shift+Enter for a new line)"
            style={{ flex: 1, resize: "none", border: "none", outline: "none", background: "transparent", fontSize: 14, color: NAVY, lineHeight: 1.5, maxHeight: 120, fontFamily: "inherit", padding: "6px 0" }} />
          {streaming ? (
            <button onClick={stop} title="Stop" style={{ width: 40, height: 40, borderRadius: 12, background: "var(--page-bg)", border: "1.5px solid #e5e7eb", cursor: "pointer", display: "grid", placeItems: "center", color: NAVY, flexShrink: 0 }}>
              <Square size={16} fill={NAVY} />
            </button>
          ) : (
            <button onClick={() => send()} disabled={!input.trim()} title="Send"
              style={{ width: 40, height: 40, borderRadius: 12, background: input.trim() ? `linear-gradient(135deg,${ORANGE},${GOLD})` : "#e5e7eb", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
              <Send size={17} />
            </button>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", marginTop: 7 }}>
          AI can make mistakes — cross-check important results. For batch discussion, post your doubt in the Feed.
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "inline-flex", gap: 4, padding: "3px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: ORANGE, display: "block" }} />
      ))}
    </div>
  );
}
