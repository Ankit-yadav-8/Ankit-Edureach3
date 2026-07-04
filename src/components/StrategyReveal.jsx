import { motion } from "framer-motion";

export function StrategyReveal({ children, delay = 0, className = "", style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 0.84, 0.32, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedWidth({ children, width, className = "", style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: `${width}%` }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.2, ease: [0.16, 0.84, 0.32, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedHeight({ children, height, className = "", style = {}, delay = 0 }) {
  return (
    <motion.div
      initial={{ height: 0 }}
      whileInView={{ height: height }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 1.4, ease: [0.16, 0.84, 0.32, 1], delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
