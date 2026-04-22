import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lang, LangStr } from '../data/cv';

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  getStr: (langStr: LangStr | string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('portfolio_lang') as Lang;
    if (savedLang === 'en' || savedLang === 'vi') {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = () => {
    setLang(prev => {
      const newLang = prev === 'en' ? 'vi' : 'en';
      localStorage.setItem('portfolio_lang', newLang);
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
