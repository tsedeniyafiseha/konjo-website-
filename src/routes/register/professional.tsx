import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Paperclip, Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useLang } from "../../lib/language-context";
import { t } from "../../lib/i18n";

export const Route = createFileRoute("/register/professional")({
  head: () => ({
    meta: [
      { title: "Join as a Professional | እንደ ባለሙያ ይቀላቀሉ | Konjo" },
      { name: "description", content: "Register to join Konjo as a beauty, grooming or wellness professional in Addis Ababa." },
    ],
  }),
  component: ProfessionalRegister,
});

// ── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/heic";
const ACCEPTED_DOCS   = "image/jpeg,image/png,image/webp,application/pdf";
const MAX_PHOTO_MB    = 5;
const MAX_FILE_MB     = 10;
const MAX_PORTFOLIO   = 6;

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
}

async function uploadFile(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
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
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-semibold transition-colors ${
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "en" ? "EN" : "አማ"}
        </button>
      ))}
    </div>
  );
}

// ── Bilingual label ───────────────────────────────────────────────────────────
// Shows the active-language label prominently, the other language smaller below.

function BLabel({
  en, am, required = false,
}: { en: string; am: string; required?: boolean }) {
  const { lang } = useLang();
  const primary   = lang === "am" ? am : en;
  const secondary = lang === "am" ? en : am;
  return (
    <div className="mb-1.5">
      <span className="block text-xs font-semibold uppercase tracking-[.14em] text-foreground/80">
        {primary}
        {required && <span className="ml-1 text-primary">*</span>}
      </span>
      <span className="block text-[10px] text-muted-foreground">{secondary}</span>
    </div>
  );
}

// ── File picker ───────────────────────────────────────────────────────────────

function FilePicker({
  id, enLabel, amLabel, enHint, amHint,
  accept, multiple = false, maxFiles = 1, maxMB,
  files, onChange, required = false,
}: {
  id: string;
  enLabel: string; amLabel: string;
  enHint?: string; amHint?: string;
  accept: string;
  multiple?: boolean;
  maxFiles?: number;
  maxMB: number;
  files: File[];
  onChange: (files: File[]) => void;
  required?: boolean;
}) {
  const { lang } = useLang();
  const ref = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError("");
    const picked = Array.from(e.target.files ?? []);
    const tooBig = picked.filter((f) => f.size > maxMB * 1024 * 1024);
    if (tooBig.length) {
      setSizeError(lang === "am" ? `እያንዳንዱ ፋይል ከ${maxMB} MB በታች መሆን አለበት።` : `Each file must be under ${maxMB} MB.`);
      return;
    }
    const merged = [...files, ...picked].slice(0, maxFiles);
    onChange(merged);
    if (ref.current) ref.current.value = "";
  };

  const remove = (i: number) => onChange(files.filter((_, idx) => idx !== i));
  const hint = lang === "am" ? amHint : enHint;
  const uploadText = lang === "am"
    ? (files.length === 0 ? `ለመስቀል ጠቅ ያድርጉ${multiple ? ` (እስከ ${maxFiles})` : ""}` : `ተጨማሪ ያስስቁ (${files.length}/${maxFiles})`)
    : (files.length === 0 ? `Click to upload${multiple ? ` (up to ${maxFiles})` : ""}` : `Add more (${files.length}/${maxFiles})`);

  return (
    <div>
      <BLabel en={enLabel} am={amLabel} required={required} />
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}

      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <span key={`${f.name}-${i}`} className="flex items-center gap-2 border border-border bg-secondary px-3 py-1.5 text-xs">
              <Paperclip size={11} className="shrink-0 text-primary" />
              <span className="max-w-[140px] truncate">{f.name}</span>
              <button type="button" onClick={() => remove(i)}
                className="text-muted-foreground hover:text-foreground" aria-label={`Remove ${f.name}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {files.length < maxFiles && (
        <label htmlFor={id}
          className="flex cursor-pointer items-center gap-3 border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary">
          <Upload size={16} className="shrink-0 text-primary" />
          <span>{uploadText}</span>
          <input ref={ref} id={id} type="file" accept={accept} multiple={multiple}
            className="sr-only" onChange={handleChange}
            required={required && files.length === 0} />
        </label>
      )}
      {sizeError && <p className="mt-1 text-xs text-red-500">{sizeError}</p>}
    </div>
  );
}

// ── Single-file picker ────────────────────────────────────────────────────────

function SingleFilePicker({
  id, enLabel, amLabel, enHint, amHint,
  accept, maxMB, file, onChange, required = false,
}: {
  id: string;
  enLabel: string; amLabel: string;
  enHint?: string; amHint?: string;
  accept: string; maxMB: number;
  file: File | null;
  onChange: (f: File | null) => void;
  required?: boolean;
}) {
  const { lang } = useLang();
  const ref = useRef<HTMLInputElement>(null);
  const [sizeError, setSizeError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSizeError("");
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (picked.size > maxMB * 1024 * 1024) {
      setSizeError(lang === "am" ? `ፋይሉ ከ${maxMB} MB በታች መሆን አለበት።` : `File must be under ${maxMB} MB.`);
      return;
    }
    onChange(picked);
    if (ref.current) ref.current.value = "";
  };

  const hint = lang === "am" ? amHint : enHint;
  const uploadText = lang === "am" ? "ለመስቀል ጠቅ ያድርጉ" : "Click to upload";

  return (
    <div>
      <BLabel en={enLabel} am={amLabel} required={required} />
      {hint && <p className="mb-2 text-xs text-muted-foreground">{hint}</p>}
      {file ? (
        <div className="flex items-center gap-3 border border-border bg-secondary px-4 py-3">
          <Paperclip size={14} className="shrink-0 text-primary" />
          <span className="flex-1 truncate text-sm">{file.name}</span>
          <button type="button" onClick={() => onChange(null)}
            className="text-muted-foreground hover:text-foreground" aria-label="Remove file">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label htmlFor={id}
          className="flex cursor-pointer items-center gap-3 border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary">
          <Upload size={16} className="shrink-0 text-primary" />
          <span>{uploadText}</span>
          <input ref={ref} id={id} type="file" accept={accept} className="sr-only"
            onChange={handleChange} required={required && !file} />
        </label>
      )}
      {sizeError && <p className="mt-1 text-xs text-red-500">{sizeError}</p>}
    </div>
  );
}

// ── Form state ────────────────────────────────────────────────────────────────

type FormState = {
  full_name: string;
  phone: string;
  profession: string;
  home_location: string;
  experience: string;
  rate: string;
  bio: string;
};

const EMPTY: FormState = {
  full_name: "", phone: "", profession: "",
  home_location: "", experience: "", rate: "", bio: "",
};

// ── Main component ────────────────────────────────────────────────────────────

function ProfessionalRegister() {
  const { lang } = useLang();
  const [form, setForm]                    = useState<FormState>(EMPTY);
  const [portfolioFiles, setPortfolio]     = useState<File[]>([]);
  const [certificateFile, setCertificate]  = useState<File | null>(null);
  const [nationalIdFile, setNationalId]    = useState<File | null>(null);
  const [status, setStatus]                = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]            = useState("");

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nationalIdFile) {
      setErrorMsg(lang === "am"
        ? "እባክዎ ብሔራዊ መታወቂያ ወይም ፓስፖርት ያስስቁ።"
        : "Please upload your national ID / passport.");
      setStatus("error"); return;
    }
    if (portfolioFiles.length === 0) {
      setErrorMsg(lang === "am"
        ? "እባክዎ ቢያንስ አንድ ፖርትፎሊዮ ፎቶ ያስስቁ።"
        : "Please upload at least one portfolio photo.");
      setStatus("error"); return;
    }

    setStatus("loading"); setErrorMsg("");

    try {
      const prefix = `${slugify(form.full_name)}-${Date.now()}`;

      const portfolioUrls = await Promise.all(
        portfolioFiles.map((f, i) =>
          uploadFile("portfolio-photos", `${prefix}/portfolio-${i + 1}-${f.name}`, f),
        ),
      );

      const nationalIdUrl = await uploadFile(
        "identity-docs", `${prefix}/id-${nationalIdFile.name}`, nationalIdFile,
      );

      let certificateUrl: string | null = null;
      if (certificateFile) {
        certificateUrl = await uploadFile(
          "certificates", `${prefix}/cert-${certificateFile.name}`, certificateFile,
        );
      }

      const { error } = await supabase.from("professionals").insert([{
        full_name:       form.full_name.trim(),
        phone:           form.phone.trim(),
        profession:      form.profession,
        home_location:   form.home_location.trim(),
        experience:      form.experience,
        rate:            form.rate.trim(),
        bio:             form.bio.trim() || null,
        portfolio_urls:  portfolioUrls,
        national_id_url: nationalIdUrl,
        certificate_url: certificateUrl,
      }]);

      if (error) throw new Error(error.message);

      setStatus("success");
      setForm(EMPTY); setPortfolio([]); setCertificate(null); setNationalId(null);

    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(
        lang === "am"
          ? `ስህተት ተፈጥሯል: ${msg}. እባክዎ እንደገና ይሞክሩ ወይም hr@konjoet.com ያነጋግሩ።`
          : `Upload failed: ${msg}. Please try again or email hr@konjoet.com`,
      );
      setStatus("error");
    }
  };

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow";
  const sectionClass = "border-t border-border pt-8";

  // Translated profession options
  const PROFESSIONS = [
    { value: "Barber",                 en: "Barber",                 am: "ፀጉር ቆረጣ" },
    { value: "Hairstylist & Braider",  en: "Hairstylist & Braider",  am: "የፀጉር አሠሪ እና ጌጠኛ" },
    { value: "Nail Artist",            en: "Nail Artist",            am: "የጥፍር ባለሙያ" },
    { value: "Makeup Artist",          en: "Makeup Artist",          am: "የሜክአፕ ባለሙያ" },
    { value: "Massage Therapist",      en: "Massage Therapist",      am: "የማሳጅ ባለሙያ" },
    { value: "Skincare & Esthetician", en: "Skincare & Esthetician", am: "የቆዳ ሐኪም" },
    { value: "Other",                  en: "Other",                  am: "ሌላ" },
  ];

  const EXPERIENCE = [
    { value: "Less than 1 year", en: "Less than 1 year", am: "ከ1 ዓመት በታች" },
    { value: "1 – 3 years",      en: "1 – 3 years",      am: "1 – 3 ዓመታት" },
    { value: "3 – 5 years",      en: "3 – 5 years",      am: "3 – 5 ዓመታት" },
    { value: "5 – 10 years",     en: "5 – 10 years",     am: "5 – 10 ዓመታት" },
    { value: "10+ years",        en: "10+ years",         am: "10+ ዓመታት" },
  ];

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

      <div className="mx-auto max-w-[720px] px-5 py-16 md:px-8">
        {/* ── Intro ── */}
        <p className="eyebrow">{t("pro_page_eyebrow", lang)}</p>
        <h1 className="section-title mt-0">
          {lang === "am" ? "የቆንጆ ቡድን " : "Join the "}
          <em>{lang === "am" ? "ይቀላቀሉ።" : "Konjo team."}</em>
        </h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          {t("pro_page_subtitle", lang)}
        </p>

        {/* ── Success ── */}
        {status === "success" ? (
          <div className="mt-12 border border-primary/30 bg-secondary px-8 py-12 text-center">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check size={24} />
            </div>
            <h2 className="font-display text-3xl">{t("pro_success_title", lang)}</h2>
            <p className="mt-4 text-muted-foreground">{t("pro_success_subtitle", lang)}</p>
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

            {/* ── Section 1: Personal info ── */}
            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">
                {t("pro_section1", lang)}
              </p>

              {/* Full name */}
              <div>
                <BLabel en="Full name" am="ሙሉ ስም" required />
                <input id="full_name" type="text" required value={form.full_name} onChange={set("full_name")}
                  placeholder={t("pro_full_name_ph", lang)} className={inputClass} />
              </div>

              {/* Phone */}
              <div>
                <BLabel en="Phone number" am="ስልክ ቁጥር" required />
                <input id="phone" type="tel" required value={form.phone} onChange={set("phone")}
                  placeholder="+251 9xx xxx xxxx" className={inputClass} />
              </div>

              {/* Home location */}
              <div>
                <BLabel en="Home location / neighbourhood" am="የቤት አካባቢ / ሰፈር" required />
                <input id="home_location" type="text" required value={form.home_location} onChange={set("home_location")}
                  placeholder={t("pro_location_ph", lang)} className={inputClass} />
              </div>

              {/* National ID */}
              <SingleFilePicker
                id="national_id"
                enLabel="National ID or Passport"
                amLabel="የሀገር መታወቂያ ወይም ፓስፖርት"
                enHint="A clear photo or scan of your kebele ID, national ID, or passport. Max 10 MB."
                amHint="የቀበሌ መታወቂያ፣ ብሔራዊ መታወቂያ ወይም ፓስፖርት ግልጽ ፎቶ። ከፍተኛ 10 MB።"
                accept={ACCEPTED_DOCS}
                maxMB={MAX_FILE_MB}
                file={nationalIdFile}
                onChange={setNationalId}
                required
              />
            </div>

            {/* ── Section 2: Professional details ── */}
            <div className={`${sectionClass} space-y-6`}>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">
                {t("pro_section2", lang)}
              </p>

              {/* Profession */}
              <div>
                <BLabel en="Profession" am="ሙያ" required />
                <select id="profession" required value={form.profession} onChange={set("profession")} className={inputClass}>
                  <option value="">{t("pro_profession_ph", lang)}</option>
                  {PROFESSIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {lang === "am" ? `${p.am} / ${p.en}` : p.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience + Rate */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <BLabel en="Years of experience" am="የልምድ ዓመታት" required />
                  <select id="experience" required value={form.experience} onChange={set("experience")} className={inputClass}>
                    <option value="">{t("pro_experience_ph", lang)}</option>
                    {EXPERIENCE.map((x) => (
                      <option key={x.value} value={x.value}>
                        {lang === "am" ? x.am : x.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <BLabel en="Rate per service (ETB)" am="የአንድ አገልግሎት ዋጋ (ብር)" required />
                  <input id="rate" type="text" required value={form.rate} onChange={set("rate")}
                    placeholder={t("pro_rate_ph", lang)} className={inputClass} />
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="mb-1.5">
                  <span className="block text-xs font-semibold uppercase tracking-[.14em] text-foreground/80">
                    {lang === "am" ? "አጭር የራስ ታሪክ" : "Short bio"}{" "}
                    <span className="font-normal normal-case tracking-normal text-muted-foreground">
                      ({lang === "am" ? "አስፈላጊ አይደለም" : "optional"})
                    </span>
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {lang === "am" ? "Short bio" : "አጭር የራስ ታሪክ"}
                  </span>
                </div>
                <textarea id="bio" rows={4} value={form.bio} onChange={set("bio")}
                  placeholder={t("pro_bio_ph", lang)}
                  className={`${inputClass} resize-none`} />
              </div>
            </div>

            {/* ── Section 3: Documents & portfolio ── */}
            <div className={`${sectionClass} space-y-6`}>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">
                {t("pro_section3", lang)}
              </p>

              <FilePicker
                id="portfolio"
                enLabel="Portfolio photos — previous work"
                amLabel="ፖርትፎሊዮ ፎቶዎች — ቀደም ያሉ ሥራዎች"
                enHint={`Upload up to ${MAX_PORTFOLIO} photos of your best work. JPG, PNG or WebP. Max ${MAX_PHOTO_MB} MB each.`}
                amHint={`እስከ ${MAX_PORTFOLIO} ምርጥ ሥራዎቻችሁ ፎቶ ያስስቁ። JPG፣ PNG ወይም WebP። ከፍተኛ ${MAX_PHOTO_MB} MB።`}
                accept={ACCEPTED_IMAGES}
                multiple maxFiles={MAX_PORTFOLIO}
                maxMB={MAX_PHOTO_MB}
                files={portfolioFiles}
                onChange={setPortfolio}
                required
              />

              <SingleFilePicker
                id="certificate"
                enLabel="Certificate or qualification"
                amLabel="ሰርተፊኬት ወይም ብቃት"
                enHint="If you have a professional certificate or training document, upload it here. PDF, JPG or PNG. Max 10 MB."
                amHint="ሙያዊ ሰርተፊኬት ወይም የሥልጠና ሰነድ ካለዎት እዚህ ያስስቁ። PDF፣ JPG ወይም PNG። ከፍተኛ 10 MB።"
                accept={ACCEPTED_DOCS}
                maxMB={MAX_FILE_MB}
                file={certificateFile}
                onChange={setCertificate}
              />
            </div>

            {/* ── Error ── */}
            {status === "error" && (
              <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
            )}

            {/* ── Submit ── */}
            <button type="submit" disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 bg-primary py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">
              {status === "loading" ? (
                <><Loader2 size={17} className="animate-spin" /> {t("pro_submitting", lang)}</>
              ) : (
                <>{t("pro_submit", lang)} <ArrowRight size={17} /></>
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {t("pro_email_fallback", lang)}{" "}
              <a href="mailto:hr@konjoet.com?subject=Konjo%20Professional%20Application&body=Hello%20Konjo%20HR%20Team%2C%0A%0AI%20am%20interested%20in%20joining%20Konjo.%0A%0APlease%20find%20my%20CV%20attached.%0A%0AThank%20you."
                className="text-primary underline underline-offset-2">
                hr@konjoet.com
              </a>
            </p>

          </form>
        )}
      </div>
    </main>
  );
}
