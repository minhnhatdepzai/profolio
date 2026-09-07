import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Download, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { BrandLogo } from './BrandLogo';
import { SoundToggle } from './BrandExperience';

const navItems = [
  { id: 'selected-work', label: { en: 'Latest work', vi: 'Dự án mới nhất' } },
  { id: 'capabilities', label: { en: 'Capabilities', vi: 'Năng lực' } },
  { id: 'journey', label: { en: 'Journey', vi: 'Hành trình' } },
  { id: 'archive', label: { en: 'Archive', vi: 'Lưu trữ' } },
  { id: 'contact', label: { en: 'Contact', vi: 'Liên hệ' } },
];

const cvFileName = 'Le-Minh-Nhat-CV-EN.docx';
const cvPath = `${import.meta.env.BASE_URL}cv/${cvFileName}`;

export const Navigation = () => {
  const { getStr } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = ['hero', 'selected-work', 'capabilities', 'journey', 'archive', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-42% 0px -48% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia('(min-width: 801px)');
    const onResize = () => { if (desktop.matches) setOpen(false); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuRef.current?.focus(); }
      if (event.key === 'Tab') {
        const elements = Array.from<HTMLElement>(headerRef.current?.querySelectorAll<HTMLElement>('a,button') ?? []).filter(el => el.getClientRects().length);
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    headerRef.current?.querySelector<HTMLElement>('.nav-panel button')?.focus();
    document.body.classList.add('nav-is-open');
    window.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.body.classList.remove('nav-is-open');
      window.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [open]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setOpen(false);
  };

  return (
    <header className="nav-wrap" ref={headerRef}>
      <button className="brand" onClick={() => goTo('hero')} title={getStr({ en: 'Back to top', vi: 'Về đầu trang' })} data-cursor="focus">
        <BrandLogo className="brand__logo" />
        <span className="brand__name">Lê Minh Nhật</span>
      </button>

      <nav id="main-navigation" className={`nav-panel ${open ? 'is-open' : ''}`} aria-label={getStr({en:'Main navigation',vi:'Điều hướng chính'})}>
        {navItems.map((item, index) => (
          <button
            key={item.id}
            className={active === item.id ? 'is-active' : ''}
            onClick={() => goTo(item.id)}
          >
            <span>0{index + 2}</span>
            {getStr(item.label)}
          </button>
        ))}
        <div className="nav-mobile-actions">
          <a href={cvPath} download={cvFileName}><Download size={17} />{getStr({en:'Download CV',vi:'Tải CV tiếng Anh'})}</a>
          <a href="mailto:lnhat1938@gmail.com">{getStr({en:'Contact me',vi:'Liên hệ'})}<ArrowUpRight size={17} /></a>
        </div>
      </nav>

      <div className="nav-actions">
        <SoundToggle />
        <LanguageToggle />
        <a
          className="nav-contact"
          href="mailto:lnhat1938@gmail.com"
          title={getStr({
            en: 'Email Le Minh Nhat',
            vi: 'Gửi email cho Lê Minh Nhật',
          })}
          data-cursor="focus"
        >
          <span>{getStr({ en: 'Start a conversation', vi: 'Bắt đầu trao đổi' })}</span>
          <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-button"
          ref={menuRef}
          onClick={() => setOpen((value) => !value)}
          aria-label={getStr(open ? {en:'Close menu',vi:'Đóng menu'} : {en:'Open menu',vi:'Mở menu'})}
          aria-expanded={open}
          aria-controls="main-navigation"
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
};

export const DesktopNav = Navigation;
export const MobileNav = () => null;
