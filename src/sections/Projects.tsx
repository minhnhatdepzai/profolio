import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Film, Github, Globe, Play, Plus, X } from 'lucide-react';
import { featuredProjects, type FeaturedProject, type ProjectLink } from '../data/projects';
import { useLanguage } from '../contexts/LanguageContext';
import './projects-gallery.css';

const ProjectArtifact = ({ project }: { project: FeaturedProject }) => {
  const { getStr } = useLanguage();

  if (project.media) {
    const mediaSource = /^https?:\/\//.test(project.media.file)
      ? project.media.file
      : `${import.meta.env.BASE_URL}${project.media.file}`;

    return (
      <div className={`artifact artifact--real artifact--real-${project.slug}`}>
        <div className="artifact-label">{getStr(project.media.label)} / {project.order}</div>
        <div className="artifact-real__type" aria-hidden="true">{project.title}</div>
        <figure className="artifact-real__screen">
          <img
            src={mediaSource}
            alt={getStr(project.media.alt)}
            loading="lazy"
            decoding="async"
          />
          <figcaption><i />{project.media.source}</figcaption>
        </figure>
      </div>
    );
  }

  if (project.slug === 'japano') {
    return (
      <div className="artifact artifact--japano">
        <div className="artifact-label">AI COMMERCE / {project.order}</div>
        <div className="japano-word">JPN</div>
        <div className="japano-phone japano-phone--front"><span>AI FIT</span><i /><i /><strong>YOUR LOOK</strong></div>
        <div className="japano-phone japano-phone--back"><span>STORE</span><i /><i /></div>
        <div className="artifact-orbit"><span>SHOP</span><span>TRY</span><span>EXPLORE</span></div>
      </div>
    );
  }

  if (project.slug === 'saigon-77') {
    return (
      <div className="artifact artifact--saigon">
        <div className="artifact-label">CITY SYSTEM / {project.order}</div>
        <div className="saigon-sun" />
        <div className="saigon-skyline" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /></div>
        <div className="saigon-road" aria-hidden="true"><i /><i /><i /></div>
        <div className="saigon-route"><i /><i /><i /><span>ROUTE</span></div>
        <div className="saigon-type">SAIGON<strong>// 77</strong></div>
        <div className="saigon-hud"><span>WALK</span><span>DRIVE</span><span>MISSION</span></div>
      </div>
    );
  }

  if (project.slug === 'math-lab') {
    return (
      <div className="artifact artifact--math">
        <div className="artifact-label">SEMANTIC SCENE / {project.order}</div>
        <div className="math-formula">x² + y² = r²</div>
        <svg className="math-graph" viewBox="0 0 420 300" role="img" aria-label="Animated coordinate system">
          <path d="M20 150H400M210 20V280" className="math-axis" />
          <path d="M45 245C105 235 115 65 210 105S305 245 385 58" className="math-curve" />
          <circle cx="210" cy="105" r="7" />
        </svg>
        <div className="math-bars"><i /><i /><i /><i /></div>
        <div className="math-step">MODEL → PLAN → SCENE</div>
      </div>
    );
  }

  if (project.slug === 'smart-classroom') {
    return (
      <div className="artifact artifact--smart-classroom">
        <div className="artifact-label">SMART CLASSROOM / {project.order}</div>
        <div className="classroom-board"><span>EDUVISION</span><strong>AI</strong><i /></div>
        <div className="classroom-desks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="classroom-camera"><i /></div>
        <div className="classroom-scan" aria-hidden="true" />
        <div className="classroom-signals"><span>VISION</span><span>AGENT</span><span>DIGITAL TWIN</span></div>
      </div>
    );
  }

  if (project.slug === 'kho') {
    return (
      <div className="artifact artifact--kho">
        <div className="artifact-label">LANGBIANG / {project.order}</div>
        <div className="kho-sun" />
        <div className="kho-gong"><i /><i /><i /></div>
        <svg className="kho-mountain" viewBox="0 0 600 360" aria-hidden="true">
          <path d="M-20 345L115 165L190 260L320 62L470 244L620 118V380H-20Z" />
          <path d="M-20 360L145 238L265 310L420 160L620 295V380H-20Z" />
        </svg>
        <div className="kho-card">FLAG<br />CARD <strong>08</strong></div>
      </div>
    );
  }

  if (project.slug === 'picko247') {
    return (
      <div className="artifact artifact--picko">
        <div className="artifact-label">RALLY ENGINE / {project.order}</div>
        <div className="picko-score"><span>LIVE</span><strong>24</strong><i>:</i><strong>17</strong></div>
        <div className="picko-court"><i className="picko-ball" /></div>
        <div className="picko-type">RALLY<br />247</div>
      </div>
    );
  }

  if (project.slug === 'vehicle-counting') {
    return (
      <div className="artifact artifact--vehicle-counting">
        <div className="artifact-label">VISION PIPELINE / {project.order}</div>
        <div className="traffic-feed">
          <div className="traffic-lanes" aria-hidden="true"><i /><i /></div>
          <div className="traffic-box traffic-box--car"><span>ID 17 · CAR</span></div>
          <div className="traffic-box traffic-box--bike"><span>ID 08 · BIKE</span></div>
          <div className="traffic-box traffic-box--bus"><span>ID 24 · BUS</span></div>
          <div className="traffic-line"><span>COUNT LINE</span></div>
        </div>
        <div className="traffic-count"><span>UP</span><strong>—</strong><span>DOWN</span><strong>—</strong></div>
        <div className="traffic-model">YOLOv8 × ByteTrack</div>
      </div>
    );
  }

  return (
    <div className="artifact artifact--community">
      <div className="artifact-label">SOCIAL PLAY / {project.order}</div>
      <div className="community-orbits" aria-hidden="true"><i /><i /><i /></div>
      <div className="community-word" aria-hidden="true">HAPPY<br /><span>TO</span>PLAY<span className="community-star">✳</span></div>
      <div className="community-footnote"><span>PLAY. CONNECT. BELONG.</span><span>{getStr({ en: 'CONCEPT ARTWORK', vi: 'MINH HỌA Ý TƯỞNG' })}</span></div>
    </div>
  );
};

const LinkIcon = ({ kind }: { kind: ProjectLink['kind'] }) => {
  if (kind === 'github') return <Github aria-hidden="true" />;
  if (kind === 'video') return <Film aria-hidden="true" />;
  if (kind === 'showcase') return <Globe aria-hidden="true" />;
  return <Play aria-hidden="true" />;
};

export const Projects = () => {
  const { getStr, lang } = useLanguage();
  const [openSlug, setOpenSlug] = useState<FeaturedProject['slug'] | null>(() => (
    featuredProjects.find((project) => location.hash === `#case-${project.slug}`)?.slug ?? null
  ));
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const returnHashRef = useRef(location.hash.startsWith('#case-') ? '#selected-work' : location.hash);
  const openProject = featuredProjects.find((project) => project.slug === openSlug);

  useEffect(() => {
    const syncHash = (event: Event) => {
      const nextSlug = featuredProjects.find((project) => location.hash === `#case-${project.slug}`)?.slug ?? null;
      if (nextSlug && !dialogRef.current?.open) {
        const activeElement = document.activeElement;
        triggerRef.current = activeElement instanceof HTMLElement && activeElement !== document.body
          ? activeElement
          : null;
        if (event instanceof HashChangeEvent) {
          const previousHash = new URL(event.oldURL).hash;
          returnHashRef.current = previousHash.startsWith('#case-') ? '#selected-work' : previousHash;
        }
      }
      setOpenSlug(nextSlug);
    };
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);
    return () => {
      window.removeEventListener('hashchange', syncHash);
      window.removeEventListener('popstate', syncHash);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !openSlug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('dialog-is-open');
    dialog.showModal();
    dialog.scrollTop = 0;

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove('dialog-is-open');
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [openSlug]);

  const openCase = (project: FeaturedProject, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    returnHashRef.current = location.hash.startsWith('#case-') ? '#selected-work' : location.hash;
    history.pushState(null, '', `#case-${project.slug}`);
    setOpenSlug(project.slug);
  };

  const closeCase = () => {
    if (location.hash.startsWith('#case-')) {
      history.replaceState(null, '', `${location.pathname}${location.search}${returnHashRef.current}`);
    }
    setOpenSlug(null);
  };

  return (
    <section id="selected-work" className="projects-section work-gallery" aria-labelledby="work-gallery-title">
      <header className="work-gallery__heading" data-reveal>
        <div className="work-gallery__eyeline">
          <span className="eyebrow">02 / {lang === 'vi' ? 'DỰ ÁN TIÊU BIỂU' : 'SELECTED WORK'}</span>
          <span className="work-gallery__edition">2025—2026</span>
        </div>
        <div className="work-gallery__intro">
          <h2 id="work-gallery-title">{lang === 'vi' ? 'Từ ý tưởng.' : 'From an idea.'}<br /><em>{lang === 'vi' ? 'Đến trải nghiệm.' : 'To an experience.'}</em><sup>08</sup></h2>
          <p>{lang === 'vi' ? 'Tám dự án, tám thế giới riêng. Khám phá sản phẩm, chơi thử và nhìn sâu vào cách tôi xây dựng.' : 'Eight projects. Eight distinct worlds. Explore the products, press play, and see how I build.'}</p>
        </div>
        <div className="work-gallery__legend"><span>AI & PRODUCT ENGINEERING</span><span>WEB · MOBILE · INTERACTIVE 3D</span></div>
      </header>

      <div className="work-gallery__grid">
        {featuredProjects.map((project) => (
          <article
            id={`work-${project.slug}`}
            className={`project-card project-card--${project.slug}`}
            key={project.slug}
            style={{ '--accent': project.accent, '--accent-soft': project.accentSoft, '--case-ink': project.ink } as CSSProperties}
            aria-labelledby={`project-title-${project.slug}`}
            data-reveal
          >
            <div className="project-card__topline"><span>{project.order} / {project.year}</span><span>{getStr(project.eyebrow)}</span></div>
            <div className="project-card__visual">
              <ProjectArtifact project={project} />
              <button
                className="project-card__visual-action"
                onClick={(event) => openCase(project, event.currentTarget)}
                aria-label={`${lang === 'vi' ? 'Khám phá dự án' : 'Explore project'} ${project.title}`}
                aria-haspopup="dialog"
                data-cursor="view"
              ><ArrowUpRight aria-hidden="true" /></button>
            </div>

            <div className="project-card__content">
              <div className="project-card__title-row">
                <h3 id={`project-title-${project.slug}`}>{project.title}</h3>
                <span className={`project-card__status project-card__status--${project.status}`}><i />{getStr(project.statusLabel)}</span>
              </div>
              <p className="project-card__summary">{getStr(project.summary)}</p>
              <div className="project-card__stack" aria-label={lang === 'vi' ? 'Công nghệ nổi bật' : 'Core technologies'}>{project.stack.slice(0, 3).map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="project-card__actions">
                <button onClick={(event) => openCase(project, event.currentTarget)} aria-haspopup="dialog" data-cursor="view">
                  {lang === 'vi' ? 'Câu chuyện dự án' : 'Read case study'}<Plus aria-hidden="true" />
                </button>
                {project.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" data-cursor={link.kind === 'video' ? 'play' : 'view'}>
                    <LinkIcon kind={link.kind} /><span>{getStr(link.label)}</span><ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="work-gallery__end"><span>08 / 08</span><span>{lang === 'vi' ? 'Mỗi dự án, một cách giải bài toán.' : 'Different worlds. The same drive to build.'}</span><ArrowUpRight aria-hidden="true" /></div>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        aria-describedby="project-dialog-summary"
        onCancel={(event) => { event.preventDefault(); closeCase(); }}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeCase();
        }}
      >
        {openProject && (
          <div className="project-dialog__inner" style={{ '--accent': openProject.accent, '--accent-soft': openProject.accentSoft, '--case-ink': openProject.ink } as CSSProperties}>
            <header className="project-dialog__bar"><span>{openProject.order} / {lang === 'vi' ? 'CÂU CHUYỆN DỰ ÁN' : 'PROJECT CASE STUDY'}</span><button className="project-dialog__close" onClick={closeCase} aria-label={lang === 'vi' ? 'Đóng case study' : 'Close case study'} autoFocus><X aria-hidden="true" /></button></header>
            <div className="project-dialog__layout">
            <div className="project-dialog__visual"><ProjectArtifact project={openProject} /></div>
            <div className="project-dialog__copy">
              <span className="project-dialog__eyebrow">{getStr(openProject.eyebrow)}</span>
              <h2 id="project-dialog-title">{openProject.title}</h2>
              <blockquote>{getStr(openProject.statement)}</blockquote>
              <p id="project-dialog-summary">{getStr(openProject.summary)}</p>
              <dl className="project-dialog__details">
                <div><dt>{lang === 'vi' ? 'Bài toán' : 'The problem'}</dt><dd>{getStr(openProject.problem)}</dd></div>
                <div><dt>{lang === 'vi' ? 'Giải pháp' : 'The solution'}</dt><dd>{getStr(openProject.solution)}</dd></div>
                <div><dt>{lang === 'vi' ? 'Đóng góp của tôi' : 'My contribution'}</dt><dd>{getStr(openProject.contribution)}</dd></div>
              </dl>
              <h3>{lang === 'vi' ? 'Điểm đáng chú ý' : 'What makes it matter'}</h3>
              <ol>{openProject.highlights.map((highlight, index) => <li key={index}><span>0{index + 1}</span>{getStr(highlight)}</li>)}</ol>
              <h3>{lang === 'vi' ? 'Công nghệ sử dụng' : 'Built with'}</h3>
              <div className="project-dialog__stack">{openProject.stack.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="project-dialog__links">
                {openProject.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><LinkIcon kind={link.kind} />{getStr(link.label)}<ArrowUpRight aria-hidden="true" /></a>
                ))}
              </div>
            </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
