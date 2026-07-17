import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("framer-motion")) return "motion";
            if (id.includes("lucide-react")) return "icons";

            // Charting and maths rendering are heavy and only a handful of lazy
            // routes use them. They MUST NOT share a chunk with anything the
            // entry touches: a chunk is preloaded if *any* module in it is
            // reachable eagerly, so when these sat in the catch-all "libs" bucket
            // one tiny eager dependency dragged all ~690KB of recharts + katex
            // onto every page, /admin included.
            if (
              id.includes("recharts") || id.includes("/d3-") || id.includes("\\d3-") ||
              id.includes("victory-vendor") || id.includes("internmap") ||
              id.includes("decimal.js") || id.includes("fast-equals") || id.includes("eventemitter3")
            ) return "charts";
            if (id.includes("katex")) return "katex";

            if (id.includes("react-dom") || id.includes("react-router")) return "vendor";
            if (id.includes("react")) return "vendor";
            return "libs";
          }
          // Split large data files into separate async chunks
          if (id.includes("/data/neetBlogs")) return "data-neet";
          if (id.includes("/data/colleges.js")) return "data-colleges";
          if (id.includes("/data/premiumClass")) return "data-premium";
        },
      },
    },
  },
});