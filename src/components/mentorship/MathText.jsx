/* MathText — a lightweight inline renderer for CBT question/option/solution
   text. Turns $inline$, $$display$$, \(inline\) and \[display\] into KaTeX,
   renders GitHub-style markdown tables (the vision model emits frequency/data
   tables that way), auto-detects common plain-text math (x^2, a_1, 1/2, Greek
   letters, arrows), and leaves everything else as plain text with newlines
   preserved. Much smaller than a full Markdown renderer and needs no theme, so
   it drops straight into the test player and the post-submit review. */
import katex from "katex";
import "katex/dist/katex.min.css";

// Some converted papers lost the leading backslash on LaTeX commands that take a
// braced argument (e.g. "vec{a}", "frac{1}{2}", "sqrt{2}"), so KaTeX rendered the
// command name as literal italic letters ("veca" instead of an arrow over a).
// Restore the backslash for a known, safe set of commands when one is missing —
// fixes both already-saved questions and new conversions. A command already
// preceded by a backslash (or letters, so it's mid-word) is left untouched.
const BARE_CMD_RE = /(^|[^\\A-Za-z])(vec|hat|bar|tilde|widehat|widetilde|overrightarrow|overline|underline|dot|ddot|frac|dfrac|tfrac|binom|sqrt|operatorname|mathbb|mathbf|mathrm|mathcal|mathit|boldsymbol|text)(\s*\{)/g;
function fixBareCommands(tex) {
  return String(tex).replace(BARE_CMD_RE, (_, pre, cmd, brace) => `${pre}\\${cmd}${brace}`);
}

// KaTeX emits its own sanitised markup (throwOnError:false), so the
// dangerouslySetInnerHTML below is safe. Returns null on a parse failure so the
// caller can fall back to the raw source instead of throwing.
function mathHtml(tex, display) {
  try {
    return katex.renderToString(fixBareCommands(String(tex).trim()), { throwOnError: false, displayMode: display });
  } catch {
    return null;
  }
}

// ── Greek letter mapping (plain-text → LaTeX) ────────────────────────────────
const GREEK = {
  alpha: "\\alpha", beta: "\\beta", gamma: "\\gamma", delta: "\\delta",
  epsilon: "\\epsilon", zeta: "\\zeta", eta: "\\eta", theta: "\\theta",
  iota: "\\iota", kappa: "\\kappa", lambda: "\\lambda", mu: "\\mu",
  nu: "\\nu", xi: "\\xi", pi: "\\pi", rho: "\\rho", sigma: "\\sigma",
  tau: "\\tau", upsilon: "\\upsilon", phi: "\\phi", chi: "\\chi",
  psi: "\\psi", omega: "\\omega",
  Alpha: "A", Beta: "B", Gamma: "\\Gamma", Delta: "\\Delta",
  Theta: "\\Theta", Lambda: "\\Lambda", Pi: "\\Pi", Sigma: "\\Sigma",
  Phi: "\\Phi", Psi: "\\Psi", Omega: "\\Omega",
};
const GREEK_RE = new RegExp(`\\b(${Object.keys(GREEK).join("|")})\\b`, "g");

// ── Symbol replacement (plain-text → LaTeX) ──────────────────────────────────
const SYMBOL_MAP = [
  [/→/g, "\\rightarrow"], [/←/g, "\\leftarrow"], [/↔/g, "\\leftrightarrow"],
  [/⇒/g, "\\Rightarrow"], [/⇐/g, "\\Leftarrow"], [/⇔/g, "\\Leftrightarrow"],
  [/≥/g, "\\geq"], [/≤/g, "\\leq"], [/≠/g, "\\neq"], [/≈/g, "\\approx"],
  [/±/g, "\\pm"], [/∓/g, "\\mp"], [/×/g, "\\times"], [/÷/g, "\\div"],
  [/∞/g, "\\infty"], [/∑/g, "\\sum"], [/∏/g, "\\prod"], [/∫/g, "\\int"],
  [/√/g, "\\sqrt{}"], [/∈/g, "\\in"], [/∉/g, "\\notin"], [/⊂/g, "\\subset"],
  [/∩/g, "\\cap"], [/∪/g, "\\cup"], [/°/g, "^\\circ"],
];

// ── Auto-detect plain-text math and wrap in $ delimiters ─────────────────────
// This catches common patterns students see: x^2, a_1, 1/2, >=, <=, etc.
// and wraps them so KaTeX can render them properly.
function autoWrapMath(src) {
  // Don't process if the source already has KaTeX delimiters
  if (/\$|\\\(|\\\[/.test(src)) return src;

  let out = src;

  // Replace Unicode symbols with LaTeX equivalents wrapped in $
  for (const [re, tex] of SYMBOL_MAP) {
    out = out.replace(re, `$${tex}$`);
  }

  // Replace Greek letter names with LaTeX (only standalone words)
  out = out.replace(GREEK_RE, (m) => `$${GREEK[m]}$`);

  // Superscripts: x^2, x^{n+1}, a^2, CO^2 etc. (letter/digit followed by ^digit(s))
  out = out.replace(/([a-zA-Z0-9)}\]])\^(\{[^}]+\}|\d+)/g, (_, base, exp) => `$${base}^${exp}$`);

  // Subscripts: a_1, x_{n+1}, C_p etc.
  out = out.replace(/([a-zA-Z)}\]])\_([\w]+|\{[^}]+\})/g, (_, base, sub) => `$${base}_${sub}$`);

  // Simple fractions like 1/2, 3/4 (digit/digit) — but not dates like 25/06
  out = out.replace(/(?<!\d)\b(\d+)\/(\d+)\b(?!\/)/g, (_, n, d) => {
    if (Number(d) > 100 || Number(n) > 100) return `${n}/${d}`; // probably a date or ID
    return `$\\frac{${n}}{${d}}$`;
  });

  // >= and <= and != (ASCII notation)
  out = out.replace(/(?<!=)>=(?!=)/g, "$\\geq$");
  out = out.replace(/(?<!=)<=(?!=)/g, "$\\leq$");
  out = out.replace(/!=(?!=)/g, "$\\neq$");

  // Merge adjacent $ delimiters: $x$$y$ → $xy$
  out = out.replace(/\$\$/g, " ");

  return out;
}

// Render a run of text, turning math delimiters into KaTeX. Returns an array of
// React children (strings + <span>s).
function renderInline(src, keyBase = 0) {
  // First, auto-wrap any plain-text math that's not already in delimiters
  const processed = autoWrapMath(src);

  // $$display$$ | \[display\] | $inline$ | \(inline\)
  const re = /(\$\$([\s\S]+?)\$\$)|(\\\[([\s\S]+?)\\\])|(\$(?!\s)([^$\n]+?)\$)|(\\\(([\s\S]+?)\\\))/g;
  const out = [];
  let last = 0, m, key = keyBase;
  while ((m = re.exec(processed)) !== null) {
    if (m.index > last) out.push(processed.slice(last, m.index));
    const display = m[2] !== undefined || m[4] !== undefined;
    const tex = m[2] ?? m[4] ?? m[6] ?? m[8];
    const html = mathHtml(tex, display);
    out.push(
      html
        ? <span key={`m${key++}`} style={display ? { display: "block", margin: "8px 0", maxWidth: "100%", overflowX: "auto", textAlign: "center" } : undefined} dangerouslySetInnerHTML={{ __html: html }} />
        : <code key={`f${key++}`} style={{ background: "#fef3c7", color: "#92400e", padding: "1px 5px", borderRadius: 4, fontSize: "0.9em", fontFamily: "monospace" }}>{m[0]}</code>
    );
    last = re.lastIndex;
  }
  if (last < processed.length) out.push(processed.slice(last));
  return out;
}

// ── Markdown table support ───────────────────────────────────────────────────
const splitRow = (line) => {
  let l = line.trim();
  if (l.startsWith("|")) l = l.slice(1);
  if (l.endsWith("|")) l = l.slice(0, -1);
  return l.split("|").map((c) => c.trim());
};
// A separator row: cells of dashes (with optional alignment colons), e.g.
// "--- | :--: | ---".
const isSepRow = (line) => /^\s*\|?\s*:?-{2,}:?\s*(?:\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
const isRow = (line) => line.includes("|");

const tableStyle = { display: "inline-table", borderCollapse: "collapse", margin: "8px 0", fontSize: "0.95em", maxWidth: "100%", borderRadius: 8, overflow: "hidden" };
const cellStyle = { border: "1px solid #e2e8f0", padding: "6px 11px", textAlign: "left", verticalAlign: "middle", whiteSpace: "normal" };

function MdTable({ rows, kb }) {
  const [head, ...body] = rows;
  const cols = Math.max(head.length, ...body.map((r) => r.length));
  const cell = (r, n) => (r[n] ?? "");
  return (
    <table style={tableStyle}>
      <thead>
        <tr>{Array.from({ length: cols }, (_, j) => (
          <th key={j} style={{ ...cellStyle, background: "#f1f5f9", fontWeight: 700, color: "#0d1b3e" }}>{renderInline(cell(head, j), kb + j * 7)}</th>
        ))}</tr>
      </thead>
      <tbody>
        {body.map((r, i) => (
          <tr key={i} style={{ background: i % 2 ? "#f8fafc" : "#fff" }}>{Array.from({ length: cols }, (_, j) => (
            <td key={j} style={cellStyle}>{renderInline(cell(r, j), kb + (i + 1) * 113 + j * 7)}</td>
          ))}</tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Bold / italic markdown support ───────────────────────────────────────────
function renderFormattedInline(src, keyBase = 0) {
  const mathRendered = renderInline(src, keyBase);
  // Process string segments for **bold** and *italic*
  return mathRendered.map((segment, i) => {
    if (typeof segment !== "string") return segment;
    const parts = [];
    let last = 0, key = keyBase + i * 1000;
    // **bold**
    const boldRe = /\*\*(.+?)\*\*/g;
    let bm;
    while ((bm = boldRe.exec(segment)) !== null) {
      if (bm.index > last) parts.push(segment.slice(last, bm.index));
      parts.push(<strong key={`b${key++}`} style={{ fontWeight: 700 }}>{bm[1]}</strong>);
      last = boldRe.lastIndex;
    }
    if (parts.length === 0) return segment;
    if (last < segment.length) parts.push(segment.slice(last));
    return parts;
  }).flat();
}

export default function MathText({ text = "", style }) {
  let src = String(text);
  if (!src.trim()) return null;

  // Un-flatten inline markdown tables (vision model output without newlines)
  src = src.replace(/\|\s+\|/g, "|\n|");
  const rawLines = src.split("\n");
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (isRow(line)) {
      const next = rawLines[i + 1] ?? "";
      if (isSepRow(next)) {
        // This is a header row. Extract leading text.
        const trimmed = line.trim();
        if (!trimmed.startsWith("|")) {
          const firstPipe = line.indexOf("|");
          if (firstPipe > 0) {
            rawLines.splice(i, 1, line.slice(0, firstPipe).trim(), line.slice(firstPipe).trim());
            i++;
          }
        }
      } else if (i > 0 && (isSepRow(rawLines[i - 1]) || (isRow(rawLines[i - 1]) && rawLines[i - 1].trim().startsWith("|")))) {
        // This is a body row. Extract trailing text.
        const trimmed = line.trim();
        if (!trimmed.endsWith("|")) {
          const lastPipe = line.lastIndexOf("|");
          if (lastPipe !== -1 && lastPipe !== line.length - 1) {
            rawLines.splice(i, 1, line.slice(0, lastPipe + 1).trim(), line.slice(lastPipe + 1).trim());
          }
        }
      }
    }
  }

  const lines = rawLines;
  const blocks = [];
  let buf = [];
  const flushText = () => { if (buf.length) { blocks.push({ type: "text", text: buf.join("\n") }); buf = []; } };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1] ?? "";
    // A table starts on a pipe row followed by EITHER a markdown separator row
    // (| --- | --- |) OR another pipe row — the vision model and coaching papers
    // routinely emit data/frequency tables WITHOUT the separator, and the old
    // code rendered those as a wall of "|" text instead of a real table.
    if (isRow(line) && ((isSepRow(next) && next.includes("-")) || isRow(next))) {
      flushText();
      const rows = [splitRow(line)];
      let j = i + 1;
      if (isSepRow(lines[j])) j++; // skip the optional separator row
      while (j < lines.length && isRow(lines[j])) {
        if (!isSepRow(lines[j])) rows.push(splitRow(lines[j]));
        j++;
      }
      blocks.push({ type: "table", rows });
      i = j - 1; // the for-loop will re-increment
    } else {
      buf.push(line);
    }
  }
  flushText();

  // No tables → behave exactly like the original lightweight inline renderer.
  if (blocks.length === 1 && blocks[0].type === "text") {
    return <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", ...style }}>{renderFormattedInline(blocks[0].text)}</span>;
  }
  return (
    <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", ...style }}>
      {blocks.map((b, i) => b.type === "table"
        ? <MdTable key={`t${i}`} rows={b.rows} kb={i * 1000} />
        : <span key={`x${i}`}>{renderFormattedInline(b.text, i * 1000)}</span>)}
    </span>
  );
}
