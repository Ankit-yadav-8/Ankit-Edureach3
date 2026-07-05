/* Markdown — a small, dependency-free renderer tuned for LLM output.
   Handles fenced code blocks (with a copy button + language tag, Claude-style),
   headings, bold / italic / inline code / links, ordered & unordered lists,
   blockquotes, GitHub-style tables and horizontal rules. Inline text is parsed
   into real React nodes (no dangerouslySetInnerHTML) so it stays XSS-safe. */
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

/* Render a LaTeX snippet with KaTeX. KaTeX's HTML output is its own sanitised
   markup (trust:false), so dangerouslySetInnerHTML here is safe. On a parse
   error we fall back to the raw source rather than throwing. */
function mathNode(tex, display, key) {
  let html;
  try {
    html = katex.renderToString(tex.trim(), { throwOnError: false, displayMode: display });
  } catch {
    return <code key={key}>{tex}</code>;
  }
  return (
    <span
      key={key}
      style={display ? { display: "block", margin: "10px 0", overflowX: "auto" } : undefined}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ── inline tokenizer: $math$, $$math$$, \(..\), \[..\], **bold**, *italic*, `code`, [text](url) ── */
function inline(text, theme) {
  const nodes = [];
  const re = /(\$\$([\s\S]+?)\$\$)|(\\\[([\s\S]+?)\\\])|(\$(?!\s)([^$\n]+?)\$)|(\\\(([\s\S]+?)\\\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0, m, key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) nodes.push(mathNode(m[2], true, key++));         // $$display$$
    else if (m[4] !== undefined) nodes.push(mathNode(m[4], true, key++));    // \[display\]
    else if (m[6] !== undefined) nodes.push(mathNode(m[6], false, key++));   // $inline$
    else if (m[8] !== undefined) nodes.push(mathNode(m[8], false, key++));   // \(inline\)
    else if (m[10] !== undefined) nodes.push(<strong key={key++}>{inline(m[10], theme)}</strong>);
    else if (m[12] !== undefined) nodes.push(<em key={key++}>{inline(m[12], theme)}</em>);
    else if (m[14] !== undefined) nodes.push(
      <code key={key++} style={{
        background: theme.inlineCodeBg, color: theme.inlineCodeFg,
        padding: "1.5px 6px", borderRadius: 6, fontSize: ".86em",
        fontFamily: "'Space Grotesk', ui-monospace, monospace",
      }}>{m[14]}</code>
    );
    else if (m[16] !== undefined) nodes.push(
      <a key={key++} href={m[17]} target="_blank" rel="noreferrer"
        style={{ color: theme.link, textDecoration: "underline" }}>{inline(m[16], theme)}</a>
    );
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function CodeBlock({ code, lang, theme }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div style={{ border: `1px solid ${theme.codeBorder}`, borderRadius: 12, overflow: "hidden", margin: "12px 0", background: theme.codeBg }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 12px", background: theme.codeHeadBg, borderBottom: `1px solid ${theme.codeBorder}` }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".03em", color: theme.codeHeadFg, fontFamily: "'Space Grotesk', monospace", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ opacity: .7 }}>&lt;/&gt;</span> {lang || "code"}
        </span>
        <button onClick={copy} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", color: theme.codeHeadFg, cursor: "pointer", fontSize: 11.5, fontWeight: 600 }}>
          {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "13px 14px", overflowX: "auto", fontSize: 13, lineHeight: 1.6, color: theme.codeFg, fontFamily: "'Space Grotesk', ui-monospace, monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Markdown({ text = "", theme }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* fenced code block */
    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const buf = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // skip closing fence
      blocks.push(<CodeBlock key={key++} code={buf.join("\n")} lang={lang} theme={theme} />);
      continue;
    }

    /* blank line */
    if (!line.trim()) { i++; continue; }

    /* horizontal rule */
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={key++} style={{ border: "none", borderTop: `1px solid ${theme.hr}`, margin: "16px 0" }} />); i++; continue; }

    /* heading */
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const size = [0, 1.5, 1.28, 1.12, 1][lvl];
      blocks.push(
        <div key={key++} style={{ fontFamily: theme.display, fontWeight: 800, fontSize: `${size}rem`, color: theme.heading, margin: "16px 0 8px", lineHeight: 1.3 }}>
          {inline(h[2], theme)}
        </div>
      );
      i++; continue;
    }

    /* blockquote */
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      blocks.push(
        <blockquote key={key++} style={{ borderLeft: `3px solid ${theme.link}`, padding: "4px 0 4px 14px", margin: "10px 0", color: theme.bodyDim, fontStyle: "italic" }}>
          {inline(buf.join(" "), theme)}
        </blockquote>
      );
      continue;
    }

    /* table (GitHub-style: header row, separator, body rows) */
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const parseRow = (r) => r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
      const head = parseRow(line);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) { rows.push(parseRow(lines[i])); i++; }
      blocks.push(
        <div key={key++} style={{ overflowX: "auto", margin: "12px 0" }}>
          <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>
            <thead>
              <tr>{head.map((c, j) => <th key={j} style={{ textAlign: "left", padding: "8px 11px", borderBottom: `2px solid ${theme.codeBorder}`, color: theme.heading, fontWeight: 700, background: theme.tableHead }}>{inline(c, theme)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j} style={{ padding: "8px 11px", borderBottom: `1px solid ${theme.hr}`, color: theme.body }}>{inline(c, theme)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    /* unordered list */
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*[-*+]\s+/, "")); i++; }
      blocks.push(
        <ul key={key++} style={{ margin: "8px 0", paddingLeft: 22, display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((it, j) => <li key={j} style={{ color: theme.body, lineHeight: 1.65 }}>{inline(it, theme)}</li>)}
        </ul>
      );
      continue;
    }

    /* ordered list */
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) { items.push(lines[i].replace(/^\s*\d+[.)]\s+/, "")); i++; }
      blocks.push(
        <ol key={key++} style={{ margin: "8px 0", paddingLeft: 24, display: "flex", flexDirection: "column", gap: 4 }}>
          {items.map((it, j) => <li key={j} style={{ color: theme.body, lineHeight: 1.65 }}>{inline(it, theme)}</li>)}
        </ol>
      );
      continue;
    }

    /* paragraph (gather consecutive non-special lines) */
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>\s?|\s*[-*+]\s+|\s*\d+[.)]\s+|---+$)/.test(lines[i]) && !lines[i].includes("|")) {
      buf.push(lines[i]); i++;
    }
    blocks.push(
      <p key={key++} style={{ margin: "8px 0", color: theme.body, lineHeight: 1.7 }}>
        {inline(buf.join(" "), theme)}
      </p>
    );
  }

  return <div style={{ fontSize: 14.5 }}>{blocks}</div>;
}
