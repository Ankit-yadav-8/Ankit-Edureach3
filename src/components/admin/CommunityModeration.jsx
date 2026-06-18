import { useCallback, useEffect, useState } from "react";
import {
  Pin, PinOff, Trash2, Megaphone, RefreshCw, Loader2, Heart,
  MessageCircle, Paperclip, ShieldAlert, Send,
} from "lucide-react";
import { API_BASE } from "../../auth/api.js";

const ORANGE = "#F15A38", NAVY = "#0d1b3e", MUTE = "#6b7280";

const TAG_COLOR = { doubt: "#ef4444", discussion: "#6366f1", trick: "#f59e0b", strategy: "#8b5cf6", notes: "#0ea5e9", resource: "#15a06e", announcement: ORANGE };

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24); if (days < 7) return `${days}d ago`;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export default function CommunityModeration({ token }) {
  const [batches, setBatches] = useState([]);
  const [plan, setPlan] = useState(""); // "" = all batches
  const [posts, setPosts] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [acting, setActing] = useState(""); // post id being acted on

  // announcement composer
  const [annPlan, setAnnPlan] = useState("");
  const [annText, setAnnText] = useState("");
  const [annBusy, setAnnBusy] = useState(false);
  const [annMsg, setAnnMsg] = useState("");

  const authHeaders = { "x-admin-token": token };

  const call = useCallback(async (path, opts = {}) => {
    const res = await fetch(API_BASE + path, {
      ...opts,
      headers: { "Content-Type": "application/json", ...authHeaders, ...(opts.headers || {}) },
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
    return data;
  }, [token]);

  const loadBatches = useCallback(() => {
    call("/api/community/admin/batches")
      .then((d) => setBatches(d.batches || []))
      .catch(() => {});
  }, [call]);

  const loadPosts = useCallback(() => {
    setBusy(true); setErr("");
    call(`/api/community/admin/posts${plan ? `?plan=${encodeURIComponent(plan)}` : ""}`)
      .then((d) => setPosts(d.posts || []))
      .catch((e) => setErr(e.message))
      .finally(() => setBusy(false));
  }, [call, plan]);

  useEffect(() => { loadBatches(); }, [loadBatches]);
  useEffect(() => { loadPosts(); }, [loadPosts]);

  const togglePin = async (p) => {
    setActing(p.id);
    try {
      const d = await call(`/api/community/admin/posts/${p.id}/pin`, { method: "POST", body: JSON.stringify({ pinned: !p.pinned }) });
      setPosts((arr) => arr.map((x) => x.id === p.id ? { ...x, pinned: d.pinned } : x));
    } catch (e) { setErr(e.message); } finally { setActing(""); }
  };

  const remove = async (p) => {
    if (!window.confirm("Delete this post for everyone in the batch?")) return;
    setActing(p.id);
    try {
      await call(`/api/community/admin/posts/${p.id}`, { method: "DELETE" });
      setPosts((arr) => arr.filter((x) => x.id !== p.id));
    } catch (e) { setErr(e.message); } finally { setActing(""); }
  };

  const postAnnouncement = async () => {
    if (!annPlan || !annText.trim()) { setAnnMsg("Pick a batch and write the announcement."); return; }
    setAnnBusy(true); setAnnMsg("");
    try {
      await call("/api/community/admin/announcement", { method: "POST", body: JSON.stringify({ plan: annPlan, text: annText.trim() }) });
      setAnnText(""); setAnnMsg("✓ Announcement posted & pinned.");
      loadBatches();
      if (!plan || plan === annPlan) loadPosts();
    } catch (e) { setAnnMsg(e.message); } finally { setAnnBusy(false); }
  };

  const btn = (bg, color, border) => ({
    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 9,
    border: border || "1.5px solid #e5e7eb", background: bg, color, cursor: "pointer", fontSize: 12.5, fontWeight: 700,
  });

  return (
    <div>
      {/* Announcement composer */}
      <div style={{ background: "#fff", border: `1px solid ${ORANGE}33`, borderRadius: 16, padding: "18px 20px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
          <span style={{ width: 36, height: 36, borderRadius: 10, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}><Megaphone size={18} color={ORANGE} /></span>
          <div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, color: NAVY, fontSize: 15 }}>Post a pinned announcement</div>
            <div style={{ fontSize: 12, color: MUTE }}>Shows as a highlighted post at the top of that batch's community.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
          <select value={annPlan} onChange={(e) => setAnnPlan(e.target.value)}
            style={{ height: 40, padding: "0 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, color: NAVY, fontWeight: 600, minWidth: 200 }}>
            <option value="">Select batch…</option>
            {batches.map((b) => <option key={b.plan} value={b.plan}>{b.batchLabel}</option>)}
          </select>
          <textarea value={annText} onChange={(e) => setAnnText(e.target.value)} rows={2} placeholder="Write your announcement…"
            style={{ flex: 1, minWidth: 240, padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13.5, resize: "vertical", fontFamily: "inherit" }} />
          <button onClick={postAnnouncement} disabled={annBusy}
            style={{ ...btn(`linear-gradient(135deg,${ORANGE},#F15A38)`, "#fff", "none"), height: 40, padding: "0 16px" }}>
            {annBusy ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Send size={14} />} Post & pin
          </button>
        </div>
        {annMsg && <div style={{ fontSize: 12.5, marginTop: 8, fontWeight: 600, color: annMsg.startsWith("✓") ? "#16a34a" : "#dc2626" }}>{annMsg}</div>}
      </div>

      {/* Filter + refresh */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <select value={plan} onChange={(e) => setPlan(e.target.value)}
          style={{ height: 38, padding: "0 12px", borderRadius: 9, border: "1.5px solid #e5e7eb", fontSize: 13, color: NAVY, fontWeight: 600 }}>
          <option value="">All batches</option>
          {batches.map((b) => <option key={b.plan} value={b.plan}>{b.batchLabel} ({b.posts})</option>)}
        </select>
        <button onClick={loadPosts} style={btn("#fff", ORANGE, `1.5px solid ${ORANGE}`)}>
          <RefreshCw size={13} style={busy ? { animation: "spin 1s linear infinite" } : undefined} /> Refresh
        </button>
        <span style={{ marginLeft: "auto", fontSize: 12.5, color: MUTE }}>{posts.length} post{posts.length === 1 ? "" : "s"}</span>
      </div>

      {err && <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#dc2626", fontSize: 13 }}>{err}</div>}

      {/* Posts */}
      {busy && posts.length === 0 ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: MUTE, padding: 24, justifyContent: "center" }}>
          <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Loading posts…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 20px", color: "#aaa", fontSize: 14, background: "#fff", border: "1px solid #eee", borderRadius: 16 }}>
          <ShieldAlert size={26} style={{ marginBottom: 8, opacity: .5 }} /><br />No community posts {plan ? "in this batch" : "yet"}.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {posts.map((p) => {
            const tc = TAG_COLOR[p.tag] || MUTE;
            return (
              <div key={p.id} style={{ background: "#fff", border: `1px solid ${p.pinned ? `${ORANGE}55` : "#eee"}`, borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                  <span style={{ fontWeight: 800, color: NAVY, fontSize: 14 }}>{p.authorName}</span>
                  {p.studentId && <span style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b", background: "#f1f5f9", padding: "1px 7px", borderRadius: 20 }}>{p.studentId}</span>}
                  <span style={{ fontSize: 11, fontWeight: 800, color: tc, background: `${tc}14`, border: `1px solid ${tc}30`, padding: "2px 8px", borderRadius: 50, textTransform: "capitalize" }}>{p.tag}</span>
                  <span style={{ fontSize: 11.5, color: "#64748b", background: "#f1f5f9", padding: "2px 9px", borderRadius: 50, fontWeight: 600 }}>{p.batchLabel}</span>
                  {p.pinned && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, color: ORANGE }}><Pin size={11} /> Highlighted</span>}
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>{timeAgo(p.createdAt)}</span>
                </div>

                {p.text && <div style={{ fontSize: 14, color: "#1a1a2e", lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{p.text}</div>}

                <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: MUTE }}><Heart size={13} /> {p.likeCount}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: MUTE }}><MessageCircle size={13} /> {p.replyCount}</span>
                  {p.media?.length > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: MUTE }}><Paperclip size={13} /> {p.media.length} {p.media.length === 1 ? "file" : "files"}</span>}
                  {p.subject && <span style={{ fontSize: 11.5, color: "#0ea5e9", fontWeight: 700 }}>#{p.subject}</span>}

                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button onClick={() => togglePin(p)} disabled={acting === p.id}
                      style={btn(p.pinned ? `${ORANGE}14` : "#fff", p.pinned ? ORANGE : MUTE, `1.5px solid ${p.pinned ? ORANGE : "#e5e7eb"}`)}>
                      {acting === p.id ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : (p.pinned ? <PinOff size={13} /> : <Pin size={13} />)}
                      {p.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button onClick={() => remove(p)} disabled={acting === p.id}
                      style={btn("#fff", "#dc2626", "1.5px solid #fecaca")}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
