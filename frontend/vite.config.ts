import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000", // Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
