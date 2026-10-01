import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, CalendarDays, Check, ChevronRight, Clock3,
  Heart, Instagram, Linkedin, Mail, MapPin, Menu, ShieldCheck, Sparkles,
  Star, UserCheck, X,
} from "lucide-react";
import heroImage from "../assets/konjo-hero.jpg";
import serviceImage from "../assets/konjo-services.jpg";
import professionalImage from "../assets/konjo-professional.jpg";
import addisImage from "../assets/konjo-addis.jpg";
import { useLang } from "../lib/language-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Konjo | Beauty, Wellness & Grooming at Your Door" },
      { name: "description", content: "Discover trusted beauty, grooming and wellness professionals in Addis Ababa, delivered to your home, hotel or office." },
      { property: "og:title", content: "Konjo | Beauty, Wellness & Grooming at Your Door" },
      { property: "og:description", content: "Premium personal care for everyone — from trusted professionals, wherever you are in Addis Ababa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KonjoHome,
});

const mailtoApplication = `mailto:hr@konjoet.com?subject=${encodeURIComponent("Konjo Professional Application")}&body=${encodeURIComponent("Hello Konjo HR Team,\n\nI am interested in joining Konjo as a professional.\n\nPlease find my CV attached for your consideration.\n\nThank you.")}`;

// Each service has its own dedicated Unsplash image
const services = [
  {
    name: "Hair & Braiding",       nameAm: "ፀጉር እና ሽምብሮ",
    detail: "Protective styles, braids & care", detailAm: "የጥበቃ ዘዴዎች፣ ሽምብሮ እና እንክብካቤ",
    pos: "object-[60%_center]",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    imgAlt: "Hairstylist carefully braiding a client's hair in a modern interior",
  },
  {
    name: "Nails",                 nameAm: "ጥፍር",
    detail: "Manicures, pedicures & artistry", detailAm: "ማኒኪዩር፣ ፔዲኪዩር እና ጥበብ",
    pos: "object-center",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80",
    imgAlt: "Nail technician applying detailed nail art with precision tools",
  },
  {
    name: "Makeup",                nameAm: "ሜክአፕ",
    detail: "Everyday, occasion & bridal", detailAm: "ዕለታዊ፣ ልዩ ዕለት እና የሠርግ",
    pos: "object-[40%_center]",
    img: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
    imgAlt: "Professional makeup artist applying makeup to a client at home",
  },
  {
    name: "Barbering & Grooming",  nameAm: "ፀጉር ቆረጣ እና እንክብካቤ",
    detail: "Fades, lineups & beard sculpting", detailAm: "ፌዴ፣ ላይን-አፕ እና ጢም ቅርፃ",
    pos: "object-[50%_20%]",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80",
    imgAlt: "Barber giving a precise fade haircut to a male client",
  },
  {
    name: "Massage",               nameAm: "ማሳጅ",
    detail: "Restorative treatments at home", detailAm: "ቤት ውስጥ የማዳን ሕክምና",
    pos: "object-[50%_30%]",
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    imgAlt: "Licensed massage therapist performing a relaxing back massage",
  },
  {
    name: "Wellness & Skincare",   nameAm: "ጤና እና የቆዳ እንክብካቤ",
    detail: "Facials, rituals & skin health", detailAm: "ፊት ላይ ሕክምና፣ ሥርዓቶች እና የቆዳ ጤና",
    pos: "object-center",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    imgAlt: "Skincare professional performing a calming facial treatment",
  },
];

/**
 * Inline SVG wordmark that faithfully recreates the Konjo brand logo:
 * – Bold high-contrast serif "Konjo" in the brand sage green (or cream on dark bg)
 * – A flowing sinuous line that passes through/around the letterforms
 *
 * light=false → logo on light background: sage green wordmark
 * light=true  → logo on dark background: cream wordmark
 */
function Brand({ light = false }: { light?: boolean }) {
  const wordColor = light ? "var(--logo-on-dark)" : "var(--logo)";
  const lineColor = light ? "oklch(0.965 0.015 88 / 0.55)" : "oklch(0.59 0.065 140 / 0.35)";

  return (
    <span className="flex items-center" aria-label="Konjo">
      <svg
        width="148" height="44"
        viewBox="0 0 148 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/*
          Flowing wavy line — mimics the sinuous line from the brand image
          that runs vertically through the wordmark, curving around the j.
          Rendered behind the text.
        */}
        <path
          d="M74 0 C74 8, 70 12, 72 18 C74 24, 78 26, 76 32 C74 38, 70 40, 71 44"
          stroke={lineColor}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />

        {/*
          "Konjo" wordmark — bold serif, matching the brand's weight and style.
          fontFamily falls back to Georgia which is close to the original.
          We use a slightly condensed tracking to match the tight, confident
          spacing seen in the brand image.
        */}
        <text
          x="0" y="34"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="38"
          fontWeight="700"
          letterSpacing="-0.01em"
          fill={wordColor}
          dominantBaseline="auto"
        >
          Konjo
        </text>
      </svg>
    </span>
  );
}

// ── Language switcher (used in header) ───────────────────────────────────────
function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`flex items-center gap-1 rounded-sm border p-0.5 ${dark ? "border-primary-foreground/40" : "border-border"}`}>
      {(["en", "am"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className={`px-3 py-1 text-xs font-semibold transition-colors ${
            lang === l
              ? dark ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
              : dark ? "text-primary-foreground/60 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "en" ? "EN" : "አማ"}
        </button>
      ))}
    </div>
  );
}

function KonjoHome() {
  const { lang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    [lang === "am" ? "አገልግሎቶች"  : "Services",         "#services"],
    [lang === "am" ? "እንዴት ይሠራል" : "How It Works",     "#how-it-works"],
    [lang === "am" ? "ለባለሙያዎች"  : "For Professionals", "#professionals"],
    [lang === "am" ? "ደህንነት"     : "Safety",            "#safety"],
    [lang === "am" ? "ስለ እኛ"     : "About",             "#about"],
  ];
  return (
    <main className="overflow-hidden bg-background text-foreground">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${compact || menuOpen ? "border-border bg-background/95 py-3 shadow-sm backdrop-blur" : "border-transparent bg-transparent py-5"}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-12">
          <a href="#top" aria-label="Konjo home"><Brand light={!compact && !menuOpen} /></a>
          <nav className="hidden items-center gap-8 lg:flex">{nav.map(([label,href]) => <a key={href} href={href} className={`text-sm transition-colors hover:text-primary ${!compact && !menuOpen ? "text-primary-foreground/85 hover:text-primary-foreground" : "text-foreground/75"}`}>{label}</a>)}</nav>
          <div className="hidden items-center gap-2 lg:flex">
            <LangToggle dark={!compact && !menuOpen} />
            <Link to="/register/client" className={`px-4 py-2.5 text-sm font-medium transition-colors border ${!compact && !menuOpen ? "border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10" : "border-border text-foreground hover:bg-secondary"}`}>
              {lang === "am" ? "ዝርዝር ይቀላቀሉ" : "Join Waitlist"}
            </Link>
            <Link to="/register/professional" className={`px-4 py-2.5 text-sm font-medium transition-colors ${!compact && !menuOpen ? "bg-accent text-accent-foreground hover:opacity-90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {lang === "am" ? "ባለሙያ ይምዝገቡ" : "Apply as Pro"}
            </Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className={`grid size-10 place-items-center lg:hidden ${!compact && !menuOpen ? "text-primary-foreground" : "text-primary"}`} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-background px-5 py-6 lg:hidden">
            <nav className="flex flex-col">
              {nav.map(([label,href]) => <a key={href} onClick={() => setMenuOpen(false)} href={href} className="border-b border-border py-4 text-lg">{label}</a>)}
              <Link to="/register/client" onClick={() => setMenuOpen(false)} className="mt-5 border border-border px-5 py-4 text-center text-foreground">
                {lang === "am" ? "የደንበኛ ዝርዝር ይቀላቀሉ" : "Join Client Waitlist"}
              </Link>
              <Link to="/register/professional" onClick={() => setMenuOpen(false)} className="mt-2 bg-primary px-5 py-4 text-center text-primary-foreground">
                {lang === "am" ? "እንደ ባለሙያ ይመዝገቡ" : "Apply as a Professional"}
              </Link>
              <div className="mt-4 flex justify-center"><LangToggle /></div>
            </nav>
          </div>
        )}
      </header>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section id="top" className="relative min-h-[780px] bg-secondary md:min-h-[860px]">
        <img
          src={heroImage}
          alt="Konjo professional providing premium at-home personal care in Addis Ababa"
          width={1600} height={1200}
          className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="relative mx-auto flex min-h-[780px] max-w-[1440px] items-end px-5 pb-14 pt-32 md:min-h-[860px] md:items-center md:px-8 md:pb-0 lg:px-12">
          <div className="max-w-3xl text-primary-foreground">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em]">
              {lang === "am" ? "አዲስ አበባ ውስጥ ባለሙያዎችን እየፈለግን ነው" : "Now hiring professionals in Addis Ababa"}
            </p>
            <h1 className="font-display text-5xl leading-[.95] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {lang === "am"
                ? <><span>ተሰጥዎዎን ወደ</span><br/><em>ሰዎች ቤት ያምጡ።</em></>
                : <>Bring your talent<br/><em>to people's doors.</em></>}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/85 md:text-lg">
              {lang === "am"
                ? "ቆንጆ በአዲስ አበባ ውስጥ ልምደኛ ፀጉር ቆራጮችን፣ ሜክአፕ አርቲስቶችን፣ የጥፍር ባለሙያዎችን እና የማሳጅ ሕክምና ባለሙያዎችን ከደንበኞች ጋር ያገናኛል — በእርስዎ ሰዓት፣ በእርስዎ ዋጋ።"
                : "Konjo connects skilled barbers, hairstylists, nail artists, makeup artists and massage therapists with clients across Addis Ababa — on your schedule, at your price."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* Primary CTA — professional registration */}
              <Link
                to="/register/professional"
                className="inline-flex flex-col items-center justify-center gap-0.5 bg-accent px-6 py-4 font-medium text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                <span className="text-base font-semibold">
                  {lang === "am" ? "እንደ ባለሙያ ይመዝገቡ" : "Apply as a Professional"}
                </span>
                <span className="text-xs opacity-80">
                  {lang === "am" ? "Apply as a Professional" : "እንደ ባለሙያ ይመዝገቡ"}
                </span>
              </Link>
              {/* Secondary CTA — client waitlist */}
              <Link
                to="/register/client"
                className="inline-flex items-center justify-center border border-primary-foreground/60 px-6 py-4 font-medium text-primary-foreground hover:bg-primary-foreground/10"
              >
                {lang === "am" ? "የደንበኛ ዝርዝር ይቀላቀሉ" : "Join Client Waitlist"}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/70">
              {lang === "am"
                ? <><span>ፀጉር ቆረጣ</span><span>·</span><span>የፀጉር አሠሪ</span><span>·</span><span>የጥፍር ባለሙያ</span><span>·</span><span>የሜክአፕ ባለሙያ</span><span>·</span><span>የማሳጅ ባለሙያ</span></>
                : <><span>Barbers</span><span>·</span><span>Hairstylists</span><span>·</span><span>Nail artists</span><span>·</span><span>Makeup artists</span><span>·</span><span>Massage therapists</span></>}
            </div>
          </div>
        </div>
        <a href="#experience" aria-label="Scroll down" className="absolute bottom-7 right-7 hidden size-12 place-items-center border border-primary-foreground/50 text-primary-foreground md:grid">
          <ArrowDown size={18}/>
        </a>
      </section>

      {/* ── EXPERIENCE ─────────────────────────────────────────── */}
      <section id="experience" className="section-pad">
        <div className="site-shell">
          <p className="eyebrow">{lang === "am" ? "ቆንጆን ለምን ይቀላቀሉ" : "Why join Konjo"}</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <h2 className="section-title max-w-xl">
              {lang === "am" ? <>ችሎታዎ,<br/><em>ንግዶዎ።</em></> : <>Your skills,<br/><em>your business.</em></>}
            </h2>
            <p className="max-w-xl self-end text-lg leading-8 text-muted-foreground">
              {lang === "am"
                ? "ቆንጆ ግኝቱን እና ቦታ ቦታ ያስተናግዳል — እርስዎ በሚሠሩት ነገር ላይ ያተኩሩ። የራስዎን ሰዓት፣ የራስዎን ዋጋ ይወስኑ፣ ወደ እርስዎ ለሚመጡ ደንበኞች ያሳድጉ።"
                : "Konjo handles the discovery and booking so you can focus on what you do best. Set your own schedule, your own prices, and grow a client base that comes to you."}
            </p>
          </div>
          <div className="mt-16 grid border-y border-border md:grid-cols-2 lg:grid-cols-4">
            {([
              [MapPin,     lang === "am" ? "በሚፈልጉበት ሥፍራ ይሥሩ"  : "Work Where You Want",  lang === "am" ? "ደንበኞችን ቤታቸው፣ ሆቴላቸው ወይም ቢሯቸው ያገልግሉ — በእርስዎ ፈቃድ።"             : "Serve clients at their home, hotel or office — on your terms."],
              [UserCheck,  lang === "am" ? "መገለጫዎን ይገንቡ"         : "Build Your Profile",   lang === "am" ? "ፖርትፎሊዮ፣ ዋጋ እና ተገኝነት በአንድ ቦታ ያሳዩ።"                          : "Showcase your portfolio, rates and availability in one place."],
              [CalendarDays,lang === "am" ? "ቦታ ቦታዎችን ያስተዳድሩ"    : "Manage Bookings",     lang === "am" ? "ጥያቄዎችን ይቀበሉ፣ ሰዓቶን ይከታተሉ እና አስተማማኝ ሆነው ይከፈሉ።"           : "Accept requests, track your schedule and get paid reliably."],
              [ShieldCheck, lang === "am" ? "የታመነ መድረክ"           : "Trusted Platform",    lang === "am" ? "የተረጋገጡ ደንበኞች፣ ደህንነቱ የተጠበቀ ክፍያ እና ሙሉ ድጋፍ ከቆንጆ።"          : "Verified clients, secure payments and full support from Konjo."],
            ] as const).map(([Icon, title, text], i) => (
              <article key={i} className={`px-1 py-9 md:p-8 ${i > 0 ? "md:border-l md:border-border" : ""}`}>
                <Icon className="mb-8 text-primary" strokeWidth={1.3}/>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ───────────────────────────────────────────── */}
      <section id="services" className="section-pad bg-secondary">
        <div className="site-shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">{lang === "am" ? "አገልግሎቶች" : "Services"}</p>
              <h2 className="section-title max-w-2xl">
                {lang === "am" ? <>ለሁሉም <em>የሚሆን አለ።</em></> : <>Something for <em>everyone.</em></>}
              </h2>
            </div>
            <a href="#contact" className="text-link">
              {lang === "am" ? "ሁሉንም አገልግሎቶች ይመልከቱ" : "Explore all services"} <ArrowRight size={17}/>
            </a>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <a href="#contact" key={service.name} className="group relative aspect-[4/5] overflow-hidden bg-muted">
                <img src={service.img} alt={service.imgAlt} loading="lazy" width={800} height={1000}
                  className={`h-full w-full object-cover ${service.pos} transition-transform duration-700 group-hover:scale-[1.04]`} />
                <div className="absolute inset-0 bg-card-overlay" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-primary-foreground">
                  <div>
                    <h3 className="font-display text-3xl">{lang === "am" ? service.nameAm : service.name}</h3>
                    <p className="mt-1 text-sm text-primary-foreground/75">{lang === "am" ? service.detailAm : service.detail}</p>
                  </div>
                  <span className="grid size-10 place-items-center border border-primary-foreground/50 transition-colors group-hover:bg-primary-foreground/20">
                    <ArrowRight size={16}/>
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[.16em] text-muted-foreground">
              {lang === "am" ? "ለሚከተሉት ይገኛል" : "Available for"}
            </span>
            {lang === "am"
              ? ["ሴቶች", "ወንዶች", "ሁሉም ዕድሜ"].map((tag) => (
                  <span key={tag} className="border border-border px-4 py-1.5 text-xs font-medium text-foreground/70">{tag}</span>
                ))
              : ["Women", "Men", "All ages"].map((tag) => (
                  <span key={tag} className="border border-border px-4 py-1.5 text-xs font-medium text-foreground/70">{tag}</span>
                ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="section-pad">
        <div className="site-shell">
          <p className="eyebrow">{lang === "am" ? "እንዴት ይሠራል" : "How it works"}</p>
          <h2 className="section-title">
            {lang === "am" ? <>ለመቀላቀል ቀላል,<br/><em>ለማደግ የተሠራ።</em></> : <>Simple to join,<br/><em>built to grow.</em></>}
          </h2>
          <div className="mt-14 grid lg:grid-cols-4">
            {([
              ["01",
                lang === "am" ? "ማመልከቻ ያስገቡ"     : "Send your CV",
                lang === "am" ? "ቅፁን ይሙሉ — ከ2 ደቂቃ ያነሰ ጊዜ ይወስዳል። ወይም ሲቪዎን ወደ hr@konjoet.com ይላኩ።"
                              : "Email your CV to hr@konjoet.com — just hit 'Apply as a Professional' and attach your portfolio before sending."],
              ["02",
                lang === "am" ? "ይገምገሙ"             : "Get reviewed",
                lang === "am" ? "ቡድናችን ማመልከቻዎን፣ ፖርትፎሊዮዎን እና ዳራዎን በጥቂት ቀናት ውስጥ ይገመግማል።"
                              : "Our team reviews your application, portfolio and background within a few days."],
              ["03",
                lang === "am" ? "መገለጫዎን ያዋቅሩ"    : "Set up your profile",
                lang === "am" ? "ሲፈቀዱ አገልግሎቶቻቸውን ዘርዝሩ፣ ዋጋዎን ያስቀምጡ እና ተገኝነትዎን ያካፍሉ።"
                              : "Once approved, list your services, set your prices and share your availability."],
              ["04",
                lang === "am" ? "ማግኘት ይጀምሩ"       : "Start earning",
                lang === "am" ? "ደንበኞች ቀጥታ ይይዙዎታል። ይምጡ፣ ምርጥ አገልግሎት ይስጡ፣ ስምዎን ይገንቡ።"
                              : "Clients book you directly. You arrive, deliver great service, and build your reputation."],
            ] as const).map(([n, title, desc], i) => (
              <article key={n} className={`relative border-t border-border py-8 lg:px-7 ${i > 0 ? "lg:border-l" : ""}`}>
                <span className="font-display text-5xl text-accent">{n}</span>
                <h3 className="mt-8 font-display text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{desc}</p>
                {i < 3 && <ChevronRight className="absolute right-4 top-12 hidden text-border lg:block"/>}
              </article>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-muted-foreground">
              {lang === "am" ? "ለመጀመር ዝግጁ ናቸው? ቅፁን ይሙሉ — ከ2 ደቂቃ ያነሰ ጊዜ ይወስዳል።" : "Ready to get started? Fill in the form — takes less than 2 minutes."}
            </p>
            <Link to="/register/professional" className="inline-flex shrink-0 items-center gap-2 bg-primary px-6 py-4 font-medium text-primary-foreground hover:bg-primary/90">
              {lang === "am" ? "አሁን ይመዝገቡ" : "Apply Now"} <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT / PROFESSIONALS ──────────────────────────────── */}
      <section id="about" className="bg-ink text-primary-foreground">
        <div className="site-shell grid lg:grid-cols-2">
          <div className="relative min-h-[580px] lg:order-2">
            <img src={professionalImage} alt="A trusted Konjo professional ready to provide a premium at-home service"
              loading="lazy" width={1200} height={1504} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center py-16 pr-0 lg:py-24 lg:pr-20">
            <p className="eyebrow text-accent">{lang === "am" ? "የእኛ ባለሙያዎች" : "Our professionals"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>የሚታመኑ ሰዎች,<br/><em>በማናቸውም ቦታ።</em></> : <>People you can trust,<br/><em>wherever you are.</em></>}
            </h2>
            <p className="mt-7 max-w-lg leading-7 text-primary-foreground/70">
              {lang === "am"
                ? "እያንዳንዱ ፀጉር ቆራጭ፣ ስቲሊስት፣ ቴራፒስት እና የውበት ባለሙያ ከመጀመሩ በፊት ጥንቃቄ የተሞላበት የፈቃድ ሂደት ያልፋል። በእምነት ይያዙ፣ ቦታዎ ላይ ምቾት ይሰማዎ።"
                : "Every barber, stylist, therapist and beauty professional goes through a thoughtful approval process before going live. Book with confidence and feel at ease in your space."}
            </p>
            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {(lang === "am"
                ? ["የማንነት ማረጋገጫ", "የፖርትፎሊዮ ግምገማ", "ሰርተፊኬት ሲኖር", "ደረጃ እና ግምገማዎች", "ተገኝነት", "የአገልግሎት ታሪክ"]
                : ["Identity verification", "Portfolio review", "Certificates where applicable", "Ratings & reviews", "Availability", "Service history"]
              ).map(x => (
                <span key={x} className="flex items-center gap-3 border-b border-primary-foreground/15 pb-3">
                  <Check size={15} className="text-accent"/>{x}
                </span>
              ))}
            </div>
            <a href="#professionals" className="mt-10 inline-flex w-fit items-center gap-2 text-sm font-semibold text-accent">
              {lang === "am" ? "የቆንጆ ባለሙያ ይሁኑ" : "Become a Konjo Professional"} <ArrowRight size={16}/>
            </a>
          </div>
        </div>
      </section>

      {/* ── SAFETY ─────────────────────────────────────────────── */}
      <section id="safety" className="section-pad bg-primary text-primary-foreground">
        <div className="site-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="eyebrow text-accent">{lang === "am" ? "ደህንነት በዲዛይን" : "Safety by design"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>ምቾትዎ<br/><em>ቅድሚያ ይወስዳል።</em></> : <>Your comfort<br/><em>comes first.</em></>}
            </h2>
            <p className="mt-6 max-w-md text-primary-foreground/70">
              {lang === "am"
                ? "ከፍተኛ አገልግሎት ደህንነቱ የተጠበቀ መሆን አለበት። ከመጀመሪያ ጠቅ እስከ የመጨረሻ ግምገማ — ለእያንዳንዱ ደንበኛ።"
                : "Premium service should also feel safe. Quietly built into every booking, from first tap to final review — for every client."}
            </p>
          </div>
          <div className="grid gap-px bg-primary-foreground/20 sm:grid-cols-2">
            {([
              [ShieldCheck, lang === "am" ? "የተጣሩ ባለሙያዎች"       : "Vetted professionals"],
              [UserCheck,   lang === "am" ? "የተረጋገጡ የደንበኛ መለያዎች" : "Verified client accounts"],
              [Clock3,      lang === "am" ? "የቀጥታ ጉብኝት ሁኔታ"     : "Live visit status"],
              [MapPin,      lang === "am" ? "የክፍለ ጊዜ ክትትል"       : "Session tracking"],
              [Heart,       lang === "am" ? "SOS ድጋፍ"             : "SOS support"],
              [Star,        lang === "am" ? "ደረጃ እና ግምገማዎች"      : "Ratings & reviews"],
            ] as const).map(([Icon, label]) => (
              <div key={label} className="flex min-h-32 items-center gap-5 bg-primary p-6">
                <Icon className="text-accent" strokeWidth={1.25}/>
                <span className="font-display text-xl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ───────────────────────────────────────────── */}
      <section className="relative min-h-[620px] overflow-hidden">
        <img
          src={addisImage}
          alt="A contemporary view across Addis Ababa"
          loading="lazy" width={1600} height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-location-overlay"/>
        <div className="site-shell relative flex min-h-[620px] items-end py-16 text-primary-foreground">
          <div className="max-w-xl">
            <p className="eyebrow text-accent">{lang === "am" ? "የእኛ ቤት" : "Our home"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>ለ<em>አዲስ አበባ</em> የተሠራ።</> : <>Made for <em>Addis.</em></>}
            </h2>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/85">
              {lang === "am"
                ? "በአዲስ አበባ ከጀምሮ ቆንጆ ሰዎች እንደሚኖሩ፣ እንደሚሠሩ እና በከተማ ውስጥ እንደሚንቀሳቀሱ ሁኔታ ዙሪያ ተነድፎ ነው — ሴቶችም ወንዶችም።"
                : "Starting in Addis Ababa, Konjo is designed around the way people actually live, work and move through the city — men and women alike."}
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.15em]">Bole · Old Airport · CMC · Ayat</p>
          </div>
        </div>
      </section>

      {/* ── FOR PROFESSIONALS ──────────────────────────────────── */}
      <section id="professionals" className="section-pad bg-secondary">
        <div className="site-shell grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{lang === "am" ? "ለባለሙያዎች" : "For professionals"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>ቆንጆን <em>ለመቀላቀል ዝግጁ?</em></> : <>Ready to join <em>Konjo?</em></>}
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {lang === "am"
                ? "ፀጉር ቆራጭ፣ የጥፍር አርቲስት፣ የሜክአፕ አርቲስት፣ የማሳጅ ቴራፒስት ወይም የፀጉር ዘዬ ባለሙያ ቢሆኑ — ከእርስዎ መስማት እንፈልጋለን።"
                : "Whether you're a barber, nail artist, makeup artist, massage therapist or hairstylist — we'd love to hear from you."}
            </p>
            <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
              {lang === "am"
                ? "ቅፁን ይሙሉ — ከ2 ደቂቃ ያነሰ ጊዜ ይወስዳል። ወይም ሲቪዎን ቀጥታ ኢሜይል ማድረግ ይችላሉ።"
                : "Fill in the registration form — it takes under 2 minutes. You can also email your CV directly if you prefer."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register/professional" className="inline-flex items-center gap-2 bg-primary px-6 py-4 font-medium text-primary-foreground hover:bg-primary/90">
                {lang === "am" ? "እንደ ባለሙያ ይመዝገቡ" : "Register as a Professional"} <ArrowRight size={17}/>
              </Link>
              <a href={mailtoApplication} className="inline-flex items-center gap-2 border border-border px-6 py-4 font-medium text-foreground hover:bg-secondary">
                {lang === "am" ? "ሲቪ በኢሜይል ይላኩ" : "Send CV by Email"} <Mail size={17}/>
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {lang === "am" ? "ኢሜይል ቢመርጡ፣ ዝግጁ-ሆኖ-የተጻፈ መልዕክት ይከፈትልዎታል።" : "Prefer email? Your email app will open with a ready-to-use application message."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px border border-border bg-border">
            {(lang === "am"
              ? ["አዳዲስ ደንበኞችን ያግኙ", "ቦታ ቦታዎን ያስተዳድሩ", "አገልግሎት እና ዋጋ ያዋቅሩ", "ተገኝነት ይቆጣጠሩ", "ገቢዎን ይከታተሉ", "ስምዎን ይገንቡ"]
              : ["Reach new clients", "Manage your bookings", "Set services & prices", "Control availability", "Track your earnings", "Build your reputation"]
            ).map((x, i) => (
              <div key={x} className="min-h-32 bg-background p-6">
                <span className="text-xs text-muted-foreground">0{i + 1}</span>
                <p className="mt-6 font-display text-xl">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP COMING SOON ────────────────────────────────────── */}
      <section className="section-pad">
        <div className="site-shell grid items-center gap-14 lg:grid-cols-2">
          {/* Phone mockups */}
          <div className="relative mx-auto h-[600px] w-full max-w-[500px]">
            {/* Left phone */}
            <div className="absolute left-0 top-14 w-[66%] rotate-[-5deg] rounded-[2.4rem] border-[9px] border-ink bg-background p-3 shadow-2xl">
              <div className="overflow-hidden rounded-[1.7rem] bg-secondary">
                <div className="p-5">
                  <Brand/>
                  <p className="mt-8 text-xs uppercase tracking-[.16em] text-muted-foreground">Good morning</p>
                  <h3 className="mt-2 font-display text-3xl">What are you in the mood for?</h3>
                </div>
                <img
                  src={serviceImage}
                  alt="Konjo mobile service discovery"
                  loading="lazy" width={1200} height={1504}
                  className="h-52 w-full object-cover"
                />
                <div className="grid grid-cols-2 gap-2 p-4 text-xs">
                  <span className="bg-background p-3">Barbering</span>
                  <span className="bg-background p-3">Braiding</span>
                  <span className="bg-background p-3">Massage</span>
                  <span className="bg-background p-3">Nails</span>
                </div>
              </div>
            </div>
            {/* Right phone */}
            <div className="absolute bottom-0 right-0 w-[61%] rotate-[6deg] rounded-[2.4rem] border-[9px] border-ink bg-background p-3 shadow-2xl">
              <div className="overflow-hidden rounded-[1.7rem] bg-secondary p-4">
                <img
                  src={professionalImage}
                  alt="Konjo professional profile"
                  loading="lazy" width={1200} height={1504}
                  className="h-56 w-full object-cover"
                />
                <div className="pt-4">
                  <div className="flex justify-between">
                    <h3 className="font-display text-xl">Dawit B.</h3>
                    <span className="text-xs">★ 4.9</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Barber · Bole</p>
                  <div className="mt-4 bg-primary p-3 text-center text-xs text-primary-foreground">View availability</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coming soon copy */}
          <div>
            <p className="eyebrow">{lang === "am" ? "የቆንጆ መተግበሪያ" : "The Konjo app"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>አስደሳች ነገር<br/><em>በመምጣት ላይ ነው።</em></> : <>Something exciting<br/><em>is on the way.</em></>}
            </h2>
            <p className="mt-7 max-w-lg text-lg leading-8 text-muted-foreground">
              {lang === "am"
                ? "ሙሉ የመተግበሪያ ልምድ እየገነባን ነው — ደንበኞች እርስዎን እንዲያገኙ፣ አገልግሎቶቻቸውን ይይዙ እና ከስልካቸው ጀምሮ እያንዳንዱን ቀጠሮ ይከታተሉ።"
                : "We're building a full app experience — so clients can discover you, book your services and follow every appointment from their phone."}
            </p>
            <div className="mt-8 flex items-center gap-4 border border-primary/40 bg-secondary px-6 py-5">
              <Sparkles size={22} className="shrink-0 text-primary" strokeWidth={1.5}/>
              <div>
                <p className="font-semibold text-foreground">
                  {lang === "am" ? "ይጠብቁ — መተግበሪያ በቅርቡ ይጀምራል" : "Stay tuned — app launching soon"}
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {lang === "am"
                    ? "አሁን ይመዝገቡ እና ሲጀምር ከፕላትፎርሙ ላይ ከሚሆኑ የመጀመሪያ ሰዎች ውስጥ ይሁኑ።"
                    : "Register now and be among the first on the platform when we launch."}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register/professional" className="inline-flex items-center gap-2 bg-primary px-6 py-4 font-medium text-primary-foreground hover:bg-primary/90">
                {lang === "am" ? "እንደ ባለሙያ ይመዝገቡ" : "Apply as a Professional"} <ArrowRight size={16}/>
              </Link>
              <Link to="/register/client" className="inline-flex items-center gap-2 border border-border px-6 py-4 font-medium text-foreground hover:bg-secondary">
                {lang === "am" ? "የደንበኛ ዝርዝር ይቀላቀሉ" : "Join Client Waitlist"} <ArrowRight size={16}/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="section-pad bg-secondary">
        <div className="site-shell">
          <p className="eyebrow">{lang === "am" ? "ደስ የሚሉ ቃላት" : "Kind words"}</p>
          <h2 className="section-title">
            {lang === "am" ? <>ለሕይወት <em>የሚስማማ እንክብካቤ።</em></> : <>Care that fits<br/><em>into real life.</em></>}
          </h2>
          <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
            {(lang === "am" ? ([
              ["ቤት ውስጥ ፌዴ እና ላይን-አፕ ከትልቅ ስብሰባ በፊት — ትራፊክ የለም፣ መጠበቅ የለም — እሱ ያልኩት አያውቅ ነበር። ቆንጆ ሙሉ ዕለታዊ ሥርዓቴን ቀይሮታል።", "ዳዊት, ቦሌ"],
              ["ቦታ ከመያዤ በፊት የባለሙያውን ሥራ፣ ግምገማዎችን እና ተገኝነት ማየት እወዳለሁ። ሙሉ ልምዱ ቀላልና አስተማማኝ ይሰማዋል።", "ሳራ, ዓሮጌ አይርፖርት"],
              ["ረዥም ሳምንት ካለፈ በኋላ ማሳጅ든 ወይም ዝግጅት ሲደርስ ጥፍር — ቆንጆ ዝግጅቱን ቀላል ያደርገዋል። ለሁሉም ይመከራል።", "ሊያ, ቀ.ሜ.ቄ"],
            ] as const) : ([
              ["Getting a fresh fade and lineup at home before a big meeting — no traffic, no waiting — is something I didn't know I needed. Konjo changed my whole routine.", "Dawit, Bole"],
              ["I love seeing a professional's work, reviews and availability before I book. The whole experience feels easy and trustworthy.", "Sara, Old Airport"],
              ["Whether it's a massage after a long week or nails before an event — Konjo makes getting ready feel effortless. Highly recommend to everyone.", "Liya, CMC"],
            ] as const)).map(([quote, name]) => (
              <figure key={name} className="flex min-h-72 flex-col justify-between bg-background p-8">
                <div>
                  <div className="flex gap-1 text-accent">
                    {[1,2,3,4,5].map(x => <Star key={x} size={14} fill="currentColor"/>)}
                  </div>
                  <blockquote className="mt-8 font-display text-2xl leading-9">"{quote}"</blockquote>
                </div>
                <figcaption className="mt-8 text-xs uppercase tracking-[.15em] text-muted-foreground">{name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ────────────────────────────────────────────── */}
      <section id="contact" className="section-pad">
        <div className="site-shell grid gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="eyebrow">{lang === "am" ? "ያናግሩን" : "Get in touch"}</p>
            <h2 className="section-title">
              {lang === "am" ? <>ጥያቄ <em>አለዎ?</em></> : <>Have a <em>question?</em></>}
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
              {lang === "am"
                ? "ለጠቅላላ መረጃ፣ ሽርክና ወይም ሌሎች ጥያቄዎች፣ ቡድናችን ከእርስዎ መስማት ይፈልጋል።"
                : "For general information, partnerships or other inquiries, our team would love to hear from you."}
            </p>
          </div>
          <div className="divide-y divide-border border-y border-border">
            <a href="mailto:info@konjoet.com" className="group flex items-center justify-between py-6">
              <span>
                <small className="block text-xs uppercase tracking-[.14em] text-muted-foreground">
                  {lang === "am" ? "አጠቃላይ ጥያቄዎች" : "General inquiries"}
                </small>
                <strong className="mt-2 block font-display text-2xl font-normal">info@konjoet.com</strong>
              </span>
              <ArrowRight className="transition-transform group-hover:translate-x-1"/>
            </a>
            <a href="mailto:hanna@konjoet.com" className="group flex items-center justify-between py-6">
              <span>
                <small className="block text-xs uppercase tracking-[.14em] text-muted-foreground">
                  {lang === "am" ? "ቀጥታ ጥያቄዎች" : "Direct inquiries"}
                </small>
                <strong className="mt-2 block font-display text-2xl font-normal">hanna@konjoet.com</strong>
              </span>
              <ArrowRight className="transition-transform group-hover:translate-x-1"/>
            </a>
            <a href="mailto:hr@konjoet.com" className="group flex items-center justify-between py-6">
              <span>
                <small className="block text-xs uppercase tracking-[.14em] text-muted-foreground">
                  {lang === "am" ? "ሥራ እና ማመልከቻዎች" : "Careers & applications"}
                </small>
                <strong className="mt-2 block font-display text-2xl font-normal">hr@konjoet.com</strong>
              </span>
              <ArrowRight className="transition-transform group-hover:translate-x-1"/>
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────── */}
      <section className="bg-accent py-20 text-accent-foreground">
        <div className="site-shell text-center">
          <Sparkles className="mx-auto mb-7" strokeWidth={1}/>
          <h2 className="mx-auto max-w-4xl font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
            {lang === "am" ? "ቀጣዩ ደንበኛዎ ቀድሞ እየጠበቀ ነው።" : "Your next client is already waiting."}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-accent-foreground/75">
            {lang === "am"
              ? "ቆንጆ ከመጀመሩ በፊት ይቀላቀሉ — ዛሬ ይመዝገቡ እና ደንበኞቻችን የሚያገኟቸው የመጀመሪያዎቹ ባለሙያዎች ይሁኑ።"
              : "Join Konjo before we launch — register today and be the first professionals our clients discover."}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register/professional" className="inline-flex flex-col items-center justify-center gap-0.5 bg-primary px-8 py-4 text-primary-foreground hover:bg-primary/90">
              <span className="font-semibold">{lang === "am" ? "እንደ ባለሙያ ይመዝገቡ" : "Apply as a Professional"}</span>
              <span className="text-xs opacity-75">{lang === "am" ? "Apply as a Professional" : "እንደ ባለሙያ ይመዝገቡ"}</span>
            </Link>
            <Link to="/register/client" className="inline-flex items-center justify-center border border-accent-foreground/40 px-6 py-4 hover:bg-accent-foreground/10">
              {lang === "am" ? "የደንበኛ ዝርዝር ይቀላቀሉ" : "Join Client Waitlist"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-ink py-14 text-primary-foreground">
        <div className="site-shell">
          <div className="grid gap-10 border-b border-primary-foreground/15 pb-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Brand light/>
              <p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/55">
                {lang === "am"
                  ? "ውበት፣ ጤና እና እንክብካቤ — በአዲስ አበባ ወደ እርስዎ ይምጣ። ለሁሉም።"
                  : "Beauty, grooming and wellness — brought to you in Addis Ababa. For everyone."}
              </p>
            </div>
            <div>
              <p className="footer-title">{lang === "am" ? "ያስሱ" : "Explore"}</p>
              <div className="footer-links">
                <a href="#services">{lang === "am" ? "አገልግሎቶች" : "Services"}</a>
                <a href="#how-it-works">{lang === "am" ? "እንዴት ይሠራል" : "How It Works"}</a>
                <a href="#safety">{lang === "am" ? "ደህንነት" : "Safety"}</a>
                <a href="#about">{lang === "am" ? "ስለ እኛ" : "About"}</a>
              </div>
            </div>
            <div>
              <p className="footer-title">{lang === "am" ? "ለባለሙያዎች" : "For Professionals"}</p>
              <div className="footer-links">
                <a href="#professionals">{lang === "am" ? "ሲቪ ይላኩ" : "Apply with your CV"}</a>
                <Link to="/register/professional">{lang === "am" ? "የባለሙያ ምዝገባ" : "Professional registration"}</Link>
                <Link to="/register/client">{lang === "am" ? "የደንበኛ ዝርዝር" : "Client waitlist"}</Link>
                <a href="#contact">{lang === "am" ? "ያናግሩን" : "Contact"}</a>
              </div>
            </div>
            <div>
              <p className="footer-title">{lang === "am" ? "ያናግሩን" : "Get in touch"}</p>
              <div className="footer-links">
                <a href="mailto:hr@konjoet.com">hr@konjoet.com</a>
                <a href="mailto:info@konjoet.com">info@konjoet.com</a>
                <a href="mailto:hanna@konjoet.com">hanna@konjoet.com</a>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 pt-7 text-xs text-primary-foreground/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Konjo. {lang === "am" ? "መብቱ በሕግ የተጠበቀ ነው።" : "All rights reserved."}</p>
            <div className="flex items-center gap-5">
              <a href="#">{lang === "am" ? "የግልነት ፖሊሲ" : "Privacy Policy"}</a>
              <a href="#">{lang === "am" ? "ውሎች እና ሁኔታዎች" : "Terms & Conditions"}</a>
              <a href="#" aria-label="Instagram"><Instagram size={16}/></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={16}/></a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
