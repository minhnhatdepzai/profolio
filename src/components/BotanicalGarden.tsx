import { useEffect, useId, useRef, useState } from 'react';
import './botanical-garden.css';

type BotanicalGardenProps = {
  variant: 'hero' | 'vine' | 'footer';
  paused?: boolean;
  motionAllowed?: boolean;
};

const leafShape = 'M0 0C-20-20-70-29-88-69C-106-108-103-154-81-189C-64-216-30-229 2-273C29-234 65-222 89-191C120-151 117-109 99-77C80-39 37-27 0 0Z';

/** Decorative, native SVG foliage. Motion rests outside the viewport. */
export const BotanicalGarden = ({ variant, paused = false, motionAllowed = true }: BotanicalGardenProps) => {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, '');
  const [resting, setResting] = useState(true);
  const id = (name: string) => `${uid}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let visible = false;
    const update = () => setResting(paused || !motionAllowed || !visible || document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { rootMargin: '80px' });
    observer.observe(element);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [paused, motionAllowed]);

  const leaf = (x: number, y: number, rotate: number, scale: number, index: number, small = false) => (
    <g key={`leaf-${index}`} transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} className={small ? 'garden-detail' : undefined}>
      <g className={`garden-leaf garden-leaf--${index % 3}`}>
        <use href={`#${id(index % 3 === 1 ? 'spear' : 'monstera')}`} />
      </g>
    </g>
  );

  return (
    <div ref={root} className={`garden-flora garden-flora--${variant}${resting ? ' garden-flora--resting' : ''}`} aria-hidden="true">
      <svg viewBox={variant === 'vine' ? '0 0 360 1000' : '0 0 720 680'} fill="none" focusable="false">
        <defs>
          <linearGradient id={id('leaf')} x1="-95" y1="-210" x2="100" y2="-45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#b8db8b" />
            <stop offset=".16" stopColor="#6da05c" />
            <stop offset=".43" stopColor="#285540" />
            <stop offset=".51" stopColor="#173b2e" />
            <stop offset=".7" stopColor="#387050" />
            <stop offset="1" stopColor="#102a22" />
          </linearGradient>
          <linearGradient id={id('spear-fill')} x1="-42" y1="-230" x2="45" y2="-80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#adc481" />
            <stop offset=".42" stopColor="#5c874a" />
            <stop offset=".5" stopColor="#32583a" />
            <stop offset=".65" stopColor="#497849" />
            <stop offset="1" stopColor="#203e2b" />
          </linearGradient>
          <linearGradient id={id('stem')} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9ab879" /><stop offset=".45" stopColor="#4c7147" /><stop offset="1" stopColor="#1d392b" />
          </linearGradient>
          <linearGradient id={id('petal')} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f5dccc" /><stop offset=".45" stopColor="#dcae9f" /><stop offset="1" stopColor="#9d6b6e" />
          </linearGradient>
          <linearGradient id={id('mushroom')} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#e5efd0" /><stop offset=".45" stopColor="#a7c69a" /><stop offset="1" stopColor="#4a7660" />
          </linearGradient>
          <radialGradient id={id('spore')}>
            <stop stopColor="#f4ffdc" /><stop offset=".18" stopColor="#d8f5a7" stopOpacity=".85" /><stop offset="1" stopColor="#c9ff4a" stopOpacity="0" />
          </radialGradient>
          <mask id={id('cuts')} maskUnits="userSpaceOnUse" x="-125" y="-280" width="250" height="285">
            <path d={leafShape} fill="white" />
            <g stroke="black" strokeLinecap="round" fill="none">
              <path d="M-118-88Q-67-82-37-115M-112-137Q-65-123-29-156M-89-181Q-54-160-22-197" strokeWidth="12" />
              <path d="M124-93Q77-82 41-115M125-140Q80-123 31-158M101-182Q62-165 26-199" strokeWidth="12" />
              <path d="M-20-64Q-32-79-25-96M26-72Q41-92 31-106M-15-125Q-24-133-18-145M20-134Q29-142 22-154" strokeWidth="7" />
            </g>
          </mask>
          <g id={id('monstera')}>
            <path d={leafShape} fill={paint('leaf')} mask={paint('cuts')} stroke="#8db67a" strokeOpacity=".22" strokeWidth="1" />
            <path d="M0 5Q8-117 2-265" stroke="#bacd93" strokeOpacity=".5" strokeWidth="1.7" />
            <path d="M4-47Q-26-53-52-73M5-112Q-19-126-50-143M5-171Q-16-183-40-200M5-64Q32-60 68-84M6-130Q34-132 70-154M5-189Q25-185 45-207" stroke="#a9c182" strokeOpacity=".28" strokeWidth="1" />
          </g>
          <g id={id('spear')}>
            <path d="M0 0C-61-68-65-171 7-288C65-173 67-72 0 0Z" fill={paint('spear-fill')} stroke="#a8c385" strokeOpacity=".22" />
            <path d="M0 0Q11-144 7-284" stroke="#c5d9a0" strokeOpacity=".45" strokeWidth="1.5" />
            <g stroke="#b1c997" strokeOpacity=".22">
              <path d="M4-52L-25-86M6-78L-34-118M7-104L-39-153M8-136L-33-182M9-164L-22-211M8-199L-9-239M4-56L33-89M6-84L44-126M7-113L46-156M8-144L40-188M9-178L31-217" />
            </g>
          </g>
          <g id={id('fern')}>
            <path d="M0 0C-18-64-29-159 0-259" stroke={paint('stem')} strokeWidth="2.5" />
            {Array.from({ length: 10 }, (_, index) => {
              const y = -24 - index * 23;
              const width = 51 - index * 3.8;
              return <g key={index} fill={paint('spear-fill')}><path d={`M-13 ${y}Q${-width - 20} ${y + 6} ${-width - 31} ${y - 33}Q${-width + 1} ${y - 28}-13 ${y}Z`} /><path d={`M-12 ${y - 1}Q${width - 5} ${y + 2} ${width + 12} ${y - 40}Q10 ${y - 24}-12 ${y - 1}Z`} /></g>;
            })}
          </g>
          <g id={id('bloom')}>
            <g fill={paint('petal')} stroke="#f7decd" strokeOpacity=".25">
              {[0, 72, 144, 216, 288].map((angle) => <path key={angle} transform={`rotate(${angle})`} d="M0 0C-26-12-22-45-6-51C9-62 27-43 22-27C19-10 6-3 0 0Z" />)}
            </g>
            <circle r="8" fill="#dcc58c" /><circle r="3" fill="#f0e2a8" />
          </g>
          <g id={id('shroom')}>
            <path d="M-5 0Q-1-28-7-54L7-54Q4-24 10 0Z" fill="#91aa82" />
            <path d="M-48-46Q-26-94 1-91Q28-90 50-46Q5-26-48-46Z" fill={paint('mushroom')} />
            <path d="M-48-46Q2-39 50-46Q8-23-48-46Z" fill="#bddbad" />
            <path d="M-34-43L-4-35M-21-42L-3-35M-8-42L0-35M8-41L3-35M21-42L7-35M35-44L10-35" stroke="#608369" strokeOpacity=".6" />
            <ellipse cx="-14" cy="-68" rx="5" ry="3" fill="#ebf5d7" opacity=".55" /><ellipse cx="15" cy="-60" rx="3" ry="2" fill="#ebf5d7" opacity=".55" />
          </g>
        </defs>

        {variant === 'vine' ? <>
          <path d="M302 1020C204 876 350 790 243 641S345 412 250 281S291 103 253-20" stroke={paint('stem')} strokeWidth="4" />
          <path d="M278 995C198 822 307 770 214 632S320 390 230 240" stroke="#9db78a" strokeOpacity=".24" strokeWidth="1" />
          {leaf(269, 212, -52, .48, 0)}
          {leaf(263, 382, 51, .53, 1)}
          {leaf(261, 537, -64, .56, 2)}
          {leaf(260, 718, 47, .58, 3)}
          {leaf(280, 877, -58, .64, 4)}
          {leaf(279, 1010, 48, .53, 5)}
          <g transform="translate(277 633) scale(.65)" className="garden-detail"><use href={`#${id('bloom')}`} /></g>
          <g transform="translate(294 966) rotate(-23) scale(.45)" className="garden-detail"><use href={`#${id('fern')}`} /></g>
          <g className="garden-spore garden-spore--one"><circle cx="205" cy="372" r="9" fill={paint('spore')} /></g>
          <g className="garden-spore garden-spore--two"><circle cx="203" cy="789" r="8" fill={paint('spore')} /></g>
        </> : <>
          <ellipse cx="562" cy="658" rx="200" ry="34" fill="#071c15" opacity=".6" />
          <g stroke={paint('stem')} strokeLinecap="round">
            <path d="M631 709Q571 489 623 262M615 716Q486 538 493 429M617 707Q489 649 302 601M633 713Q699 552 692 436M621 712Q525 535 382 505" strokeWidth="5" />
            <path d="M625 711Q501 618 429 379M638 713Q586 540 554 544" strokeWidth="2.5" />
          </g>
          {leaf(623, 448, 8, 1.15, 1)}
          {leaf(690, 539, 49, 1.12, 2)}
          {leaf(509, 536, -43, 1.05, 0)}
          {leaf(624, 624, 37, 1.12, 3)}
          {leaf(413, 640, -70, .99, 4)}
          {leaf(566, 663, -15, .75, 5)}
          {leaf(699, 678, 68, .73, 6, true)}
          <g transform="translate(401 683) rotate(-36) scale(.78)" className="garden-detail"><g className="garden-leaf garden-leaf--one"><use href={`#${id('fern')}`} /></g></g>
          <g transform="translate(672 682) rotate(33) scale(.67)" className="garden-detail"><g className="garden-leaf garden-leaf--two"><use href={`#${id('fern')}`} /></g></g>
          <path d="M495 684Q478 636 497 588M539 690Q546 661 568 634" stroke={paint('stem')} strokeWidth="2" />
          <g transform="translate(495 591) rotate(-24) scale(.67)"><use href={`#${id('bloom')}`} /></g>
          <g transform="translate(568 635) rotate(18) scale(.48)" className="garden-detail"><use href={`#${id('bloom')}`} /></g>
          <g transform="translate(446 684) rotate(-8) scale(.75)"><use href={`#${id('shroom')}`} /></g>
          <g transform="translate(395 689) rotate(13) scale(.46)" className="garden-detail"><use href={`#${id('shroom')}`} /></g>
          <g className="garden-spore garden-spore--one"><circle cx="367" cy="534" r="13" fill={paint('spore')} /><circle cx="617" cy="328" r="8" fill={paint('spore')} /></g>
          <g className="garden-spore garden-spore--two"><circle cx="489" cy="423" r="11" fill={paint('spore')} /><circle cx="675" cy="572" r="10" fill={paint('spore')} /></g>
          <g className="garden-spore garden-spore--three"><circle cx="526" cy="564" r="8" fill={paint('spore')} /><circle cx="423" cy="632" r="11" fill={paint('spore')} /></g>
        </>}
      </svg>
    </div>
  );
};
