/**
 * @file vite.config.js
 * @description Configures the Vite development and build environment.
 *
 * Responsibilities:
 * - Register the React plugin.
 * - Proxy frontend API requests to the backend during development.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

