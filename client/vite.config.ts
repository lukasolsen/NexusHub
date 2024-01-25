import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  envDir: path.resolve(__dirname),
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../shared"),

      
    },
  },
  server: {
    host: process.env.VITE_HOST_IP || "localhost",
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
