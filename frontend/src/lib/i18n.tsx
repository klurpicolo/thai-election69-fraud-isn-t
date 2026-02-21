import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";
import type { Party } from "./types";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "election69-lang";

function getInitialLang(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "th") return stored;
  } catch {}
  return "th";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const value: LanguageContextValue = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function usePartyName(party: Party | undefined): string {
  const { lang } = useLanguage();
  if (!party) return "";
  return lang === "en" && party.nameEn ? party.nameEn : party.name;
}
