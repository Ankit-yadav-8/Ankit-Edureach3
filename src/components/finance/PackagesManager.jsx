import React, { useState } from "react";
import { Package, Plus, Trash2, Edit2, TrendingUp, DollarSign, Users, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { formatCurrency } from "../../utils/financialEngine";

const ACCENT = "#FF693D";

export default function PackagesManager({
  packages = [],
  onUpdatePackages,
  funnel,
  onUpdateFunnel,
  arpu,
  currency = "INR",
  usdToInr = 85.0,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [durationMonths, setDurationMonths] = useState(3);
  const [priceInr, setPriceInr] = useState(2499);
  const [priceUsd, setPriceUsd] = useState(69);
  const [discountPct, setDiscountPct] = useState(0);
  const [sharePct, setSharePct] = useState(25);
  const [description, setDescription] = useState("");

  const totalShare = packages.reduce((acc, p) => acc + (Number(p.sharePct) || 0), 0);

  const openAddModal = () => {
    setEditingPkg(null);
    setName("");
    setDurationMonths(3);
    setPriceInr(2499);
    setPriceUsd(69);
    setDiscountPct(0);
    setSharePct(25);
    setDescription("");
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingPkg(p);
    setName(p.name);
    setDurationMonths(p.durationMonths);
    setPriceInr(p.priceInr);
    setPriceUsd(p.priceUsd);
    setDiscountPct(p.discountPct || 0);
    setSharePct(p.sharePct || 25);
    setDescription(p.description || "");
    setModalOpen(true);
  };

  const handleSavePackage = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
              name,
              durationMonths: Number(durationMonths),
              priceInr: Number(priceInr),
              priceUsd: Number(priceUsd),
              discountPct: Number(discountPct),
              sharePct: Number(sharePct),
              description,
            }
          : p
      );
      onUpdatePackages(updated);
    } else {
      const newPkg = {
        id: `pkg_${Date.now()}`,
        name,
        durationMonths: Number(durationMonths),
        priceInr: Number(priceInr),
        priceUsd: Number(priceUsd),
        discountPct: Number(discountPct),
        sharePct: Number(sharePct),
        description,
      };
      onUpdatePackages([...packages, newPkg]);
    }
    setModalOpen(false);
  };

  const handleDeletePackage = (id) => {
    if (packages.length <= 1) {
      alert("At least one mentorship package must remain.");
      return;
    }
    if (window.confirm("Remove this package from pricing catalog?")) {
      onUpdatePackages(packages.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── TOP ARPU METRICS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>BLENDED INDIAN ARPU</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: ACCENT, marginTop: 4 }}>
            {formatCurrency(arpu?.inrArpu || 0, "INR")}
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            Average revenue per Indian student across all package tiers
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>BLENDED INTERNATIONAL ARPU</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#0284c7", marginTop: 4 }}>
            ${arpu?.usdArpu || 0} <span style={{ fontSize: 14, color: "#64748b" }}>({formatCurrency(arpu?.intlInrArpu || 0, "INR")})</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
            FX Exchange rate: 1 USD = ₹{usdToInr}
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid #e2e8f0",
            padding: "20px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>PACKAGE SHARE INTEGRITY</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: totalShare === 100 ? "#10b981" : "#f59e0b", marginTop: 4 }}>
            {totalShare}%
          </div>
          <div style={{ fontSize: 11, color: totalShare === 100 ? "#10b981" : "#b91c1c", marginTop: 4 }}>
            {totalShare === 100 ? "✓ 100% Student distribution balanced" : `⚠ Package shares sum to ${totalShare}% (should be 100%)`}
          </div>
        </div>
      </div>

      {/* ── PACKAGES CATALOG TABLE ── */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 18,
          border: "1px solid #e2e8f0",
          padding: "22px 24px",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Mentorship Packages & Pricing Tiers
            </h3>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>
              Editable pricing for Indian (₹) & Global NRI ($) students, discounts, and customer volume share %
            </p>
          </div>
          <button
            onClick={openAddModal}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 16px",
              borderRadius: 10,
              background: ACCENT,
              color: "#ffffff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(255,105,61,0.25)",
            }}
          >
            <Plus size={16} /> Add Package
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.6 }}>
                <th style={{ padding: "12px 14px" }}>Package Name</th>
                <th style={{ padding: "12px 14px" }}>Duration</th>
                <th style={{ padding: "12px 14px" }}>Indian Price</th>
                <th style={{ padding: "12px 14px" }}>International Price</th>
                <th style={{ padding: "12px 14px" }}>Discount</th>
                <th style={{ padding: "12px 14px" }}>Student Share (%)</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ fontWeight: 800, color: "#0f172a" }}>{pkg.name}</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>{pkg.description}</div>
                  </td>
                  <td style={{ padding: "14px", fontWeight: 700, color: "#334155" }}>
                    {pkg.durationMonths} {pkg.durationMonths === 1 ? "month" : "months"}
                  </td>
                  <td style={{ padding: "14px", fontWeight: 800, color: "#0f172a", fontSize: 14 }}>
                    {formatCurrency(pkg.priceInr, "INR")}
                  </td>
                  <td style={{ padding: "14px", fontWeight: 800, color: "#0284c7", fontSize: 14 }}>
                    ${pkg.priceUsd}
                  </td>
                  <td style={{ padding: "14px" }}>
                    {pkg.discountPct > 0 ? (
                      <span style={{ fontSize: 11, fontWeight: 800, background: "#ecfdf5", color: "#047857", padding: "2px 8px", borderRadius: 6 }}>
                        {pkg.discountPct}% OFF
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Regular</span>
                    )}
                  </td>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 10, width: 60, overflow: "hidden" }}>
                        <div style={{ width: `${pkg.sharePct}%`, height: "100%", background: ACCENT, borderRadius: 10 }} />
                      </div>
                      <span style={{ fontWeight: 800, color: "#0f172a" }}>{pkg.sharePct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        onClick={() => openEditModal(pkg)}
                        style={{ border: "none", background: "transparent", color: "#64748b", cursor: "pointer", padding: 4 }}
                        title="Edit package"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={{ border: "none", background: "transparent", color: "#f43f5e", cursor: "pointer", padding: 4 }}
                        title="Delete package"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── STUDENT ACQUISITION FUNNELS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))", gap: 20 }}>
        {/* Indian Funnel */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            border: "1px solid #e2e8f0",
            padding: "22px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#fff7ed", color: ACCENT, display: "grid", placeItems: "center" }}>
              <Users size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>Indian Student Acquisition Funnel</h4>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Target: 1,000 paying Indian students / year</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>1. Monthly Social Media Impressions</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Instagram Reels, YouTube SEO & Shorts</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>120,000</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>2. Website Visitors (8% click rate)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>CampusPoint.in landing page visits</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>9,600 / mo</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>3. Interested Leads (5% conversion)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Students requesting JEE/NEET roadmap</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>480 / mo</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>4. Diagnostic Calls Done (60% connect)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Free 1-on-1 strategy call with counsellor</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>288 / mo</div>
            </div>

            <div style={{ background: "#ecfdf5", padding: "12px 14px", borderRadius: 10, border: "1px solid #a7f3d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#047857" }}>5. Paying Mentorship Students (35% close)</div>
                <div style={{ fontSize: 11, color: "#065f46" }}>Purchasing 1m, 3m, 6m or 12m package</div>
              </div>
              <div style={{ fontWeight: 900, color: "#047857", fontSize: 16 }}>~84 / mo avg (1,000/yr)</div>
            </div>
          </div>
        </div>

        {/* International NRI Funnel */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            border: "1px solid #e2e8f0",
            padding: "22px",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#f0f9ff", color: "#0284c7", display: "grid", placeItems: "center" }}>
              <Globe size={18} />
            </div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0 }}>International NRI Funnel</h4>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Target: 50 paying international students / year (Gulf, US, UK)</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>1. NRI Community & Search Reach</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Gulf & NRI parents targeting DASA/CIWG</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>25,000 / mo</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>2. NRI Website Visitors (6% click rate)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Global landing page visits</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>1,500 / mo</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>3. Inquiries & Leads (4% conversion)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>WhatsApp inquiries & diagnostic requests</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>60 / mo</div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>4. Global Strategy Calls (50% completed)</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Zoom video evaluation with IIT Roorkee mentor</div>
              </div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 14 }}>30 / mo</div>
            </div>

            <div style={{ background: "#f0f9ff", padding: "12px 14px", borderRadius: 10, border: "1px solid #bae6fd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0284c7" }}>5. Paying Global Students (25% close)</div>
                <div style={{ fontSize: 11, color: "#0369a1" }}>Purchasing USD packages ($69 - $199)</div>
              </div>
              <div style={{ fontWeight: 900, color: "#0284c7", fontSize: 16 }}>~4.2 / mo avg (50/yr)</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL: ADD / EDIT PACKAGE ── */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 2000,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              background: "#ffffff",
              borderRadius: 18,
              padding: "24px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
            }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 16px" }}>
              {editingPkg ? "Edit Mentorship Package" : "Add Mentorship Package"}
            </h3>

            <form onSubmit={handleSavePackage} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Package Title</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. 3-Month Mentorship"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Duration (Months)</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  required
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Indian Price (₹ INR)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    required
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>International Price ($ USD)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    required
                    value={priceUsd}
                    onChange={(e) => setPriceUsd(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Discount (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Student Share (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={sharePct}
                    onChange={(e) => setSharePct(e.target.value)}
                    style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 4 }}>Short Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key features included in this package"
                  style={{ width: "100%", height: 38, padding: "0 10px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", fontSize: 13 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
                >
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

