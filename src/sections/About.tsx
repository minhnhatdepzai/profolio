import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BotanicalGarden } from '../components/BotanicalGarden';

export const About = ({ gardenPaused = false }: { gardenPaused?: boolean }) => {
  const { lang } = useLanguage();
  return (
    <section id="about" className="perspective section-pad">
      <BotanicalGarden variant="vine" paused={gardenPaused} />
      <div className="perspective__index" data-reveal><span>01 /</span><p>{lang === 'vi' ? 'MỘT GÓC NHÌN KHÁC' : 'A DIFFERENT PERSPECTIVE'}</p></div>
      <div className="perspective__main">
        <h2 data-reveal>{lang === 'vi' ? 'Tư duy hệ thống.' : 'A systems mind.'}<br /><em>{lang === 'vi' ? 'Cảm quan sáng tạo.' : 'A creative instinct.'}</em></h2>
        <div className="perspective__details" data-reveal>
          <p>{lang === 'vi'
            ? 'Một ứng dụng thử đồ AI. Một bài toán trở thành mô phỏng. Một thành phố có thể chơi. Tôi bắt đầu từ nhu cầu của người dùng, rồi kết nối công nghệ với trải nghiệm.'
            : 'An AI fitting room. A math problem you can explore. A city you can play. I start with what people need, then connect the technology to the experience.'}</p>
          <a className="perspective__experience" href="#journey"><span>{lang === 'vi' ? 'KINH NGHIỆM THỰC TẾ' : 'PROFESSIONAL EXPERIENCE'}</span><strong>{lang === 'vi' ? 'KỸ SƯ AI · THỬ VIỆC' : 'AI ENGINEER · PROBATION'}</strong><p>STEM · 05—08 / 2026</p><ArrowUpRight size={21} /></a>
        </div>
      </div>
    </section>
  );
};
