import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Loader2, ShieldCheck, Lock, MessagesSquare,
  RefreshCw, ArrowLeftRight, Globe2, Bot,
} from "lucide-react";
import AiDoubtSolver from "./AiDoubtSolver.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  API_BASE,
  apiCommunityMe, apiCommunityFeed, apiCommunityCreatePost,
  apiCommunityDeletePost, apiCommunityLikePost, apiCommunityReplies, apiCommunityReply,
  apiCommunityLikeReply, apiCommunitySignUpload,
} from "../../auth/api.js";
import {
  ORANGE, GOLD, NAVY, MUTE, CYAN,
  SUBJECTS, Composer, PostCard,
} from "./communityKit.jsx";

const API_HOST = (() => { try { return new URL(API_BASE).host; } catch { return API_BASE; } })();

/* ════════════════════════════════════════════════════════════════
   BATCH COMMUNITY (main)
   `plan` pins the room to one of the student's batches; `onSwitchBatch`
   lets the dashboard re-point when they belong to more than one.
   ════════════════════════════════════════════════════════════════ */
export default function Community({ plan, onSwitchBatch }) {
  const { token } = useAuth();
  const [me, setMe] = useState(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | ai
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  // Bind every data call to the resolved plan so the kit's PostCard/ReplyThread
  // always talk to the SAME batch the header shows.
  const api = useMemo(() => ({
    plan,
    replies: (t, id) => apiCommunityReplies(t, id, plan),
    reply: (t, id, b) => apiCommunityReply(t, id, b, plan),
    likeReply: (t, id) => apiCommunityLikeReply(t, id, plan),
    signUpload: apiCommunitySignUpload,
  }), [plan]);

  // identity / batch — reloads whenever the selected plan changes
  useEffect(() => {
    if (!token) return;
    setLoading(true); setLocked(false); setMe(null);
    apiCommunityMe(token, plan)
      .then((d) => mounted.current && setMe(d))
      .catch((e) => { if (mounted.current && e.status === 403) setLocked(true); })
      .finally(() => mounted.current && setLoading(false));
  }, [token, plan]);

  const loadFeed = useCallback((which = tab, silent = false) => {
    if (which === "ai") return;
    if (!silent) setRefreshing(true);
    apiCommunityFeed(token, which, plan)
      .then((d) => { if (mounted.current) setPosts(d.posts || []); })
      .catch(() => {})
      .finally(() => mounted.current && setRefreshing(false));
  }, [token, plan, tab]);

  // load + poll the feed (skip while on the AI solver tab)
  useEffect(() => {
    if (!me || tab === "ai") return;
    loadFeed(tab);
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") loadFeed(tab, true);
    }, 12000);
    const onFocus = () => loadFeed(tab, true);
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [me, tab, loadFeed]);

  const createPost = async (payload) => {
    const d = await apiCommunityCreatePost(token, payload, plan);
    setPosts((p) => [d.post, ...p]);
  };
  const likePost = (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) } : x));
    apiCommunityLikePost(token, id, plan).catch(() => loadFeed(tab, true));
  };
  const deletePost = (id) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((p) => p.filter((x) => x.id !== id));
    apiCommunityDeletePost(token, id, plan).catch(() => loadFeed(tab, true));
  };
  const onReplied = (postId, count) => setPosts((p) => p.map((x) => x.id === postId ? { ...x, replyCount: count } : x));

  /* ── states ── */
  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", gap: 10, color: MUTE, padding: 30, justifyContent: "center" }}>
      <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Loading your batch community…
    </div>;
  }

  if (locked || !me) {
    return (
      <div style={{ background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 20, padding: "34px 24px", textAlign: "center", boxShadow: "0 18px 44px -30px rgba(13,27,62,.4)" }}>
        <div style={{ width: 58, height: 58, borderRadius: 18, background: `${ORANGE}14`, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
          <Lock size={26} color={ORANGE} />
        </div>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.25rem", margin: "0 0 6px" }}>Community is for mentorship students</h3>
        <p style={{ color: MUTE, fontSize: 14.5, maxWidth: 420, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Join a mentorship batch to meet your batchmates and ask doubts with photos & videos — answered by peers and mentors.
          Everyone is welcome in the open public community meanwhile.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/mentorship" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", textDecoration: "none", padding: "11px 22px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14 }}>
            Explore mentorship plans
          </Link>
          <Link to="/community" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--page-bg)", border: `1.5px solid ${CYAN}`, color: CYAN, textDecoration: "none", padding: "11px 22px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14 }}>
            <Globe2 size={16} /> Public community
          </Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: "all", label: "Feed", icon: MessagesSquare },
    { id: "ai", label: "AI Solver", icon: Bot },
  ];
  const subjects = SUBJECTS[me.exam] || SUBJECTS.JEE;
  const otherBatches = (me.allBatches || []).filter((b) => b.plan !== me.plan);

  return (
    <div>
      {/* batch header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: `linear-gradient(135deg,${ORANGE},#E0421F)`, color: "#fff", borderRadius: 18, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,.18)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Users size={22} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem" }}>{me.batchLabel} · Community</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.85)" }}>
            {me.batchmateCount} member{me.batchmateCount === 1 ? "" : "s"} · You are <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#fff" }}>{me.studentId}</span>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,.16)", border: "1px solid rgba(134,239,172,.4)", padding: "6px 13px", borderRadius: 50 }}>
          <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "block" }} />
          LIVE
        </span>
      </div>

      {/* batch switcher — only when the student belongs to more than one batch */}
      {otherBatches.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 14, background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 14, padding: "10px 14px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, color: NAVY }}>
            <ArrowLeftRight size={15} color={ORANGE} /> Your batches
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 800, color: "#fff", background: ORANGE, padding: "5px 12px", borderRadius: 50 }}>
            {me.batchLabel}
          </span>
          {otherBatches.map((b) => (
            <button key={b.plan} onClick={() => onSwitchBatch?.(b.plan)}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: NAVY, background: "var(--page-bg)", border: "1.5px solid #e5e7eb", padding: "5px 12px", borderRadius: 50, cursor: onSwitchBatch ? "pointer" : "default" }}>
              {b.batchLabel}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      <div style={{ marginBottom: 16 }}>
        <Composer token={token} exam={me.exam} simple canUpload={me.cloudinaryReady} signUpload={api.signUpload} plan={plan} onSubmit={createPost} />
        {!me.cloudinaryReady && (
          <div style={{ fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginTop: 8, lineHeight: 1.55 }}>
            Photo / video uploads aren't configured on this server
            (<code style={{ fontFamily: "monospace", background: "#fef3c7", padding: "1px 6px", borderRadius: 5, color: "#92400e" }}>{API_HOST}</code>) yet —
            set the <strong>CLOUDINARY_*</strong> env vars there and redeploy. Text posts work fine.
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
                border: `1.5px solid ${on ? ORANGE : "#e5e7eb"}`, background: on ? ORANGE : "#fff", color: on ? "#fff" : NAVY, boxShadow: on ? `0 8px 18px -8px ${ORANGE}` : "none" }}>
              <t.icon size={15} color={on ? "#fff" : ORANGE} /> {t.label}
            </button>
          );
        })}
        {tab !== "ai" && (
          <button onClick={() => loadFeed(tab)} title="Refresh"
            style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 50, border: "1.5px solid #e5e7eb", background: "var(--page-bg)", color: MUTE, cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
            <RefreshCw size={14} style={refreshing ? { animation: "spin 1s linear infinite" } : undefined} /> Refresh
          </button>
        )}
      </div>

      {/* content */}
      {tab === "ai" ? (
        <AiDoubtSolver token={token} exam={me.exam} subjects={subjects} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "34px 20px", background: "var(--page-bg)", border: "1px dashed #e5e7eb", borderRadius: 18, color: MUTE }}>
              <ShieldCheck size={28} color="#cbd5e1" style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>No posts yet</div>
              <div style={{ fontSize: 13.5 }}>Be the first to ask a doubt in your batch.</div>
            </div>
          ) : posts.map((p) => (
            <PostCard key={p.id} api={api} token={token} post={p} exam={me.exam} accent={ORANGE} canUpload={me.cloudinaryReady} onLike={likePost} onDelete={deletePost} onReplied={onReplied} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
