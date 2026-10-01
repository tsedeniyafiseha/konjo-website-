import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./i18n";

// ---------------------------------------------------------------------------
// Language context — persists user choice in localStorage
// ---------------------------------------------------------------------------

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => undefined,
});

const STORAGE_KEY = "konjo_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    // Read from localStorage on first render (client-side only)
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "am" ? "am" : "en";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* noop */ }
    // Update the html lang attribute for accessibility
    if (typeof document !== "undefined") {
      document.documentElement.lang = l === "am" ? "am" : "en";
    }
  };

  // Sync html lang attribute on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang === "am" ? "am" : "en";
    }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/** Use this hook in any component to get the current language and setter */
export function useLang() {
  return useContext(LangContext);
}
