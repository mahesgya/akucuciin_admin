import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  server: {
    port: 5173,
    host: true,

    proxy: {
      "/api": {
        target: "https://apiv3.akucuciin.my.id",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
