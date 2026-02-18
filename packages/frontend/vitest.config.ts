import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: [
        "src/utils/**/*.ts",
        "src/lib/utils.ts",
        "src/lib/parseBlogContent.ts",
        "src/components/Footer.tsx",
        "src/components/Navbar.tsx",
        "src/components/ThemeProvider.tsx",
      ],
      exclude: [
        "src/**/*.d.ts",
        "src/test/**",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
      ],
      thresholds: {
        lines: 70,
        functions: 65,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
