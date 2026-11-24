import { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BotanicalGarden } from '../components/BotanicalGarden';
import { GardenGeckoArt } from '../components/GardenCompanions';
import { cvFileName, cvPath } from '../data/cvFile';

const GardenHabitatFallback = ({ paused, motionAllowed }: { paused: boolean; motionAllowed: boolean }) => {
  const root = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const update = () => setRunning(visible && !paused && !document.hidden && motionAllowed);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [paused, motionAllowed]);
  return (
    <div ref={root} className="hero-visual-fallback hero-habitat-fallback" data-running={running}>
      <div className="habitat-moon" />
      <div className="habitat-island" />
      <div className="habitat-branch" />
      <BotanicalGarden variant="hero" paused={paused} motionAllowed={motionAllowed} />
      <div className="habitat-creature"><GardenGeckoArt /></div>
      <div className="habitat-lanterns"><i /><i /><i /><i /></div>
    </div>
  );
};

export const Hero = ({ gardenPaused = false, motionAllowed = true }: { gardenPaused?: boolean; motionAllowed?: boolean }) => {
  const { lang } = useLanguage();
  const goToWork = () => document.getElementById('selected-work')?.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });

  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline">
        <p>{lang === 'vi' ? 'KỸ THUẬT · SẢN PHẨM · TRẢI NGHIỆM' : 'ENGINEERING · PRODUCT · EXPERIENCE'}</p>
        <span className="availability"><i />{lang === 'vi' ? 'Sẵn sàng cho cơ hội mới' : 'Open to opportunities'}</span>
      </div>

      <div className="hero-main">
        <div className="hero-copy">
          <p className="hero-name">LÊ MINH NHẬT <span>— PORTFOLIO / 2026</span></p>
          <p className="hero-role">{lang === 'vi' ? 'KỸ SƯ AI' : 'AI ENGINEER'} <span>×</span> {lang === 'vi' ? 'KỸ SƯ SẢN PHẨM' : 'PRODUCT ENGINEER'}</p>
          <h1 id="hero-title" className={`hero-title${lang === 'vi' ? ' hero-title--vi' : ''}`}>
            <span className="hero-line">{lang === 'vi' ? 'Tôi xây AI.' : 'I build AI.'}</span>
            <span className="hero-line hero-line--second">{lang === 'vi' ? 'Thành ' : 'I ship '}<em>{lang === 'vi' ? 'sản phẩm.' : 'products.'}</em></span>
          </h1>
          <div className="hero-intro">
            <p>{lang === 'vi'
              ? 'Từ RAG, thị giác máy tính đến web và Android: tôi xây trọn đường đi từ mô hình đến giao diện người dùng.'
              : 'From RAG and computer vision to web and Android, I build the path from model to the interface people use.'}</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={goToWork} data-magnetic data-cursor="focus">
                {lang === 'vi' ? 'Xem dự án chính' : 'See selected work'}<span><ArrowDownRight size={20} /></span>
              </button>
              <a className="hero-cv" href={cvPath} download={cvFileName}>
                <Download size={16} />{lang === 'vi' ? 'Tải CV tiếng Anh' : 'Download CV'}
              </a>
            </div>
            <p className="hero-evidence">{lang === 'vi' ? 'Dự án có demo, mã nguồn hoặc case study để kiểm chứng.' : 'Explore working demos, source code and project case studies.'}</p>
          </div>
        </div>

        <div className="hero-stage" aria-hidden="true">
          <GardenHabitatFallback paused={gardenPaused} motionAllowed={motionAllowed} />
          <div className="habitat-note"><i /><span>MEET MOSS.</span>{lang === 'vi' ? 'MỘT CHÚT TRÍ TƯỞNG TƯỢNG.' : 'A LITTLE IMAGINATION.'}</div>
          <div className="hero-stage__cross hero-stage__cross--one">+</div><div className="hero-stage__cross hero-stage__cross--two">+</div>
          <div className="hero-stage__label"><span>FIG. 01</span><span>{lang === 'vi' ? 'KHU VƯỜN CỦA NHỮNG Ý TƯỞNG' : 'WHERE LITTLE IDEAS COME ALIVE'}</span><i /></div>
        </div>
      </div>

      <div className="hero-footline">
        <button onClick={goToWork} className="hero-scroll"><ArrowDownRight size={17} /><span>{lang === 'vi' ? 'Cuộn để khám phá' : 'Scroll to discover'}</span></button>
        <span className="hero-footline__disciplines">AI / WEB / MOBILE / INTERACTIVE</span>
        <span>HCMC, VIETNAM <i>10.82° N · 106.62° E</i></span>
      </div>

      <div className="hero-preview" aria-label={lang === 'vi' ? 'Điểm nhấn dự án' : 'Project highlights'}>
        <div className="hero-preview__intro"><span>{lang === 'vi' ? 'BẮT ĐẦU TỪ ĐÂY' : 'START WITH THE WORK'}</span><strong>04 <i>{lang === 'vi' ? 'dự án nổi bật.' : 'selected projects.'}</i></strong></div>
        <a className="hero-preview__item" href="#case-japano" data-cursor="view"><img src={`${import.meta.env.BASE_URL}projects/japano-showcase.webp`} alt="" width="64" height="76" /><span><small>01 / AI × FASHION</small><strong>JAPANO</strong></span><ArrowUpRight /></a>
        <a className="hero-preview__item" href="#case-math-lab" data-cursor="view"><img src={`${import.meta.env.BASE_URL}projects/mathlab-video.jpg`} alt="" width="64" height="76" /><span><small>04 / AI × LEARNING</small><strong>Math Vision Lab</strong></span><ArrowUpRight /></a>
        <a className="hero-preview__item" href="#case-fanpage-chatbot" data-cursor="view"><img src={`${import.meta.env.BASE_URL}projects/previews/fanpage-chatbot.webp`} alt="" width="64" height="76" /><span><small>02 / AI × KNOWLEDGE</small><strong>Fanpage AI Chatbot</strong></span><ArrowUpRight /></a>
      </div>
    </section>
  );
};
