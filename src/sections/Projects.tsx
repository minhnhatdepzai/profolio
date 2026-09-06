import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight, Film, Github, Play, X } from 'lucide-react';
import { featuredProjects, type FeaturedProject } from '../data/projects';
import { useLanguage } from '../contexts/LanguageContext';

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
        <span className="artifact-real__proof">{getStr({ en: 'SOURCE-VERIFIED MEDIA', vi: 'MEDIA ĐÃ XÁC MINH NGUỒN' })}</span>
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
    <div className="artifact artifact--happy artifact--pending">
      <div className="artifact-label">SOURCE VERIFIED / {project.order}</div>
      <div className="pending-cross" aria-hidden="true" />
      <div className="pending-title">REAL<br />MEDIA<br /><i>PENDING</i></div>
      <div className="pending-modules"><span>VOICE ROOMS</span><span>ACCESSIBILITY</span><span>2D / 3D GAMES</span></div>
      <p>{getStr({ en: 'No fabricated interface preview.', vi: 'Không dùng ảnh giao diện giả.' })}</p>
    </div>
  );
};

const LinkIcon = ({ kind }: { kind: 'demo' | 'github' | 'video' }) => {
  if (kind === 'github') return <Github aria-hidden="true" />;
  if (kind === 'video') return <Film aria-hidden="true" />;
  return <Play aria-hidden="true" />;
};

export const Projects = () => {
  const { getStr, lang } = useLanguage();
  const [openSlug, setOpenSlug] = useState<FeaturedProject['slug'] | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openProject = featuredProjects.find((project) => project.slug === openSlug);

  useEffect(() => {
    const slug = location.hash.replace('#case-', '') as FeaturedProject['slug'];
    if (featuredProjects.some((project) => project.slug === slug)) setOpenSlug(slug);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openProject && !dialog.open) {
      dialog.showModal();
      document.body.classList.add('dialog-is-open');
      history.replaceState(null, '', `#case-${openProject.slug}`);
    } else if (!openProject && dialog.open) {
      dialog.close();
    }
    return () => document.body.classList.remove('dialog-is-open');
  }, [openProject]);

  const closeCase = () => {
    setOpenSlug(null);
    document.body.classList.remove('dialog-is-open');
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  };

  return (
    <section id="selected-work" className="projects-section">
      <header className="projects-heading section-pad" data-reveal>
        <div>
          <span className="eyebrow">02 · {lang === 'vi' ? 'DỰ ÁN MỚI NHẤT' : 'LATEST WORK'}</span>
          <h2>{lang === 'vi' ? 'Tám sản phẩm. Tám thế giới riêng.' : 'Eight products. Eight distinct worlds.'}</h2>
        </div>
        <p>2025—2026<br />{lang === 'vi' ? 'THIẾT KẾ · CODE · TRIỂN KHAI' : 'DESIGN · CODE · DELIVERY'}</p>
      </header>

      <div className="case-list">
        {featuredProjects.map((project) => (
          <article
            id={`work-${project.slug}`}
            className={`case-study case-study--${project.slug}`}
            key={project.slug}
            style={{ '--accent': project.accent, '--accent-soft': project.accentSoft, '--case-ink': project.ink } as CSSProperties}
          >
            <div className="case-study__artifact">
              <div className="case-study__artifact-inner"><ProjectArtifact project={project} /></div>
            </div>

            <div className="case-study__content">
              <div className="case-study__meta" data-reveal>
                <span>{project.order}</span>
                <span>{project.year}</span>
                <span className={`status status--${project.status}`}><i />{getStr(project.statusLabel)}</span>
              </div>
              <p className="case-study__eyebrow" data-reveal>{getStr(project.eyebrow)}</p>
              <h3 data-reveal>{project.title}</h3>
              <blockquote data-reveal>{getStr(project.statement)}</blockquote>
              <p className="case-study__summary" data-reveal>{getStr(project.summary)}</p>

              <div className="case-study__triptych" data-reveal>
                <div><span>{lang === 'vi' ? 'BÀI TOÁN' : 'PROBLEM'}</span><p>{getStr(project.problem)}</p></div>
                <div><span>{lang === 'vi' ? 'HỆ THỐNG' : 'SYSTEM'}</span><p>{getStr(project.solution)}</p></div>
                <div><span>{lang === 'vi' ? 'ĐÓNG GÓP' : 'CONTRIBUTION'}</span><p>{getStr(project.contribution)}</p></div>
              </div>

              <div className="case-study__stack" data-reveal>{project.stack.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <div className="case-study__actions" data-reveal>
                <button onClick={() => setOpenSlug(project.slug)} data-cursor="view">
                  {lang === 'vi' ? 'Mở system brief' : 'Open system brief'}<ArrowDownRight />
                </button>
                {project.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer" data-cursor={link.kind === 'video' ? 'play' : 'view'}>
                    <LinkIcon kind={link.kind} />{getStr(link.label)}<ArrowUpRight />
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dialogRef} className="case-dialog" onClose={closeCase} onCancel={(event) => { event.preventDefault(); closeCase(); }}>
        {openProject && (
          <div className="case-dialog__inner" style={{ '--accent': openProject.accent } as CSSProperties}>
            <button className="case-dialog__close" onClick={closeCase} aria-label={lang === 'vi' ? 'Đóng case study' : 'Close case study'}><X /></button>
            <div className="case-dialog__visual"><ProjectArtifact project={openProject} /></div>
            <div className="case-dialog__copy">
              <span>{openProject.order} / SYSTEM BRIEF</span>
              <h2>{openProject.title}</h2>
              <p>{getStr(openProject.summary)}</p>
              <h3>{lang === 'vi' ? 'Điểm đáng chú ý' : 'What makes it matter'}</h3>
              <ol>{openProject.highlights.map((highlight, index) => <li key={index}><span>0{index + 1}</span>{getStr(highlight)}</li>)}</ol>
              <div className="case-dialog__links">
                {openProject.links.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><LinkIcon kind={link.kind} />{getStr(link.label)}<ArrowUpRight /></a>
                ))}
                {!openProject.links.length && <p className="media-note">{lang === 'vi' ? 'Ảnh thật và demo JAPANO sẽ được bổ sung khi bạn gửi media.' : 'Real JAPANO imagery and demo will be added when media is supplied.'}</p>}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
};
