"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { translations, type Language, type TranslationKey } from "./translations";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "helloworld-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("az");

  // İlk yüklənmədə localStorage-dən dili oxu
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (stored === "az" || stored === "ru") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(stored);
    }
  }, []);

  // Dili dəyiş və localStorage-də saxla
  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  // Dili toggle et (az ↔ ru)
  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "az" ? "ru" : "az";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  // Tərcümə funksiyası
  const t = useCallback(
    (key: TranslationKey) => {
      return translations[lang][key] ?? translations.az[key] ?? key;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook — komponentlərdə istifadə olunur
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage LanguageProvider daxilində istifadə edilməlidir");
  }
  return ctx;
}