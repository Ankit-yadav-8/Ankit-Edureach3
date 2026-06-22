import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText, UploadCloud, Loader2, Trash2, CheckCircle2, AlertTriangle,
  RefreshCw, Wand2, ClipboardList, Clock, FileCheck2, X,
} from "lucide-react";
import {
  apiAdminTestSignUpload, apiAdminTestParse, apiAdminTestCreate,
  apiAdminTestList, apiAdminTestDelete,
} from "../../auth/api.js";
import { uploadPdf, validatePdf } from "../../utils/cloudinaryUpload.js";

const ORANGE = "#FF693D", NAVY = "#0d1b3e", GREEN = "#15a06e", MUTE = "#6b7280";

const PLANS = [
  { key: "mentor-jee-2027", label: "JEE 2027" },
  { key: "mentor-neet-2027", label: "NEET 2027" },
  { key: "mentor-jee-2028", label: "JEE 2028 (2-yr)" },
  { key: "mentor-neet-2028", label: "NEET 2028 (2-yr)" },
  { key: "mentor-foundation", label: "Foundation (9–10)" },
];
const CATEGORIES = [
  { key: "daily", label: "Daily Test" },
  { key: "weekly", label: "Weekly Test" },
  { key: "full", label: "Full / Major Test" },
];

const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—");

const card = { background: "#fff", borderRadius: 16, border: "1px solid #f0e9e0", boxShadow: "0 8px 30px rgba(13,27,62,.06)" };
const lbl = { fontSize: 12, fontWeight: 700, color: MUTE, marginBottom: 6, display: "block" };
const inp = { width: "100%", height: 40, padding: "0 12px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: NAVY };

export default function TestUpload({ token }) {
  const [plan, setPlan] = useState(PLANS[0].key);
  const [category, setCategory] = useState("daily");

  // upload form
  const [title, setTitle] = useState("");
  const [durationMin, setDurationMin] = useState(60);
  const [mCorrect, setMCorrect] = useState(4);
  const [mWrong, setMWrong] = useState(-1);
  const [testPdfUrl, setTestPdfUrl] = useState("");
  const [keyPdfUrl, setKeyPdfUrl] = useState("");
  const [up, setUp] = useState({ test: 0, key: 0 }); // upload progress
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [questions, setQuestions] = useState(null); // parsed/edited questions

  const testRef = useRef(null);
  const keyRef = useRef(null);

  // existing tests
  const [list, setList] = useState([]);
  const [listBusy, setListBusy] = useState(false);

  const loadList = useCallback(() => {
    setListBusy(true);
    apiAdminTestList(token, plan, category)
      .then((d) => setList(d.tests || []))
      .catch((e) => setErr(e.message))
      .finally(() => setListBusy(false));
  }, [token, plan, category]);

  useEffect(() => { loadList(); }, [loadList]);

  const resetForm = () => {
    setTitle(""); setDurationMin(60); setMCorrect(4); setMWrong(-1);
    setTestPdfUrl(""); setKeyPdfUrl(""); setUp({ test: 0, key: 0 });
    setQuestions(null); setNote(""); setErr("");
    if (testRef.current) testRef.current.value = "";
    if (keyRef.current) keyRef.current.value = "";
  };

  async function handleFile(e, which) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const v = validatePdf(file);
    if (v) { setErr(v); return; }
    setErr(""); setBusy(true);
    setUp((s) => ({ ...s, [which]: 1 }));
    try {
      const sig = await apiAdminTestSignUpload(token, plan);
      const url = await uploadPdf(file, sig, (p) => setUp((s) => ({ ...s, [which]: p })));
      if (which === "test") setTestPdfUrl(url); else setKeyPdfUrl(url);
    } catch (ex) {
      setErr(ex.message || "Upload failed");
      setUp((s) => ({ ...s, [which]: 0 }));
    } finally { setBusy(false); }
  }

  async function parse() {
    if (!testPdfUrl) { setErr("Upload the question paper PDF first."); return; }
    setParsing(true); setErr(""); setNote("");
    try {
      const d = await apiAdminTestParse(token, { testPdfUrl, keyPdfUrl });
      setQuestions(d.questions || []);
      setNote(d.note || "");
    } catch (ex) { setErr(ex.message || "Could not parse the PDF"); }
    finally { setParsing(false); }
  }

  const setQ = (i, patch) => setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const addQ = () => setQuestions((qs) => [...qs, { qno: (qs[qs.length - 1]?.qno || qs.length) + 1, text: "", options: [], type: "single", correct: "" }]);
  const delQ = (i) => setQuestions((qs) => qs.filter((_, j) => j !== i));

  const unanswered = (questions || []).filter((q) => !String(q.correct).trim()).length;

  async function publish() {
    if (!title.trim()) { setErr("Give the test a title."); return; }
    if (!questions?.length) { setErr("Parse the PDF (or add questions) first."); return; }
    setPublishing(true); setErr("");
    try {
      await apiAdminTestCreate(token, {
        plan, category, title: title.trim(), durationMin: Number(durationMin) || 60,
        marking: { correct: Number(mCorrect) || 4, wrong: Number(mWrong) },
        testPdfUrl, keyPdfUrl, questions, parseNote: note,
      });
      resetForm();
      loadList();
    } catch (ex) { setErr(ex.message || "Could not publish"); }
    finally { setPublishing(false); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this test and all its attempts?")) return;
    try { await apiAdminTestDelete(token, id); setList((l) => l.filter((t) => t.id !== id)); }
    catch (ex) { setErr(ex.message); }
  }

  const UploadBox = ({ which, label, url }) => (
    <div>
      <span style={lbl}>{label}</span>
      <button onClick={() => (which === "test" ? testRef : keyRef).current?.click()} disabled={busy}
        style={{ width: "100%", border: `1.5px dashed ${url ? GREEN : "#d6cdc0"}`, background: url ? "#f0faf4" : "#fafafa", borderRadius: 12, padding: "16px 12px", cursor: busy ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 10, textAlign: "left" }}>
        <span style={{ width: 38, height: 38, borderRadius: 10, background: url ? "#dcfce7" : "#f0e9e0", display: "grid", placeItems: "center", flexShrink: 0 }}>
          {url ? <FileCheck2 size={18} color={GREEN} /> : <UploadCloud size={18} color={ORANGE} />}
        </span>
        <span style={{ minWidth: 0 }}>
          <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: NAVY }}>{url ? "Uploaded ✓" : "Choose PDF"}</span>
          <span style={{ display: "block", fontSize: 11.5, color: MUTE, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {up[which] > 0 && up[which] < 100 ? `Uploading… ${up[which]}%` : url ? "Tap to replace" : "PDF up to 25 MB"}
          </span>
        </span>
      </button>
      <input ref={which === "test" ? testRef : keyRef} type="file" accept="application/pdf" hidden onChange={(e) => handleFile(e, which)} />
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {/* Plan + category selector */}
      <div style={{ ...card, padding: "18px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div style={{ minWidth: 200 }}>
            <span style={lbl}>Mentorship plan</span>
            <select value={plan} onChange={(e) => setPlan(e.target.value)} style={{ ...inp, cursor: "pointer" }}>
              {PLANS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div style={{ display: "inline-flex", gap: 6, background: "#f5f3ef", borderRadius: 50, padding: 5 }}>
            {CATEGORIES.map((c) => {
              const on = category === c.key;
              return (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  style={{ padding: "8px 16px", border: "none", borderRadius: 50, cursor: "pointer", fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: on ? "#fff" : "#7c7368", background: on ? "linear-gradient(135deg,#FF693D,#E0421F)" : "transparent" }}>
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {err && (
        <div style={{ background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertTriangle size={15} /> {err}
        </div>
      )}

      {/* Upload + create */}
      <div style={{ ...card, padding: "20px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, background: `${ORANGE}15`, display: "grid", placeItems: "center" }}><UploadCloud size={17} color={ORANGE} /></span>
          <h3 style={{ margin: 0, fontFamily: "Sora", fontWeight: 800, fontSize: 16, color: NAVY }}>
            Upload a {CATEGORIES.find((c) => c.key === category)?.label} → {PLANS.find((p) => p.key === plan)?.label}
          </h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 16 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <span style={lbl}>Test title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Daily Test 12 — Kinematics" style={inp} />
          </div>
          <div>
            <span style={lbl}>Duration (minutes)</span>
            <input type="number" min={1} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} style={inp} />
          </div>
          <div>
            <span style={lbl}>Marks · correct</span>
            <input type="number" value={mCorrect} onChange={(e) => setMCorrect(e.target.value)} style={inp} />
          </div>
          <div>
            <span style={lbl}>Marks · wrong</span>
            <input type="number" value={mWrong} onChange={(e) => setMWrong(e.target.value)} style={inp} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
          <UploadBox which="test" label="Question paper PDF *" url={testPdfUrl} />
          <UploadBox which="key" label="Answer key PDF" url={keyPdfUrl} />
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={parse} disabled={!testPdfUrl || parsing || busy}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", border: "none", height: 42, padding: "0 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: !testPdfUrl || parsing ? "not-allowed" : "pointer", opacity: !testPdfUrl || parsing ? 0.6 : 1 }}>
            {parsing ? <Loader2 size={16} className="adm-spin" /> : <Wand2 size={16} />} {parsing ? "Converting to CBT…" : "Auto-convert to CBT"}
          </button>
          {questions && (
            <button onClick={resetForm} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: MUTE, border: "1.5px solid #e5e7eb", height: 42, padding: "0 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <X size={15} /> Clear
            </button>
          )}
        </div>

        {note && (
          <div style={{ marginTop: 14, background: "#f0f6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", color: "#1e40af", fontSize: 13 }}>{note}</div>
        )}

        {/* Parsed question review */}
        {questions && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontFamily: "Sora", color: NAVY, fontSize: 14 }}>
                Review · {questions.length} question{questions.length === 1 ? "" : "s"}
                {unanswered > 0 && <span style={{ marginLeft: 8, color: "#b45309", background: "#fef3c7", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{unanswered} missing answer</span>}
              </div>
              <button onClick={addQ} style={{ fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer" }}>+ Add question</button>
            </div>
            <div style={{ maxHeight: 360, overflowY: "auto", border: "1px solid #f0e9e0", borderRadius: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#faf8f4", position: "sticky", top: 0 }}>
                    {["#", "Question (stem)", "Type", "Correct", ""].map((h, i) => (
                      <th key={i} style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#999", textTransform: "uppercase", letterSpacing: ".05em", borderBottom: "1px solid #f0e9e0", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #f5f3ef" }}>
                      <td style={{ padding: "8px 10px", color: MUTE, fontWeight: 700 }}>{q.qno}</td>
                      <td style={{ padding: "8px 10px", maxWidth: 360 }}>
                        <div style={{ color: NAVY, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 360 }} title={q.text}>{q.text || <em style={{ color: "#bbb" }}>—</em>}</div>
                        {q.type === "single" && q.options?.length > 0 && (
                          <div style={{ fontSize: 11, color: MUTE, marginTop: 2 }}>{q.options.map((o) => `${o.key}) ${o.text}`).join("  ·  ").slice(0, 120)}</div>
                        )}
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <select value={q.type} onChange={(e) => setQ(i, { type: e.target.value })} style={{ ...inp, height: 32, width: 96, fontSize: 12 }}>
                          <option value="single">MCQ</option>
                          <option value="integer">Integer</option>
                        </select>
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <input value={q.correct} onChange={(e) => setQ(i, { correct: e.target.value })} placeholder={q.type === "single" ? "1–4 / A–D" : "number"}
                          style={{ ...inp, height: 32, width: 90, fontSize: 13, fontWeight: 700, textAlign: "center", borderColor: String(q.correct).trim() ? "#e5e7eb" : "#fca5a5" }} />
                      </td>
                      <td style={{ padding: "8px 10px" }}>
                        <button onClick={() => delQ(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1" }}><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={publish} disabled={publishing}
              style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#FF693D,#E0421F)", color: "#fff", border: "none", height: 46, padding: "0 24px", borderRadius: 12, fontWeight: 800, fontFamily: "Sora", fontSize: 15, cursor: publishing ? "wait" : "pointer", boxShadow: "0 10px 24px -10px #FF693D" }}>
              {publishing ? <Loader2 size={17} className="adm-spin" /> : <CheckCircle2 size={17} />} Publish to {PLANS.find((p) => p.key === plan)?.label}
            </button>
          </div>
        )}
      </div>

      {/* Existing tests */}
      <div style={{ ...card, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, color: NAVY, fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <ClipboardList size={16} color={ORANGE} /> Published tests
            <span style={{ background: "#f3f4f6", borderRadius: 20, padding: "2px 10px", fontSize: 12, color: "#666", fontWeight: 600 }}>{list.length}</span>
          </span>
          <button onClick={loadList} style={{ background: "none", border: "none", color: MUTE, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}>
            <RefreshCw size={14} className={listBusy ? "adm-spin" : ""} /> Refresh
          </button>
        </div>
        {list.length === 0 ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "#aaa", fontSize: 14 }}>
            {listBusy ? "Loading…" : "No tests in this section yet."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {list.map((t) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: "1px solid #f7f5f1" }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: `${ORANGE}12`, display: "grid", placeItems: "center", flexShrink: 0 }}><FileText size={17} color={ORANGE} /></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: NAVY, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: MUTE, marginTop: 2, display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>{t.categoryLabel}</span>
                    <span>{t.totalQuestions} Qs · {t.maxMarks} marks</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Clock size={11} /> {t.durationMin}m</span>
                    <span>{t.attempts} attempt{t.attempts === 1 ? "" : "s"}</span>
                    <span>{fmtDate(t.createdAt)}</span>
                  </div>
                </div>
                <button onClick={() => remove(t.id)} title="Delete" style={{ background: "#fff", border: "1.5px solid #fee2e2", color: "#ef4444", borderRadius: 9, width: 34, height: 34, display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`.adm-spin{animation:admSpin .8s linear infinite}`}</style>
    </div>
  );
}
