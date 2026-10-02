import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Build mode ───────────────────────────────────────────────────────────────
// npm run build:public  → loads .env.public  → NO /admin page
//   upload dist/client/ to public_html on shared hosting
//
// npm run build:admin   → loads .env.admin   → /admin included
//   deploy to Vercel
// ─────────────────────────────────────────────────────────────────────────────

// Read VITE_INCLUDE_ADMIN directly from .env.{mode} at config parse time.
// We detect the mode from the npm script name passed via npm_lifecycle_script.
function readIncludeAdmin(): boolean {
  const script = process.env["npm_lifecycle_script"] ?? "";
  const mode   = script.includes("--mode admin")  ? "admin"
               : script.includes("--mode public") ? "public"
               : null;

  if (!mode) return false; // default build → no admin

  try {
    const envFile = resolve(process.cwd(), `.env.${mode}`);
    const content = readFileSync(envFile, "utf8");
    const match   = content.match(/^VITE_INCLUDE_ADMIN\s*=\s*(.+)$/m);
    return match?.[1]?.trim() === "true";
  } catch {
    return false;
  }
}

const includeAdmin = readIncludeAdmin();

const prerenderRoutes = [
  { path: "/" },
  { path: "/register/professional" },
  { path: "/register/client" },
  ...(includeAdmin ? [{ path: "/admin" }] : []),
];

export default defineConfig({
  nitro: false,

  tanstackStart: {
    server: { entry: "server" },

    prerender: {
      enabled: true,
      crawlLinks: false,
      routes: prerenderRoutes.map((r) => r.path),
    },

    pages: prerenderRoutes,
  },
});
