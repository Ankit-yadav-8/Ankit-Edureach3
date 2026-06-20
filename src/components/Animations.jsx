/**
 * Animations.jsx — Reusable dynamic animation components
 * Uses framer-motion + CSS custom animations
 */
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

/* ─────────────────────────────────────────────────────────
   1. FLOATING ORBS — animated background glow blobs
───────────────────────────────────────────────────────── */
export function FloatingOrbs({ count = 5, colors = ["#FF693D", "#6366f1", "#0ea5a4", "#fbbf24", "#8b5cf6"], style = {} }) {
  const orbs = Array.from({ length: count }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: 200 + Math.random() * 200,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 4,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0, ...style }}>
      {orbs.map((o) => (
        <motion.div
          key={o.id}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.08, 0.95, 1.05, 1],
            opacity: [0.12, 0.2, 0.14, 0.18, 0.12],
          }}
          transition={{ duration: o.duration, delay: o.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: o.size,
            height: o.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${o.color}55 0%, ${o.color}22 40%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
            filter: "blur(2px)",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. TYPEWRITER TEXT
───────────────────────────────────────────────────────── */
export function TypewriterText({ words, interval = 2400, style = {}, cursorColor = "#FF693D" }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => { setPaused(false); setDeleting(true); }, interval);
      return () => clearTimeout(t);
    }
    const target = words[idx];
    if (!deleting) {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        setPaused(true);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
        return () => clearTimeout(t);
      } else {
        setDeleting(false);
        setIdx((i) => (i + 1) % words.length);
      }
    }
  }, [displayed, deleting, paused, idx, words, interval]);

  return (
    <span style={{ ...style }}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{ color: cursorColor, fontWeight: 300, marginLeft: 2 }}
      >|</motion.span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   3. 3D TILT CARD — perspective tilt on mouse move
───────────────────────────────────────────────────────── */
export function TiltCard({ children, style = {}, intensity = 12 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });
  const glowOpacity = useSpring(0, { stiffness: 200, damping: 25 });
  // Hoist useTransform out of JSX to comply with Rules of Hooks
  const shineBg = useTransform(
    [x, y],
    ([xv, yv]) => `radial-gradient(circle at ${(xv + 0.5) * 100}% ${(yv + 0.5) * 100}%, rgba(255,255,255,0.10) 0%, transparent 60%)`
  );

  const handleMove = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleEnter = useCallback(() => { scale.set(1.03); glowOpacity.set(1); }, [scale, glowOpacity]);
  const handleLeave = useCallback(() => { x.set(0); y.set(0); scale.set(1); glowOpacity.set(0); }, [x, y, scale, glowOpacity]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", position: "relative", ...style }}
    >
      {/* Shine overlay */}
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 10,
          background: shineBg,
          opacity: glowOpacity,
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. RIPPLE BUTTON
───────────────────────────────────────────────────────── */
export function RippleButton({ children, onClick, style = {}, className = "", color = "rgba(255,255,255,0.35)" }) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const btn = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - btn.left;
    const y = e.clientY - btn.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((rr) => rr.id !== id)), 700);
    onClick?.(e);
  };

  return (
    <button onClick={handleClick} style={{ position: "relative", overflow: "hidden", ...style }} className={className}>
      {children}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ width: 0, height: 0, opacity: 0.6, x: r.x, y: r.y }}
          animate={{ width: 300, height: 300, opacity: 0, x: r.x - 150, y: r.y - 150 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          style={{
            position: "absolute", borderRadius: "50%",
            background: color, pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────
   5. STAGGER CONTAINER — animate children with stagger
───────────────────────────────────────────────────────── */
export function StaggerReveal({ children, stagger = 0.08, delay = 0, className = "", style = {} }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, y = 24, style = {} }) {
  return (
    <motion.div
      style={style}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   6. GRADIENT TEXT — animated shifting gradient
───────────────────────────────────────────────────────── */
export function GradientText({ children, from = "#FF693D", via = "#fbbf24", to = "#FF693D", style = {}, animate = true }) {
  return (
    <span style={{
      background: `linear-gradient(90deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
      backgroundSize: animate ? "200% auto" : "100% auto",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      animation: animate ? "gradientShift 3s linear infinite" : "none",
      display: "inline-block",
      ...style,
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   7. GLOW BORDER CARD — animated rotating gradient border
───────────────────────────────────────────────────────── */
export function GlowBorderCard({ children, color = "#FF693D", radius = 16, style = {} }) {
  return (
    <div style={{ position: "relative", borderRadius: radius, ...style }}>
      {/* Animated border */}
      <div style={{
        position: "absolute", inset: -2, borderRadius: radius + 2,
        background: `conic-gradient(from 0deg, ${color}, ${color}44, transparent, ${color}44, ${color})`,
        animation: "rotateBorder 4s linear infinite",
        zIndex: 0,
      }} />
      <div style={{ position: "relative", zIndex: 1, borderRadius: radius, overflow: "hidden", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   8. COUNTER BADGE — animated number with flash
───────────────────────────────────────────────────────── */
export function CounterBadge({ value, label, color = "#FF693D", style = {} }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={triggered ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      style={{ textAlign: "center", ...style }}
    >
      <motion.div
        animate={triggered ? { scale: [1, 1.25, 1] } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{ fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: "2.2rem", color, lineHeight: 1, letterSpacing: "-1px" }}
      >
        {value}
      </motion.div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 5, fontFamily: "'DM Sans',sans-serif" }}>{label}</div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   9. WAVE SVG SEPARATOR
───────────────────────────────────────────────────────── */
export function WaveSeparator({ fillTop = "#fff", fillBottom = "#fff7ef", flip = false, style = {} }) {
  return (
    <div style={{ lineHeight: 0, overflow: "hidden", transform: flip ? "scaleY(-1)" : "none", background: fillTop, ...style }}>
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 64 }}>
        <path
          d="M0,32 C180,64 360,0 540,32 C720,64 900,0 1080,32 C1260,64 1380,16 1440,32 L1440,64 L0,64 Z"
          fill={fillBottom}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   10. ANIMATED NUMBER — smooth count-up on view
───────────────────────────────────────────────────────── */
export function AnimatedNumber({ target, suffix = "", prefix = "", duration = 1.8, style = {} }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const triggered = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered.current) {
        triggered.current = true;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min((now - start) / (duration * 1000), 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} style={style}>
      {prefix}{val.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────
   11. MAGNETIC BUTTON — subtle magnetic pull on hover
───────────────────────────────────────────────────────── */
export function MagneticButton({ children, style = {}, className = "", onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ x: sx, y: sy, ...style }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────────────────────
   12. SCROLL PROGRESS LINE (top of page)
───────────────────────────────────────────────────────── */
export function ScrollProgressBar({ color = "#FF693D" }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, height: 3,
        background: color, zIndex: 9999,
        width: `${progress}%`,
        transformOrigin: "left",
        boxShadow: "0 0 8px rgba(255, 105, 61,.6)",
      }}
    />
  );
}
