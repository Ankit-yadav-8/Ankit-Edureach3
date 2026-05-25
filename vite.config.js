import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Ankit-Edureach3/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
}));