import { useState, useEffect, useCallback, Fragment } from "react";
import {
  Users, Download, RefreshCw, ShieldCheck, LogOut, KeyRound, Mail, Phone, Calendar, Clock,
  ChevronRight, ChevronDown,
} from "lucide-react";
import { API_BASE } from "../auth/api.js";

const KEY_STORAGE = "edureach:adminKey";
const ORANGE = "#F47B20";

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const avatar = (name, phone) => (name || phone || "U").charAt(0).toUpperCase();

const avatarColor = (str) => {
  const colors = ["#6366f1","#f59e0b","#10b981","#3b82f6","#ec4899","#8b5cf6","#14b8a6","#f97316"];
  let hash = 0;
  for (let i = 0; i < (str || "").length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export default function Admin() {
  const [storedKey, setStoredKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || "");
  const [entering, setEntering] = useState("");
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());

  const toggleRow = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const fetchUsers = useCallback(async (k) => {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/users", { headers: { "x-admin-key": k } });
      if (res.status === 401 || res.status === 403) throw new Error("Invalid admin key");
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total ?? (data.users?.length || 0));
      setAuthed(true);
      sessionStorage.setItem(KEY_STORAGE, k);
      setStoredKey(k);
    } catch (e) {
      setErr(e.message);
      setAuthed(false);
    } finally { setBusy(false); }
  }, []);

  useEffect(() => { if (storedKey) fetchUsers(storedKey); /* eslint-disable-next-line */ }, []);

  async function downloadCsv() {
    setErr("");
    try {
      const res = await fetch(API_BASE + "/api/users/export.csv", { headers: { "x-admin-key": storedKey } });
      if (!res.ok) throw new Error("CSV download failed (" + res.status + ")");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "collegeparichay-users.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message); }
  }

  function logout() {
    sessionStorage.removeItem(KEY_STORAGE);
    setStoredKey(""); setEntering(""); setAuthed(false);
    setUsers([]); setTotal(0); setErr("");
  }

  const filtered = users.filter((u) =>
    !search ||
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || "").includes(search)
  );

  // ── KEY-GATE ──────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "60px 16px", background: "#f8f7f5" }}>
        <div style={{ maxWidth: 440, width: "100%", background: "#fff", borderRadius: 20, padding: "40px 36px", boxShadow: "0 4px 32px rgba(0,0,0,0.08)", border: "1px solid #eee" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 28 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: `${ORANGE}15`, display: "grid", placeItems: "center", marginBottom: 16 }}>
              <ShieldCheck size={30} color={ORANGE} />
            </div>
            <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: "#0d1b3e", fontSize: "1.6rem", margin: 0 }}>Admin Access</h2>
            <p style={{ color: "#888", fontSize: 14, marginTop: 8 }}>Enter your secret key to view signups</p>
          </div>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <KeyRound size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#bbb", pointerEvents: "none" }} />
            <input
              type="password" placeholder="Enter ADMIN_KEY"
              value={entering} onChange={(e) => setEntering(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && entering) fetchUsers(entering); }}
              autoFocus
              style={{
                width: "100%", paddingLeft: 44, paddingRight: 16, height: 50,
                borderRadius: 12, border: "1.5px solid #e5e7eb", fontSize: 15,
                outline: "none", boxSizing: "border-box", fontFamily: "inherit",
                transition: "border .2s",
              }}
            />
          </div>
          <button
            disabled={busy || !entering}
            onClick={() => fetchUsers(entering)}
            style={{
              background: ORANGE, color: "#fff", width: "100%", border: "none",
              height: 50, borderRadius: 12, fontWeight: 700, fontSize: 16,
              cursor: busy || !entering ? "not-allowed" : "pointer",
              opacity: busy || !entering ? 0.6 : 1, transition: "opacity .2s",
            }}
          >
            {busy ? "Verifying…" : "🔓 Unlock Dashboard"}
          </button>
          {err && (
            <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", marginTop: 14, color: "#dc2626", fontSize: 13, textAlign: "center" }}>
              {err}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", padding: "32px 0 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}>
                <ShieldCheck size={18} color={ORANGE} />
              </div>
              <h1 style={{ fontFamily: "Sora", fontWeight: 800, color: "#0d1b3e", fontSize: "1.5rem", margin: 0 }}>
                Admin Dashboard
              </h1>
            </div>
            <p style={{ color: "#888", fontSize: 13, margin: 0, paddingLeft: 46 }}>
              College Parichay · Live signups from MongoDB Atlas
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => fetchUsers(storedKey)} disabled={busy}
              style={{ background: "#fff", color: ORANGE, border: `1.5px solid ${ORANGE}`, height: 40, padding: "0 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <RefreshCw size={14} style={{ animation: busy ? "spin 1s linear infinite" : "none" }} />
              {busy ? "Refreshing…" : "Refresh"}
            </button>
            <button onClick={downloadCsv}
              style={{ background: ORANGE, color: "#fff", border: "none", height: 40, padding: "0 16px", borderRadius: 10, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <Download size={14} /> Export CSV
            </button>
            <button onClick={logout}
              style={{ background: "#fff", color: "#888", border: "1.5px solid #e5e7eb", height: 40, padding: "0 14px", borderRadius: 10, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          <div style={{ background: "#0d1b3e", borderRadius: 16, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${ORANGE}33`, display: "grid", placeItems: "center" }}>
              <Users size={22} color={ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>{total}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", marginTop: 4 }}>Total signups</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #eee" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
              <Calendar size={22} color="#16a34a" />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                {users.filter(u => {
                  const d = new Date(u.createdAt);
                  const now = new Date();
                  return d.toDateString() === now.toDateString();
                }).length}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Joined today</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #eee" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff7ed", display: "grid", placeItems: "center" }}>
              <Clock size={22} color={ORANGE} />
            </div>
            <div>
              <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                {users.filter(u => {
                  const d = new Date(u.lastLogin);
                  const now = new Date();
                  return (now - d) < 24 * 60 * 60 * 1000;
                }).length}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Active today</div>
            </div>
          </div>
        </div>

        {err && (
          <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#dc2626", fontSize: 13 }}>
            {err}
          </div>
        )}

        {/* Search + Table */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>

          {/* Search bar */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: "#0d1b3e", fontSize: 15 }}>
              All Users
              <span style={{ marginLeft: 8, background: "#f3f4f6", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#666", fontWeight: 600 }}>
                {filtered.length}
              </span>
            </span>
            <input
              placeholder="Search name, email or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 38, padding: "0 14px", borderRadius: 10, border: "1.5px solid #e5e7eb",
                fontSize: 13, outline: "none", minWidth: 240, fontFamily: "inherit",
              }}
            />
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
              {search ? "No users match your search." : "No signups yet."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 1100, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#fafafa" }}>
                    {["#", "", "User", "Email", "Phone", "Coaching", "JEE Mains", "JEE Adv.", "Joined", "Last Login"].map((h, hi) => (
                      <th key={hi} style={{
                        padding: "12px 20px", textAlign: "left", fontSize: 11,
                        fontWeight: 700, color: "#999", letterSpacing: ".06em",
                        textTransform: "uppercase", borderBottom: "1px solid #f0f0f0",
                        whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => {
                    const isOpen = expanded.has(u._id);
                    return (
                    <Fragment key={u._id}>
                    <tr style={{ borderBottom: isOpen ? "none" : "1px solid #f8f8f8", transition: "background .15s", cursor: "pointer", background: isOpen ? "#fafafa" : "transparent" }}
                      onClick={() => toggleRow(u._id)}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = isOpen ? "#fafafa" : "transparent"}
                    >
                      <td style={{ padding: "14px 20px", fontSize: 12, color: "#ccc", fontFamily: "monospace", width: 40 }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "14px 8px", width: 24, color: "#bbb" }}>
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: avatarColor(u.name || u.phone),
                            color: "#fff", display: "grid", placeItems: "center",
                            fontSize: 13, fontWeight: 800,
                          }}>
                            {avatar(u.name, u.phone)}
                          </div>
                          <span style={{ fontWeight: 600, color: "#0d1b3e", fontSize: 14 }}>
                            {u.name || "—"}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                          <Mail size={13} color="#bbb" />
                          {u.email || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 13 }}>
                          <Phone size={13} color="#bbb" />
                          {u.phone || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555" }}>
                        {u.coaching || <span style={{ color: "#ddd" }}>—</span>}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555", fontWeight: 600 }}>
                        {u.jeeMainsRank ? u.jeeMainsRank.toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#555", fontWeight: 600 }}>
                        {u.jeeAdvancedRank ? u.jeeAdvancedRank.toLocaleString() : "—"}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 12.5, color: "#888", whiteSpace: "nowrap" }}>
                        {fmtDate(u.createdAt)}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          fontSize: 12, color: "#555",
                          background: "#f3f4f6", borderRadius: 6,
                          padding: "4px 8px", whiteSpace: "nowrap",
                        }}>
                          {fmtDate(u.lastLogin)}
                        </span>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr style={{ borderBottom: "1px solid #f0f0f0", background: "#fafafa" }}>
                        <td colSpan={10} style={{ padding: "0 20px 18px 52px" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 8 }}>
                            Full document (MongoDB Atlas)
                          </div>
                          <pre style={{
                            margin: 0, padding: "14px 16px", background: "#0d1b3e", color: "#cdd6f4",
                            borderRadius: 10, fontSize: 12.5, lineHeight: 1.6, overflowX: "auto",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}>
                            {JSON.stringify(u, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                    </Fragment>
                  );})}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}