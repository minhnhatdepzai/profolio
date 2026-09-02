import { Bot, Braces, Component, Database, Layers3, PenTool, ScanFace, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const capabilities = [
  {
    number: '01',
    title: { en: 'Product engineering', vi: 'Kỹ thuật sản phẩm' },
    text: { en: 'Responsive interfaces, mobile journeys and the state systems that make them dependable.', vi: 'Giao diện responsive, hành trình mobile và hệ thống trạng thái giúp sản phẩm vận hành tin cậy.' },
    tools: ['React', 'TypeScript', 'React Native', 'Node.js'],
    icon: Component,
  },
  {
    number: '02',
    title: { en: 'AI & computer vision', vi: 'AI & thị giác máy tính' },
    text: { en: 'Inference pipelines, quality gates and visual models with honest uncertainty boundaries.', vi: 'Pipeline inference, cổng kiểm định chất lượng và mô hình thị giác với ranh giới bất định rõ ràng.' },
    tools: ['Python', 'PyTorch', 'FastAPI', 'OpenCV'],
    icon: ScanFace,
  },
  {
    number: '03',
    title: { en: 'Interactive worlds', vi: 'Thế giới tương tác' },
    text: { en: '3D scenes, motion systems, browser games and audiovisual storytelling that serve the idea.', vi: 'Scene 3D, motion system, game trình duyệt và kể chuyện nghe nhìn phục vụ đúng ý tưởng.' },
    tools: ['Three.js', 'WebGL', 'GSAP', 'Web Audio'],
    icon: Layers3,
  },
  {
    number: '04',
    title: { en: 'Systems & delivery', vi: 'Hệ thống & triển khai' },
    text: { en: 'APIs, data models, Linux workflows and cloud delivery from prototype to working demo.', vi: 'API, mô hình dữ liệu, quy trình Linux và triển khai cloud từ prototype đến demo hoạt động.' },
    tools: ['MongoDB', 'PostgreSQL', 'Cloudflare', 'Linux'],
    icon: Database,
  },
];

const signalIcons = [Braces, Smartphone, Bot, PenTool];

export const Skills = () => {
  const { lang } = useLanguage();

  return (
    <section id="capabilities" className="capabilities-section section-pad">
      <header className="section-heading section-heading--split" data-reveal>
        <div>
          <span className="eyebrow">03 · {lang === 'vi' ? 'NĂNG LỰC' : 'CAPABILITIES'}</span>
          <h2>{lang === 'vi' ? 'Ý tưởng dẫn đường. Công nghệ tạo lực.' : 'Ideas lead. Technology gives them force.'}</h2>
        </div>
        <p>{lang === 'vi' ? 'Một bộ công cụ đa ngành để đi từ khái niệm đến trải nghiệm có thể sử dụng.' : 'A cross-disciplinary toolkit for moving from concept to a usable experience.'}</p>
      </header>

      <div className="capability-grid">
        {capabilities.map(({ number, title, text, tools, icon: Icon }, index) => {
          const Signal = signalIcons[index];
          return (
            <article className="capability-card" key={number} data-reveal>
              <div className="capability-card__top"><span>{number}</span><Icon aria-hidden="true" /></div>
              <div className="capability-card__signal" aria-hidden="true"><Signal /></div>
              <h3>{title[lang]}</h3>
              <p>{text[lang]}</p>
              <ul>{tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
            </article>
          );
        })}
      </div>
    </section>
  );
};
