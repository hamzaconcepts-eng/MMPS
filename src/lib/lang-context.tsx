"use client";

import { createContext, useContext, useState } from "react";

type Lang = "en" | "ar";

const LangContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  isRtl: boolean;
}>({
  lang: "en",
  setLang: () => {},
  isRtl: false,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const isRtl = lang === "ar";

  return (
    <LangContext.Provider value={{ lang, setLang, isRtl }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
