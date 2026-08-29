import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  plugins: [
    tsconfigPaths({ projects: ["./tsconfig.vitest.json"] }),
    react(),
  ],
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next", "lib/generated"],
  },
});