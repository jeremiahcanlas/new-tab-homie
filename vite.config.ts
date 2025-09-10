/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  server: {
    proxy: {
      "/api/suggestions": {
        target: "https://suggestqueries.google.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/suggestions/, "/complete/search"),
      },
    },
  },
});
