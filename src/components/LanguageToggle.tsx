import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button onClick={toggleLang} className="language-toggle" aria-label={lang === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}>
      <span>{lang.toUpperCase()}</span>
      <span className="language-toggle__dot" />
    </button>
  );
};
