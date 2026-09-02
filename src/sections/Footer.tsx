import { ArrowUp, ArrowUpRight, Facebook, Github, Mail, Phone, Youtube } from 'lucide-react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer = () => {
  const { lang } = useLanguage();

  return (
    <footer id="contact" className="footer">
      <div className="footer-kicker"><span>06</span><span>{lang === 'vi' ? 'LIÊN HỆ' : 'CONTACT'}</span><span>HO CHI MINH CITY · VN</span></div>
      <div className="footer-title" data-reveal>
        <p>{lang === 'vi' ? 'Có một bài toán đáng để cùng giải?' : 'Have a problem worth solving together?'}</p>
        <a href={`mailto:${personalInfo.email}`} data-cursor="view">
          <span>{lang === 'vi' ? 'MÌNH CÙNG XÂY' : 'LET’S BUILD IT'}</span><ArrowUpRight />
        </a>
      </div>
      <div className="footer-bottom">
        <div className="footer-links">
          <a href={`mailto:${personalInfo.email}`}><Mail /> Email</a>
          <a href={`tel:${personalInfo.phone}`}><Phone /> {personalInfo.phone}</a>
          <a href={personalInfo.githubLink} target="_blank" rel="noreferrer"><Github /> GitHub</a>
          <a href={personalInfo.facebook} target="_blank" rel="noreferrer"><Facebook /> Facebook</a>
          <a href={personalInfo.youtube} target="_blank" rel="noreferrer"><Youtube /> YouTube</a>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{lang === 'vi' ? 'Lên đầu trang' : 'Back to top'} <ArrowUp /></button>
      </div>
      <p className="footer-note">{lang === 'vi' ? 'Thiết kế & phát triển bởi Lê Minh Nhật · 2026' : 'Designed & developed by Le Minh Nhat · 2026'}</p>
      <div className="footer-signature" aria-hidden="true">LÊ MINH NHẬT</div>
    </footer>
  );
};
