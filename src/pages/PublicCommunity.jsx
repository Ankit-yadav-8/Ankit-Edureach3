import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe2, Sparkles, Loader2, ShieldCheck, MessagesSquare, Users,
  RefreshCw, Search, Inbox, X, GraduationCap, ChevronDown, Check, Plus, Send,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext.jsx";
import Seo from "../components/Seo.jsx";
import {
  API_BASE,
  apiPublicMe, apiPublicFeed, apiPublicCreatePost, apiPublicDeletePost,
  apiPublicLikePost, apiPublicReplies, apiPublicReply, apiPublicLikeReply,
  apiPublicSignUpload,
} from "../auth/api.js";
import {
  ORANGE, GOLD, GREEN, NAVY, MUTE, CYAN,
  SUBJECTS, Composer, PostCard, POST_TAGS, TAG_META,
} from "../components/mentorship/communityKit.jsx";

const API_HOST = (() => { try { return new URL(API_BASE).host; } catch { return API_BASE; } })();

// One shared api binding for the kit's PostCard / ReplyThread / Composer.
const PUBLIC_API = {
  plan: undefined,
  replies: apiPublicReplies,
  reply: apiPublicReply,
  likeReply: apiPublicLikeReply,
  signUpload: apiPublicSignUpload,
};

// What members can share. The order doubles as the on-screen category bar; each
// card filters the feed to that category AND points the composer at it so a tap
// on "Tricks" lets you read every trick and add your own in one go.
const CATEGORIES = [
  { id: "trick",      label: "Tricks",      blurb: "Time-saving shortcuts & hacks" },
  { id: "strategy",   label: "Strategies",  blurb: "How to plan, revise & attempt" },
  { id: "notes",      label: "Notes",       blurb: "Topic summaries & short notes" },
  { id: "doubt",      label: "Doubts",      blurb: "Ask & get it solved" },
  { id: "discussion", label: "Discussions", blurb: "Talk it out with everyone" },
  { id: "resource",   label: "Resources",   blurb: "Books, videos & PDFs" },
];

const CATEGORY_PLACEHOLDER = {
  doubt:      "Ask a doubt — the community will help you solve it…",
  discussion: "Start a discussion with the whole community…",
  trick:      "Share a trick or shortcut you swear by…",
  strategy:   "Share a strategy — how you plan, revise or attempt papers…",
  notes:      "Share notes or a quick summary of a topic…",
  resource:   "Share a resource — a book, video or PDF that helped you…",
};

export default function PublicCommunity() {
  const { token, isLoggedIn, openLogin } = useAuth();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | highlights | unanswered
  const [category, setCategory] = useState(""); // "" = every category | doubt | trick | strategy | notes | …
  const [subject, setSubject] = useState("");
  const [subjectMenuOpen, setSubjectMenuOpen] = useState(false);
  const composerRef = useRef(null);

  // Tricks / Strategies open a popup list-builder so members can jot several
  // points and post the whole list to the community in one go.
  const [listModal, setListModal] = useState(null); // "trick" | "strategy" | null
  const [listIntro, setListIntro] = useState("");
  const [listInput, setListInput] = useState("");
  const [listItems, setListItems] = useState([]);
  const [listSubject, setListSubject] = useState("");
  const [listBusy, setListBusy] = useState(false);
  const [listErr, setListErr] = useState("");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);
  useEffect(() => {
    const prev = document.title;
    document.title = "Public Community · College Parichay";
    return () => { document.title = prev; };
  }, []);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    apiPublicMe(token)
      .then((d) => mounted.current && setMe(d))
      .catch(() => {})
      .finally(() => mounted.current && setLoading(false));
  }, [token]);

  const loadFeed = useCallback((which = tab, silent = false) => {
    if (!silent) setRefreshing(true);
    apiPublicFeed(token, which, subject, category)
      .then((d) => { if (mounted.current) setPosts(d.posts || []); })
      .catch(() => {})
      .finally(() => mounted.current && setRefreshing(false));
  }, [token, tab, subject, category]);

  useEffect(() => {
    if (!me) return;
    loadFeed(tab);
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") loadFeed(tab, true);
    }, 12000);
    const onFocus = () => loadFeed(tab, true);
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [me, tab, loadFeed]);

  const createPost = async (payload) => {
    const d = await apiPublicCreatePost(token, payload);
    setPosts((p) => [d.post, ...p]);
    setMe((m) => m ? { ...m, postCount: (m.postCount || 0) + 1 } : m);
  };
  const likePost = (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) } : x));
    apiPublicLikePost(token, id).catch(() => loadFeed(tab, true));
  };
  const deletePost = (id) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((p) => p.filter((x) => x.id !== id));
    apiPublicDeletePost(token, id).catch(() => loadFeed(tab, true));
  };
  const onReplied = (postId, count) => setPosts((p) => p.map((x) => x.id === postId ? { ...x, replyCount: count } : x));

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) =>
      (p.text || "").toLowerCase().includes(q) ||
      (p.authorName || "").toLowerCase().includes(q) ||
      (p.subject || "").toLowerCase().includes(q));
  }, [posts, query]);

  /* ── not-logged-in gate (site is auth-gated, but be graceful) ── */
  if (!isLoggedIn) {
    return (
      <section style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "130px 16px 60px", background: "#f8f7f5" }}>
        <Seo
          title="Student Community — Ask Doubts & Discuss with JEE / NEET Aspirants"
          description="Join the CollegeParichay student community — a public forum where JEE & NEET aspirants, students and mentors discuss doubts, colleges, branches and campus life."
          path="/community"
          breadcrumbs={[{ name: "Home", path: "/" }, { name: "Community", path: "/community" }]}
        />
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${CYAN}15`, display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <Globe2 size={30} color={CYAN} />
          </div>
          <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.5rem", margin: "0 0 8px" }}>Public Community</h2>
          <p style={{ color: "#6b7280", marginBottom: 18, lineHeight: 1.6 }}>Log in to join the open community where students, members and aspirants discuss every doubt together.</p>
          <button onClick={openLogin} style={{ background: CYAN, color: "#fff", border: "none", padding: "12px 22px", borderRadius: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Sora" }}>Log in to join</button>
        </div>
      </section>
    );
  }

  const TABS = [
    { id: "all", label: "Feed", icon: MessagesSquare },
    { id: "highlights", label: "Highlights", icon: Sparkles },
    { id: "unanswered", label: "Unanswered", icon: Inbox },
  ];
  const subjects = SUBJECTS.Public;

  return (
    <section style={{ background: "#f8f7f5", minHeight: "100vh", padding: "110px 0 70px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 18px" }}>

        {/* hero */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", background: `linear-gradient(135deg,${NAVY},#13325c)`, color: "#fff", borderRadius: 22, padding: "22px 24px", marginBottom: 18, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -20, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,.4), transparent 70%)" }} />
          <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Globe2 size={26} color="#fff" />
          </div>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.4px" }}>Public Community</div>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.78)", marginTop: 2 }}>
              Open to <strong>everyone</strong> — free members, mentorship students & aspirants. Ask anything, help anyone.
            </div>
            {me && (
              <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#bae6fd" }}>
                  <Users size={14} /> {me.memberCount} member{me.memberCount === 1 ? "" : "s"}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#bae6fd" }}>
                  <MessagesSquare size={14} /> {me.postCount} post{me.postCount === 1 ? "" : "s"}
                </span>
                {me.role === "student" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,.16)", border: "1px solid rgba(134,239,172,.4)", padding: "3px 11px", borderRadius: 50 }}>
                    <GraduationCap size={13} /> Mentorship student
                  </span>
                )}
              </div>
            )}
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,.16)", border: "1px solid rgba(134,239,172,.4)", padding: "6px 13px", borderRadius: 50, position: "relative" }}>
            <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "block" }} />
            LIVE
          </span>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: MUTE, padding: 30, justifyContent: "center" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading the public community…
          </div>
        ) : (
          <>
            {/* composer */}
            <div ref={composerRef} style={{ marginBottom: 16 }}>
              {category && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 8, padding: "5px 12px", borderRadius: 50, background: `${TAG_META[category].color}12`, border: `1px solid ${TAG_META[category].color}33`, color: TAG_META[category].color, fontWeight: 800, fontSize: 12.5, fontFamily: "Sora" }}>
                  {(() => { const Ic = TAG_META[category].icon; return <Ic size={13} />; })()}
                  Posting under {TAG_META[category].label}
                  <button onClick={() => setCategory("")} title="Clear" style={{ border: "none", background: "transparent", cursor: "pointer", color: "inherit", display: "grid", placeItems: "center", padding: 0 }}><X size={13} /></button>
                </div>
              )}
              <Composer token={token} exam="Public" canUpload={me?.cloudinaryReady} signUpload={apiPublicSignUpload}
                initialTag={category || undefined}
                placeholder={CATEGORY_PLACEHOLDER[category] || "Ask a doubt or share something with the whole community…"} onSubmit={createPost} />
              {me && !me.cloudinaryReady && (
                <div style={{ fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginTop: 8, lineHeight: 1.55 }}>
                  Photo / video uploads aren't configured on this server
                  (<code style={{ fontFamily: "monospace", background: "#fef3c7", padding: "1px 6px", borderRadius: 5, color: "#92400e" }}>{API_HOST}</code>) yet — text posts work fine.
                </div>
              )}
            </div>

            {/* tabs + refresh */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {TABS.map((t) => {
                const on = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 15px", borderRadius: 50, cursor: "pointer", fontFamily: "Sora", fontWeight: 700, fontSize: 13,
                      border: `1.5px solid ${on ? CYAN : "#e5e7eb"}`, background: on ? CYAN : "#fff", color: on ? "#fff" : NAVY, boxShadow: on ? `0 8px 18px -8px ${CYAN}` : "none" }}>
                    <t.icon size={15} color={on ? "#fff" : CYAN} /> {t.label}
                  </button>
                );
              })}
              <button onClick={() => loadFeed(tab)} title="Refresh"
                style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 50, border: "1.5px solid #e5e7eb", background: "#fff", color: MUTE, cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
                <RefreshCw size={14} style={refreshing ? { animation: "spin 1s linear infinite" } : undefined} /> Refresh
              </button>
            </div>

            {/* subject filter + search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <button onClick={() => setSubject("")}
                style={{ padding: "6px 13px", borderRadius: 50, cursor: "pointer", fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${subject === "" ? ORANGE : "#e5e7eb"}`, background: subject === "" ? `${ORANGE}14` : "#fff", color: subject === "" ? ORANGE : MUTE }}>
                All subjects
              </button>
              {subjects.map((s) => {
                const on = subject === s;
                return (
                  <button key={s} onClick={() => setSubject(on ? "" : s)}
                    style={{ padding: "6px 13px", borderRadius: 50, cursor: "pointer", fontSize: 12.5, fontWeight: 700, border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? `${ORANGE}14` : "#fff", color: on ? ORANGE : MUTE }}>
                    {s}
                  </button>
                );
              })}
              <div style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 50, padding: "6px 12px", minWidth: 180 }}>
                <Search size={15} color={MUTE} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the community…"
                  style={{ border: "none", outline: "none", fontSize: 13, color: NAVY, background: "transparent", width: "100%" }} />
                {query && <button onClick={() => setQuery("")} style={{ border: "none", background: "transparent", cursor: "pointer", color: MUTE, display: "grid", placeItems: "center" }}><X size={14} /></button>}
              </div>
            </div>

            {/* feed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {shown.length === 0 ? (
                <div style={{ textAlign: "center", padding: "34px 20px", background: "#fff", border: "1px dashed #e5e7eb", borderRadius: 18, color: MUTE }}>
                  <ShieldCheck size={28} color="#cbd5e1" style={{ marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                    {query ? "No matches"
                      : category ? `No ${CATEGORIES.find((c) => c.id === category)?.label.toLowerCase()} yet`
                      : tab === "highlights" ? "No highlights yet"
                      : tab === "unanswered" ? "No open doubts" : "No posts yet"}
                  </div>
                  <div style={{ fontSize: 13.5 }}>
                    {query ? "Try a different search term."
                      : category ? "Be the first to share one with the community."
                      : tab === "unanswered" ? "Every doubt has been answered. 🎉"
                      : "Be the first to start a discussion."}
                  </div>
                </div>
              ) : shown.map((p) => (
                <PostCard key={p.id} api={PUBLIC_API} token={token} post={p} exam="Public" showRole
                  canUpload={me?.cloudinaryReady} onLike={likePost} onDelete={deletePost} onReplied={onReplied} />
              ))}
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </section>
  );
}
