import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    target: "node18",
    outDir: "dist/server",
    rollupOptions: {
      input: "server/neon-index.ts",
      output: {
        entryFileNames: "neon-build.mjs",
      },
      external: [
        "@neondatabase/serverless",
        "pg",
        "bcryptjs",
        "jsonwebtoken",
        "express",
        "cors",
      ],
    },
  },
  optimizeDeps: {
    exclude: ["@neondatabase/serverless"],
  },
});
