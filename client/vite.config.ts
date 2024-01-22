import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

console.log("Root path", path.resolve(__dirname, "../shared"));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),
    },
  },
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(__dirname, "../shared/ssl/server.key"),
        "utf-8"
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, "../shared/ssl/server.cert"),
        "utf-8"
      ),
    },
  },
  plugins: [react(), TanStackRouterVite()],
});
