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