/* BlogPost — full article page at /blog/:slug. Renders the post body, a back
   control, and a few "read next" cards. */
import { useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, GitCompareArrows, Gauge, Building2, Brain, ListChecks,
  TrendingUp, ShieldCheck, Layers, Clock, ArrowRight, Trophy, Medal, Award,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { CL } from "../components/home/clTheme.js";
import { BLOG_POSTS, getBlogPost } from "../data/blog.js";

const ICONS = { BookOpen, GitCompareArrows, Gauge, Building2, Brain, ListChecks, TrendingUp, ShieldCheck, Layers, Trophy, Medal, Award };
const ACCENTS = { coral: CL.coral, green: CL.green, blue: CL.blue, violet: CL.violet, amber: CL.amber };

/* Inline spans: {t} text · {b} bold · {i} italic · {l,h} link (internal = SPA nav) */
function Spans({ spans, accent }) {
  return spans.map((s, i) => {
    if (s.b) return <strong key={i} style={{ color: CL.ink, fontWeight: 700 }}>{s.b}</strong>;
    if (s.i) return <em key={i}>{s.i}</em>;
    if (s.l) {
      const linkStyle = { color: accent, fontWeight: 600, textDecoration: "none", borderBottom: `1px solid ${accent}55` };
      return s.h.startsWith("/")
        ? <Link key={i} to={s.h} style={linkStyle}>{s.l}</Link>
        : <a key={i} href={s.h} target="_blank" rel="noopener noreferrer" style={linkStyle}>{s.l}</a>;
    }
    return <span key={i}>{s.t}</span>;
  });
}

/* Renders one body block — supports rich ({type}) and legacy ({h?,p}) shapes. */
function Block({ block, accent }) {
  const pStyle = { fontSize: "1.04rem", lineHeight: 1.85, color: CL.body, margin: "0 0 20px" };
  if (block.type === "h2")
    return <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.42rem", color: CL.ink, letterSpacing: "-0.5px", margin: "34px 0 14px", lineHeight: 1.25 }}>{block.t}</h2>;
  if (block.type === "h3")
    return <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.14rem", color: CL.ink2, margin: "24px 0 10px", lineHeight: 1.3 }}>{block.t}</h3>;
  if (block.type === "ul")
    return (
      <ul style={{ margin: "0 0 20px", paddingLeft: 4, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {block.items.map((it, i) => (
          <li key={i} style={{ position: "relative", paddingLeft: 22, fontSize: "1.04rem", lineHeight: 1.7, color: CL.body }}>
            <span style={{ position: "absolute", left: 2, top: 9, width: 7, height: 7, borderRadius: "50%", background: accent }} />
            <Spans spans={it} accent={accent} />
          </li>
        ))}
      </ul>
    );
  if (block.type === "p")
    return <p style={pStyle}><Spans spans={block.s} accent={accent} /></p>;
  if (block.type === "note")
    return (
      <div style={{
        margin: "0 0 22px", padding: "14px 18px", borderRadius: 12,
        background: `${accent}0E`, borderLeft: `3px solid ${accent}`,
        fontSize: "1rem", lineHeight: 1.7, color: CL.ink2,
      }}>
        <Spans spans={block.s} accent={accent} />
      </div>
    );
  if (block.type === "table")
    return (
      /* Wide tables scroll inside their own container so the page never scrolls sideways. */
      <div style={{ margin: "0 0 24px", overflowX: "auto", borderRadius: 12, border: `1px solid ${CL.line}`, background: CL.card }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 460, fontSize: 14 }}>
          <thead>
            <tr>
              {block.head.map((cell, i) => (
                <th key={i} style={{
                  textAlign: "left", padding: "11px 14px", background: `${accent}12`,
                  fontFamily: CL.display, fontWeight: 800, fontSize: 12.5, color: CL.ink,
                  borderBottom: `1px solid ${CL.line}`, whiteSpace: "nowrap",
                }}>
                  <Spans spans={cell} accent={accent} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r} style={{ background: r % 2 ? CL.cream2 : "transparent" }}>
                {row.map((cell, c) => (
                  <td key={c} style={{
                    padding: "10px 14px", color: CL.body, lineHeight: 1.6, verticalAlign: "top",
                    borderBottom: r === block.rows.length - 1 ? "none" : `1px solid ${CL.line}`,
                  }}>
                    <Spans spans={cell} accent={accent} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  // legacy { h?, p }
  return (
    <div style={{ marginBottom: 2 }}>
      {block.h && <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.3rem", color: CL.ink, letterSpacing: "-0.4px", margin: "22px 0 10px" }}>{block.h}</h2>}
      <p style={pStyle}>{block.p}</p>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = post ? `${post.title} · College Parichay Blog` : "Blog · College Parichay";
  }, [slug, post]);

  // Result cards (Round 1/2/3) live on dedicated pages via `link` and have no
  // article body — redirect if someone lands on their /blog/:slug directly.
  if (post?.link) return <Navigate to={post.link} replace />;

  if (!post || !post.body) {
    return (
      <div style={{ background: CL.cream, minHeight: "100vh", paddingTop: 128 }}>
        <div className="container" style={{ textAlign: "center", paddingBottom: 80 }}>
          <h1 style={{ fontFamily: CL.display, color: CL.ink, marginBottom: 18 }}>Article not found</h1>
          <Link to="/blog" className="btn btn-coral">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const Ic = ICONS[post.iconName] || BookOpen;
  const accent = ACCENTS[post.accent] || CL.coral;
  const isNeet = post.category === "NEET";

  // "Read next" — prefer siblings in the same category, then fill from the rest
  const rest = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  const more = [
    ...rest.filter((p) => p.category === post.category),
    ...rest.filter((p) => p.category !== post.category),
  ].slice(0, 3);

  const desc = post.metaDescription || post.snippet;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: desc,
    author: { "@type": "Organization", name: post.author || "College Parichay" },
    publisher: {
      "@type": "Organization",
      name: "CollegeParichay",
      logo: { "@type": "ImageObject", url: "https://collegeparichay.in/cplogo.svg" },
    },
    mainEntityOfPage: `https://collegeparichay.in/blog/${post.slug}`,
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    ...(post.focusKeyword
      ? { keywords: [post.focusKeyword, ...(post.secondaryKeywords || [])].join(", ") }
      : {}),
  };

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo title={post.title} description={desc} path={`/blog/${post.slug}`} type="article" jsonLd={jsonLd}
        keywords={post.focusKeyword ? [post.focusKeyword, ...(post.secondaryKeywords || [])] : undefined}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      <article style={{ paddingTop: 110, paddingBottom: 70 }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <BackButton to="/blog" label="Back to Blog" style={{ marginBottom: 24 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <span style={{ width: 52, height: 52, borderRadius: 14, background: `${accent}18`, display: "grid", placeItems: "center", flexShrink: 0 }}>
              <Ic size={26} color={accent} />
            </span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".06em", color: accent, textTransform: "uppercase" }}>{post.category}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: CL.muted, marginTop: 3 }}>
                <Clock size={13} /> {post.read} · {post.tag}
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.5vw,2.8rem)", color: CL.ink, letterSpacing: "-1px", lineHeight: 1.12, margin: "0 0 18px" }}>
            {post.title}
          </motion.h1>

          <p style={{ fontSize: "1.18rem", lineHeight: 1.7, color: CL.ink2, fontWeight: 500, marginBottom: 28, paddingBottom: 24, borderBottom: `1px solid ${CL.line}` }}>
            {post.snippet}
          </p>

          {post.body.map((block, i) => <Block key={i} block={block} accent={accent} />)}

          <div style={{ marginTop: 30, padding: "18px 20px", borderRadius: 14, background: CL.coralSoft + "66", border: `1px solid ${CL.coral}33`, fontSize: 13.5, color: CL.ink2, lineHeight: 1.6 }}>
            {isNeet
              ? "These guides are indicative and student-written — cutoffs and fees vary every year, so always verify the latest figures on mcc.nic.in, your state counselling site and nta.ac.in before locking decisions."
              : "These guides are indicative and student-written — always verify the latest rules on josaa.nic.in / csab.nic.in / nta.ac.in before locking decisions."}
          </div>

          {/* read next */}
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.2rem", color: CL.ink, marginBottom: 18 }}>Read next</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(220px, 100%), 1fr))", gap: 14 }}>
              {more.map((p) => {
                const PIc = ICONS[p.iconName] || BookOpen;
                const pac = ACCENTS[p.accent] || CL.coral;
                return (
                  <Link key={p.slug} to={`/blog/${p.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: CL.card, border: `1px solid ${CL.line}`, borderRadius: 14, boxShadow: CL.shadow, padding: "16px 16px", height: "100%" }}>
                      <span style={{ width: 34, height: 34, borderRadius: 10, background: `${pac}18`, display: "grid", placeItems: "center", marginBottom: 10 }}>
                        <PIc size={17} color={pac} />
                      </span>
                      <div style={{ fontFamily: CL.display, fontWeight: 800, fontSize: 14, color: CL.ink, lineHeight: 1.3, marginBottom: 6 }}>{p.title}</div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: pac }}>Read <ArrowRight size={12} /></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
