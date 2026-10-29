const fs = require('fs');

// 1. Update src/styles/index.css to eliminate orange scrollbars completely
let css = fs.readFileSync('src/styles/index.css', 'utf8');

const oldScrollSectionRegex = /\/\* ════════════════════════════════════════════════[\s\S]*?CUSTOM SCROLLBAR[\s\S]*?::-webkit-scrollbar-thumb:hover[\s\S]*?\}[\s\r\n]*\/\* Dedicated custom scroll utility classes \*\//;

const newScrollSection = `/* ════════════════════════════════════════════════
   CLEAN SCROLLBAR SYSTEM (Invisible, Full Smooth Functionality)
════════════════════════════════════════════════ */
html, body {
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

::-webkit-scrollbar-button {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

/* Dedicated custom scroll utility classes */`;

if (oldScrollSectionRegex.test(css)) {
  css = css.replace(oldScrollSectionRegex, newScrollSection);
  console.log('index.css: Old global scrollbar styling replaced.');
} else {
  console.log('index.css: Old global scrollbar regex did not match, checking fallback.');
}

// Remove any remaining scrollbar-color: #FF693D #f1f5f9
css = css.replace(/scrollbar-color:\s*#FF693D\s*#f1f5f9\s*;?/g, 'scrollbar-width: none !important;');
fs.writeFileSync('src/styles/index.css', css, 'utf8');
console.log('src/styles/index.css saved.');

// 2. Update src/pages/Admin.jsx
let admin = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// Update fetchPayments in Admin.jsx to normalize Yukeeth and Yuvan to 13999 and persist to DB
const oldFetchPaymentsRegex = /const fetchPayments = useCallback\(async \(t\) => \{[\s\S]*?setPayments\(data\.enrollments \|\| \[\]\);[\s\S]*?setPayLoaded\(true\);[\s\S]*?\}, \[\]\);/;

const newFetchPayments = `const fetchPayments = useCallback(async (t) => {
    setBusy(true); setErr("");
    try {
      const res = await fetch(API_BASE + "/api/payment/enrollments", { headers: { "x-admin-token": t }, cache: "no-store" });
      if (res.status === 401 || res.status === 403) throw new Error("Session expired - please log in again");
      if (!res.ok) throw new Error("Server error " + res.status);
      const data = await res.json();
      const rawList = data.enrollments || [];
      // Normalize Yukeeth and Yuvan price to 13999 in frontend state and persist to database
      const list = rawList.map((p) => {
        if (
          (p.email === "yukeethjee@gmail.com" || p.email === "yuvanjee28@gmail.com" || /yukeeth|yuvan/i.test(p.name)) &&
          Number(p.amount) < 1000
        ) {
          if (p._id && t) {
            fetch(\`\${API_BASE}/api/payment/enrollments/\${p._id}\`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", "x-admin-token": t },
              body: JSON.stringify({ amount: 13999, originalAmount: 13999 }),
            }).catch(() => {});
          }
          return { ...p, amount: 13999 };
        }
        return p;
      });
      setPayments(list);
      setPayTotal(data.total ?? (list.length || 0));
      setPayLoaded(true);
    } catch (e) {
      setErr(e.message);
    } finally { setBusy(false); }
  }, []);`;

if (oldFetchPaymentsRegex.test(admin)) {
  admin = admin.replace(oldFetchPaymentsRegex, newFetchPayments);
  console.log('Admin.jsx: fetchPayments updated.');
} else {
  console.log('Admin.jsx: oldFetchPaymentsRegex did not match.');
}

// Add handleUpdateAmount in Admin.jsx
if (!admin.includes('handleUpdateAmount')) {
  admin = admin.replace(
    'const handleApproveEmail = async (id) => {',
    `const handleUpdateAmount = useCallback(async (id, newAmount) => {
    const num = Number(newAmount);
    if (isNaN(num) || num < 0) return alert("Please enter a valid amount");
    try {
      const res = await fetch(\`\${API_BASE}/api/payment/enrollments/\${id}\`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ amount: num, originalAmount: num }),
      });
      if (!res.ok) throw new Error("Failed to update price in database");
      setPayments((prev) => prev.map((p) => (p._id === id ? { ...p, amount: num } : p)));
    } catch (err) {
      alert(err.message || "Could not update price");
    }
  }, [token]);\n\n  const handleApproveEmail = async (id) => {`
  );
  console.log('Admin.jsx: handleUpdateAmount added.');
}

// Update the 4 Payments Stat Cards in Admin.jsx
const oldCardsRegex = /\{\/\* Payments Stat Cards \*\/\}[\s\S]*?Awaiting email approval<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

const newCards = `{/* Payments Stat Cards - Only 4 Core Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 16, marginBottom: 24 }}>
                  {/* Option 1: Total Signups */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#1a1d42 0%,#3c2a66 100%)", borderRadius: 16, padding: "20px 24px", color: "#fff", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 10px 30px rgba(60,42,102,.28)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: \`\${ORANGE}33\`, display: "grid", placeItems: "center" }}>
                      <Users size={22} color={ORANGE} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1 }}>{payTotal}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", marginTop: 4, fontWeight: 600 }}>Total Signups</div>
                    </div>
                  </div>

                  {/* Option 2: Today Payment */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
                      <Calendar size={22} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                        {payments.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 600 }}>Today Payment</div>
                    </div>
                  </div>

                  {/* Option 3: Total Payment */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fbf7f2)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #f0e9e0", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdf4", display: "grid", placeItems: "center" }}>
                      <IndianRupee size={22} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#0d1b3e" }}>
                        ₹{revenue.toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, fontWeight: 600 }}>Total Payment</div>
                    </div>
                  </div>

                  {/* Option 4: Awaiting Email Approval */}
                  <div className="adm-stat" style={{ background: "linear-gradient(135deg,#ffffff,#fff7ed)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, border: "1px solid #fed7aa", boxShadow: "0 4px 18px rgba(13,27,62,.05)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ffedd5", display: "grid", placeItems: "center" }}>
                      <Mail size={22} color="#ea580c" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "Sora", fontWeight: 800, fontSize: "1.8rem", lineHeight: 1, color: "#ea580c" }}>
                        {payments.filter(p => !p.confirmationEmailSent).length}
                      </div>
                      <div style={{ fontSize: 12, color: "#9a3412", marginTop: 4, fontWeight: 600 }}>Awaiting Email Approval</div>
                    </div>
                  </div>
                </div>`;

if (oldCardsRegex.test(admin)) {
  admin = admin.replace(oldCardsRegex, newCards);
  console.log('Admin.jsx: 4 option cards updated.');
} else {
  console.log('Admin.jsx: oldCardsRegex did not match.');
}

// Pass onUpdateAmount to PaymentsTable
admin = admin.replace(
  'onApproveEmail={handleApproveEmail}\n                  approvingId={approvingId}',
  'onApproveEmail={handleApproveEmail}\n                  approvingId={approvingId}\n                  onUpdateAmount={handleUpdateAmount}'
);
admin = admin.replace(
  'onApproveEmail={handleApproveEmail}\r\n                  approvingId={approvingId}',
  'onApproveEmail={handleApproveEmail}\r\n                  approvingId={approvingId}\r\n                  onUpdateAmount={handleUpdateAmount}'
);

// Remove duplicate metric strip inside PaymentsTable
const oldPaymentsTableStripRegex = /\{\/\* Payments Metric Strip \*\/\}[\s\S]*?Approval Pending<\/span>[\s\S]*?\{pendingCount\}[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;

if (oldPaymentsTableStripRegex.test(admin)) {
  admin = admin.replace(oldPaymentsTableStripRegex, '');
  console.log('Admin.jsx: Duplicate PaymentsTable metric strip removed.');
} else {
  console.log('Admin.jsx: oldPaymentsTableStripRegex did not match.');
}

// Update PaymentsTable signature to accept onUpdateAmount
admin = admin.replace(
  'function PaymentsTable({ payments, search, setSearch, expanded, toggleRow, onApproveEmail, approvingId })',
  'function PaymentsTable({ payments, search, setSearch, expanded, toggleRow, onApproveEmail, approvingId, onUpdateAmount })'
);

// Add quick price editing inside table row
const oldAmountCellRegex = /<td style=\{\{\s*padding:\s*"11px 14px",\s*fontSize:\s*12\.5,\s*color:\s*"#0f172a",\s*fontWeight:\s*800,\s*whiteSpace:\s*"nowrap"\s*\}\}>[\s\S]*?₹\{Number\(p\.amount \|\| 0\)\.toLocaleString\("en-IN"\)\}[\s\S]*?<\/td>/;

const newAmountCell = `<td style={{ padding: "11px 14px", fontSize: 12.5, color: "#0f172a", fontWeight: 800, whiteSpace: "nowrap" }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span>₹{Number(p.amount || 0).toLocaleString("en-IN")}</span>
                            <button
                              type="button"
                              title="Edit price in database"
                              onClick={() => {
                                const val = window.prompt(\`Edit payment amount for \${p.name || 'customer'}:\`, p.amount || '13999');
                                if (val !== null && val.trim() !== '') {
                                  onUpdateAmount?.(p._id, Number(val.trim()));
                                }
                              }}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "2px 4px",
                                cursor: "pointer",
                                color: "#94a3b8",
                                fontSize: 11,
                                borderRadius: 4,
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.color = "#FF693D"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                            >
                              ✎
                            </button>
                          </div>
                        </td>`;

if (oldAmountCellRegex.test(admin)) {
  admin = admin.replace(oldAmountCellRegex, newAmountCell);
  console.log('Admin.jsx: Editable amount cell updated.');
} else {
  console.log('Admin.jsx: oldAmountCellRegex did not match.');
}

fs.writeFileSync('src/pages/Admin.jsx', admin, 'utf8');
console.log('src/pages/Admin.jsx saved.');
