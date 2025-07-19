import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react(), neonExpressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function neonExpressPlugin(): Plugin {
  return {
    name: "neon-express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Lazy load the Neon server to avoid early initialization
      const { createNeonServer } = require("./server/neon-index");
      const app = createNeonServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
