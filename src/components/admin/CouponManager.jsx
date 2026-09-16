import { useState, useEffect } from "react";
import { Plus, Tag, Trash2, CheckCircle2, Loader2, Sparkles, Globe, CreditCard } from "lucide-react";
import { API_BASE } from "../../auth/api.js";

const ORANGE = "#FF693D";

// Matches plan enum prefixes logic for badges
const getPlanFamily = (plan) => {
  if (plan.includes("neet")) return "NEET";
  if (plan.includes("jee")) return "JEE";
  if (plan.includes("foundation")) return "Foundation";
  return "Mentorship";
};

export default function CouponManager({ adminKey }) {
  const [coupons, setCoupons] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [adding, setAdding] = useState(false);
  
  // New coupon form state
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [region, setRegion] = useState("both"); // indian, international, both
  const [validForPlans, setValidForPlans] = useState([]);
  const [maxUses, setMaxUses] = useState("");

  const loadCoupons = async () => {
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/payment/admin/coupons`, {
        headers: { "x-admin-token": sessionStorage.getItem("edureach:adminToken") },
      });
      if (!res.ok) throw new Error("Failed to load coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async () => {
    if (!code.trim() || !discount || isNaN(discount) || Number(discount) <= 0) {
      setErr("Enter a valid code and discount amount");
      return;
    }
    
    // Prompt for admin key (step 2) to authorize
    const enteredKey = window.prompt("Enter Admin Key to authorize creating this coupon:");
    if (!enteredKey) return; // user cancelled

    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/payment/admin/coupons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": sessionStorage.getItem("edureach:adminToken"),
        },
        body: JSON.stringify({
          adminKey: enteredKey,
          code: code.trim().toUpperCase(),
          discountAmount: Number(discount),
          validForRegion: region,
          validForPlans: validForPlans.length > 0 ? validForPlans : undefined,
          maxUses: maxUses ? Number(maxUses) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon");
      
      setAdding(false);
      setCode("");
      setDiscount("");
      setRegion("both");
      setValidForPlans([]);
      setMaxUses("");
      loadCoupons();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (couponId, couponCode) => {
    const enteredKey = window.prompt(`Enter Admin Key to authorize DELETING coupon ${couponCode}:`);
    if (!enteredKey) return;
    
    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/payment/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": sessionStorage.getItem("edureach:adminToken"),
        },
        body: JSON.stringify({ adminKey: enteredKey }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete coupon");
      }
      loadCoupons();
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  const toggleStatus = async (couponId, currentStatus, couponCode) => {
    const enteredKey = window.prompt(`Enter Admin Key to authorize ${currentStatus ? "deactivating" : "activating"} coupon ${couponCode}:`);
    if (!enteredKey) return;

    setBusy(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/payment/admin/coupons/${couponId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": sessionStorage.getItem("edureach:adminToken"),
        },
        body: JSON.stringify({
          adminKey: enteredKey,
          isActive: !currentStatus
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update coupon status");
      }
      loadCoupons();
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <div style={{ animation: "admUp .4s cubic-bezier(.4,0,.2,1) both" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: "1.3rem", fontWeight: 800, margin: 0, color: "#0d1b3e", display: "flex", alignItems: "center", gap: 10 }}>
            <Tag size={20} color={ORANGE} /> Coupon Manager
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "4px 0 0" }}>Create and manage flat-amount discount coupons for mentorship plans.</p>
        </div>
        {!adding && (
          <button onClick={() => setAdding(true)} disabled={busy}
            style={{ display: "flex", alignItems: "center", gap: 6, background: ORANGE, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            <Plus size={16} /> New Coupon
          </button>
        )}
      </div>

      {err && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", padding: "12px 16px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, marginBottom: 20 }}>
          {err}
        </div>
      )}

      {/* Add Form */}
      {adding && (
        <div style={{ background: "#fff", border: "1px solid #f0e9e0", borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 10px 30px -10px rgba(13,27,62,.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontFamily: "Sora, sans-serif", fontWeight: 700 }}>Create New Coupon</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Coupon Code</span>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. DIWALI2599" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, textTransform: "uppercase", outline: "none", fontWeight: 600 }} />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Discount Amount (₹)</span>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="e.g. 500" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
            </label>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Valid Region</span>
              <select value={region} onChange={(e) => setRegion(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, outline: "none", background: "#fff" }}>
                <option value="both">Both Indian & International</option>
                <option value="indian">Indian Only</option>
                <option value="international">International Only</option>
              </select>
            </label>
            <label style={{ display: "block" }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Max Uses (optional)</span>
              <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Leave blank for unlimited" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, outline: "none" }} />
            </label>
          </div>
          <div style={{ marginTop: 20, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => setAdding(false)} style={{ background: "transparent", border: "1px solid #d1d5db", color: "#6b7280", padding: "8px 16px", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Cancel</button>
            <button onClick={handleCreate} disabled={busy} style={{ background: ORANGE, border: "none", color: "#fff", padding: "8px 20px", borderRadius: 8, fontWeight: 700, cursor: busy ? "wait" : "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              {busy ? <Loader2 size={16} className="spin" /> : "Create & Authorize"}
            </button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div style={{ background: "#fff", border: "1px solid #f0e9e0", borderRadius: 16, overflow: "hidden", boxShadow: "0 10px 30px -10px rgba(13,27,62,.06)" }}>
        {busy && coupons.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
            <Loader2 size={24} className="spin" style={{ margin: "0 auto 10px", display: "block" }} />
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>
            No coupons found.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Code & Discount</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Region</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Usage</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase" }}>Status</th>
                <th style={{ padding: "14px 20px", fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} style={{ borderBottom: "1px solid #f3f4f6", opacity: c.isActive ? 1 : 0.6 }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15, fontWeight: 800, color: "#111827", letterSpacing: ".05em" }}>
                      {c.code}
                    </div>
                    <div style={{ fontSize: 13, color: "#059669", fontWeight: 700, marginTop: 4 }}>
                      ₹{c.discountAmount} OFF
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    {c.validForRegion === "both" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "#f3f4f6", color: "#4b5563", padding: "4px 8px", borderRadius: 6 }}>
                        <Globe size={13} /> All
                      </span>
                    ) : c.validForRegion === "indian" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "#fff7ed", color: "#c2410c", padding: "4px 8px", borderRadius: 6 }}>
                        🇮🇳 Indian
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "#eff6ff", color: "#1d4ed8", padding: "4px 8px", borderRadius: 6 }}>
                        🌍 Int'l
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>
                      {c.usedCount} <span style={{ color: "#9ca3af", fontWeight: 400 }}>/ {c.maxUses || "∞"} uses</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <button onClick={() => toggleStatus(c._id, c.isActive, c.code)} disabled={busy}
                      style={{
                        padding: "4px 10px", borderRadius: 50, border: "none", fontSize: 11.5, fontWeight: 700, cursor: busy ? "wait" : "pointer",
                        background: c.isActive ? "#dcfce7" : "#f3f4f6", color: c.isActive ? "#166534" : "#6b7280"
                      }}>
                      {c.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button onClick={() => handleDelete(c._id, c.code)} disabled={busy}
                      style={{ background: "transparent", border: "none", color: "#ef4444", cursor: busy ? "wait" : "pointer", padding: 6, borderRadius: 6 }}>
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
