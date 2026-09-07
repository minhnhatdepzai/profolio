import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import type { Lang, LangStr } from '../data/cv';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  getStr: (langStr: LangStr | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const savedLang = localStorage.getItem('portfolio_lang');
      if (savedLang === 'en' || savedLang === 'vi') return savedLang;
    } catch { /* Use the browser language if storage is unavailable. */ }
    return navigator.language.toLowerCase().startsWith('vi') ? 'vi' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = lang === 'vi'
      ? 'Lê Minh Nhật — Kỹ sư AI & Creative Developer'
      : 'Le Minh Nhat — AI Engineer & Creative Developer';
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => {
      const newLang = prev === 'en' ? 'vi' : 'en';
      try { localStorage.setItem('portfolio_lang', newLang); } catch { /* Language still works without persistence. */ }
      return newLang;
    });
  };

  const getStr = (langStr: LangStr | string) => {
    if (typeof langStr === 'string') return langStr;
    return langStr[lang] || langStr.en;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, getStr }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
