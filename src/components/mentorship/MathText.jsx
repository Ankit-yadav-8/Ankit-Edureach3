/* MathText — a lightweight inline renderer for CBT question/option/solution
   text. Turns $inline$, $$display$$, \(inline\) and \[display\] into KaTeX,
   renders GitHub-style markdown tables (the vision model emits frequency/data
   tables that way), and leaves everything else as plain text with newlines
   preserved. Much smaller than a full Markdown renderer and needs no theme, so
   it drops straight into the test player and the post-submit review. */
import katex from "katex";
import "katex/dist/katex.min.css";

// KaTeX emits its own sanitised markup (throwOnError:false), so the
// dangerouslySetInnerHTML below is safe. Returns null on a parse failure so the
// caller can fall back to the raw source instead of throwing.
function mathHtml(tex, display) {
  try {
    return katex.renderToString(String(tex).trim(), { throwOnError: false, displayMode: display });
  } catch {
    return null;
  }
}

// Render a run of text, turning math delimiters into KaTeX. Returns an array of
// React children (strings + <span>s).
function renderInline(src, keyBase = 0) {
  // $$display$$ | \[display\] | $inline$ | \(inline\)
  const re = /(\$\$([\s\S]+?)\$\$)|(\\\[([\s\S]+?)\\\])|(\$(?!\s)([^$\n]+?)\$)|(\\\(([\s\S]+?)\\\))/g;
  const out = [];
  let last = 0, m, key = keyBase;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const display = m[2] !== undefined || m[4] !== undefined;
    const tex = m[2] ?? m[4] ?? m[6] ?? m[8];
    const html = mathHtml(tex, display);
    out.push(
      html
        ? <span key={`m${key++}`} style={display ? { display: "inline-block", margin: "4px 0", maxWidth: "100%", overflowX: "auto" } : undefined} dangerouslySetInnerHTML={{ __html: html }} />
        : m[0]
    );
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));
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

const tableStyle = { display: "inline-table", borderCollapse: "collapse", margin: "8px 0", fontSize: "0.95em", maxWidth: "100%" };
const cellStyle = { border: "1px solid #cbd5e1", padding: "4px 9px", textAlign: "left", verticalAlign: "middle", whiteSpace: "normal" };

function MdTable({ rows, kb }) {
  const [head, ...body] = rows;
  const cols = Math.max(head.length, ...body.map((r) => r.length));
  const cell = (r, n) => (r[n] ?? "");
  return (
    <table style={tableStyle}>
      <thead>
        <tr>{Array.from({ length: cols }, (_, j) => (
          <th key={j} style={{ ...cellStyle, background: "#f1f5f9", fontWeight: 700 }}>{renderInline(cell(head, j), kb + j * 7)}</th>
        ))}</tr>
      </thead>
      <tbody>
        {body.map((r, i) => (
          <tr key={i}>{Array.from({ length: cols }, (_, j) => (
            <td key={j} style={cellStyle}>{renderInline(cell(r, j), kb + (i + 1) * 113 + j * 7)}</td>
          ))}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default function MathText({ text = "", style }) {
  const src = String(text);
  const lines = src.split("\n");
  const blocks = [];
  let buf = [];
  const flushText = () => { if (buf.length) { blocks.push({ type: "text", text: buf.join("\n") }); buf = []; } };

  for (let i = 0; i < lines.length; i++) {
    // A table = a header row, a separator row, then zero or more data rows.
    if (isRow(lines[i]) && i + 1 < lines.length && isSepRow(lines[i + 1]) && lines[i + 1].includes("-")) {
      flushText();
      const rows = [splitRow(lines[i])];
      i += 2; // consume header + separator
      while (i < lines.length && isRow(lines[i]) && !isSepRow(lines[i])) { rows.push(splitRow(lines[i])); i++; }
      i--; // the for-loop will re-increment
      blocks.push({ type: "table", rows });
    } else {
      buf.push(lines[i]);
    }
  }
  flushText();

  // No tables → behave exactly like the original lightweight inline renderer.
  if (blocks.length === 1 && blocks[0].type === "text") {
    return <span style={{ whiteSpace: "pre-wrap", ...style }}>{renderInline(blocks[0].text)}</span>;
  }
  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {blocks.map((b, i) => b.type === "table"
        ? <MdTable key={`t${i}`} rows={b.rows} kb={i * 1000} />
        : <span key={`x${i}`}>{renderInline(b.text, i * 1000)}</span>)}
    </span>
  );
}
