import { Bot, Braces, ChevronDown, Component, Cpu, Database, Layers3, MessagesSquare, PenTool, ScanFace, Smartphone, Terminal } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const capabilities = [
  {
    number: '01',
    title: { en: 'Product engineering', vi: 'Kỹ thuật sản phẩm' },
    text: { en: 'Responsive interfaces, mobile journeys, APIs and databases — the state systems that make products dependable, shipped on Cloudflare, GitHub Pages or Docker.', vi: 'Giao diện responsive, hành trình mobile, API và cơ sở dữ liệu — hệ thống trạng thái giúp sản phẩm tin cậy, triển khai trên Cloudflare, GitHub Pages hoặc Docker.' },
    tools: ['React', 'TypeScript', 'React Native', 'Node.js'],
    icon: Component,
  },
  {
    number: '02',
    title: { en: 'LLM, RAG & agents', vi: 'LLM, RAG & agent' },
    text: { en: 'Grounded assistants that cite their sources — LangGraph agents, hybrid retrieval over pgvector and output checks that remove what the model cannot back up.', vi: 'Trợ lý có căn cứ, biết dẫn nguồn — agent LangGraph, truy xuất lai trên pgvector và bộ kiểm tra đầu ra loại bỏ điều model không chứng minh được.' },
    tools: ['LangGraph', 'RAG · pgvector', 'Qwen3', 'FastAPI'],
    icon: MessagesSquare,
  },
  {
    number: '03',
    title: { en: 'AI & computer vision', vi: 'AI & thị giác máy tính' },
    text: { en: 'Detection, OCR and pose pipelines, quality gates and visual models with honest uncertainty boundaries.', vi: 'Pipeline nhận diện, OCR và pose, cổng kiểm định chất lượng và mô hình thị giác với ranh giới bất định rõ ràng.' },
    tools: ['PyTorch', 'YOLO26 / YOLOv8', 'OpenCV', 'EasyOCR'],
    icon: ScanFace,
  },
  {
    number: '04',
    title: { en: 'Model training & fine-tuning', vi: 'Huấn luyện & fine-tune model' },
    text: { en: 'LoRA and VeRA adapters on Qwen3-4B, a LoRA on FLUX.2 and a 91-class YOLO26 detector — trained inside a real VRAM budget and released only through a baseline benchmark.', vi: 'Adapter LoRA và VeRA trên Qwen3-4B, LoRA trên FLUX.2 và detector YOLO26 91 lớp — huấn luyện trong ngân sách VRAM thật và chỉ bật khi vượt được benchmark baseline.' },
    tools: ['PEFT LoRA / VeRA', 'diffusers', 'Ultralytics', 'CUDA'],
    icon: Cpu,
  },
  {
    number: '05',
    title: { en: 'AI-assisted engineering', vi: 'Kỹ thuật với trợ lý AI' },
    text: { en: 'Agentic coding as daily practice — specify, generate, then verify. I package my own workflows as reusable skills.', vi: 'Lập trình cùng agent như thói quen hằng ngày — đặc tả, sinh code, rồi kiểm chứng. Tôi đóng gói quy trình của mình thành skill tái dùng được.' },
    tools: ['Claude Code', 'OpenAI Codex', 'MCP', 'Authored skills'],
    icon: Terminal,
  },
  {
    number: '06',
    title: { en: 'Interactive worlds', vi: 'Thế giới tương tác' },
    text: { en: '3D scenes, motion systems, browser games and audiovisual storytelling that serve the idea.', vi: 'Scene 3D, motion system, game trình duyệt và kể chuyện nghe nhìn phục vụ đúng ý tưởng.' },
    tools: ['Three.js', 'WebGL', 'GSAP', 'Web Audio'],
    icon: Layers3,
  },
];

const signalIcons = [Smartphone, Database, Braces, Cpu, Bot, PenTool];

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
            <details className="capability-card" key={number} data-reveal>
              <summary>
                <span className="capability-card__top"><span>{number}</span><Icon aria-hidden="true" /></span>
                <span className="capability-card__signal" aria-hidden="true"><Signal /></span>
                <span className="capability-card__title">{title[lang]}</span>
                <span className="capability-card__hint">
                  {lang === 'vi' ? 'Nhấn để xem chi tiết' : 'Open for details'}
                  <ChevronDown aria-hidden="true" />
                </span>
              </summary>
              <div className="capability-card__details">
                <p>{text[lang]}</p>
                <ul>{tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
};
