import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: "tests/rules",
    include: ["**/*.test.ts"],
    environment: "node",
    // Rules tests share one emulator; run files one at a time so clearing
    // data in one file cannot race with another.
    fileParallelism: false,
    testTimeout: 15_000,
    hookTimeout: 30_000,
  },
});
