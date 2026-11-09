import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vercel automatically sets VERCEL_GIT_COMMIT_SHA during its build step —
// we surface it (and the exact build time) into the app itself so you can
// always tell, just by looking at the page, whether you're seeing the
// latest deploy or a stale/cached one.
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_SHA__: JSON.stringify(
      (process.env.VERCEL_GIT_COMMIT_SHA || "local").slice(0, 7)
    ),
  },
});
