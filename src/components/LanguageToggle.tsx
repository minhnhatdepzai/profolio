import { useLanguage } from '../contexts/LanguageContext';

export const LanguageToggle = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button onClick={toggleLang} className="language-toggle" aria-label={`${lang.toUpperCase()} — switch language`}>
      <span>{lang.toUpperCase()}</span>
      <span className="language-toggle__dot" />
    </button>
  );
};
