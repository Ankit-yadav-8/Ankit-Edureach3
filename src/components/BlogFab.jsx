/* BlogFab — a small floating "Blog" tab pinned to the right edge, vertically
   centred. Present on every device (desktop, tablet, iPhone). Opens /blog. */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function BlogFab() {
  const nav = useNavigate();
  return (
    <motion.button
      onClick={() => nav("/blog")}
      aria-label="Open the blog"
      title="Read the blog"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.96 }}
      style={{
        position: "fixed", right: 0, top: "50%", transform: "translateY(-50%)",
        zIndex: 1300,
        display: "flex", alignItems: "center", gap: 7,
        padding: "11px 13px", border: "none", cursor: "pointer",
        background: "linear-gradient(135deg, #F15A38, #E0421F)", color: "#fff",
        borderRadius: "14px 0 0 14px",
        boxShadow: "0 10px 26px -8px rgba(241,90,56,.6)",
        fontFamily: "'Space Grotesk','Sora',sans-serif", fontWeight: 800, fontSize: 12.5,
        writingMode: "vertical-rl",
      }}
    >
      <BookOpen size={15} style={{ transform: "rotate(90deg)" }} />
      Blog
    </motion.button>
  );
}
