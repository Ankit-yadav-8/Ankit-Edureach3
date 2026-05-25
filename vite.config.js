import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo is served at https://ankit-yadav-8.github.io/Ankit-Edureach2/
// so the production base must match the repo name. Dev stays at "/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/Ankit-Edureach2/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
}));
