import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Paperclip, Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLang } from "../../lib/language-context";
import { t } from "../../lib/i18n";

export const Route = createFileRoute("/register/client")({
  head: () => ({
    meta: [
      { title: "Join the Waitlist | ዝርዝሩን ይቀላቀሉ | Konjo" },
      { name: "description", content: "Sign up for Konjo — book beauty, grooming and wellness professionals at your door in Addis Ababa." },
    ],
  }),
  component: ClientRegister,
});

const ACCEPTED_DOCS = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_FILE_MB   = 10;

function slugify(email: string) {
  return email.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").toLowerCase();
}

async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600", upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ── Language switcher ─────────────────────────────────────────────────────────

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center gap-1 rounded-sm border border-border p-0.5">
      {(["en", "am"] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-semibold transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}>
          {l === "en" ? "EN" : "አማ"}
        </button>
      ))}
    </div>
  );
}

// ── Bilingual label ───────────────────────────────────────────────────────────

function BLabel({ en, am, required = false }: { en: string; am: string; required?: boolean }) {
  const { lang } = useLang();
  const primary   = lang === "am" ? am : en;
  const secondary = lang === "am" ? en : am;
  return (
    <div className="mb-1.5">
      <span className="block text-xs font-semibold uppercase tracking-[.14em] text-foreground/80">
        {primary}{required && <span className="ml-1 text-primary">*</span>}
      </span>
      <span className="block text-[10px] text-muted-foreground">{secondary}</span>
    </div>
  );
}

// ── Services list ─────────────────────────────────────────────────────────────

const SERVICES = [
  { value: "Hair & Braiding",      en: "Hair & Braiding",      am: "ፀጉር እና ሽምብሮ" },
  { value: "Nails",                en: "Nails",                am: "ጥፍር" },
  { value: "Makeup",               en: "Makeup",               am: "ሜክአፕ" },
  { value: "Barbering & Grooming", en: "Barbering & Grooming", am: "ፀጉር ቆረጣ" },
  { value: "Massage",              en: "Massage",              am: "ማሳጅ" },
  { value: "Wellness & Skincare",  en: "Wellness & Skincare",  am: "ጤና እና ቆዳ" },
];

function ClientRegister() {
  const { lang } = useLang();
  const [email, setEmail]           = useState("");
  const [services, setServices]     = useState<string[]>([]);
  const [passportFile, setPassport] = useState<File | null>(null);
  const [status, setStatus]         = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]     = useState("");
  const passportRef                 = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError]   = useState("");

  const toggleService = (s: string) =>
    setServices((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const handlePassport = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError("");
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setSizeError(lang === "am" ? `ፋይሉ ከ${MAX_FILE_MB} MB በታች መሆን አለበት።` : `File must be under ${MAX_FILE_MB} MB.`);
      return;
    }
    setPassport(f);
    if (passportRef.current) passportRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (services.length === 0) {
      setErrorMsg(lang === "am" ? "እባክዎ ቢያንስ አንድ አገልግሎት ይምረጡ።" : "Please select at least one service.");
      setStatus("error"); return;
    }
    if (!passportFile) {
      setErrorMsg(lang === "am" ? "እባክዎ ፓስፖርት ወይም መታወቂያ ያስስቁ።" : "Please upload your passport or national ID.");
      setStatus("error"); return;
    }

    setStatus("loading"); setErrorMsg("");

    try {
      const prefix = `${slugify(email)}-${Date.now()}`;
      const passportUrl = await uploadFile("client-identity", `${prefix}/id-${passportFile.name}`, passportFile);

      const { error } = await supabase.from("clients").insert([{
        email: email.trim().toLowerCase(),
        services,
        passport_url: passportUrl,
      }]);

      if (error) throw new Error(error.message);

      setStatus("success");
      setEmail(""); setServices([]); setPassport(null);

    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(lang === "am"
        ? `ስህተት ተፈጥሯል: ${msg}. እባክዎ እንደገና ይሞክሩ።`
        : `Submission failed: ${msg}. Please try again or email info@konjoet.com`);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1344px] items-center justify-between px-5 py-4 md:px-8">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={15} />
            <span>{t("cta_back_konjo", lang)}</span>
          </Link>
          <span className="font-display text-xl text-primary">Konjo</span>
          <LangToggle />
        </div>
      </header>

      <div className="mx-auto max-w-[640px] px-5 py-16 md:px-8">
        {/* ── Intro ── */}
        <p className="eyebrow">{t("cli_page_eyebrow", lang)}</p>
        <h1 className="section-title mt-0">
          {lang === "am" ? "ቆንጆን ለመጀመሪያ ጊዜ " : "Be first to "}
          <em>{lang === "am" ? "ይሞክሩ።" : "experience Konjo."}</em>
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {t("cli_page_subtitle", lang)}
        </p>

        {/* ── Success ── */}
        {status === "success" ? (
          <div className="mt-12 border border-primary/30 bg-secondary px-8 py-12 text-center">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check size={24} />
            </div>
            <h2 className="font-display text-3xl">{t("cli_success_title", lang)}</h2>
            <p className="mt-4 text-muted-foreground">{t("cli_success_subtitle", lang)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={() => setStatus("idle")}
                className="border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-secondary">
                {t("cta_submit_another", lang)}
              </button>
              <Link to="/" className="bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {t("cta_back_home", lang)}
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-12 space-y-8">

            {/* Email */}
            <div>
              <BLabel en="Email address" am="የኢሜይል አድራሻ" required />
              <input id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com" className={inputClass} />
            </div>

            {/* Services */}
            <div>
              <BLabel en="Services you're interested in" am="ፍላጎት ያላቸው አገልግሎቶች" required />
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {SERVICES.map((svc) => {
                  const checked = services.includes(svc.value);
                  const label   = lang === "am" ? svc.am : svc.en;
                  const sub     = lang === "am" ? svc.en : svc.am;
                  return (
                    <button key={svc.value} type="button" onClick={() => toggleService(svc.value)}
                      className={`border px-3 py-3 text-left transition-colors ${
                        checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}>
                      {checked && <Check size={12} className="mb-1 block" />}
                      <span className="block text-sm font-medium">{label}</span>
                      <span className={`block text-[10px] ${checked ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Passport */}
            <div>
              <BLabel en="Passport or National ID" am="ፓስፖርት ወይም ብሔራዊ መታወቂያ" required />
              <p className="mb-2 text-xs text-muted-foreground">
                {lang === "am"
                  ? "ፓስፖርት ወይም ብሔራዊ መታወቂያ ግልጽ ፎቶ ወይም ቅጂ። JPG፣ PNG ወይም PDF። ከፍተኛ 10 MB።"
                  : "A clear photo or scan of your passport or national ID. JPG, PNG or PDF. Max 10 MB."}
              </p>
              {passportFile ? (
                <div className="flex items-center gap-3 border border-border bg-secondary px-4 py-3">
                  <Paperclip size={14} className="shrink-0 text-primary" />
                  <span className="flex-1 truncate text-sm">{passportFile.name}</span>
                  <button type="button" onClick={() => setPassport(null)}
                    className="text-muted-foreground hover:text-foreground" aria-label="Remove file">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label htmlFor="passport"
                  className="flex cursor-pointer items-center gap-3 border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary">
                  <Upload size={16} className="shrink-0 text-primary" />
                  <span>{lang === "am" ? "ለመስቀል ጠቅ ያድርጉ" : "Click to upload"}</span>
                  <input ref={passportRef} id="passport" type="file" accept={ACCEPTED_DOCS}
                    className="sr-only" onChange={handlePassport} required={!passportFile} />
                </label>
              )}
              {sizeError && <p className="mt-1 text-xs text-red-500">{sizeError}</p>}
            </div>

            {/* Error */}
            {status === "error" && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
            )}

            {/* Submit */}
            <button type="submit" disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 bg-primary py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {status === "loading" ? (
                <><Loader2 size={17} className="animate-spin" /> {t("cli_submitting", lang)}</>
              ) : (
                <>{t("cli_submit", lang)} <ArrowRight size={17} /></>
              )}
            </button>

          </form>
        )}
      </div>
    </main>
  );
}
