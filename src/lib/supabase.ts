import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Environment variables
// Set these in a .env file at the project root:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
// ---------------------------------------------------------------------------
const supabaseUrl     = import.meta.env["VITE_SUPABASE_URL"] as string;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "[Konjo] Supabase env vars missing. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

// ---------------------------------------------------------------------------
// DATABASE SCHEMA
// Run this SQL in: Supabase Dashboard → SQL Editor → New query
//
// ─── Tables ─────────────────────────────────────────────────────────────────
//
// create table professionals (
//   id               uuid primary key default gen_random_uuid(),
//   created_at       timestamptz default now(),
//   full_name        text not null,
//   phone            text not null,
//   profession       text not null,
//   home_location    text not null,
//   experience       text not null,
//   rate             text not null,
//   bio              text,
//   portfolio_urls   text[] not null default '{}',
//   national_id_url  text not null,
//   certificate_url  text,
//   status           text not null default 'pending',  -- pending | approved | rejected
//   notes            text
// );
//
// create table clients (
//   id           uuid primary key default gen_random_uuid(),
//   created_at   timestamptz default now(),
//   email        text not null,
//   services     text[] not null,
//   passport_url text not null,
//   status       text not null default 'pending',       -- pending | approved | rejected
//   notes        text
// );
//
// ─── Storage buckets ────────────────────────────────────────────────────────
// Create these 4 buckets in Supabase Storage (set to PUBLIC):
//   portfolio-photos   — professional work photos
//   identity-docs      — professional national ID / passport
//   certificates       — professional certificates (optional)
//   client-identity    — client passport / national ID
//
// ─── Row Level Security ──────────────────────────────────────────────────────
//
// alter table professionals enable row level security;
// alter table clients       enable row level security;
//
// -- Allow anyone to insert (the registration forms)
// create policy "anon insert professionals"
//   on professionals for insert to anon with check (true);
//
// create policy "anon insert clients"
//   on clients for insert to anon with check (true);
//
// -- Allow reads (admin dashboard uses the anon key — tighten with service key if needed)
// create policy "anon read professionals"
//   on professionals for select to anon using (true);
//
// create policy "anon read clients"
//   on clients for select to anon using (true);
//
// ─── Storage policies (for each bucket) ─────────────────────────────────────
// In Supabase Storage → each bucket → Policies, add:
//
//   INSERT  anon  → true
//   SELECT  anon  → true   (so uploaded files are publicly accessible)
// ---------------------------------------------------------------------------

export type Professional = {
  id:              string;
  created_at:      string;
  full_name:       string;
  phone:           string;
  profession:      string;
  home_location:   string;
  experience:      string;
  rate:            string;
  bio:             string | null;
  portfolio_urls:  string[];
  national_id_url: string;
  certificate_url: string | null;
  status:          string | null;
  notes:           string | null;
};

export type Client = {
  id:           string;
  created_at:   string;
  email:        string;
  services:     string[];
  passport_url: string;
  status:       string | null;
  notes:        string | null;
};
