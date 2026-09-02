import { Award, BriefcaseBusiness, GraduationCap } from 'lucide-react';
import { certificates, education, experience, prizes } from '../data/cv';
import { useLanguage } from '../contexts/LanguageContext';

export const Experience = () => {
  const { getStr, lang } = useLanguage();

  return (
    <section id="journey" className="journey-section section-pad">
      <header className="section-heading" data-reveal>
        <span className="eyebrow">04 · {lang === 'vi' ? 'HÀNH TRÌNH' : 'JOURNEY'}</span>
        <h2>{lang === 'vi' ? 'Học bằng cách quan sát. Trưởng thành bằng cách xây.' : 'Learn by observing. Grow by building.'}</h2>
      </header>

      <div className="journey-layout">
        <div className="journey-column">
          <div className="journey-label"><BriefcaseBusiness /><span>{lang === 'vi' ? 'Kinh nghiệm' : 'Experience'}</span></div>
          {experience.map((item) => (
            <article className="journey-card journey-card--lead" key={item.company} data-reveal>
              <p className="journey-card__period">{getStr(item.period)}</p>
              <h3>{getStr(item.role)}</h3>
              <strong>{item.company}</strong>
              <ol>
                {item.responsibilities.map((responsibility, index) => (
                  <li key={index}><span>0{index + 1}</span>{getStr(responsibility)}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <div className="journey-column">
          <div className="journey-label"><GraduationCap /><span>{lang === 'vi' ? 'Học tập' : 'Education'}</span></div>
          {education.map((item) => (
            <article className="journey-card" key={item.period} data-reveal>
              <p className="journey-card__period">{item.period}</p>
              <h3>{getStr(item.degree)}</h3>
              <strong>{getStr(item.school)}</strong>
            </article>
          ))}
          {certificates.map((certificate) => (
            <article className="journey-card journey-card--compact" key={certificate.period} data-reveal>
              <span>{lang === 'vi' ? 'Chứng chỉ' : 'Certificate'}</span>
              <h3>{getStr(certificate.name)}</h3>
              <p>{certificate.period}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="recognition" data-reveal>
        <div className="recognition__heading"><Award /><span>{lang === 'vi' ? 'DẤU MỐC & GHI NHẬN' : 'MILESTONES & RECOGNITION'}</span><strong>{String(prizes.length).padStart(2, '0')}</strong></div>
        <div className="recognition__list">
          {prizes.map((prize, index) => <p key={index}><span>0{index + 1}</span>{getStr(prize)}</p>)}
        </div>
      </div>
    </section>
  );
};
