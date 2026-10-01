// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe, etc.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // ── Static output (no Node.js server required at runtime) ────────────────
  //
  // nitro: false  →  skip the Nitro server bundler entirely.
  //                  TanStack Start's own prerenderer still runs and writes
  //                  fully-rendered HTML files into .output/public/.
  //
  // tanstackStart.prerender  →  server-renders every route to a static HTML
  //                             file during the build.  crawlLinks follows
  //                             <a href> tags so future routes are included
  //                             automatically.
  //
  // The folder to upload to public_html is:  .output/public/
  nitro: false,

  tanstackStart: {
    server: { entry: "server" },

    prerender: {
      enabled: true,
      crawlLinks: true,
      routes: ["/"],
    },

    pages: [
      { path: "/" },
    ],
  },
});
