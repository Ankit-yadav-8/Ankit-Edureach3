import { useCallback, useEffect, useRef, useState } from "react";
import {
  FileText, UploadCloud, Loader2, Trash2, CheckCircle2, AlertTriangle,
  RefreshCw, Wand2, ClipboardList, Clock, FileCheck2, X, Plus, Layers, Info,
  ImagePlus, ChevronDown, ChevronUp,
} from "lucide-react";
import {
  apiAdminTestSignUpload, apiAdminTestParseStart, apiAdminTestParseStatus, apiAdminTestCreate,
  apiAdminTestList, apiAdminTestDelete,
} from "../../auth/api.js";
import { uploadPdf, validatePdf, uploadToCloudinary, validateFile, compressImage } from "../../utils/cloudinaryUpload.js";

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

// Subject sections per exam pattern (drives the per-section upload picker + the
// student's section tabs). NEET swaps Maths → Biology.
const SUBJECTS_BY_EXAM = {
  mains: ["Physics", "Chemistry", "Maths"],
  advanced: ["Physics", "Chemistry", "Maths"],
  neet: ["Physics", "Chemistry", "Biology"],
};

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
  const [examType, setExamType] = useState("mains"); // mains | advanced | neet | standard
  const [sections, setSections] = useState([]);      // JEE Advanced per-section marking
  const [mCorrect, setMCorrect] = useState(4);
  const [mWrong, setMWrong] = useState(-1);
  // Which subject section the current upload belongs to. "" = full paper (the
  // model auto-detects subjects). Picking one tags every parsed question with it
  // and APPENDS to the test — so you can upload Physics, then Chemistry, then Maths.
  const [uploadSubject, setUploadSubject] = useState("");

  // Exam pattern is driven by the plan: NEET → neet, Foundation → standard,
  // JEE → mains/advanced (admin toggles). Mains & NEET lock to +4 / −1 / 0.
  const isJee = plan.includes("jee");
  const fixedMarking = examType === "mains" || examType === "neet";
  const sectionSubjects = SUBJECTS_BY_EXAM[examType] || [];
  useEffect(() => {
    if (plan.includes("neet")) setExamType("neet");
    else if (plan.includes("foundation")) setExamType("standard");
    else setExamType((t) => (t === "advanced" ? "advanced" : "mains"));
  }, [plan]);
  useEffect(() => { if (fixedMarking) { setMCorrect(4); setMWrong(-1); } }, [fixedMarking]);
  const [testPdfUrl, setTestPdfUrl] = useState("");
  const [keyPdfUrl, setKeyPdfUrl] = useState("");
  const [up, setUp] = useState({ test: 0, key: 0 }); // upload progress
  const [busy, setBusy] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseMsg, setParseMsg] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [questions, setQuestions] = useState(null); // parsed/edited questions

  const testRef = useRef(null);
  const keyRef = useRef(null);
  const jobRef = useRef(null); // in-flight parse jobId, so a retry resumes it

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
    setTitle(""); setDurationMin(60); setMCorrect(4); setMWrong(-1); setSections([]);
    setTestPdfUrl(""); setKeyPdfUrl(""); setUp({ test: 0, key: 0 }); setUploadSubject("");
    setQuestions(null); setNote(""); setErr("");
    jobRef.current = null;
    if (testRef.current) testRef.current.value = "";
    if (keyRef.current) keyRef.current.value = "";
  };

  const addSection = () => setSections((s) => {
    const last = s[s.length - 1];
    const from = last ? Number(last.toQ) + 1 : 1;
    return [...s, { name: `Section ${String.fromCharCode(65 + s.length)}`, fromQ: from, toQ: from + 4, correct: 4, wrong: -1 }];
  });
  const setSection = (i, patch) => setSections((s) => s.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const delSection = (i) => setSections((s) => s.filter((_, j) => j !== i));

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
      if (which === "test") { setTestPdfUrl(url); jobRef.current = null; } else setKeyPdfUrl(url);
    } catch (ex) {
      setErr(ex.message || "Upload failed");
      setUp((s) => ({ ...s, [which]: 0 }));
    } finally { setBusy(false); }
  }

  async function parse() {
    if (!testPdfUrl) { setErr("Upload the question paper PDF first."); return; }
    setParsing(true); setErr(""); setNote("");
    setParseMsg("Reading the PDF…");
    try {
      // Parsing is a background job — math papers go through vision OCR, which on
      // the rate-limited free tier can take several minutes — so we start it and
      // poll until it's done. If a previous attempt timed out the client but the
      // job is still running on the server, resume that same jobId instead of
      // kicking off a fresh (expensive) conversion.
      let jobId = jobRef.current;
      if (!jobId) {
        // examType lets the server apply the fixed-pattern section safety net
        // (JEE Mains/NEET) when a full paper is auto-converted. A specific-section
        // upload is force-tagged below, so the net is a no-op there.
        ({ jobId } = await apiAdminTestParseStart(token, { testPdfUrl, keyPdfUrl, examType: uploadSubject ? "" : examType }));
        jobRef.current = jobId;
      }
      const started = Date.now();
      let d = null;
      // Server keeps jobs for 20 min; poll a little under that so a slow paper
      // finishes rather than erroring out.
      while (Date.now() - started < 18 * 60 * 1000) {
        await new Promise((r) => setTimeout(r, 2500));
        const secs = Math.round((Date.now() - started) / 1000);
        setParseMsg(`Converting to CBT… reading questions & maths (${secs}s)`);
        let s;
        try { s = await apiAdminTestParseStatus(token, jobId); }
        catch (pollErr) {
          // 404 = the job expired/was lost; drop it so a retry starts cleanly.
          if (/expired|not found|404/i.test(pollErr?.message || "")) { jobRef.current = null; throw pollErr; }
          continue; // transient network blip — keep polling
        }
        if (s.status === "done") { d = s; break; }
      }
      if (!d) throw new Error("Conversion is taking too long — click Auto-convert again to keep waiting (it's still running).");
      jobRef.current = null; // consumed
      const parsed = d.questions || [];
      // A specific section → tag every question with it and APPEND to the test;
      // "full paper" → replace and keep the auto-detected subjects.
      setQuestions((prev) => {
        const incoming = uploadSubject ? parsed.map((q) => ({ ...q, subject: uploadSubject })) : parsed;
        const base = uploadSubject ? (prev || []) : [];
        return [...base, ...incoming].map((q, i) => ({ ...q, qno: i + 1 }));
      });
      setNote(uploadSubject
        ? `Added ${parsed.length} ${uploadSubject} question${parsed.length === 1 ? "" : "s"}. ${d.note || ""} Upload another section or publish.`
        : (d.note || ""));
      // Clear the upload slot so the next section can be uploaded cleanly.
      if (uploadSubject) { setTestPdfUrl(""); setKeyPdfUrl(""); setUp({ test: 0, key: 0 }); }
    } catch (ex) {
      setErr(ex.message || "Could not parse the PDF");
      // A resumable timeout (jobRef still set) keeps running on the server — don't
      // wipe to the manual grid; the admin can click Auto-convert again to resume.
      if (!jobRef.current) {
        // Scanned/image PDFs or a failed job — fall back to a manual grid so the
        // admin can still build the test (students read the paper from the PDF).
        setQuestions([]);
        setNote("Couldn't read the PDF automatically. Add questions and answers manually below — students still see the uploaded paper.");
      }
    } finally { setParsing(false); setParseMsg(""); }
  }

  const setQ = (i, patch) => setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const addQ = () => setQuestions((qs) => [...qs, {
    qno: (qs[qs.length - 1]?.qno || qs.length) + 1, text: "", image: "", type: "single", correct: "",
    subject: uploadSubject || "", options: ["1", "2", "3", "4"].map((k) => ({ key: k, text: "", image: "" })), explanation: "",
  }]);
  const delQ = (i) => setQuestions((qs) => qs.filter((_, j) => j !== i));

  // Upload an image (question or option) straight to Cloudinary; returns its URL.
  const uploadImage = useCallback(async (file) => {
    const v = validateFile(file);
    if (v) throw new Error(v);
    const sig = await apiAdminTestSignUpload(token, plan);
    const prepared = await compressImage(file);
    const media = await uploadToCloudinary(prepared, sig);
    return media.url;
  }, [token, plan]);

  const unanswered = (questions || []).filter((q) => !String(q.correct).trim()).length;

  // Start a manual test with one blank question — no PDF needed. Students read
  // the question text/options/images straight from the CBT pane.
  const blankQ = (qno) => ({
    qno, text: "", image: "", type: "single", correct: "",
    options: ["1", "2", "3", "4"].map((k) => ({ key: k, text: "", image: "" })), explanation: "",
  });
  const startManual = () => { setErr(""); setNote(""); setQuestions([blankQ(1)]); };

  async function publish() {
    if (!title.trim()) { setErr("Give the test a title."); return; }
    if (!questions?.length) { setErr("Add at least one question (parse a PDF or add manually)."); return; }
    if (!testPdfUrl && !questions.some((q) => String(q.text).trim() || q.image || (q.options || []).some((o) => String(o.text).trim() || o.image))) {
      setErr("Add a question paper PDF, or give the questions some text / options.");
      return;
    }
    setPublishing(true); setErr("");
    try {
      await apiAdminTestCreate(token, {
        plan, category, title: title.trim(), durationMin: Number(durationMin) || 60,
        examType,
        marking: { correct: Number(mCorrect) || 4, wrong: Number(mWrong) },
        sections: examType === "advanced" ? sections : [],
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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <span style={lbl}>Test title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Daily Test 12 — Kinematics" style={inp} />
          </div>
          <div>
            <span style={lbl}>Duration (minutes)</span>
            <input type="number" min={1} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} style={inp} />
          </div>
          <div style={{ gridColumn: isJee ? "span 2" : "auto" }}>
            <span style={lbl}>Exam pattern</span>
            {isJee ? (
              <div style={{ display: "inline-flex", gap: 6, background: "#f5f3ef", borderRadius: 10, padding: 4 }}>
                {[{ k: "mains", l: "JEE Mains" }, { k: "advanced", l: "JEE Advanced" }].map((e) => {
                  const on = examType === e.k;
                  return (
                    <button key={e.k} type="button" onClick={() => setExamType(e.k)}
                      style={{ padding: "7px 16px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: on ? "#fff" : "#7c7368", background: on ? NAVY : "transparent" }}>
                      {e.l}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div style={{ ...inp, display: "flex", alignItems: "center", fontWeight: 700, background: "#f9fafb", color: NAVY }}>
                {plan.includes("neet") ? "NEET" : "Standard"}
              </div>
            )}
          </div>
        </div>

        {/* Marking scheme */}
        {examType === "advanced" ? (
          <div style={{ border: "1px solid #f0e9e0", borderRadius: 12, padding: "14px 16px", marginBottom: 16, background: "#fcfbf9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 800, fontFamily: "Sora", color: NAVY, fontSize: 14 }}>
                <Layers size={16} color={ORANGE} /> Marks per section
              </span>
              <button type="button" onClick={addSection} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer" }}>
                <Plus size={15} /> Add section
              </button>
            </div>
            {sections.length === 0 ? (
              <div style={{ fontSize: 12.5, color: MUTE, display: "flex", alignItems: "center", gap: 6 }}>
                <Info size={14} /> JEE Advanced marks differ per section — add one section per question range, covering every question.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sections.map((s, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr .7fr .7fr .7fr .7fr auto", gap: 8, alignItems: "center" }}>
                    <input value={s.name} onChange={(e) => setSection(i, { name: e.target.value })} placeholder="Section name" style={{ ...inp, height: 36, fontSize: 13 }} />
                    <input type="number" value={s.fromQ} onChange={(e) => setSection(i, { fromQ: e.target.value })} placeholder="From Q" style={{ ...inp, height: 36, fontSize: 13 }} title="From question" />
                    <input type="number" value={s.toQ} onChange={(e) => setSection(i, { toQ: e.target.value })} placeholder="To Q" style={{ ...inp, height: 36, fontSize: 13 }} title="To question" />
                    <input type="number" value={s.correct} onChange={(e) => setSection(i, { correct: e.target.value })} placeholder="+" style={{ ...inp, height: 36, fontSize: 13, color: GREEN, fontWeight: 700 }} title="Marks for correct" />
                    <input type="number" value={s.wrong} onChange={(e) => setSection(i, { wrong: e.target.value })} placeholder="−" style={{ ...inp, height: 36, fontSize: 13, color: "#ef4444", fontWeight: 700 }} title="Marks for wrong" />
                    <button type="button" onClick={() => delSection(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1" }}><Trash2 size={15} /></button>
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: MUTE, marginTop: 2 }}>Section name · Q-no range · +correct · −wrong. Unattempted is always 0.</div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 14, marginBottom: 16, alignItems: "end" }}>
            <div>
              <span style={lbl}>Marks · correct</span>
              <input type="number" value={mCorrect} disabled={fixedMarking} onChange={(e) => setMCorrect(e.target.value)} style={{ ...inp, background: fixedMarking ? "#f9fafb" : "#fff" }} />
            </div>
            <div>
              <span style={lbl}>Marks · wrong</span>
              <input type="number" value={mWrong} disabled={fixedMarking} onChange={(e) => setMWrong(e.target.value)} style={{ ...inp, background: fixedMarking ? "#f9fafb" : "#fff" }} />
            </div>
            <div style={{ fontSize: 12.5, color: MUTE, display: "inline-flex", alignItems: "center", gap: 6, paddingBottom: 10 }}>
              <Info size={14} /> {fixedMarking ? `${plan.includes("neet") ? "NEET" : "JEE Mains"}: +4 / −1 / 0 (locked)` : "Unattempted = 0"}
            </div>
          </div>
        )}

        {/* Section picker — upload one paper per subject, or a full paper. */}
        {sectionSubjects.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <span style={lbl}>This upload is for</span>
            <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, background: "#f5f3ef", borderRadius: 10, padding: 4 }}>
              {[{ k: "", l: "Full paper (auto)" }, ...sectionSubjects.map((s) => ({ k: s, l: s }))].map((o) => {
                const on = uploadSubject === o.k;
                return (
                  <button key={o.k} type="button" onClick={() => setUploadSubject(o.k)}
                    style={{ padding: "7px 14px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "Sora", fontWeight: 700, fontSize: 13, color: on ? "#fff" : "#7c7368", background: on ? NAVY : "transparent" }}>
                    {o.l}
                  </button>
                );
              })}
            </div>
            {uploadSubject && (
              <div style={{ fontSize: 12, color: MUTE, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                <Info size={13} /> Questions from this PDF are tagged <b style={{ color: NAVY }}>{uploadSubject}</b> and added to the test — upload each section, then publish.
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 8 }}>
          <UploadBox which="test" label={uploadSubject ? `${uploadSubject} paper PDF *` : "Question paper PDF *"} url={testPdfUrl} />
          <UploadBox which="key" label="Answer key PDF (optional)" url={keyPdfUrl} />
        </div>
        <div style={{ fontSize: 12, color: MUTE, display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 16 }}>
          <Info size={13} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>One self-contained PDF works too — if each question has its answer inline (e.g. “Ans: B” / “Correct option: 2”), leave the answer-key box empty and we’ll detect it.</span>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={parse} disabled={!testPdfUrl || parsing || busy}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", border: "none", height: 42, padding: "0 18px", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: !testPdfUrl || parsing ? "not-allowed" : "pointer", opacity: !testPdfUrl || parsing ? 0.6 : 1 }}>
            {parsing ? <Loader2 size={16} className="adm-spin" /> : <Wand2 size={16} />} {parsing ? "Converting to CBT…" : uploadSubject ? `Convert & add ${uploadSubject}` : "Auto-convert to CBT"}
          </button>
          {!questions && (
            <button onClick={startManual} disabled={busy}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: NAVY, border: "1.5px solid #e5e7eb", height: 42, padding: "0 16px", borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              <Plus size={15} /> Add questions manually
            </button>
          )}
          {questions && !parsing && (
            <button onClick={resetForm} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", color: MUTE, border: "1.5px solid #e5e7eb", height: 42, padding: "0 16px", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              <X size={15} /> Clear
            </button>
          )}
        </div>

        {parsing && parseMsg && (
          <div style={{ marginTop: 12, background: "#f0f6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", color: "#1e40af", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
            <Loader2 size={15} className="adm-spin" style={{ flexShrink: 0 }} />
            <span>{parseMsg} <span style={{ color: "#60a5fa" }}>— large maths papers can take 2–3 minutes; keep this tab open.</span></span>
          </div>
        )}

        {note && (() => {
          const warn = questions && questions.length === 0;
          return (
            <div style={{ marginTop: 14, background: warn ? "#fffbeb" : "#f0f6ff", border: `1px solid ${warn ? "#fde68a" : "#bfdbfe"}`, borderRadius: 10, padding: "10px 14px", color: warn ? "#92400e" : "#1e40af", fontSize: 13, display: "flex", gap: 8 }}>
              <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} /> <span>{note}</span>
            </div>
          );
        })()}

        {/* Parsed question review */}
        {questions && (
          <div style={{ marginTop: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
              <div style={{ fontWeight: 800, fontFamily: "Sora", color: NAVY, fontSize: 14, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span>Review · {questions.length} question{questions.length === 1 ? "" : "s"}</span>
                {/* per-section counts */}
                {[...new Set(questions.map((q) => q.subject).filter(Boolean))].map((s) => (
                  <span key={s} style={{ color: NAVY, background: "#eef2ff", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>
                    {s} {questions.filter((q) => q.subject === s).length}
                  </span>
                ))}
                {unanswered > 0 && <span style={{ color: "#b45309", background: "#fef3c7", borderRadius: 20, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{unanswered} missing answer</span>}
              </div>
              <button onClick={addQ} style={{ fontSize: 13, fontWeight: 700, color: ORANGE, background: "none", border: "none", cursor: "pointer" }}>+ Add question</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {questions.map((q, i) => (
                <QuestionCard key={i} q={q} i={i} onChange={(patch) => setQ(i, patch)} onDelete={() => delQ(i)} uploadImage={uploadImage} subjectOptions={sectionSubjects} />
              ))}
            </div>

            {err && (
              <div style={{ marginTop: 16, background: "#fff0f0", border: "1px solid #fca5a5", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} /> {err}
              </div>
            )}

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
                    {t.examTypeLabel && <span style={{ color: NAVY, fontWeight: 700 }}>{t.examTypeLabel}</span>}
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

const iconBtn = { background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "grid", placeItems: "center", padding: 4, flexShrink: 0 };

// Rich editor for one parsed/added question: stem + image, four options (each
// with text + image), correct-answer picker and a worked solution. Collapses to
// a one-line summary so a long paper stays scannable. `uploadImage(file)` pushes
// to Cloudinary and returns the URL.
function QuestionCard({ q, onChange, onDelete, uploadImage, subjectOptions = [] }) {
  const [open, setOpen] = useState(true);
  const [busySlot, setBusySlot] = useState(""); // "q" | "opt-1" … while uploading
  const [imgErr, setImgErr] = useState("");

  const isInt = q.type === "integer";
  const options = q.options?.length ? q.options : ["1", "2", "3", "4"].map((k) => ({ key: k, text: "", image: "" }));
  const setOpt = (k, patch) => onChange({ options: options.map((o) => (o.key === k ? { ...o, ...patch } : o)) });
  const correctOk = String(q.correct).trim().length > 0;

  function pickImage(slot, apply) {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "image/*";
    el.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImgErr(""); setBusySlot(slot);
      try { apply(await uploadImage(file)); }
      catch (ex) { setImgErr(ex.message || "Image upload failed"); }
      finally { setBusySlot(""); }
    };
    el.click();
  }

  const ImgCtl = ({ slot, url, onSet }) =>
    url ? (
      <div style={{ position: "relative", display: "inline-block" }}>
        <img src={url} alt="" style={{ maxHeight: 64, maxWidth: 140, borderRadius: 8, border: "1px solid #e5e7eb", display: "block" }} />
        <button type="button" onClick={() => onSet("")} title="Remove image"
          style={{ position: "absolute", top: -8, right: -8, width: 22, height: 22, borderRadius: "50%", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
          <X size={12} />
        </button>
      </div>
    ) : (
      <button type="button" onClick={() => pickImage(slot, onSet)} disabled={busySlot === slot}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px dashed #d6cdc0", background: "#fafafa", color: MUTE, borderRadius: 8, padding: "7px 11px", fontSize: 12, fontWeight: 600, cursor: busySlot === slot ? "wait" : "pointer" }}>
        {busySlot === slot ? <Loader2 size={13} className="adm-spin" /> : <ImagePlus size={13} />} Image
      </button>
    );

  return (
    <div style={{ border: `1.5px solid ${correctOk ? "#f0e9e0" : "#fca5a5"}`, borderRadius: 12, background: "#fff", overflow: "hidden" }}>
      {/* header / summary row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#faf8f4", borderBottom: open ? "1px solid #f0e9e0" : "none" }}>
        <span style={{ width: 28, height: 28, borderRadius: 8, background: `${ORANGE}15`, color: ORANGE, fontWeight: 800, fontSize: 13, display: "grid", placeItems: "center", flexShrink: 0 }}>{q.qno}</span>
        <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: NAVY, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {q.text || <span style={{ color: "#bbb", fontStyle: "italic" }}>Question {q.qno} — read from the paper</span>}
        </div>
        {!correctOk && <span style={{ fontSize: 10.5, fontWeight: 800, color: "#b45309", background: "#fef3c7", borderRadius: 20, padding: "2px 8px", flexShrink: 0 }}>no answer</span>}
        {subjectOptions.length > 0 && (
          <select value={q.subject || ""} onChange={(e) => onChange({ subject: e.target.value })} style={{ ...inp, height: 30, width: 110, fontSize: 12, flexShrink: 0 }} title="Section / subject">
            <option value="">Subject…</option>
            {subjectOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
        <select value={q.type} onChange={(e) => onChange({ type: e.target.value })} style={{ ...inp, height: 30, width: 92, fontSize: 12, flexShrink: 0 }}>
          <option value="single">MCQ</option>
          <option value="integer">Integer</option>
        </select>
        <button type="button" onClick={() => setOpen((o) => !o)} style={iconBtn}>{open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>
        <button type="button" onClick={onDelete} style={{ ...iconBtn, color: "#ef4444" }}><Trash2 size={15} /></button>
      </div>

      {open && (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* stem + image */}
          <div>
            <span style={lbl}>Question</span>
            <textarea value={q.text || ""} onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Question text (optional — students can also read it from the PDF)"
              rows={2} style={{ ...inp, height: "auto", minHeight: 56, padding: "9px 12px", resize: "vertical", lineHeight: 1.5 }} />
            <div style={{ marginTop: 8 }}><ImgCtl slot="q" url={q.image} onSet={(url) => onChange({ image: url })} /></div>
          </div>

          {/* answer */}
          {isInt ? (
            <div>
              <span style={lbl}>Correct answer (number)</span>
              <input value={q.correct || ""} onChange={(e) => onChange({ correct: e.target.value })} inputMode="decimal"
                placeholder="e.g. 9.8" style={{ ...inp, maxWidth: 200, fontWeight: 700, color: GREEN, borderColor: correctOk ? "#e5e7eb" : "#fca5a5" }} />
            </div>
          ) : (
            <div>
              <span style={lbl}>Options — tap the circle to mark the correct one</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {options.map((o) => {
                  const on = String(q.correct) === String(o.key);
                  return (
                    <div key={o.key} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <button type="button" onClick={() => onChange({ correct: o.key })} title="Mark as correct"
                        style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, marginTop: 3, border: `1.5px solid ${on ? GREEN : "#d6cdc0"}`, background: on ? GREEN : "#fff", color: on ? "#fff" : NAVY, fontWeight: 800, fontSize: 13, cursor: "pointer", display: "grid", placeItems: "center" }}>
                        {o.key}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <input value={o.text || ""} onChange={(e) => setOpt(o.key, { text: e.target.value })}
                          placeholder={`Option ${o.key} text`} style={{ ...inp, height: 36, fontSize: 13 }} />
                        <div style={{ marginTop: 6 }}><ImgCtl slot={`opt-${o.key}`} url={o.image} onSet={(url) => setOpt(o.key, { image: url })} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* worked solution */}
          <div>
            <span style={lbl}>Solution / explanation <span style={{ color: "#bbb", fontWeight: 500 }}>(shown to students after they submit)</span></span>
            <textarea value={q.explanation || ""} onChange={(e) => onChange({ explanation: e.target.value })}
              placeholder="Worked solution or why the answer is correct"
              rows={2} style={{ ...inp, height: "auto", minHeight: 52, padding: "9px 12px", resize: "vertical", lineHeight: 1.5 }} />
          </div>

          {imgErr && <div style={{ color: "#dc2626", fontSize: 12 }}>{imgErr}</div>}
        </div>
      )}
    </div>
  );
}
