/* College Parichay AI — our own Claude-style study & admissions assistant,
   powered by Groq (the key lives only on the server). Clean left sidebar with
   chat history + New Chat, a large centered prompt on a fresh chat, streaming
   responses, Markdown + code blocks, conversation memory, AI-generated titles,
   dark/light theme, file/PDF upload, voice input & spoken replies, plus quick
   Quiz / Notes / Flashcard tools. */
import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Send, Square, Sparkles, MessageSquare, Trash2, Menu, X, Sun, Moon,
  Paperclip, Mic, Volume2, VolumeX, RotateCcw, Copy, Check, User, GraduationCap,
  BookOpen, FileText, ListChecks, Layers, Code2, Calculator, Mail, Bot,
  Globe, Brain, Download, CornerDownRight,
} from "lucide-react";
import { API_BASE } from "../auth/api.js";
import { useAuth } from "../auth/AuthContext.jsx";
import Seo from "../components/Seo.jsx";
import Markdown from "../components/ai/Markdown.jsx";

/* ── theme tokens (page + markdown) ── */
const THEMES = {
  dark: {
    bg: "#1f1d1a", bgGrid: "rgba(255,255,255,.03)",
    glow1: "rgba(255, 105, 61,.16)", glow2: "rgba(123,94,167,.14)",
    sidebar: "#181613", panel: "#26231f", panelHi: "#2f2b26",
    border: "rgba(255,255,255,.09)", borderHi: "rgba(255,255,255,.16)",
    text: "#ece7df", textDim: "#a39b8f", textMute: "#7d756b",
    accent: "#FF693D", accentSoft: "rgba(255, 105, 61,.15)",
    userBubble: "rgba(255, 105, 61,.14)", userBorder: "rgba(255, 105, 61,.3)",
    display: "'Space Grotesk','Sora',sans-serif",
    heading: "#f5f1ea", body: "#d9d2c7", bodyDim: "#a39b8f", link: "#f0a868",
    inlineCodeBg: "rgba(255,255,255,.08)", inlineCodeFg: "#f0a868",
    codeBg: "#141210", codeHeadBg: "#0f0d0b", codeHeadFg: "#b8b0a4",
    codeBorder: "rgba(255,255,255,.1)", codeFg: "#e7e0d4",
    hr: "rgba(255,255,255,.1)", tableHead: "rgba(255,255,255,.04)",
  },
  light: {
    bg: "#F7F4EE", bgGrid: "rgba(33,29,46,.035)",
    glow1: "rgba(255, 105, 61,.12)", glow2: "rgba(123,94,167,.1)",
    sidebar: "#F1ECE3", panel: "#ffffff", panelHi: "#FBF9F5",
    border: "rgba(33,29,46,.1)", borderHi: "rgba(33,29,46,.18)",
    text: "#2b2722", textDim: "#6b6258", textMute: "#9a9189",
    accent: "#E0421F", accentSoft: "rgba(255, 105, 61,.12)",
    userBubble: "rgba(255, 105, 61,.12)", userBorder: "rgba(255, 105, 61,.28)",
    display: "'Space Grotesk','Sora',sans-serif",
    heading: "#211d2e", body: "#3a352f", bodyDim: "#6b6258", link: "#c2540a",
    inlineCodeBg: "rgba(33,29,46,.07)", inlineCodeFg: "#c2540a",
    codeBg: "#1c1a17", codeHeadBg: "#141210", codeHeadFg: "#b8b0a4",
    codeBorder: "rgba(0,0,0,.12)", codeFg: "#e7e0d4",
    hr: "rgba(33,29,46,.1)", tableHead: "rgba(33,29,46,.04)",
  },
};

const STORE = "cpai:chats:v1";
const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const blankChat = () => ({ id: newId(), title: "New chat", messages: [], createdAt: Date.now() });

/* engine badge shown live as the server routes each question */
const MODES = {
  search:  { label: "Web search", icon: Globe,  color: "#22c55e" },
  math:    { label: "Reasoning",  icon: Brain,  color: "#a855f7" },
  code:    { label: "Coding",     icon: Code2,  color: "#3b82f6" },
  general: { label: "Chat",       icon: Sparkles, color: "#FF693D" },
};

/* download the whole conversation as a Markdown file */
function exportChat(chat) {
  const lines = [`# ${chat.title || "College Parichay AI chat"}`, ""];
  for (const m of chat.messages) {
    const who = m.role === "user" ? "🧑 You" : "🤖 College Parichay AI";
    lines.push(`## ${who}`, "", m.content.split("\n\n--- Attached:")[0].trim(), "");
  }
  const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(chat.title || "chat").replace(/[^\w-]+/g, "-").slice(0, 40)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/* starter prompt chips on the empty screen */
const QUICK = [
  { icon: BookOpen,    label: "Solve a doubt",   prompt: "I'm stuck on this problem — solve it step by step:\n\n" },
  { icon: Calculator,  label: "Maths solution",  prompt: "Give a clean step-by-step solution with the final answer for:\n\n" },
  { icon: Code2,       label: "Generate code",   prompt: "Write well-commented code for:\n\n" },
  { icon: ListChecks,  label: "Quiz me",         prompt: "Generate 10 MCQs (with an answer key at the end) on the topic: " },
  { icon: FileText,    label: "Short notes",     prompt: "Create crisp, exam-ready short notes for the chapter: " },
  { icon: Layers,      label: "Flashcards",      prompt: "Make 10 Q&A flashcards (front/back) for: " },
];

export default function CollegeParichayAI() {
  const { user, token } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("cpai:theme") || "dark");
  const t = THEMES[theme];

  const [chats, setChats] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(STORE)); if (Array.isArray(s) && s.length) return s; } catch { /* ignore */ }
    return [blankChat()];
  });
  const [activeId, setActiveId] = useState(() => null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attach, setAttach] = useState(null);     // { name, text }
  const [listening, setListening] = useState(false);
  const [speakId, setSpeakId] = useState(null);    // message index being spoken
  const [profileOpen, setProfileOpen] = useState(false);

  const abortRef = useRef(null);
  const scrollRef = useRef(null);
  const recogRef = useRef(null);
  const fileRef = useRef(null);
  const taRef = useRef(null);

  const active = chats.find((c) => c.id === activeId) || chats[0];

  /* keep an active chat selected */
  useEffect(() => { if (!activeId && chats[0]) setActiveId(chats[0].id); }, [activeId, chats]);
  /* persist + theme */
  useEffect(() => { localStorage.setItem(STORE, JSON.stringify(chats.slice(0, 50))); }, [chats]);
  useEffect(() => { localStorage.setItem("cpai:theme", theme); }, [theme]);
  /* autoscroll on new content */
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [active?.messages, streaming]);
  /* page title */
  useEffect(() => { const p = document.title; document.title = "College Parichay AI"; return () => { document.title = p; }; }, []);
  /* auto-grow textarea */
  useEffect(() => {
    const el = taRef.current; if (!el) return;
    el.style.height = "auto"; el.style.height = Math.min(200, el.scrollHeight) + "px";
  }, [input]);

  const patchActive = useCallback((fn) => {
    setChats((prev) => prev.map((c) => (c.id === (active?.id) ? fn(c) : c)));
  }, [active?.id]);

  const newChat = () => {
    const c = blankChat();
    setChats((prev) => [c, ...prev]);
    setActiveId(c.id);
    setInput(""); setAttach(null); setSidebarOpen(false);
  };

  const deleteChat = (id) => {
    setChats((prev) => {
      const next = prev.filter((c) => c.id !== id);
      const list = next.length ? next : [blankChat()];
      if (id === activeId) setActiveId(list[0].id);
      return list;
    });
  };

  /* ── streaming send ── */
  const send = async (overrideText) => {
    const raw = (overrideText ?? input).trim();
    if (!raw || streaming) return;
    let content = raw;
    if (attach?.text) content += `\n\n--- Attached: ${attach.name} ---\n${attach.text}`;

    const userMsg = { role: "user", content };
    const baseMsgs = [...(active?.messages || []), userMsg];
    const chatId = active?.id;
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, messages: [...baseMsgs, { role: "assistant", content: "" }], suggest: [] } : c)));
    setInput(""); setAttach(null); setStreaming(true);

    const isFirst = (active?.messages?.length || 0) === 0;
    if (isFirst) genTitle(chatId, raw);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const resp = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: baseMsgs }),
        signal: controller.signal,
      });
      if (!resp.ok || !resp.body) {
        const e = await resp.json().catch(() => ({}));
        throw new Error(e.error || `Request failed (${resp.status})`);
      }
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "", acc = "";
      const appendDelta = (d) => {
        acc += d;
        setChats((prev) => prev.map((c) => {
          if (c.id !== chatId) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = { role: "assistant", content: acc };
          return { ...c, messages: msgs };
        }));
      };
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
          if (evt === "error") { try { appendDelta(`\n\n⚠️ ${JSON.parse(data).error || "AI error."}`); } catch { /* */ } }
          else if (evt === "meta") { try { const j = JSON.parse(data); setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, mode: j.mode } : c))); } catch { /* */ } }
          else if (evt === "done") { /* end */ }
          else if (data) { try { const j = JSON.parse(data); if (j.delta) appendDelta(j.delta); } catch { /* */ } }
        }
      }
      if (!acc) appendDelta("⚠️ No response — please try again.");
      else if (!acc.startsWith("⚠️")) genFollowups(chatId, raw, acc);
    } catch (err) {
      if (err.name !== "AbortError") {
        setChats((prev) => prev.map((c) => {
          if (c.id !== chatId) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = { role: "assistant", content: `⚠️ ${err.message}` };
          return { ...c, messages: msgs };
        }));
      }
    } finally { setStreaming(false); abortRef.current = null; }
  };

  const stop = () => { abortRef.current?.abort(); setStreaming(false); };

  const regenerate = () => {
    const msgs = active?.messages || [];
    let lastUser = null;
    for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "user") { lastUser = msgs[i]; break; }
    if (!lastUser) return;
    // drop trailing assistant + that user msg, then resend it
    const trimmed = [...msgs];
    while (trimmed.length && trimmed[trimmed.length - 1].role === "assistant") trimmed.pop();
    if (trimmed.length && trimmed[trimmed.length - 1].role === "user") trimmed.pop();
    patchActive((c) => ({ ...c, messages: trimmed }));
    setTimeout(() => send(lastUser.content.split("\n\n--- Attached:")[0]), 30);
  };

  /* ── AI chat title ── */
  const genTitle = async (chatId, prompt) => {
    try {
      const r = await fetch(`${API_BASE}/api/ai/title`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt }),
      });
      const { title } = await r.json();
      if (title) setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, title } : c)));
    } catch { /* keep "New chat" */ }
  };

  /* ── suggested follow-up questions ── */
  const genFollowups = async (chatId, question, answer) => {
    try {
      const r = await fetch(`${API_BASE}/api/ai/followups`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, answer }),
      });
      const { followups } = await r.json();
      if (Array.isArray(followups) && followups.length)
        setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, suggest: followups } : c)));
    } catch { /* no chips */ }
  };

  /* ── file / PDF upload ── */
  const onFile = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    try {
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        const text = await extractPdf(f);
        setAttach({ name: f.name, text });
      } else {
        const text = await f.text();
        setAttach({ name: f.name, text: text.slice(0, 60000) });
      }
    } catch {
      setAttach({ name: f.name, text: "(Could not read this file — please paste the text instead.)" });
    }
  };

  /* ── voice input ── */
  const toggleMic = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input isn't supported in this browser."); return; }
    if (listening) { recogRef.current?.stop(); return; }
    const r = new SR();
    r.lang = "en-IN"; r.interimResults = true; r.continuous = false;
    r.onresult = (ev) => {
      const txt = Array.from(ev.results).map((x) => x[0].transcript).join("");
      setInput((prev) => (ev.results[0].isFinal ? (prev ? prev + " " : "") + txt : prev));
    };
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    recogRef.current = r; r.start(); setListening(true);
  };

  /* ── spoken reply ── */
  const speak = (idx, text) => {
    if (!window.speechSynthesis) return;
    if (speakId === idx) { window.speechSynthesis.cancel(); setSpeakId(null); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[#*`>|_-]/g, "").slice(0, 4000));
    u.lang = "en-IN"; u.rate = 1.02;
    u.onend = () => setSpeakId(null);
    window.speechSynthesis.speak(u); setSpeakId(idx);
  };

  const messages = active?.messages || [];
  const empty = messages.length === 0;

  return (
    <div style={{ position: "fixed", inset: 0, top: 0, display: "flex", background: t.bg, color: t.text, fontFamily: "'DM Sans',system-ui,sans-serif", zIndex: 1, overflow: "hidden" }}>
      <Seo path="/ai" title="College Parichay AI — your free study & admissions assistant" description="A Claude-style AI tutor for JEE, NEET & counselling. Solve doubts, generate notes, quizzes and code — free." />
      {/* ambient background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(${t.bgGrid} 1px, transparent 1px)`, backgroundSize: "30px 30px", opacity: .8 }} />
      <div style={{ position: "absolute", top: "-12%", left: "12%", width: 460, height: 460, borderRadius: "50%", background: t.glow1, filter: "blur(120px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "8%", width: 420, height: 420, borderRadius: "50%", background: t.glow2, filter: "blur(120px)", pointerEvents: "none" }} />

      {/* ═══ Sidebar ═══ */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== "undefined") && (
          <aside style={{
            zIndex: 30,
            background: t.sidebar, borderRight: `1px solid ${t.border}`,
            display: "flex", flexDirection: "column",
          }} className="cpai-sidebar" data-open={sidebarOpen}>
            <div style={{ padding: "16px 14px 10px", display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, background: "linear-gradient(135deg,#FF693D,#E0421F)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Bot size={17} color="#fff" />
              </span>
              <div style={{ fontFamily: t.display, fontWeight: 800, fontSize: 15.5, letterSpacing: "-.3px" }}>College Parichay <span style={{ color: t.accent }}>AI</span></div>
              <button onClick={() => setSidebarOpen(false)} className="cpai-only-mobile" style={iconBtn(t, true)} aria-label="Close"><X size={18} /></button>
            </div>

            <div style={{ padding: "4px 14px 12px" }}>
              <button onClick={newChat} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9, justifyContent: "center",
                background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff", border: "none",
                borderRadius: 11, padding: "11px 14px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 6px 18px rgba(255, 105, 61,.3)", fontFamily: t.display,
              }}><Plus size={17} /> New chat</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: t.textMute, padding: "6px 8px 8px" }}>Recent</div>
              {chats.map((c) => (
                <div key={c.id} onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 10, cursor: "pointer",
                    background: c.id === active?.id ? t.panelHi : "transparent", marginBottom: 2,
                    border: `1px solid ${c.id === active?.id ? t.border : "transparent"}`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.querySelector(".cpai-del").style.opacity = 1; }}
                  onMouseLeave={(e) => { e.currentTarget.querySelector(".cpai-del").style.opacity = 0; }}
                >
                  <MessageSquare size={15} color={t.textDim} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
                  <button className="cpai-del" onClick={(e) => { e.stopPropagation(); deleteChat(c.id); }}
                    style={{ opacity: 0, transition: ".15s", background: "none", border: "none", color: t.textMute, cursor: "pointer", display: "grid", placeItems: "center" }} aria-label="Delete chat">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* footer: profile + theme */}
            <div style={{ borderTop: `1px solid ${t.border}`, padding: "10px 12px", display: "flex", alignItems: "center", gap: 9 }}>
              <button onClick={() => setProfileOpen(true)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 4, color: t.text }}>
                <span style={{ width: 32, height: 32, borderRadius: "50%", background: t.accentSoft, color: t.accent, display: "grid", placeItems: "center", fontWeight: 800, fontFamily: t.display, flexShrink: 0 }}>
                  {(user?.name || "S").charAt(0).toUpperCase()}
                </span>
                <span style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name || "Student"}</div>
                  <div style={{ fontSize: 11, color: t.textMute, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>View profile</div>
                </span>
              </button>
              <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={iconBtn(t)} aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </div>
          </aside>
        )}
      </AnimatePresence>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="cpai-backdrop" />}

      {/* ═══ Main ═══ */}
      <main style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* top bar */}
        <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(true)} className="cpai-only-mobile" style={iconBtn(t)} aria-label="Menu"><Menu size={19} /></button>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: t.display, fontWeight: 700, fontSize: 14, minWidth: 0, flex: 1 }}>
            <Sparkles size={15} color={t.accent} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{active?.title || "New chat"}</span>
          </div>
          {(() => {
            const md = MODES[active?.mode] || MODES.general;
            const MdIcon = md.icon;
            return (
              <span className="cpai-hide-sm" title={`Auto-routed engine · Groq`} style={{ marginLeft: "auto", fontSize: 11.5, color: t.textDim, display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${t.border}`, padding: "4px 10px", borderRadius: 50, whiteSpace: "nowrap", flexShrink: 0 }}>
                <MdIcon size={13} color={md.color} /> {md.label} · Groq
              </span>
            );
          })()}
          {!empty && (
            <button onClick={() => exportChat(active)} style={iconBtn(t)} aria-label="Export chat" title="Download chat (.md)"><Download size={17} /></button>
          )}
          <Link to="/" style={{ fontSize: 12.5, color: t.textDim, textDecoration: "none", fontWeight: 600, flexShrink: 0 }}>← Site</Link>
        </header>

        {/* messages / empty hero */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: empty ? 0 : "24px 0 16px" }}>
          {empty ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 18px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} style={{ textAlign: "center", marginBottom: 26 }}>
                <span style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg,#FF693D,#E0421F)", display: "grid", placeItems: "center", margin: "0 auto 16px", boxShadow: "0 12px 30px rgba(255, 105, 61,.35)" }}>
                  <Bot size={30} color="#fff" />
                </span>
                <h1 style={{ fontFamily: t.display, fontWeight: 800, fontSize: "clamp(1.6rem,4vw,2.2rem)", letterSpacing: "-1px", color: t.heading }}>
                  Hi {user?.name?.split(" ")[0] || "there"}, how can I help?
                </h1>
                <p style={{ color: t.textDim, marginTop: 8, fontSize: 15, fontStyle: "italic" }}>
                  Doubts, derivations, code, notes, quizzes — your free JEE / NEET study partner.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 14 }}>
                  {[MODES.search, MODES.math, MODES.code].map((m) => (
                    <span key={m.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: t.textDim, border: `1px solid ${t.border}`, borderRadius: 50, padding: "4px 11px" }}>
                      <m.icon size={13} color={m.color} /> {m.label}
                    </span>
                  ))}
                  <span style={{ fontSize: 11.5, color: t.textMute, alignSelf: "center" }}>· auto-picked per question</span>
                </div>
              </motion.div>

              <Composer t={t} input={input} setInput={setInput} send={send} streaming={streaming} stop={stop}
                taRef={taRef} attach={attach} setAttach={setAttach} fileRef={fileRef} onFile={onFile}
                toggleMic={toggleMic} listening={listening} big />

              <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center", marginTop: 20 }}>
                {QUICK.map((q) => (
                  <button key={q.label} onClick={() => { setInput(q.prompt); taRef.current?.focus(); }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 11,
                      background: t.panel, border: `1px solid ${t.border}`, color: t.text, cursor: "pointer",
                      fontSize: 13, fontWeight: 600, transition: "all .15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = ""; }}>
                    <q.icon size={15} color={t.accent} /> {q.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 18px", width: "100%", boxSizing: "border-box" }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}
                  style={{ display: "flex", gap: 13, marginBottom: 22 }}>
                  <span style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, display: "grid", placeItems: "center",
                    background: m.role === "user" ? t.userBubble : "linear-gradient(135deg,#FF693D,#E0421F)",
                    border: m.role === "user" ? `1px solid ${t.userBorder}` : "none" }}>
                    {m.role === "user" ? <User size={17} color={t.accent} /> : <Bot size={17} color="#fff" />}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: t.textDim, marginBottom: 3, fontFamily: t.display }}>
                      {m.role === "user" ? (user?.name?.split(" ")[0] || "You") : "College Parichay AI"}
                    </div>
                    {m.role === "user"
                      ? <div style={{ whiteSpace: "pre-wrap", color: t.body, lineHeight: 1.65, fontSize: 14.5 }}>{m.content.split("\n\n--- Attached:")[0]}{m.content.includes("--- Attached:") && <FileChip t={t} name={m.content.match(/--- Attached: (.*?) ---/)?.[1]} />}</div>
                      : (m.content
                          ? <Markdown text={m.content} theme={t} />
                          : <TypingDots t={t} />)}

                    {m.role === "assistant" && m.content && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <MiniBtn t={t} onClick={() => navigator.clipboard?.writeText(m.content)} icon={Copy} label="Copy" />
                        <MiniBtn t={t} onClick={() => speak(i, m.content)} icon={speakId === i ? VolumeX : Volume2} label={speakId === i ? "Stop" : "Read"} />
                        {i === messages.length - 1 && !streaming && <MiniBtn t={t} onClick={regenerate} icon={RotateCcw} label="Regenerate" />}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* suggested follow-ups */}
              {!streaming && active?.suggest?.length > 0 && messages[messages.length - 1]?.role === "assistant" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "2px 0 26px 45px" }}>
                  {active.suggest.map((q, j) => (
                    <button key={j} onClick={() => send(q)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", borderRadius: 10, background: t.panel, border: `1px solid ${t.border}`, color: t.text, cursor: "pointer", fontSize: 12.5, fontWeight: 600, textAlign: "left", lineHeight: 1.35 }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}>
                      <CornerDownRight size={14} color={t.accent} style={{ flexShrink: 0 }} /> {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* bottom composer (only when chat has messages) */}
        {!empty && (
          <div style={{ padding: "10px 18px 16px", borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <Composer t={t} input={input} setInput={setInput} send={send} streaming={streaming} stop={stop}
                taRef={taRef} attach={attach} setAttach={setAttach} fileRef={fileRef} onFile={onFile}
                toggleMic={toggleMic} listening={listening} />
              <p style={{ textAlign: "center", fontSize: 11, color: t.textMute, marginTop: 8 }}>
                College Parichay AI can make mistakes — verify important cutoffs & dates on official sites.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* profile panel */}
      <AnimatePresence>
        {profileOpen && (
          <ProfilePanel t={t} user={user} chats={chats} onClose={() => setProfileOpen(false)} />
        )}
      </AnimatePresence>

      <input ref={fileRef} type="file" accept=".txt,.md,.csv,.json,.pdf,text/*" onChange={onFile} style={{ display: "none" }} />

      <style>{`
        .cpai-only-mobile { display: none; }
        /* desktop sidebar layout lives here (not inline) so the media query below
           can actually override it on phones */
        .cpai-sidebar { position: relative; width: 268px; flex-shrink: 0; height: 100%; }
        .cpai-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 25; }
        @media (max-width: 820px) {
          .cpai-sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: 84vw; max-width: 300px;
            transform: translateX(-105%); transition: transform .25s ease; box-shadow: 0 0 40px rgba(0,0,0,.45); }
          .cpai-sidebar[data-open="true"] { transform: translateX(0); }
          .cpai-only-mobile { display: grid !important; }
          .cpai-backdrop { display: block; }
        }
        @media (min-width: 821px) { .cpai-backdrop { display: none; } }
        @media (max-width: 560px) { .cpai-hide-sm { display: none !important; } }
        .cpai-ta::placeholder { color: ${t.textMute}; }
        .cpai-ta { scrollbar-width: thin; }
      `}</style>
    </div>
  );
}

/* ── composer (input + attach + mic + send) ── */
function Composer({ t, input, setInput, send, streaming, stop, taRef, attach, setAttach, fileRef, onFile, toggleMic, listening, big }) {
  return (
    <div style={{ width: "100%" }}>
      {attach && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "6px 10px", marginBottom: 8, fontSize: 12.5, color: t.text }}>
          <Paperclip size={13} color={t.accent} /> {attach.name}
          <button onClick={() => setAttach(null)} style={{ background: "none", border: "none", color: t.textMute, cursor: "pointer", display: "grid" }}><X size={14} /></button>
        </div>
      )}
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 8, background: t.panel, border: `1px solid ${listening ? t.accent : t.borderHi}`,
        borderRadius: 16, padding: "8px 8px 8px 14px", boxShadow: big ? "0 14px 40px rgba(0,0,0,.18)" : "0 4px 18px rgba(0,0,0,.1)",
        transition: "border-color .2s", width: "100%", boxSizing: "border-box",
      }}>
        <button onClick={() => fileRef.current?.click()} style={iconBtn(t)} aria-label="Attach file" title="Attach notes / PDF"><Paperclip size={18} /></button>
        <textarea
          ref={taRef} className="cpai-ta" value={input} rows={1}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={big ? "Ask anything — a doubt, a chapter, a coding task…" : "Reply to College Parichay AI…"}
          style={{ flex: 1, minWidth: 0, resize: "none", border: "none", outline: "none", background: "transparent", color: t.text, fontSize: 15, lineHeight: 1.5, fontFamily: "inherit", maxHeight: 200, padding: "7px 0" }}
        />
        <button onClick={toggleMic} style={{ ...iconBtn(t), color: listening ? t.accent : t.textDim }} aria-label="Voice input" title="Speak">
          <Mic size={18} />
        </button>
        {streaming ? (
          <button onClick={stop} style={{ width: 38, height: 38, borderRadius: 11, border: "none", background: t.accentSoft, color: t.accent, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }} aria-label="Stop"><Square size={16} fill="currentColor" /></button>
        ) : (
          <button onClick={() => send()} disabled={!input.trim()} style={{
            width: 38, height: 38, borderRadius: 11, border: "none", flexShrink: 0,
            background: input.trim() ? "linear-gradient(135deg,#FF693D,#E0421F)" : t.panelHi,
            color: input.trim() ? "#fff" : t.textMute, display: "grid", placeItems: "center",
            cursor: input.trim() ? "pointer" : "not-allowed", boxShadow: input.trim() ? "0 4px 14px rgba(255, 105, 61,.35)" : "none",
          }} aria-label="Send"><Send size={17} /></button>
        )}
      </div>
    </div>
  );
}

function ProfilePanel({ t, user, chats, onClose }) {
  const [course, setCourse] = useState(() => localStorage.getItem("cpai:course") || "");
  useEffect(() => { localStorage.setItem("cpai:course", course); }, [course]);
  const saved = chats.filter((c) => c.messages.length > 0);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 40 }} />
      <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(380px,92vw)", background: t.sidebar, borderLeft: `1px solid ${t.border}`, zIndex: 41, padding: 22, overflowY: "auto", color: t.text }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontFamily: t.display, fontWeight: 800, fontSize: 19 }}>Profile</h2>
          <button onClick={onClose} style={iconBtn(t)} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 22 }}>
          <span style={{ width: 54, height: 54, borderRadius: "50%", background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 22, fontFamily: t.display }}>
            {(user?.name || "S").charAt(0).toUpperCase()}
          </span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, fontFamily: t.display }}>{user?.name || "Student"}</div>
            <div style={{ fontSize: 13, color: t.textDim }}>{user?.studentId || "College Parichay"}</div>
          </div>
        </div>
        {[
          { icon: User, label: "Name", value: user?.name || "—" },
          { icon: Mail, label: "Email", value: user?.email || "—" },
        ].map((row) => (
          <Field key={row.label} t={t} icon={row.icon} label={row.label} value={row.value} />
        ))}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: t.textMute, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <GraduationCap size={14} /> Course
          </div>
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Class 12 · JEE 2027"
            style={{ width: "100%", boxSizing: "border-box", background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 12px", color: t.text, outline: "none", fontSize: 14, fontFamily: "inherit" }} />
        </div>
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: t.textMute, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <MessageSquare size={14} /> Saved chats · {saved.length}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {saved.slice(0, 12).map((c) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "9px 11px", fontSize: 13 }}>
                <MessageSquare size={14} color={t.accent} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</span>
              </div>
            ))}
            {!saved.length && <div style={{ fontSize: 13, color: t.textMute }}>Your chats will appear here.</div>}
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Field({ t, icon: Icon, label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".05em", color: t.textMute, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon size={14} /> {label}
      </div>
      <div style={{ background: t.panel, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 14, color: t.text, wordBreak: "break-word" }}>{value}</div>
    </div>
  );
}

function MiniBtn({ t, onClick, icon: Icon, label }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { onClick(); if (label === "Copy") { setDone(true); setTimeout(() => setDone(false), 1300); } }}
      style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: `1px solid ${t.border}`, color: t.textDim, borderRadius: 8, padding: "4px 9px", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
      {done ? <Check size={13} /> : <Icon size={13} />} {done ? "Copied" : label}
    </button>
  );
}

function FileChip({ t, name }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, background: t.userBubble, border: `1px solid ${t.userBorder}`, borderRadius: 8, padding: "4px 9px", fontSize: 12, color: t.body }}>
      <Paperclip size={12} /> {name}
    </span>
  );
}

function TypingDots({ t }) {
  return (
    <div style={{ display: "flex", gap: 5, padding: "6px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.span key={i} animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent, display: "inline-block" }} />
      ))}
    </div>
  );
}

const iconBtn = (t, mobile) => ({
  width: 38, height: 38, borderRadius: 10, border: "none", background: "transparent", color: t.textDim,
  display: mobile ? "none" : "grid", placeItems: "center", cursor: "pointer", flexShrink: 0,
});

/* ── PDF text extraction via pdf.js (loaded from CDN on demand) ── */
async function extractPdf(file) {
  const pdfjs = await import(/* @vite-ignore */ "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.mjs";
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  const pages = Math.min(pdf.numPages, 30);
  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    out += content.items.map((it) => it.str).join(" ") + "\n\n";
    if (out.length > 60000) break;
  }
  return out.slice(0, 60000);
}
