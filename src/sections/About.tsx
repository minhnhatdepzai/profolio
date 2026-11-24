import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BotanicalGarden } from '../components/BotanicalGarden';

export const About = ({ gardenPaused = false, motionAllowed = true }: { gardenPaused?: boolean; motionAllowed?: boolean }) => {
  const { lang } = useLanguage();
  return (
    <section id="about" className="perspective section-pad">
      <BotanicalGarden variant="vine" paused={gardenPaused} motionAllowed={motionAllowed} />
      <div className="perspective__index" data-reveal><span>01 /</span><p>{lang === 'vi' ? 'HỒ SƠ NGẮN' : 'AT A GLANCE'}</p></div>
      <div className="perspective__main">
        <h2 data-reveal>{lang === 'vi' ? 'Từ bài toán AI' : 'From the AI problem'}<br /><em>{lang === 'vi' ? 'đến sản phẩm dùng được.' : 'to a usable product.'}</em></h2>
        <div className="perspective__details" data-reveal>
          <p>{lang === 'vi'
            ? 'Tôi đã xây công cụ trực quan hóa Toán tại STEM, phát triển luồng thử đồ AI cho JAPANO và trợ lý RAG có dẫn nguồn. Mỗi case bên dưới cho thấy phần việc, công nghệ và bằng chứng cụ thể.'
            : 'I built visual mathematics tools at STEM, an AI try-on journey for JAPANO and a source-citing RAG assistant. Each case below shows my contribution, technology and available proof.'}</p>
          <a className="perspective__experience" href="#journey"><span>{lang === 'vi' ? 'KINH NGHIỆM GẦN NHẤT' : 'MOST RECENT ROLE'}</span><strong>{lang === 'vi' ? 'KỸ SƯ AI · STEM EDUCATION TECHNOLOGY' : 'AI ENGINEER · STEM EDUCATION TECHNOLOGY'}</strong><p>05—08 / 2026</p><ArrowUpRight size={21} /></a>
        </div>
      </div>
    </section>
  );
};
