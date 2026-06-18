/* BlogPost — full article page at /blog/:slug. Renders the post body, a back
   control, and a few "read next" cards. */
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, GitCompareArrows, Gauge, Building2, Brain, ListChecks,
  TrendingUp, ShieldCheck, Layers, Clock, ArrowRight,
} from "lucide-react";
import Seo from "../components/Seo.jsx";
import BackButton from "../components/BackButton.jsx";
import { CL } from "../components/home/clTheme.js";
import { BLOG_POSTS, getBlogPost } from "../data/blog.js";

const ICONS = { BookOpen, GitCompareArrows, Gauge, Building2, Brain, ListChecks, TrendingUp, ShieldCheck, Layers };
const ACCENTS = { coral: CL.coral, green: CL.green, blue: CL.blue, violet: CL.violet, amber: CL.amber };

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = post ? `${post.title} · College Parichay Blog` : "Blog · College Parichay";
  }, [slug, post]);

  if (!post) {
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
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div style={{ background: CL.cream, minHeight: "100vh" }}>
      <Seo title={`${post.title} · College Parichay Blog`} description={post.snippet} path={`/blog/${post.slug}`} />

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

          {post.body.map((block, i) => (
            <div key={i} style={{ marginBottom: 22 }}>
              {block.h && (
                <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.3rem", color: CL.ink, letterSpacing: "-0.4px", margin: "10px 0 10px" }}>
                  {block.h}
                </h2>
              )}
              <p style={{ fontSize: "1.04rem", lineHeight: 1.85, color: CL.body }}>{block.p}</p>
            </div>
          ))}

          <div style={{ marginTop: 30, padding: "18px 20px", borderRadius: 14, background: CL.coralSoft + "66", border: `1px solid ${CL.coral}33`, fontSize: 13.5, color: CL.ink2, lineHeight: 1.6 }}>
            These guides are indicative and student-written — always verify the latest rules on josaa.nic.in / csab.nic.in / nta.ac.in before locking decisions.
          </div>

          {/* read next */}
          <div style={{ marginTop: 48 }}>
            <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.2rem", color: CL.ink, marginBottom: 18 }}>Read next</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
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
