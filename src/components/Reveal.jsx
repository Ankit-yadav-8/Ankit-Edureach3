import { motion } from "framer-motion";

/**
 * Reveal — animates children up + fade when scrolled into view.
 * Usage: <Reveal delay={0.1}><Card/></Reveal>
 */
export default function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
