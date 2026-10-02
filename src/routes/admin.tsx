import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Download, Eye, EyeOff, Loader2, LogOut,
  RefreshCw, Users, Briefcase, Trash2, CheckCircle,
  XCircle, Clock, ExternalLink, X,
} from "lucide-react";
import { supabase, type Professional, type Client } from "../lib/supabase";

// ---------------------------------------------------------------------------
// ADMIN GATE
// The admin dashboard is only available when VITE_INCLUDE_ADMIN=true.
// When this env var is absent (public / shared-hosting build) the route
// renders a plain 404 — no auth code, no Supabase calls, nothing exposed.
// ---------------------------------------------------------------------------
const ADMIN_ENABLED = import.meta.env["VITE_INCLUDE_ADMIN"] === "true";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: ADMIN_ENABLED ? "Admin Dashboard | Konjo" : "404 | Konjo" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

// ── Auth ─────────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = (import.meta.env["VITE_ADMIN_PASSWORD"] as string) ?? "konjo-admin-2026";
const SESSION_KEY = "konjo_admin_auth";

function useAdminAuth() {
  const [authed, setAuthed] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "true"; } catch { return false; }
  });
  const login = (pw: string) => {
    if (pw === ADMIN_PASSWORD) {
      try { sessionStorage.setItem(SESSION_KEY, "true"); } catch { /* noop */ }
      setAuthed(true); return true;
    }
    return false;
  };
  const logout = () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
    setAuthed(false);
  };
  return { authed, login, logout };
}

// ── Password gate ─────────────────────────────────────────────────────────────

function PasswordGate({ onLogin }: { onLogin: (pw: string) => boolean }) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(pw)) { setError(true); setPw(""); }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to site
        </Link>
        <h1 className="font-display text-4xl text-foreground">Admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">Enter the admin password to continue.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="relative">
            <input type={show ? "text" : "password"} value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              placeholder="Password" autoFocus
              className={`w-full border px-4 py-3 pr-12 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow ${error ? "border-red-400" : "border-border"}`}
            />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-xs text-red-500">Incorrect password. Please try again.</p>}
          <button type="submit"
            className="w-full bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Enter dashboard
          </button>
        </form>
      </div>
    </main>
  );
}

// ── Confirm delete dialog ─────────────────────────────────────────────────────

function ConfirmDialog({
  name, onConfirm, onCancel, loading,
}: { name: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm border border-border bg-background p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl text-foreground">Delete entry?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This will permanently delete <strong className="text-foreground">{name}</strong> from the database. This cannot be undone.
            </p>
          </div>
          <button onClick={onCancel} className="shrink-0 text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onConfirm} disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {loading ? "Deleting…" : "Yes, delete"}
          </button>
          <button onClick={onCancel} disabled={loading}
            className="flex-1 border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge + changer ────────────────────────────────────────────────────

type Status = "pending" | "approved" | "rejected";

const STATUS_STYLES: Record<Status, string> = {
  pending:  "bg-yellow-50  text-yellow-700  border-yellow-200",
  approved: "bg-green-50   text-green-700   border-green-200",
  rejected: "bg-red-50     text-red-700     border-red-200",
};

const STATUS_ICONS: Record<Status, React.ElementType> = {
  pending:  Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

function StatusBadge({ status }: { status: Status }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span className={`inline-flex items-center gap-1 border px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[status]}`}>
      <Icon size={11} /> {status}
    </span>
  );
}

async function updateStatus(table: "professionals" | "clients", id: string, status: Status) {
  return supabase.from(table).update({ status }).eq("id", id);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]!);
  const csv = [
    keys.join(","),
    ...rows.map((r) =>
      keys.map((k) => {
        const v = r[k];
        const s = Array.isArray(v) ? v.join("; ") : String(v ?? "");
        return `"${s.replace(/"/g, '""')}"`;
      }).join(","),
    ),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, icon: Icon, sub }: {
  label: string; value: number; icon: React.ElementType; sub?: string;
}) {
  return (
    <div className="flex items-center gap-5 border border-border bg-background p-6">
      <div className="grid size-12 shrink-0 place-items-center bg-secondary text-primary">
        <Icon size={22} strokeWidth={1.4} />
      </div>
      <div>
        <p className="text-3xl font-display font-semibold text-foreground">{value}</p>
        <p className="mt-0.5 text-xs uppercase tracking-[.14em] text-muted-foreground">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

// ── Extended types with optional status/notes ─────────────────────────────────

type ProRow = Professional & { status?: Status; notes?: string };
type CliRow = Client       & { status?: Status; notes?: string };

// ── Main dashboard ────────────────────────────────────────────────────────────

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab]                   = useState<"professionals" | "clients">("professionals");
  const [professionals, setProfessionals] = useState<ProRow[]>([]);
  const [clients, setClients]           = useState<CliRow[]>([]);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string; table: "professionals" | "clients" } | null>(null);
  const [deleting, setDeleting]         = useState(false);

  // Inline notes editing
  const [editingNotes, setEditingNotes] = useState<{ id: string; table: "professionals" | "clients"; value: string } | null>(null);
  const [savingNotes, setSavingNotes]   = useState(false);

  const fetchData = async () => {
    setLoading(true); setFetchError("");
    const [proRes, cliRes] = await Promise.all([
      supabase.from("professionals").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
    ]);
    if (proRes.error || cliRes.error) {
      setFetchError("Failed to load data. Check your Supabase connection.");
    } else {
      setProfessionals((proRes.data ?? []) as ProRow[]);
      setClients((cliRes.data ?? []) as CliRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { void fetchData(); }, []);

  // ── Delete ──────────────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase.from(deleteTarget.table).delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (!error) {
      if (deleteTarget.table === "professionals") {
        setProfessionals((p) => p.filter((r) => r.id !== deleteTarget.id));
      } else {
        setClients((c) => c.filter((r) => r.id !== deleteTarget.id));
      }
    }
  };

  // ── Status change ───────────────────────────────────────────────────────────

  const handleStatusChange = async (
    table: "professionals" | "clients",
    id: string,
    status: Status,
  ) => {
    const { error } = await updateStatus(table, id, status);
    if (!error) {
      if (table === "professionals") {
        setProfessionals((p) => p.map((r) => r.id === id ? { ...r, status } : r));
      } else {
        setClients((c) => c.map((r) => r.id === id ? { ...r, status } : r));
      }
    }
  };

  // ── Notes save ──────────────────────────────────────────────────────────────

  const saveNotes = async () => {
    if (!editingNotes) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from(editingNotes.table)
      .update({ notes: editingNotes.value })
      .eq("id", editingNotes.id);
    setSavingNotes(false);
    if (!error) {
      if (editingNotes.table === "professionals") {
        setProfessionals((p) => p.map((r) => r.id === editingNotes.id ? { ...r, notes: editingNotes.value } : r));
      } else {
        setClients((c) => c.map((r) => r.id === editingNotes.id ? { ...r, notes: editingNotes.value } : r));
      }
      setEditingNotes(null);
    }
  };

  // ── Counts by status ────────────────────────────────────────────────────────

  const proApproved = professionals.filter((p) => p.status === "approved").length;
  const proPending  = professionals.filter((p) => !p.status || p.status === "pending").length;

  const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-[.12em] text-muted-foreground whitespace-nowrap";
  const tdClass = "px-4 py-3 text-sm text-foreground align-top";

  return (
    <>
      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <ConfirmDialog
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      <main className="min-h-screen bg-background text-foreground">
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1344px] items-center justify-between px-5 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft size={14} />
              </Link>
              <span className="font-display text-xl text-primary">Konjo</span>
              <span className="hidden text-muted-foreground sm:block">·</span>
              <span className="hidden text-sm text-muted-foreground sm:block">Admin Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => void fetchData()}
                className="flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <RefreshCw size={13} /> Refresh
              </button>
              <button onClick={onLogout}
                className="flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                <LogOut size={13} /> Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1344px] px-5 py-10 md:px-8">

          {/* ── Stats ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total professionals" value={professionals.length} icon={Briefcase} />
            <StatCard label="Approved" value={proApproved} icon={CheckCircle}
              sub={`${proPending} pending review`} />
            <StatCard label="Client signups" value={clients.length} icon={Users} />
            <StatCard label="Total registrations" value={professionals.length + clients.length} icon={Users} />
          </div>

          {/* ── Tab bar ── */}
          <div className="mt-10 flex items-center justify-between gap-4 border-b border-border">
            <div className="flex">
              {(["professionals", "clients"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}>
                  {t} ({t === "professionals" ? professionals.length : clients.length})
                </button>
              ))}
            </div>
            <button
              onClick={() => tab === "professionals"
                ? downloadCSV("konjo-professionals.csv", professionals as unknown as Record<string, unknown>[])
                : downloadCSV("konjo-clients.csv", clients as unknown as Record<string, unknown>[])}
              className="mb-1 flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-medium hover:bg-secondary transition-colors">
              <Download size={13} /> Export CSV
            </button>
          </div>

          {/* ── Table ── */}
          <div className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-muted-foreground">
                <Loader2 size={22} className="animate-spin mr-3" /> Loading…
              </div>
            ) : fetchError ? (
              <div className="border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">{fetchError}</div>
            ) : tab === "professionals" ? (
              professionals.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">No professional registrations yet.</p>
              ) : (
                <div className="overflow-x-auto border border-border">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-secondary">
                      <tr>
                        {["Status", "Date", "Name", "Phone", "Profession", "Location", "Experience", "Rate", "Bio", "Portfolio", "ID", "Cert", "Notes", "Actions"].map((h) => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {professionals.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/50 transition-colors">

                          {/* Status */}
                          <td className={tdClass}>
                            <select
                              value={p.status ?? "pending"}
                              onChange={(e) => void handleStatusChange("professionals", p.id, e.target.value as Status)}
                              className="border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                            >
                              <option value="pending">pending</option>
                              <option value="approved">approved</option>
                              <option value="rejected">rejected</option>
                            </select>
                            <div className="mt-1"><StatusBadge status={(p.status ?? "pending") as Status} /></div>
                          </td>

                          <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>{formatDate(p.created_at)}</td>
                          <td className={`${tdClass} whitespace-nowrap font-medium`}>{p.full_name}</td>
                          <td className={tdClass}>{p.phone}</td>
                          <td className={tdClass}>{p.profession}</td>
                          <td className={tdClass}>{p.home_location}</td>
                          <td className={`${tdClass} whitespace-nowrap`}>{p.experience}</td>
                          <td className={`${tdClass} whitespace-nowrap`}>{p.rate}</td>

                          {/* Bio */}
                          <td className={`${tdClass} max-w-[180px]`}>
                            <p className="line-clamp-3 text-muted-foreground">{p.bio ?? "—"}</p>
                          </td>

                          {/* Portfolio thumbnails */}
                          <td className={tdClass}>
                            {p.portfolio_urls?.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {p.portfolio_urls.map((url, i) => (
                                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Portfolio ${i + 1}`}
                                      className="h-12 w-12 object-cover border border-border hover:opacity-80 transition-opacity" />
                                  </a>
                                ))}
                              </div>
                            ) : "—"}
                          </td>

                          {/* National ID */}
                          <td className={tdClass}>
                            <a href={p.national_id_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:opacity-75">
                              View <ExternalLink size={10} />
                            </a>
                          </td>

                          {/* Certificate */}
                          <td className={tdClass}>
                            {p.certificate_url
                              ? <a href={p.certificate_url} target="_blank" rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:opacity-75">
                                  View <ExternalLink size={10} />
                                </a>
                              : <span className="text-muted-foreground">—</span>}
                          </td>

                          {/* Notes */}
                          <td className={`${tdClass} min-w-[180px]`}>
                            {editingNotes?.id === p.id ? (
                              <div className="flex flex-col gap-1.5">
                                <textarea
                                  rows={3}
                                  value={editingNotes.value}
                                  onChange={(e) => setEditingNotes({ ...editingNotes, value: e.target.value })}
                                  className="w-full border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                                />
                                <div className="flex gap-1.5">
                                  <button onClick={saveNotes} disabled={savingNotes}
                                    className="bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                                    {savingNotes ? "Saving…" : "Save"}
                                  </button>
                                  <button onClick={() => setEditingNotes(null)}
                                    className="border border-border px-2 py-1 text-xs hover:bg-secondary">
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingNotes({ id: p.id, table: "professionals", value: p.notes ?? "" })}
                                className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {p.notes ? <span className="line-clamp-2">{p.notes}</span> : <span className="italic">Add note…</span>}
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className={tdClass}>
                            <button
                              onClick={() => setDeleteTarget({ id: p.id, name: p.full_name, table: "professionals" })}
                              className="flex items-center gap-1 border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete this entry"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              clients.length === 0 ? (
                <p className="py-16 text-center text-muted-foreground">No client signups yet.</p>
              ) : (
                <div className="overflow-x-auto border border-border">
                  <table className="min-w-full border-collapse">
                    <thead className="bg-secondary">
                      <tr>
                        {["Status", "Date", "Email", "Services", "Passport / ID", "Notes", "Actions"].map((h) => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {clients.map((c) => (
                        <tr key={c.id} className="hover:bg-secondary/50 transition-colors">

                          {/* Status */}
                          <td className={tdClass}>
                            <select
                              value={c.status ?? "pending"}
                              onChange={(e) => void handleStatusChange("clients", c.id, e.target.value as Status)}
                              className="border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                            >
                              <option value="pending">pending</option>
                              <option value="approved">approved</option>
                              <option value="rejected">rejected</option>
                            </select>
                            <div className="mt-1"><StatusBadge status={(c.status ?? "pending") as Status} /></div>
                          </td>

                          <td className={`${tdClass} whitespace-nowrap text-muted-foreground`}>{formatDate(c.created_at)}</td>
                          <td className={tdClass}>
                            <a href={`mailto:${c.email}`} className="text-primary underline underline-offset-2 hover:opacity-75">{c.email}</a>
                          </td>
                          <td className={tdClass}>
                            <div className="flex flex-wrap gap-1">
                              {c.services.map((s) => (
                                <span key={s} className="border border-border bg-secondary px-2 py-0.5 text-xs">{s}</span>
                              ))}
                            </div>
                          </td>
                          <td className={tdClass}>
                            <a href={c.passport_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:opacity-75">
                              View <ExternalLink size={10} />
                            </a>
                          </td>

                          {/* Notes */}
                          <td className={`${tdClass} min-w-[180px]`}>
                            {editingNotes?.id === c.id ? (
                              <div className="flex flex-col gap-1.5">
                                <textarea rows={3} value={editingNotes.value}
                                  onChange={(e) => setEditingNotes({ ...editingNotes, value: e.target.value })}
                                  className="w-full border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                                />
                                <div className="flex gap-1.5">
                                  <button onClick={saveNotes} disabled={savingNotes}
                                    className="bg-primary px-2 py-1 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
                                    {savingNotes ? "Saving…" : "Save"}
                                  </button>
                                  <button onClick={() => setEditingNotes(null)}
                                    className="border border-border px-2 py-1 text-xs hover:bg-secondary">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingNotes({ id: c.id, table: "clients", value: c.notes ?? "" })}
                                className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors">
                                {c.notes ? <span className="line-clamp-2">{c.notes}</span> : <span className="italic">Add note…</span>}
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className={tdClass}>
                            <button
                              onClick={() => setDeleteTarget({ id: c.id, name: c.email, table: "clients" })}
                              className="flex items-center gap-1 border border-red-200 bg-red-50 px-2 py-1.5 text-xs text-red-600 hover:bg-red-100 transition-colors"
                              title="Delete this entry">
                              <Trash2 size={12} /> Delete
                            </button>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

function AdminPage() {
  // Public build — show a plain 404, no admin code exposed
  if (!ADMIN_ENABLED) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
        <p className="text-7xl font-bold text-foreground">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <ArrowLeft size={14} /> Back to Konjo
        </Link>
      </main>
    );
  }

  // Admin build — full authenticated dashboard
  const { authed, login, logout } = useAdminAuth();
  if (!authed) return <PasswordGate onLogin={login} />;
  return <Dashboard onLogout={logout} />;
}
