import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { featuredProjects } from '../data/projects';
import { useLanguage } from '../contexts/LanguageContext';

export const Hero = () => {
  const { lang } = useLanguage();
  const goToWork = () => document.getElementById('selected-work')?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline">
        <p>INDEPENDENT MIND. <span>CONNECTED THINKING.</span></p>
        <span className="availability"><i />{lang === 'vi' ? 'Sẵn sàng cho cơ hội mới' : 'Open to opportunities'}</span>
      </div>

      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-name">LÊ MINH NHẬT <span>— PORTFOLIO / 2026</span></p>
          <p className="hero-role">AI ENGINEER <span>×</span> CREATIVE DEVELOPER</p>
          <h1 id="hero-title" className={`hero-title${lang === 'vi' ? ' hero-title--vi' : ''}`}>
            <span className="hero-line">{lang === 'vi' ? 'Từ ý tưởng.' : 'Intelligence,'}</span>
            <span className="hero-line hero-line--second">{lang === 'vi' ? 'Đến ' : 'Made '}<em>{lang === 'vi' ? 'thực tế.' : 'real.'}</em><span className="hero-spark" aria-hidden="true">✳</span></span>
          </h1>
          <div className="hero-intro">
            <p>{lang === 'vi'
              ? 'Tôi kết nối AI, kỹ thuật và thiết kế để tạo nên sản phẩm hữu ích — và những trải nghiệm khiến bạn muốn khám phá.'
              : 'I bring AI, engineering and design together. Building useful products — and experiences that make you want to explore.'}</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={goToWork} data-magnetic data-cursor="focus">
                {lang === 'vi' ? 'Khám phá dự án' : 'Explore my work'}<span><ArrowDownRight size={20} /></span>
              </button>
              <a className="hero-cv" href={`${import.meta.env.BASE_URL}cv/Le-Minh-Nhat-CV-EN.docx`} download="Le-Minh-Nhat-CV-EN.docx">
                <Download size={16} />{lang === 'vi' ? 'Tải CV tiếng Anh' : 'Download CV'}
              </a>
            </div>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <div className="hero-visual-fallback"><div className="fallback-orbit fallback-orbit--one" /><div className="fallback-orbit fallback-orbit--two" /><div className="fallback-orbit fallback-orbit--three" /><div className="fallback-core"><span>LN</span></div></div>
          <div className="hero-stage__cross hero-stage__cross--one">+</div><div className="hero-stage__cross hero-stage__cross--two">+</div>
          <div className="hero-stage__label"><span>FIG. 01</span><span>THE CONNECTED MIND</span><i /></div>
        </div>
      </div>

      <div className="hero-footline">
        <button onClick={goToWork} className="hero-scroll"><ArrowDownRight size={17} /><span>{lang === 'vi' ? 'Cuộn để khám phá' : 'Scroll to discover'}</span></button>
        <span className="hero-footline__disciplines">AI / WEB / MOBILE / INTERACTIVE</span>
        <span>HCMC, VIETNAM <i>10.82° N · 106.62° E</i></span>
      </div>

      <div className="hero-preview" aria-label={lang === 'vi' ? 'Điểm nhấn dự án' : 'Project highlights'}>
        <div className="hero-preview__intro"><span>{lang === 'vi' ? 'TỪ Ý TƯỞNG ĐẾN SẢN PHẨM' : 'FROM CONCEPT TO EXPERIENCE'}</span><strong>{String(featuredProjects.length).padStart(2, '0')} <i>{lang === 'vi' ? 'thế giới để khám phá.' : 'worlds to explore.'}</i></strong></div>
        <a className="hero-preview__item" href="#case-japano" data-cursor="view"><img src={`${import.meta.env.BASE_URL}projects/japano-showcase.webp`} alt="" width="64" height="76" /><span><small>01 / AI × FASHION</small><strong>JAPANO</strong></span><ArrowUpRight /></a>
        <a className="hero-preview__item" href="#case-math-lab" data-cursor="view"><img src={`${import.meta.env.BASE_URL}projects/mathlab-video.jpg`} alt="" width="64" height="76" /><span><small>03 / AI × LEARNING</small><strong>Math Vision Lab</strong></span><ArrowUpRight /></a>
        <a className="hero-preview__item hero-preview__item--game" href="#case-saigon-77" data-cursor="view"><span className="hero-preview__game" aria-hidden="true">77</span><span><small>02 / CODE × PLAY</small><strong>SAIGON // 77</strong></span><ArrowUpRight /></a>
      </div>
    </section>
  );
};
