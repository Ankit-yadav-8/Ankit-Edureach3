/* MathText — a lightweight inline renderer for CBT question/option/solution
   text. Turns $inline$, $$display$$, \(inline\) and \[display\] into KaTeX and
   leaves everything else as plain text; newlines are preserved. Much smaller
   than the full Markdown renderer and needs no theme, so it drops straight into
   the test player and the post-submit review. */
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

export default function MathText({ text = "", style }) {
  const src = String(text);
  // $$display$$ | \[display\] | $inline$ | \(inline\)
  const re = /(\$\$([\s\S]+?)\$\$)|(\\\[([\s\S]+?)\\\])|(\$(?!\s)([^$\n]+?)\$)|(\\\(([\s\S]+?)\\\))/g;
  const out = [];
  let last = 0, m, key = 0;

  while ((m = re.exec(src)) !== null) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const display = m[2] !== undefined || m[4] !== undefined;
    const tex = m[2] ?? m[4] ?? m[6] ?? m[8];
    const html = mathHtml(tex, display);
    out.push(
      html
        ? <span key={key++} style={display ? { display: "inline-block", margin: "4px 0", maxWidth: "100%", overflowX: "auto" } : undefined} dangerouslySetInnerHTML={{ __html: html }} />
        : m[0]
    );
    last = re.lastIndex;
  }
  if (last < src.length) out.push(src.slice(last));

  return <span style={{ whiteSpace: "pre-wrap", ...style }}>{out}</span>;
}
