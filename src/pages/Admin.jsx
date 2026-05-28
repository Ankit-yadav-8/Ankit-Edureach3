import { useState, useEffect, useCallback } from "react";
import {
  Users, Download, RefreshCw, ShieldCheck, LogOut, KeyRound,
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

export default function Admin() {
  const [storedKey, setStoredKey] = useState(() => sessionStorage.getItem(KEY_STORAGE) || "");
  const [entering, setEntering] = useState("");
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

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
      a.href = url; a.download = "edureach-users.csv";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setErr(e.message); }
  }

  function logout() {
    sessionStorage.removeItem(KEY_STORAGE);
    setStoredKey(""); setEntering(""); setAuthed(false);
    setUsers([]); setTotal(0); setErr("");
  }

  // ── KEY-GATE SCREEN ─────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="page" style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: "60px 16px" }}>
        <div className="card" style={{ maxWidth: 420, width: "100%", padding: "32px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 22 }}>
            <div style={{ width: 54, height: 54, borderRadius: 16, background: `${ORANGE}15`, display: "grid", placeItems: "center", marginBottom: 12 }}>
              <ShieldCheck size={26} color={ORANGE} />
            </div>
            <h2 style={{ fontFamily: "Sora", fontWeight: 800, color: "var(--navy)", fontSize: "1.4rem" }}>Admin access</h2>
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 5 }}>Enter your ADMIN_KEY to view signups.</p>
          </div>
          <div style={{ position: "relative", marginBottom: 14 }}>
            <KeyRound size={17} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9aa0aa", pointerEvents: "none" }} />
            <input
              className="input" type="password" placeholder="ADMIN_KEY"
              value={entering} onChange={(e) => setEntering(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && entering) fetchUsers(entering); }}
              style={{ width: "100%", paddingLeft: 42 }} autoFocus
            />
          </div>
          <button
            disabled={busy || !entering}
            onClick={() => fetchUsers(entering)}
            style={{
              background: ORANGE, color: "#fff", width: "100%", border: "none",
              height: 46, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: "pointer",
              opacity: busy || !entering ? 0.6 : 1,
            }}
          >
            {busy ? "Checking…" : "Unlock"}
          </button>
          {err && <p style={{ color: "#e5484d", fontSize: 12.5, marginTop: 12, textAlign: "center" }}>{err}</p>}
          <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 16 }}>
            Set the value in <code>server/.env</code> as <code>ADMIN_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ───────────────────────────────────────────────────
  return (
    <div className="page" style={{ padding: "32px 0 60px" }}>
      <div className="container">

        {/* header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: "Sora", fontWeight: 800, color: "var(--navy)", fontSize: "1.6rem" }}>EduReach Admin</h1>
            <p style={{ color: "var(--muted)", fontSize: 13.5, marginTop: 4 }}>Live signups · pulled from your MongoDB Atlas DB</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => fetchUsers(storedKey)} disabled={busy}
              style={{ background: "#fff", color: ORANGE, border: `1.6px solid ${ORANGE}`, height: 42, padding: "0 18px", borderRadius: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <RefreshCw size={15} /> {busy ? "Refreshing…" : "Refresh"}
            </button>
            <button onClick={downloadCsv}
              style={{ background: ORANGE, color: "#fff", border: "none", height: 42, padding: "0 18px", borderRadius: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <Download size={15} /> Download CSV
            </button>
            <button onClick={logout} title="Forget admin key"
              style={{ background: "#f4f5f7", color: "var(--muted)", border: "none", height: 42, padding: "0 14px", borderRadius: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>

        {/* count card */}
        <div style={{ background: "var(--navy)", borderRadius: 16, padding: "22px 24px", color: "#fff", marginBottom: 24, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${ORANGE}33`, display: "grid", placeItems: "center" }}>
            <Users size={26} color={ORANGE} />
          </div>
          <div>
            <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>{total.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.65)", marginTop: 4 }}>Total signups</div>
          </div>
        </div>

        {err && (
          <div style={{ background: "rgba(229,72,77,.08)", border: "1px solid rgba(229,72,77,.25)", color: "#c1272d", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, marginBottom: 16 }}>
            {err}
          </div>
        )}

        {/* table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {users.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
              No signups yet.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", minWidth: 860, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--sky)" }}>
                    {["#", "Name", "Email", "Phone", "Joined", "Last login"].map((h) => (
                      <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "var(--navy)", letterSpacing: ".02em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderTop: "1px solid #eef0f3" }}>
                      <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--muted)", fontFamily: "monospace" }}>
                        {i + 1}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13.5, color: "var(--navy)", fontWeight: 600 }}>
                        {u.name || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--muted)" }}>
                        {u.email || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "var(--muted)" }}>
                        {u.phone || "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--muted)" }}>
                        {fmtDate(u.createdAt)}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 12.5, color: "var(--muted)" }}>
                        {fmtDate(u.lastLogin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}