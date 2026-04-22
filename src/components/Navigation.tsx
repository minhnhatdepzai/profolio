import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import { Home, User, Briefcase, GraduationCap, Code, Award, Mail } from 'lucide-react';
import { motion } from 'motion/react';

const navItems = [
  { id: 'hero', icon: Home, label: { en: 'Home', vi: 'Trang chủ' } },
  { id: 'about', icon: User, label: { en: 'About', vi: 'Giới thiệu' } },
  { id: 'experience', icon: Briefcase, label: { en: 'Experience', vi: 'Kinh nghiệm' } },
  { id: 'education', icon: GraduationCap, label: { en: 'Education', vi: 'Học vấn' } },
  { id: 'projects', icon: Code, label: { en: 'Projects', vi: 'Dự án' } },
  { id: 'awards', icon: Award, label: { en: 'Awards', vi: 'Giải thưởng' } },
  { id: 'contact', icon: Mail, label: { en: 'Contact', vi: 'Liên hệ' } }
];

export const DesktopNav = () => {
  const { getStr } = useLanguage();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="hidden md:flex fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-6 py-4 justify-between items-center">
      <div className="text-xl font-bold tracking-tight text-white/90">
        Lê Minh <span className="text-blue-500">Nhật</span>
      </div>
      
      <div className="flex items-center gap-6">
        <ul className="flex items-center gap-6">
          {navItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => handleScroll(item.id)}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                aria-label={getStr(item.label)}
              >
                {getStr(item.label)}
              </button>
            </li>
          ))}
        </ul>
        <div className="w-px h-6 bg-white/20 mx-2" />
        <LanguageToggle />
      </div>
    </nav>
  );
};

export const MobileNav = () => {
  const { getStr } = useLanguage();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold tracking-tight text-white/90">
          Lê Minh <span className="text-blue-500">Nhật</span>
        </div>
        <LanguageToggle />
      </div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 w-full z-50 bg-black/80 backdrop-blur-lg border-t border-white/10 pb-safe">
        <ul className="flex items-center justify-around px-2 py-3 overflow-x-auto gap-2 no-scrollbar">
          {navItems.map(item => (
            <li key={item.id} className="flex-shrink-0">
              <button
                onClick={() => handleScroll(item.id)}
                className="flex flex-col items-center justify-center w-14 h-12 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-all"
                aria-label={getStr(item.label)}
              >
                <item.icon size={20} />
                <span className="text-[10px] mt-1 hidden sm:block whitespace-nowrap">{getStr(item.label)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
