import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="relative flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      aria-label="Toggle Language"
    >
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
        <span className={lang === 'en' ? 'text-blue-400' : 'opacity-50'}>EN</span>
        <span className="opacity-50">/</span>
        <span className={lang === 'vi' ? 'text-blue-400' : 'opacity-50'}>VI</span>
      </div>
    </button>
  );
};
