import React from 'react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, Github, ArrowUp, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  const { getStr } = useLanguage();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="border-t border-white/10 bg-black py-12 px-6 pb-24 md:pb-12 text-center md:text-left">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Lê Minh <span className="text-blue-500">Nhật</span>
          </h3>
          <p className="text-gray-500 text-sm">
            {getStr(personalInfo.title)}
          </p>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <a href={`tel:${personalInfo.phone}`} className="hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/10">
            <Phone size={20} />
          </a>
          <a href={`mailto:${personalInfo.email}`} className="hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/10">
            <Mail size={20} />
          </a>
          <a href={personalInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/10">
            <Facebook size={20} />
          </a>
          <a href={personalInfo.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/10">
            <Youtube size={20} />
          </a>
          <a href={personalInfo.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors p-2 bg-white/5 rounded-full border border-white/10">
            <Github size={20} />
          </a>
        </div>

        <button 
          onClick={handleScrollTop}
          className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
        >
          {getStr({ en: "Back to top", vi: "Trở lên đầu trang" })}
          <ArrowUp size={16} />
        </button>

      </div>
    </footer>
  );
};
