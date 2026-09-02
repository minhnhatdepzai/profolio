import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight, Github, MapPin } from 'lucide-react';
import { personalInfo } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

const disciplines = ['WEB', 'MOBILE', 'AI', '3D'];

export const Hero = () => {
  const { lang } = useLanguage();

  const goToWork = () => document.getElementById('selected-work')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-signal" aria-hidden="true">
        <span>LN / 26</span>
        <span>10.8231° N</span>
        <span>106.6297° E</span>
      </div>

      <div className="hero-status hero-enter hero-enter--one">
        <span className="hero-status__label">{lang === 'vi' ? 'PORTFOLIO SỐ · 2026' : 'DIGITAL PORTFOLIO · 2026'}</span>
        <span className="availability"><i />{lang === 'vi' ? 'Sẵn sàng cho cơ hội mới' : 'Open to new opportunities'}</span>
      </div>

      <div className="hero-copy">
        <p className="hero-name hero-enter hero-enter--two">LÊ MINH NHẬT</p>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-title__line hero-title__line--solid"><i className="hero-enter hero-enter--three">BUILDING WORLDS</i></span>
          <span className="hero-title__line hero-title__line--outline"><i className="hero-enter hero-enter--four">THAT WORK.</i></span>
        </h1>
        <div className="hero-intro hero-enter hero-enter--five">
          <p>
            {lang === 'vi'
              ? 'Tôi biến những bài toán khó trong web, mobile, AI và trải nghiệm tương tác thành sản phẩm có thể dùng, khám phá và ghi nhớ.'
              : 'I turn hard problems across web, mobile, AI and interactive media into products people can use, explore and remember.'}
          </p>
          <div className="hero-actions">
            <button className="primary-cta" onClick={goToWork} data-cursor="focus">
              {lang === 'vi' ? 'Khám phá dự án mới nhất' : 'Explore latest work'}
              <ArrowDownRight size={18} />
            </button>
            <a className="text-link" href={personalInfo.githubLink} target="_blank" rel="noreferrer" data-cursor="focus">
              <Github size={17} />GitHub<ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="hero-disciplines" aria-label={lang === 'vi' ? 'Lĩnh vực chuyên môn' : 'Disciplines'}>
        {disciplines.map((discipline, index) => (
          <span key={discipline} style={{ '--discipline-index': index } as CSSProperties}>{discipline}</span>
        ))}
      </div>

      <div className="hero-location hero-enter hero-enter--five">
        <MapPin size={15} />
        <span>Ho Chi Minh City · Vietnam</span>
      </div>

      <button className="scroll-cue" onClick={goToWork} data-cursor="focus">
        <span>{lang === 'vi' ? 'Bắt đầu hành trình' : 'Begin the atlas'}</span>
        <ArrowDownRight size={21} />
      </button>
    </section>
  );
};
