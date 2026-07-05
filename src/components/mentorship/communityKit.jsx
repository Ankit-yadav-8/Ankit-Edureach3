// ─────────────────────────────────────────────────────────────────────────────
// Community kit — the shared presentational + data pieces used by BOTH the
// per-batch mentorship community and the open public community. The data-bound
// pieces (Composer, ReplyThread, PostCard) take an `api` object so the same UI
// can talk to either backend (/api/community/* or /api/public-community/*).
// ─────────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Send, ImagePlus, Loader2, X, MessagesSquare, BookOpen, Pin,
  HelpCircle, CornerDownRight, Hash, PlayCircle, GraduationCap, BadgeCheck,
  Lightbulb, Target, FileText,
} from "lucide-react";
import { uploadToCloudinary, validateFile, compressImage, getUploadSignature } from "../../utils/cloudinaryUpload.js";

/* ── palette ──────────────────────────────────────────────────────── */
export const ORANGE = "#FF693D", GOLD = "#FF693D", GREEN = "#15a06e";
export const NAVY = "#0d1b3e", INK = "#1a1a2e", MUTE = "#5b6472", CYAN = "#0ea5e9";

export const TAG_META = {
  doubt:        { label: "Doubt",        color: "#ef4444", icon: HelpCircle },
  discussion:   { label: "Discussion",   color: "#6366f1", icon: MessagesSquare },
  trick:        { label: "Trick",        color: "#f59e0b", icon: Lightbulb },
  strategy:     { label: "Strategy",     color: "#8b5cf6", icon: Target },
  notes:        { label: "Notes",        color: CYAN,      icon: FileText },
  resource:     { label: "Resource",     color: GREEN,     icon: BookOpen },
  announcement: { label: "Announcement", color: ORANGE,    icon: Pin },
};
// Tags a member can pick when writing a post. "tricks / strategies / notes"
// turn the community into a place to share exam wisdom, not just ask doubts.
export const POST_TAGS = ["doubt", "discussion", "trick", "strategy", "notes", "resource"];

export const SUBJECTS = {
  JEE: ["Physics", "Chemistry", "Maths"],
  NEET: ["Physics", "Chemistry", "Biology"],
  Foundation: ["Maths", "Science"],
  Public: ["Physics", "Chemistry", "Maths", "Biology"],
};

const AVATAR_COLORS = ["#6366f1", "#ef4444", GREEN, "#8b5cf6", ORANGE, CYAN, "#ec4899", "#14b8a6"];

/* ── helpers ──────────────────────────────────────────────────────── */
export function initials(name) {
  const p = String(name || "S").trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase() || "S";
}
export function avatarColor(seed) {
  let h = 0;
  for (const c of String(seed || "x")) h = (h * 31 + c.charCodeAt(0)) % 997;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
export function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 45) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
export const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ── author role badge (public community) ─────────────────────────── */
const ROLE_META = {
  student: { label: "Mentorship student", color: GREEN,   icon: GraduationCap },
  mentor:  { label: "Mentor",             color: "#8b5cf6", icon: BadgeCheck },
  team:    { label: "CP Team",            color: ORANGE,  icon: BadgeCheck },
};
export function RoleBadge({ role }) {
  const m = ROLE_META[role];
  if (!m) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 10, fontWeight: 800, color: m.color, background: `${m.color}14`, border: `1px solid ${m.color}33`, padding: "1px 7px", borderRadius: 20 }}>
      <m.icon size={10} /> {m.label}
    </span>
  );
}

/* ── avatar ───────────────────────────────────────────────────────── */
export function Avatar({ name, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flexShrink: 0,
      background: `linear-gradient(135deg,${avatarColor(name)},${avatarColor(name + "z")})`,
      color: "#fff", display: "grid", placeItems: "center",
      fontWeight: 800, fontSize: size * 0.4, fontFamily: "Sora",
    }}>{initials(name)}</div>
  );
}

/* ── media gallery (images grid + inline video) ───────────────────── */
export function MediaGrid({ media }) {
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

/* ── like / reply pill button ─────────────────────────────────────── */
export function PillBtn({ active, color, onClick, children, title }) {
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

/* ── shared composer (used for posts + replies) ───────────────────── */
export function Composer({ token, exam, compact, onSubmit, placeholder, autoFocus, canUpload = true, signUpload, plan, initialTag }) {
  const [text, setText] = useState("");
  const [tag, setTag] = useState(initialTag || "doubt");
  const [subject, setSubject] = useState("");

  // When the user switches the active category (e.g. clicks "Tricks"), reflect
  // it in the composer so the post they write lands in that category.
  useEffect(() => { if (initialTag) setTag(initialTag); }, [initialTag]);
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
    if (!files.length) return;

    const jobs = [];
    for (const file of files) {
      const v = validateFile(file);
      if (v) { setErr(v); continue; }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setAtts((a) => [...a, { id, name: file.name, status: "uploading", progress: 0, isVideo: file.type.startsWith("video/") }]);
      jobs.push({ id, file });
    }
    if (!jobs.length) return;

    let sig;
    try {
      sig = await getUploadSignature(token, signUpload, plan);
    } catch (ex) {
      setErr(ex.message || "Upload failed");
      setAtts((a) => a.filter((x) => !jobs.some((j) => j.id === x.id)));
      return;
    }

    await Promise.all(jobs.map(async ({ id, file }) => {
      try {
        const prepared = await compressImage(file);
        const media = await uploadToCloudinary(prepared, sig, (p) =>
          setAtts((a) => a.map((x) => x.id === id ? { ...x, progress: p } : x)));
        setAtts((a) => a.map((x) => x.id === id ? { ...x, status: "done", media, progress: 100 } : x));
      } catch (ex) {
        setErr(ex.message || "Upload failed");
        setAtts((a) => a.filter((x) => x.id !== id));
      }
    }));
  };

  const removeAtt = (id) => setAtts((a) => a.filter((x) => x.id !== id));

  const submit = async () => {
    if (!canPost) return;
    setBusy(true); setErr("");
    try {
      await onSubmit({ text: text.trim(), media: ready, tag, subject });
      setText(""); setAtts([]); setSubject(""); setTag(initialTag || "doubt");
    } catch (ex) {
      setErr(ex.message || "Could not post. Try again.");
    } finally { setBusy(false); }
  };

  return (
    <div style={{ background: "var(--page-bg)", border: "1px solid #eef2f7", borderRadius: 16, padding: compact ? 12 : 16, boxShadow: compact ? "none" : "0 14px 36px -28px rgba(13,27,62,.4)" }}>
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
          style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "var(--page-bg)", color: NAVY, cursor: canUpload ? "pointer" : "not-allowed", opacity: canUpload ? 1 : .5, fontWeight: 700, fontSize: 13 }}>
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

/* ── reply thread ─────────────────────────────────────────────────── */
export function ReplyThread({ api, token, post, exam, onReplied, canUpload, showRole }) {
  const [replies, setReplies] = useState(null);
  const [busy, setBusy] = useState(true);

  const load = useCallback(() => {
    api.replies(token, post.id)
      .then((d) => setReplies(d.replies || []))
      .catch(() => setReplies([]))
      .finally(() => setBusy(false));
  }, [api, token, post.id]);

  useEffect(() => { load(); }, [load]);

  const addReply = async (payload) => {
    const d = await api.reply(token, post.id, payload);
    setReplies((r) => [...(r || []), d.reply]);
    onReplied?.(post.id, d.replyCount);
  };

  const toggleLike = (rid) => {
    setReplies((r) => r.map((x) => x.id === rid ? { ...x, likedByMe: !x.likedByMe, likeCount: x.likeCount + (x.likedByMe ? -1 : 1) } : x));
    api.likeReply(token, rid).catch(() => load());
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
              {showRole && <RoleBadge role={r.role} />}
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
        <Composer token={token} exam={exam} compact canUpload={canUpload} signUpload={api.signUpload} plan={api.plan} placeholder="Write a reply…" onSubmit={addReply} />
      </div>
    </div>
  );
}

/* ── single post card ─────────────────────────────────────────────── */
export function PostCard({ api, token, post, exam, onLike, onDelete, onReplied, canUpload, showRole }) {
  const [open, setOpen] = useState(false);
  const tag = TAG_META[post.tag] || TAG_META.doubt;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }}
      style={{ background: "var(--page-bg)", border: `1px solid ${post.pinned ? `${ORANGE}55` : "#eef2f7"}`, borderRadius: 18,
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
            {showRole && <RoleBadge role={post.role} />}
            {post.studentId && <span style={{ fontSize: 10.5, fontFamily: "monospace", color: "#64748b", background: "#f1f5f9", padding: "1px 7px", borderRadius: 20 }}>{post.studentId}</span>}
            <span style={{ fontSize: 12, color: "#9ca3af" }}>· {timeAgo(post.createdAt)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
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
            <X size={16} />
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
            <ReplyThread api={api} token={token} post={post} exam={exam} onReplied={onReplied} canUpload={canUpload} showRole={showRole} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
