import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';

const navItems = [
  { id: 'selected-work', label: { en: 'Latest work', vi: 'Dự án mới nhất' } },
  { id: 'capabilities', label: { en: 'Capabilities', vi: 'Năng lực' } },
  { id: 'journey', label: { en: 'Journey', vi: 'Hành trình' } },
  { id: 'archive', label: { en: 'Archive', vi: 'Lưu trữ' } },
  { id: 'contact', label: { en: 'Contact', vi: 'Liên hệ' } },
];

export const Navigation = () => {
  const { getStr } = useLanguage();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('hero');

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.body.classList.add('nav-is-open');
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('nav-is-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <header className="nav-wrap">
      <button className="brand" onClick={() => goTo('hero')} title={getStr({ en: 'Back to top', vi: 'Về đầu trang' })} data-cursor="focus">
        <span className="brand__mark" aria-hidden="true"><i>L</i><i>N</i></span>
        <span className="brand__name">Lê Minh Nhật</span>
      </button>

      <nav className={`nav-panel ${open ? 'is-open' : ''}`} aria-label="Main navigation">
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
      </nav>

      <div className="nav-actions">
        <LanguageToggle />
        <a className="nav-contact" href="mailto:lnhat1938@gmail.com" data-cursor="focus">
          <span>{getStr({ en: 'Start a conversation', vi: 'Bắt đầu trao đổi' })}</span>
          <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </header>
  );
};

export const DesktopNav = Navigation;
export const MobileNav = () => null;
