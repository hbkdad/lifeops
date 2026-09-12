import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    // No domain logic exists yet (Epic 0) - real tests land starting Epic 2/3.
    // Don't fail CI on an honestly-empty suite; remove once tests exist.
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
