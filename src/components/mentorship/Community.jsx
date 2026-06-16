import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Send, ImagePlus, Trash2, Users, Sparkles, Loader2, X,
  ShieldCheck, Lock, HelpCircle, MessagesSquare, BookOpen, Pin,
  RefreshCw, CornerDownRight, Hash, PlayCircle,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  API_BASE,
  apiCommunityMe, apiCommunityMembers, apiCommunityFeed, apiCommunityCreatePost,
  apiCommunityDeletePost, apiCommunityLikePost, apiCommunityReplies, apiCommunityReply,
  apiCommunityLikeReply,
} from "../../auth/api.js";
import { uploadToCloudinary, validateFile } from "../../utils/cloudinaryUpload.js";

// The backend this build talks to — shown on the "uploads not configured"
// banner so it's obvious WHICH server needs the CLOUDINARY_* env vars.
const API_HOST = (() => { try { return new URL(API_BASE).host; } catch { return API_BASE; } })();

/* ── palette (matches the dashboard) ─────────────────────────────── */
const ORANGE = "#F47B20", GOLD = "#f5a623", GREEN = "#15a06e";
const NAVY = "#0d1b3e", INK = "#1a1a2e", MUTE = "#5b6472", CYAN = "#0ea5e9";

const TAG_META = {
  doubt:        { label: "Doubt",        color: "#ef4444", icon: HelpCircle },
  discussion:   { label: "Discussion",   color: "#6366f1", icon: MessagesSquare },
  resource:     { label: "Resource",     color: GREEN,     icon: BookOpen },
  announcement: { label: "Announcement", color: ORANGE,    icon: Pin },
};
const POST_TAGS = ["doubt", "discussion", "resource"];

const SUBJECTS = {
  JEE: ["Physics", "Chemistry", "Maths"],
  NEET: ["Physics", "Chemistry", "Biology"],
  Foundation: ["Maths", "Science"],
};

const AVATAR_COLORS = ["#6366f1", "#ef4444", GREEN, "#8b5cf6", ORANGE, CYAN, "#ec4899", "#14b8a6"];

/* ── helpers ─────────────────────────────────────────────────────── */
function initials(name) {
  const p = String(name || "S").trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase() || "S";
}
function avatarColor(seed) {
  let h = 0;
  for (const c of String(seed || "x")) h = (h * 31 + c.charCodeAt(0)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ── avatar ──────────────────────────────────────────────────────── */
function Avatar({ name, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg,${avatarColor(name)},${avatarColor(name + "z")})`,
      color: "#fff", display: "grid", placeItems: "center",
      fontWeight: 800, fontSize: size * 0.4, fontFamily: "Sora",
    }}>{initials(name)}</div>
  );
}

/* ── media gallery (images grid + inline video) ──────────────────── */
function MediaGrid({ media }) {
  if (!media?.length) return null;
  const cols = media.length === 1 ? 1 : 2;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 6, marginTop: 10, borderRadius: 14, overflow: "hidden" }}>
      {media.map((m, i) => m.type === "video" ? (
        <video key={i} src={m.url} poster={m.poster} controls preload="metadata"
          style={{ width: "100%", maxHeight: 360, background: "#000", borderRadius: 10, gridColumn: media.length === 1 ? "auto" : "1 / -1" }} />
      ) : (
        <a key={i} href={m.url} target="_blank" rel="noreferrer" style={{ display: "block", lineHeight: 0 }}>
          <img src={m.url} alt="attachment" loading="lazy"
            style={{ width: "100%", height: media.length === 1 ? "auto" : 170, maxHeight: 420, objectFit: "cover", borderRadius: 10, cursor: "zoom-in", background: "#f1f5f9" }} />
        </a>
      ))}
    </div>
  );
}

/* ── like / reply pill button ────────────────────────────────────── */
function PillBtn({ active, color, onClick, children, title }) {
  return (
    <button onClick={onClick} title={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 50, cursor: "pointer",
        fontSize: 12.5, fontWeight: 700, fontFamily: "Sora", transition: "all .15s",
        border: `1.5px solid ${active ? color : "#e5e7eb"}`,
        background: active ? `${color}14` : "#fff", color: active ? color : MUTE,
      }}>{children}</button>
  );
}

/* ── shared composer (used for posts + replies) ──────────────────── */
function Composer({ token, exam, compact, onSubmit, placeholder, autoFocus, canUpload = true }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState("doubt");
  const [subject, setSubject] = useState("");
  const [atts, setAtts] = useState([]); // { id, name, status, progress, media, isVideo }
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef(null);
  const subjects = SUBJECTS[exam] || SUBJECTS.JEE;

  const uploading = atts.some((a) => a.status === "uploading");
  const ready = atts.filter((a) => a.status === "done").map((a) => a.media);
  const canPost = !busy && !uploading && (text.trim() || ready.length);

  const pickFiles = async (e) => {
    setErr("");
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    for (const file of files) {
      const v = validateFile(file);
      if (v) { setErr(v); continue; }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setAtts((a) => [...a, { id, name: file.name, status: "uploading", progress: 0, isVideo: file.type.startsWith("video/") }]);
      try {
        const media = await uploadToCloudinary(file, token, (p) =>
          setAtts((a) => a.map((x) => x.id === id ? { ...x, progress: p } : x)));
        setAtts((a) => a.map((x) => x.id === id ? { ...x, status: "done", media, progress: 100 } : x));
      } catch (ex) {
        setErr(ex.message || "Upload failed");
        setAtts((a) => a.filter((x) => x.id !== id));
      }
    }
  };

  const removeAtt = (id) => setAtts((a) => a.filter((x) => x.id !== id));

  const submit = async () => {
    if (!canPost) return;
    setBusy(true); setErr("");
    try {
      await onSubmit({ text: text.trim(), media: ready, tag, subject });
      setText(""); setAtts([]); setSubject(""); setTag("doubt");
    } catch (ex) {
      setErr(ex.message || "Could not post. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 16, padding: compact ? 12 : 16, boxShadow: compact ? "none" : "0 14px 36px -28px rgba(13,27,62,.4)" }}>
      <textarea
        value={text} onChange={(e) => setText(e.target.value)} autoFocus={autoFocus}
        placeholder={placeholder || "Ask a doubt, share a resource, or start a discussion…"}
        rows={compact ? 2 : 3}
        style={{ width: "100%", border: "none", outline: "none", resize: "vertical", fontSize: 14.5, color: INK, fontFamily: "inherit", lineHeight: 1.6, background: "transparent" }}
      />

      {!compact && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", margin: "6px 0 4px" }}>
          {POST_TAGS.map((t) => {
            const m = TAG_META[t]; const on = tag === t;
            return (
              <button key={t} onClick={() => setTag(t)}
                style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 50, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${on ? m.color : "#e5e7eb"}`, background: on ? m.color : "#fff", color: on ? "#fff" : MUTE }}>
                <m.icon size={13} /> {m.label}
              </button>
            );
          })}
          <span style={{ width: 1, background: "#eef2f7", margin: "0 2px" }} />
          {subjects.map((s) => {
            const on = subject === s;
            return (
              <button key={s} onClick={() => setSubject(on ? "" : s)}
                style={{ padding: "5px 11px", borderRadius: 50, cursor: "pointer", fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${on ? CYAN : "#e5e7eb"}`, background: on ? `${CYAN}14` : "#fff", color: on ? CYAN : MUTE }}>
                {s}
              </button>
            );
          })}
        </div>
      )}

      {/* attachment previews */}
      {atts.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
          {atts.map((a) => (
            <div key={a.id} style={{ position: "relative", width: 76, height: 76, borderRadius: 10, overflow: "hidden", border: "1px solid #e5e7eb", background: "#f1f5f9", display: "grid", placeItems: "center" }}>
              {a.status === "done" && !a.isVideo && <img src={a.media.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {a.status === "done" && a.isVideo && <PlayCircle size={26} color={NAVY} />}
              {a.status === "uploading" && (
                <div style={{ textAlign: "center" }}>
                  <Loader2 size={18} color={ORANGE} style={{ animation: "spin 1s linear infinite" }} />
                  <div style={{ fontSize: 10, color: MUTE, marginTop: 2, fontWeight: 700 }}>{a.progress}%</div>
                </div>
              )}
              <button onClick={() => removeAtt(a.id)} title="Remove"
                style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", border: "none", background: "rgba(13,27,62,.8)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
                <X size={11} />
              </button>
            </div>
          ))}
        </div>
      )}

      {err && <div style={{ fontSize: 12.5, color: "#dc2626", fontWeight: 600, margin: "2px 0 6px" }}>{err}</div>}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
        <button onClick={() => fileRef.current?.click()} disabled={!canUpload}
          title={canUpload ? "Attach photo or video" : "Media uploads aren't configured on the server yet"}
          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: NAVY, cursor: canUpload ? "pointer" : "not-allowed", opacity: canUpload ? 1 : .5, fontWeight: 700, fontSize: 13 }}>
          <ImagePlus size={16} color={ORANGE} /> Photo / Video
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple hidden onChange={pickFiles} />
        <button onClick={submit} disabled={!canPost}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 11, border: "none", cursor: canPost ? "pointer" : "not-allowed",
            background: canPost ? `linear-gradient(135deg,${ORANGE},${GOLD})` : "#e5e7eb", color: "#fff", fontFamily: "Sora", fontWeight: 800, fontSize: 13.5,
            boxShadow: canPost ? `0 10px 22px -10px ${ORANGE}` : "none" }}>
          {busy ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={15} />}
          {compact ? "Reply" : "Post"}
        </button>
      </div>
    </div>
  );
}

/* ── reply thread ────────────────────────────────────────────────── */
function ReplyThread({ token, post, exam, onReplied, canUpload }) {
  const [replies, setReplies] = useState(null);
  const [busy, setBusy] = useState(true);

  const load = useCallback(() => {
    apiCommunityReplies(token, post.id)
      .then((d) => setReplies(d.replies || []))
      .catch(() => setReplies([]))
      .finally(() => setBusy(false));
  }, [token, post.id]);

  useEffect(() => { load(); }, [load]);

  const addReply = async (payload) => {
    const d = await apiCommunityReply(token, post.id, payload);
    setReplies((r) => [...(r || []), d.reply]);
    onReplied?.(post.id, d.replyCount);
  };

  const toggleLike = (rid) => {
    setReplies((r) => r.map((x) => x.id === rid ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) } : x));
    apiCommunityLikeReply(token, rid).catch(() => load());
  };

  return (
    <div style={{ marginTop: 12, paddingLeft: 14, borderLeft: `2px solid ${CYAN}22` }}>
      {busy && <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTE, fontSize: 13, padding: "4px 0" }}><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading replies…</div>}
      {replies?.map((r) => (
        <div key={r.id} style={{ display: "flex", gap: 10, padding: "8px 0" }}>
          <Avatar name={r.authorName} size={30} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 13, color: NAVY, fontFamily: "Sora" }}>{r.authorName}</span>
              {r.isMine && <span style={{ fontSize: 10, fontWeight: 800, color: GREEN, background: `${GREEN}14`, padding: "1px 6px", borderRadius: 20 }}>You</span>}
              <span style={{ fontSize: 11.5, color: "#9ca3af" }}>· {timeAgo(r.createdAt)}</span>
            </div>
            {r.text && <div style={{ fontSize: 13.5, color: INK, lineHeight: 1.55, marginTop: 2, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{r.text}</div>}
            <MediaGrid media={r.media} />
            <button onClick={() => toggleLike(r.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, padding: "3px 9px", borderRadius: 50, border: "none", background: "transparent", cursor: "pointer", fontSize: 12, fontWeight: 700, color: r.likedByMe ? "#ef4444" : "#9ca3af" }}>
              <Heart size={13} fill={r.likedByMe ? "#ef4444" : "none"} /> {r.likeCount || ""}
            </button>
          </div>
        </div>
      ))}
      {!busy && replies?.length === 0 && (
        <div style={{ fontSize: 13, color: "#9ca3af", padding: "4px 0 8px" }}>No replies yet — be the first to help.</div>
      )}
      <div style={{ marginTop: 8 }}>
        <Composer token={token} exam={exam} compact canUpload={canUpload} placeholder="Write a reply…" onSubmit={addReply} />
      </div>
    </div>
  );
}

/* ── single post card ────────────────────────────────────────────── */
function PostCard({ token, post, exam, onLike, onDelete, onReplied, canUpload }) {
  const [open, setOpen] = useState(false);
  const tag = TAG_META[post.tag] || TAG_META.doubt;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}
      style={{ background: "#fff", border: `1px solid ${post.pinned ? `${ORANGE}55` : "#eef2f7"}`, borderRadius: 18,
        padding: 18, boxShadow: "0 14px 38px -30px rgba(13,27,62,.5)", position: "relative", overflow: "hidden" }}>
      {post.pinned && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${ORANGE},${GOLD})` }} />
      )}
      <div style={{ display: "flex", gap: 12 }}>
        <Avatar name={post.authorName} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: 14.5, color: NAVY, fontFamily: "Sora" }}>{post.authorName}</span>
            {post.isMine && <span style={{ fontSize: 10, fontWeight: 800, color: GREEN, background: `${GREEN}14`, padding: "1px 7px", borderRadius: 20 }}>You</span>}
            {post.studentId && <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#64748b", background: "#f1f5f9", padding: "1px 7px", borderRadius: 20 }}>{post.studentId}</span>}
            <span style={{ fontSize: 12, color: "#9ca3af" }}>· {timeAgo(post.createdAt)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: tag.color, background: `${tag.color}14`, border: `1px solid ${tag.color}30`, padding: "2px 8px", borderRadius: 50 }}>
              <tag.icon size={11} /> {tag.label}
            </span>
            {post.subject && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: CYAN, background: `${CYAN}10`, padding: "2px 8px", borderRadius: 50 }}><Hash size={10} />{post.subject}</span>}
            {post.pinned && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: ORANGE }}><Pin size={11} /> Highlighted</span>}
          </div>
        </div>
        {post.isMine && (
          <button onClick={() => onDelete(post.id)} title="Delete"
            style={{ border: "none", background: "transparent", color: "#cbd5e1", cursor: "pointer", padding: 4, height: "fit-content" }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {post.text && <div style={{ fontSize: 14.5, color: INK, lineHeight: 1.65, marginTop: 10, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{post.text}</div>}
      <MediaGrid media={post.media} />

      <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
        <PillBtn active={post.likedByMe} color="#ef4444" onClick={() => onLike(post.id)} title="Upvote">
          <Heart size={14} fill={post.likedByMe ? "#ef4444" : "none"} /> {post.likeCount || 0}
        </PillBtn>
        <PillBtn active={open} color={CYAN} onClick={() => setOpen((o) => !o)} title="Replies">
          <CornerDownRight size={14} /> {post.replyCount || 0} {post.replyCount === 1 ? "reply" : "replies"}
        </PillBtn>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <ReplyThread token={token} post={post} exam={exam} onReplied={onReplied} canUpload={canUpload} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── batchmates grid ─────────────────────────────────────────────── */
function MemberGrid({ token, batchLabel }) {
  const [data, setData] = useState(null);
  useEffect(() => { apiCommunityMembers(token).then(setData).catch(() => setData({ members: [], count: 0 })); }, [token]);
  if (!data) return <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTE, padding: 16 }}><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading batchmates…</div>;
  return (
    <div>
      <div style={{ fontSize: 13, color: MUTE, marginBottom: 12 }}>
        <strong style={{ color: NAVY }}>{data.count}</strong> student{data.count === 1 ? "" : "s"} in {batchLabel}.
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
        {data.members.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: "1px solid #eef2f7", borderRadius: 14, padding: "12px 14px" }}>
            <Avatar name={m.name} size={40} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name}</div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8" }}>{m.studentId || "—"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   COMMUNITY (main)
   ════════════════════════════════════════════════════════════════ */
export default function Community() {
  const { token } = useAuth();
  const [me, setMe] = useState(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all"); // all | highlights | members
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  // identity / batch
  useEffect(() => {
    if (!token) return;
    apiCommunityMe(token)
      .then((d) => mounted.current && setMe(d))
      .catch((e) => { if (mounted.current && e.status === 403) setLocked(true); })
      .finally(() => mounted.current && setLoading(false));
  }, [token]);

  const loadFeed = useCallback((which = tab, silent = false) => {
    if (which === "members") return;
    if (!silent) setRefreshing(true);
    apiCommunityFeed(token, which)
      .then((d) => { if (mounted.current) setPosts(d.posts || []); })
      .catch(() => {})
      .finally(() => mounted.current && setRefreshing(false));
  }, [token, tab]);

  // load + poll the feed (skip while on the members tab)
  useEffect(() => {
    if (!me || tab === "members") return;
    loadFeed(tab);
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") loadFeed(tab, true);
    }, 12000);
    const onFocus = () => loadFeed(tab, true);
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(iv); window.removeEventListener("focus", onFocus); };
  }, [me, tab, loadFeed]);

  const createPost = async (payload) => {
    const d = await apiCommunityCreatePost(token, payload);
    setPosts((p) => [d.post, ...p]);
  };
  const likePost = (id) => {
    setPosts((p) => p.map((x) => x.id === id ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) } : x));
    apiCommunityLikePost(token, id).catch(() => loadFeed(tab, true));
  };
  const deletePost = (id) => {
    if (!window.confirm("Delete this post?")) return;
    setPosts((p) => p.filter((x) => x.id !== id));
    apiCommunityDeletePost(token, id).catch(() => loadFeed(tab, true));
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
      <div style={{ background: "#fff", border: "1px solid #eef2f7", borderRadius: 20, padding: "34px 24px", textAlign: "center", boxShadow: "0 18px 44px -30px rgba(13,27,62,.4)" }}>
        <div style={{ width: 58, height: 58, borderRadius: 18, background: `${ORANGE}14`, display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
          <Lock size={26} color={ORANGE} />
        </div>
        <h3 style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: "1.25rem", margin: "0 0 6px" }}>Community is for mentorship students</h3>
        <p style={{ color: MUTE, fontSize: 14.5, maxWidth: 420, margin: "0 auto 16px", lineHeight: 1.6 }}>
          Join a mentorship batch to meet your batchmates and ask doubts with photos & videos — answered by peers and mentors.
        </p>
        <a href="/mentorship" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${ORANGE},${GOLD})`, color: "#fff", textDecoration: "none", padding: "11px 22px", borderRadius: 12, fontFamily: "Sora", fontWeight: 800, fontSize: 14 }}>
          Explore mentorship plans
        </a>
      </div>
    );
  }

  const TABS = [
    { id: "all", label: "Feed", icon: MessagesSquare },
    { id: "highlights", label: "Highlights", icon: Sparkles },
    { id: "members", label: "Batchmates", icon: Users },
  ];

  return (
    <div>
      {/* batch header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", background: `linear-gradient(135deg,${NAVY},#16224a)`, color: "#fff", borderRadius: 18, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Users size={22} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.1rem" }}>{me.batchLabel} · Community</div>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,.7)" }}>
            {me.batchmateCount} member{me.batchmateCount === 1 ? "" : "s"} · You are <span style={{ fontFamily: "monospace", color: GOLD }}>{me.studentId}</span>
          </div>
        </div>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 800, color: "#86efac", background: "rgba(34,197,94,.16)", border: "1px solid rgba(134,239,172,.4)", padding: "6px 13px", borderRadius: 50 }}>
          <motion.span animate={{ opacity: [1, .3, 1] }} transition={{ duration: 1.4, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "block" }} />
          LIVE
        </span>
      </div>

      {/* composer */}
      <div style={{ marginBottom: 16 }}>
        <Composer token={token} exam={me.exam} canUpload={me.cloudinaryReady} onSubmit={createPost} />
        {!me.cloudinaryReady && (
          <div style={{ fontSize: 12, color: "#b45309", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "8px 12px", marginTop: 8, lineHeight: 1.55 }}>
            Photo / video uploads aren't configured on this server
            (<code style={{ fontFamily: "monospace", background: "#fef3c7", padding: "1px 6px", borderRadius: 5, color: "#92400e" }}>{API_HOST}</code>) yet —
            set the <strong>CLOUDINARY_*</strong> env vars there and redeploy. Text posts work fine.
            <span style={{ display: "block", marginTop: 3, color: "#a16207" }}>
              Verify with <code style={{ fontFamily: "monospace" }}>{API_BASE}/api/community/health</code>
            </span>
          </div>
        )}
      </div>

      {/* tabs + refresh */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
        {tab !== "members" && (
          <button onClick={() => loadFeed(tab)} title="Refresh"
            style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 13px", borderRadius: 50, border: "1.5px solid #e5e7eb", background: "#fff", color: MUTE, cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
            <RefreshCw size={14} style={refreshing ? { animation: "spin 1s linear infinite" } : undefined} /> Refresh
          </button>
        )}
      </div>

      {/* content */}
      {tab === "members" ? (
        <MemberGrid token={token} batchLabel={me.batchLabel} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "34px 20px", background: "#fff", border: "1px dashed #e5e7eb", borderRadius: 18, color: MUTE }}>
              <ShieldCheck size={28} color="#cbd5e1" style={{ marginBottom: 8 }} />
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>
                {tab === "highlights" ? "No highlights yet" : "No posts yet"}
              </div>
              <div style={{ fontSize: 13.5 }}>
                {tab === "highlights" ? "Posts with likes & replies will show up here." : "Be the first to ask a doubt in your batch."}
              </div>
            </div>
          ) : posts.map((p) => (
            <PostCard key={p.id} token={token} post={p} exam={me.exam} canUpload={me.cloudinaryReady} onLike={likePost} onDelete={deletePost} onReplied={onReplied} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
