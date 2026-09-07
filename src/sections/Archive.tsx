import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { archiveProjects, type ArchiveProject } from '../data/projects';
import { useLanguage } from '../contexts/LanguageContext';

type Filter = 'All' | ArchiveProject['category'];
const filters: Filter[] = ['All', 'AI & Vision', 'Web & Mobile', 'Games', 'Security'];

export const Archive = () => {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState<Filter>('All');
  const projects = useMemo(
    () => filter === 'All' ? archiveProjects : archiveProjects.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <section id="archive" className="archive-section section-pad">
      <header className="section-heading section-heading--split" data-reveal>
        <div>
          <span className="eyebrow">05 · {lang === 'vi' ? 'KHO THỬ NGHIỆM' : 'BUILD ARCHIVE'}</span>
          <h2>{lang === 'vi' ? 'Nhiều câu hỏi hơn. Nhiều thứ đã xây hơn.' : 'More questions. More things built.'}</h2>
        </div>
        <p>{lang === 'vi' ? 'Một lát cắt từ các thử nghiệm AI, ứng dụng, game và bảo mật trên GitHub.' : 'A slice of AI, application, game and security experiments across GitHub.'}</p>
      </header>

      <div className="archive-filters" role="group" aria-label={lang === 'vi' ? 'Lọc dự án' : 'Filter projects'} data-reveal>
        {filters.map((item) => (
          <button key={item} className={filter === item ? 'is-active' : ''} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'All' && lang === 'vi' ? 'Tất cả' : item}</button>
        ))}
      </div>

      <div className="archive-list">
        {projects.map((project, index) => (
          <a href={project.url} target="_blank" rel="noreferrer" key={project.url} data-reveal data-cursor="view">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{project.name}</h3>
            <p>{project.category}</p>
            <time>{project.year}</time>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </div>
      <a className="archive-github" href="https://github.com/minhnhatdepzai?tab=repositories" target="_blank" rel="noreferrer">
        {lang === 'vi' ? 'Xem toàn bộ GitHub' : 'See the full GitHub archive'} <ArrowUpRight />
      </a>
    </section>
  );
};
