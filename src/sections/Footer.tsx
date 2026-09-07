import { ArrowUp, ArrowUpRight, Facebook, Github, Mail, Phone, Youtube } from 'lucide-react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { BotanicalGarden } from '../components/BotanicalGarden';
import { BrandLogo } from '../components/BrandLogo';
import { IntroReplay } from '../components/BrandExperience';

export const Footer = ({ gardenPaused = false, motionAllowed = true }: { gardenPaused?: boolean; motionAllowed?: boolean }) => {
  const { lang } = useLanguage();

  return (
    <footer id="contact" className="footer">
      <BotanicalGarden variant="footer" paused={gardenPaused} motionAllowed={motionAllowed} />
      <div className="footer-kicker"><span>06</span><span>{lang === 'vi' ? 'LIÊN HỆ' : 'CONTACT'}</span><span>HO CHI MINH CITY · VN</span></div>
      <div className="footer-title" data-reveal>
        <p>{lang === 'vi' ? 'Đang tìm người xây sản phẩm AI và trải nghiệm tương tác?' : 'Hiring for AI products and interactive experiences?'}</p>
        <a href={`mailto:${personalInfo.email}`} data-cursor="view">
          <span>{lang === 'vi' ? 'Cùng tạo nên' : 'Let’s build'}<br /><em>{lang === 'vi' ? 'điều tiếp theo.' : 'what’s next.'}</em></span><ArrowUpRight />
        </a>
      </div>
      <a className="footer-email" href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
      <div className="footer-bottom">
        <div className="footer-links">
          <a href={`mailto:${personalInfo.email}`}><Mail /> Email</a>
          <a href={`tel:${personalInfo.phone}`}><Phone /> {personalInfo.phone}</a>
          <a href={personalInfo.githubLink} target="_blank" rel="noreferrer"><Github /> GitHub</a>
          <a href={personalInfo.facebook} target="_blank" rel="noreferrer"><Facebook /> Facebook</a>
          <a href={personalInfo.youtube} target="_blank" rel="noreferrer"><Youtube /> YouTube</a>
        </div>
        <button onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{lang === 'vi' ? 'Lên đầu trang' : 'Back to top'} <ArrowUp /></button>
      </div>
      <div className="footer-brand">
        <div className="footer-brand__identity"><BrandLogo /><p className="footer-note">{lang === 'vi' ? 'Thiết kế & phát triển bởi Lê Minh Nhật · 2026' : 'Designed & developed by Le Minh Nhat · 2026'}</p></div>
        <IntroReplay />
      </div>
      <div className="footer-signature" aria-hidden="true">LÊ MINH NHẬT</div>
    </footer>
  );
};
