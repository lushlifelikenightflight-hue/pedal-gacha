import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sites } from "@openai/sites-vite-plugin";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/pedal-gacha/" : "/",
  plugins: [react(), sites()],
  server: { host: "127.0.0.1", port: 4173 },
  preview: { host: "127.0.0.1", port: 4173 },
});
