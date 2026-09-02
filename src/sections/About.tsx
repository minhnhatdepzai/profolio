import { ArrowDownRight, Blocks, BrainCircuit, Compass, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const lenses = [
  { icon: Blocks, en: 'Systems', vi: 'Hệ thống' },
  { icon: Smartphone, en: 'Products', vi: 'Sản phẩm' },
  { icon: BrainCircuit, en: 'Intelligence', vi: 'Trí tuệ' },
  { icon: Compass, en: 'Stories', vi: 'Câu chuyện' },
];

export const About = () => {
  const { lang } = useLanguage();

  return (
    <section id="about" className="about-section section-pad">
      <div className="section-rail" data-reveal>
        <span>01</span>
        <p>{lang === 'vi' ? 'Góc nhìn' : 'Point of view'}</p>
      </div>

      <div className="about-main">
        <p className="eyebrow" data-reveal>{lang === 'vi' ? 'BUILDER · STORYTELLER · SYSTEM THINKER' : 'BUILDER · STORYTELLER · SYSTEM THINKER'}</p>
        <h2 data-reveal>
          {lang === 'vi' ? 'Tôi không chỉ làm màn hình ' : 'I do not just make screens '}
          <em>{lang === 'vi' ? 'trông đẹp.' : 'look good.'}</em>
          <br />
          {lang === 'vi' ? 'Tôi xây cả thế giới phía sau chúng.' : 'I build the world behind them.'}
        </h2>

        <div className="about-grid" data-reveal>
          <div className="about-orbit" aria-hidden="true">
            <span>LN</span>
            <i>PRODUCT / AI / PLAY / 26</i>
          </div>
          <div className="about-story">
            <p>
              {lang === 'vi'
                ? 'Từ thời trang AI, toán học trực quan đến di sản số và game thể thao, tôi thích những dự án đòi hỏi tư duy sản phẩm, kỹ thuật và kể chuyện cùng xuất hiện trong một trải nghiệm.'
                : 'From AI fashion and visual mathematics to digital heritage and sports games, I am drawn to projects where product thinking, engineering and storytelling must coexist in one experience.'}
            </p>
            <div className="about-metrics">
              <div><strong>05</strong><span>{lang === 'vi' ? 'case study trọng tâm' : 'flagship case studies'}</span></div>
              <div><strong>45+</strong><span>{lang === 'vi' ? 'kho mã công khai' : 'public repositories'}</span></div>
              <div><strong>04</strong><span>{lang === 'vi' ? 'trụ cột năng lực' : 'capability pillars'}</span></div>
            </div>
          </div>
        </div>

        <div className="about-lenses" data-reveal>
          {lenses.map(({ icon: Icon, en, vi }, index) => (
            <article key={en}>
              <span>0{index + 1}</span>
              <Icon aria-hidden="true" />
              <p>{lang === 'vi' ? vi : en}</p>
            </article>
          ))}
          <ArrowDownRight className="about-lenses__arrow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};
