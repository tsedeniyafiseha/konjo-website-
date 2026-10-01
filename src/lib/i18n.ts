// ---------------------------------------------------------------------------
// Konjo — translation strings
// Supported languages: "en" (English) | "am" (Amharic / አማርኛ)
// ---------------------------------------------------------------------------

export type Lang = "en" | "am";

export const translations = {
  // ── Language switcher ────────────────────────────────────────────────────
  lang_en: { en: "EN", am: "EN" },
  lang_am: { en: "አማ", am: "አማ" },

  // ── Global nav / header ──────────────────────────────────────────────────
  nav_services:      { en: "Services",          am: "አገልግሎቶች" },
  nav_how:           { en: "How It Works",       am: "እንዴት ይሠራል" },
  nav_professionals: { en: "For Professionals",  am: "ለባለሙያዎች" },
  nav_safety:        { en: "Safety",             am: "ደህንነት" },
  nav_about:         { en: "About",              am: "ስለ እኛ" },
  nav_apply:         { en: "Apply Now",          am: "አሁን ይመዝገቡ" },

  // ── Key CTA buttons (index page) ─────────────────────────────────────────
  cta_apply_pro:     { en: "Apply as a Professional", am: "እንደ ባለሙያ ይመዝገቡ" },
  cta_join_waitlist: { en: "Join Client Waitlist",    am: "የደንበኛ ዝርዝር ይቀላቀሉ" },
  cta_apply_now:     { en: "Apply Now",               am: "አሁን ይመዝገቡ" },
  cta_explore:       { en: "Explore Services",        am: "አገልግሎቶችን ይመልከቱ" },
  cta_back_home:     { en: "Back to home",            am: "ወደ መነሻ ይመለሱ" },
  cta_back_konjo:    { en: "Back to Konjo",           am: "ወደ ቆንጆ ይመለሱ" },
  cta_submit_another:{ en: "Submit another entry",    am: "ሌላ ግቤት ያስገቡ" },

  // ── Professional registration form ───────────────────────────────────────
  pro_page_eyebrow:  { en: "For professionals",       am: "ለባለሙያዎች" },
  pro_page_title:    { en: "Join the Konjo team.",    am: "የቆንጆ ቡድን ይቀላቀሉ።" },
  pro_page_subtitle: {
    en: "Register your details below. We'll review everything and contact you when the platform is ready to launch.",
    am: "ዝርዝሮቻችሁን ከዚህ በታች ያስገቡ። ሁሉንም እንገመግማለን እና መድረኩ ሲጀምር እናናግራቸዋለን።",
  },

  pro_success_title:   { en: "Application received!",    am: "ማመልከቻው ደርሷል!" },
  pro_success_subtitle:{
    en: "Thanks for registering. We'll review your details and reach out when Konjo launches.",
    am: "ስለተመዘገቡ እናመሰግናለን። ዝርዝሮቻችሁን እንገመግምና ቆንጆ ሲጀምር እናናግራቸዋለን።",
  },

  // Section headers
  pro_section1: { en: "01 — Personal information",    am: "01 — የግል መረጃ" },
  pro_section2: { en: "02 — Professional details",    am: "02 — የሙያ ዝርዝሮች" },
  pro_section3: { en: "03 — Documents & portfolio",   am: "03 — ሰነዶች እና ፖርትፎሊዮ" },

  // Personal info fields
  pro_full_name:       { en: "Full name",                    am: "ሙሉ ስም" },
  pro_full_name_ph:    { en: "e.g. Hana Tesfaye",           am: "ለምሳሌ፦ ሃና ተስፋዬ" },
  pro_phone:           { en: "Phone number",                 am: "ስልክ ቁጥር" },
  pro_phone_ph:        { en: "+251 9xx xxx xxxx",            am: "+251 9xx xxx xxxx" },
  pro_location:        { en: "Home location / neighbourhood",am: "የቤት አካባቢ / ሰፈር" },
  pro_location_ph:     { en: "e.g. Bole, near Edna Mall",   am: "ለምሳሌ፦ ቦሌ፣ ከኤድና ሞል አቅራቢያ" },
  pro_national_id:     { en: "National ID or Passport",     am: "የሀገር መታወቂያ ወይም ፓስፖርት" },
  pro_national_id_hint:{
    en: "A clear photo or scan of your kebele ID, national ID, or passport. Max 10 MB.",
    am: "የቀበሌ መታወቂያ፣ ብሔራዊ መታወቂያ ወይም ፓስፖርት ግልጽ ፎቶ። ከፍተኛ 10 MB።",
  },

  // Professional fields
  pro_profession:      { en: "Profession",              am: "ሙያ" },
  pro_profession_ph:   { en: "Select your profession…", am: "ሙያዎን ይምረጡ…" },
  pro_experience:      { en: "Years of experience",     am: "የልምድ ዓመታት" },
  pro_experience_ph:   { en: "Select…",                 am: "ይምረጡ…" },
  pro_rate:            { en: "Rate per service (ETB)",   am: "የአንድ አገልግሎት ዋጋ (ብር)" },
  pro_rate_ph:         { en: "e.g. 500 – 800 ETB per session", am: "ለምሳሌ፦ 500 – 800 ብር በአንድ ጊዜ" },
  pro_bio:             { en: "Short bio",                am: "አጭር የራስ ታሪክ" },
  pro_bio_optional:    { en: "optional",                 am: "አስፈላጊ አይደለም" },
  pro_bio_ph:          {
    en: "Tell us about yourself, your speciality and your style…",
    am: "ስለ እራስዎ፣ ስለ ልዩ ችሎታዎ እና ዘዴዎ ይንገሩን…",
  },

  // Professions list
  prof_barber:       { en: "Barber",                  am: "ፀጉር ቆረጣ" },
  prof_hair:         { en: "Hairstylist & Braider",   am: "የፀጉር አሠሪ እና ጌጠኛ" },
  prof_nail:         { en: "Nail Artist",             am: "የጥፍር ባለሙያ" },
  prof_makeup:       { en: "Makeup Artist",           am: "የሜክአፕ ባለሙያ" },
  prof_massage:      { en: "Massage Therapist",       am: "የማሳጅ ባለሙያ" },
  prof_skin:         { en: "Skincare & Esthetician",  am: "የቆዳ ሐኪም" },
  prof_other:        { en: "Other",                   am: "ሌላ" },

  // Experience options
  exp_less1:  { en: "Less than 1 year", am: "ከ1 ዓመት በታች" },
  exp_1_3:    { en: "1 – 3 years",      am: "1 – 3 ዓመታት" },
  exp_3_5:    { en: "3 – 5 years",      am: "3 – 5 ዓመታት" },
  exp_5_10:   { en: "5 – 10 years",     am: "5 – 10 ዓመታት" },
  exp_10plus: { en: "10+ years",        am: "10+ ዓመታት" },

  // Documents
  pro_portfolio:       { en: "Portfolio photos — previous work", am: "ፖርትፎሊዮ ፎቶዎች — ቀደም ያሉ ሥራዎች" },
  pro_portfolio_hint:  {
    en: "Upload up to 6 photos of your best work. JPG, PNG or WebP. Max 5 MB each.",
    am: "እስከ 6 ምርጥ ሥራዎቻችሁ ፎቶ ያስስቁ። JPG፣ PNG ወይም WebP። ከፍተኛ 5 MB በእያንዳንዱ።",
  },
  pro_certificate:      { en: "Certificate or qualification",    am: "ሰርተፊኬት ወይም ብቃት" },
  pro_certificate_hint: {
    en: "If you have a professional certificate or training document, upload it here. PDF, JPG or PNG. Max 10 MB.",
    am: "ሙያዊ ሰርተፊኬት ወይም የሥልጠና ሰነድ ካለዎት እዚህ ያስስቁ። PDF፣ JPG ወይም PNG። ከፍተኛ 10 MB።",
  },

  // File picker
  file_click_upload:   { en: "Click to upload",        am: "ለመስቀል ጠቅ ያድርጉ" },
  file_add_more:       { en: "Add more",               am: "ተጨማሪ ያስስቁ" },
  file_required:       { en: "*",                      am: "*" },

  // Submit button
  pro_submit:          { en: "Submit Application",             am: "ማመልከቻ ያስገቡ" },
  pro_submitting:      { en: "Uploading & submitting…",        am: "በመስቀልና በማስገባት ላይ…" },
  pro_email_fallback:  {
    en: "Prefer to apply by email?",
    am: "በኢሜይል ማመልከት ይፈልጋሉ?",
  },

  // Required marker
  required: { en: "*", am: "*" },

  // ── Client registration form ─────────────────────────────────────────────
  cli_page_eyebrow:  { en: "Client registration",            am: "የደንበኛ ምዝገባ" },
  cli_page_title:    { en: "Be first to experience Konjo.",  am: "ቆንጆን ለመጀመሪያ ጊዜ ይሞክሩ።" },
  cli_page_subtitle: {
    en: "Register now and we'll notify you the moment Konjo launches.",
    am: "አሁን ይመዝገቡ — ቆንጆ ሲጀምር እናሳውቃቸዋለን።",
  },
  cli_success_title:   { en: "You're registered!",           am: "ተመዝግበዋል!" },
  cli_success_subtitle:{
    en: "We'll email you as soon as Konjo goes live.",
    am: "ቆንጆ ሲጀምር ወዲያውኑ ኢሜይል እናደርሳቸዋለን።",
  },
  cli_email:         { en: "Email address",                  am: "የኢሜይል አድራሻ" },
  cli_email_ph:      { en: "you@email.com",                  am: "you@email.com" },
  cli_services:      { en: "Services you're interested in",  am: "ፍላጎት ያላቸው አገልግሎቶች" },
  cli_passport:      { en: "Passport or National ID",        am: "ፓስፖርት ወይም ብሔራዊ መታወቂያ" },
  cli_passport_hint: {
    en: "A clear photo or scan of your passport or national ID. JPG, PNG or PDF. Max 10 MB.",
    am: "ፓስፖርት ወይም ብሔራዊ መታወቂያ ግልጽ ፎቶ ወይም ቅጂ። JPG፣ PNG ወይም PDF። ከፍተኛ 10 MB።",
  },
  cli_submit:        { en: "Join the Waitlist",              am: "ዝርዝሩን ይቀላቀሉ" },
  cli_submitting:    { en: "Submitting…",                    am: "በማስገባት ላይ…" },

  // Services (shared)
  svc_hair:     { en: "Hair & Braiding",       am: "ፀጉር እና ሽምብሮ" },
  svc_nails:    { en: "Nails",                 am: "ጥፍር" },
  svc_makeup:   { en: "Makeup",                am: "ሜክአፕ" },
  svc_barber:   { en: "Barbering & Grooming",  am: "ፀጉር ቆረጣ እና ዕለታዊ እንክብካቤ" },
  svc_massage:  { en: "Massage",               am: "ማሳጅ" },
  svc_skin:     { en: "Wellness & Skincare",   am: "ጤና እና የቆዳ እንክብካቤ" },
} as const;

export type TranslationKey = keyof typeof translations;

/** Return the translated string for a key + language */
export function t(key: TranslationKey, lang: Lang): string {
  return translations[key][lang];
}
