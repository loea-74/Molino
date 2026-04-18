"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "es" | "en";

interface LangCtx {
  lang: Lang;
  toggle: () => void;
}

const LangContext = createContext<LangCtx>({ lang: "es", toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "es" || saved === "en") {
      setLang(saved);
    } else {
      const browser = navigator.language.startsWith("en") ? "en" : "es";
      setLang(browser);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggle = () => setLang((l) => (l === "es" ? "en" : "es"));

  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
