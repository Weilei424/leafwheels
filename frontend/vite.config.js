import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.DOCKER_ENV ? "http://backend:8080" : "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  build: {
    sourcemap: true,
    minify: false,
  },
});
