/* ExamBuzzHome — compact home teaser for the Exam Buzz hub.
   News + Applications + the counselling Radar now live together on the
   dedicated /exam-buzz page; this card invites users in. */
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Radio, Newspaper, CalendarClock, ArrowRight, BookOpen } from "lucide-react";
import { NEWS } from "../../data/news.js";
import { RADAR } from "../../data/counselling.js";
import { BLOG_POSTS } from "../../data/blog.js";
import { CL, clEyebrow } from "./clTheme.js";

export default function ExamBuzzHome() {
  const latest = NEWS.slice(0, 3);
  const openDeadlines = RADAR.length;

  return (
    <section style={{ background: CL.cream, padding: "84px 0", position: "relative", overflow: "hidden" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 36px" }}>
          <span style={clEyebrow}><Radio size={13} /> Exam Buzz</span>
          <h2 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "clamp(1.9rem,4.2vw,2.7rem)", color: CL.ink, letterSpacing: "-1.1px", margin: "16px 0 12px", lineHeight: 1.1 }}>
            Every update & deadline, <span style={{ color: CL.coral }}>in one feed.</span>
          </h2>
          <p style={{ color: CL.body, fontSize: "1.04rem", lineHeight: 1.7 }}>
            Results, admit cards and counselling schedules — plus a live application & counselling radar so you never miss a date.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(290px, 100%), 1fr))", gap: 20, maxWidth: 980, margin: "0 auto" }}>
          {/* news preview */}
          <motion.div whileHover={{ y: -5 }} style={{ background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: "24px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: CL.coralSoft, display: "grid", placeItems: "center" }}>
                <Newspaper size={20} color={CL.coral} />
              </span>
              <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.15rem", color: CL.ink }}>Latest Updates</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {latest.map((n) => (
                <div key={n.slug} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: CL.coral, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: CL.ink2, lineHeight: 1.45 }}>
                    <strong style={{ color: CL.coralDk }}>{n.tags[0]}</strong> · {n.title}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/exam-buzz" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13.5, fontFamily: CL.display }}>
              Read all updates <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* radar preview */}
          <motion.div whileHover={{ y: -5 }} style={{ background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: "24px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: CL.greenSoft, display: "grid", placeItems: "center" }}>
                <CalendarClock size={20} color="#0a8f5b" />
              </span>
              <div>
                <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.15rem", color: CL.ink }}>Application & Counselling Radar</h3>
                <span style={{ fontSize: 12, color: "#0a8f5b", fontWeight: 700 }}>{openDeadlines} live windows tracked</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {RADAR.slice(0, 3).map((r) => (
                <div key={r.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: CL.cream2, border: `1px solid ${CL.cream3}`, borderRadius: 10, padding: "9px 12px" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: CL.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
                  <span style={{ fontSize: 11.5, color: CL.coralDk, fontWeight: 700, whiteSpace: "nowrap" }}>{r.deadline}</span>
                </div>
              ))}
            </div>
            <Link to="/exam-buzz" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13.5, fontFamily: CL.display }}>
              Open the full radar <ArrowRight size={15} />
            </Link>
          </motion.div>

          {/* blog preview */}
          <motion.div whileHover={{ y: -5 }} style={{ background: CL.card, borderRadius: 20, border: `1px solid ${CL.line}`, boxShadow: CL.shadow, padding: "24px 24px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(58,134,255,.12)", display: "grid", placeItems: "center" }}>
                <BookOpen size={20} color={CL.blue} />
              </span>
              <div>
                <h3 style={{ fontFamily: CL.display, fontWeight: 800, fontSize: "1.15rem", color: CL.ink }}>From the Blog</h3>
                <span style={{ fontSize: 12, color: CL.blue, fontWeight: 700 }}>Guides by IIT Roorkee alumni</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              {BLOG_POSTS.slice(0, 3).map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} style={{ display: "flex", gap: 9, alignItems: "flex-start", textDecoration: "none" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: CL.blue, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: CL.ink2, lineHeight: 1.45 }}>
                    <strong style={{ color: CL.coralDk }}>{p.category}</strong> · {p.title}
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/blog" style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 7, color: CL.coralDk, fontWeight: 700, fontSize: 13.5, fontFamily: CL.display }}>
              Read the blog <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>

        <div style={{ textAlign: "center", marginTop: 30 }}>
          <Link to="/exam-buzz" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: CL.coral, color: "#fff", padding: "13px 26px", borderRadius: 12, fontFamily: CL.display, fontWeight: 800, fontSize: 14.5, boxShadow: "0 10px 26px rgba(255, 105, 61,.35)" }}>
            Open Exam Buzz <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
