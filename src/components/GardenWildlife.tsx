import { useEffect, useId, useRef } from 'react';
import './garden-wildlife.css';

type GardenWildlifeProps = { paused: boolean; motionAllowed?: boolean };

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export const GardenWildlife = ({ paused, motionAllowed = true }: GardenWildlifeProps) => {
  const root = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const unique = useId().replace(/:/g, '');
  const id = (name: string) => `${unique}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const squirrels = [...element.querySelectorAll<HTMLElement>('.wildlife-squirrel')];
    const tails = [...element.querySelectorAll<SVGGElement>('.wildlife-squirrel__tail')];
    const legs = [...element.querySelectorAll<SVGGElement>('.wildlife-squirrel__legs')];
    const birds = [...element.querySelectorAll<HTMLElement>('.wildlife-bird')];
    const wings = [...element.querySelectorAll<SVGGElement>('.wildlife-bird__wing')];
    const petals = [...element.querySelectorAll<SVGGElement>('.wildlife-petal')];
    const blossoms = [...element.querySelectorAll<SVGGElement>('.wildlife-blossom')];
    let frame = 0;
    let previous = 0;
    let width = window.innerWidth;
    const resize = () => { width = window.innerWidth; draw(elapsed.current); };
    const draw = (time: number) => {
      const mobile = width < 600;
      const left = mobile ? 28 : 250;
      const right = Math.max(left + 50, width - (mobile ? 65 : 110));
      const range = right - left;
      squirrels.forEach((squirrel, index) => {
        // Run, investigate, turn, run home, then rest. Both start above the control lane.
        const phase = (time + index * 10.4) % 25;
        let position = .1;
        let facing = 1;
        let running = false;
        if (phase < 7) { position = .1 + .82 * smooth(phase / 7); running = phase > .25 && phase < 6.8; }
        else if (phase < 12) position = .92;
        else if (phase < 19) { position = .92 - .82 * smooth((phase - 12) / 7); facing = -1; running = phase < 18.8; }
        else { position = .1; facing = -1; }
        if (index === 1) { position = 1 - position; facing *= -1; }
        const runBounce = running ? Math.abs(Math.sin(time * 12)) * (mobile ? 4 : 6) : Math.max(0, Math.sin((phase - 8.6) * 3)) * (phase > 8.6 && phase < 9.7 ? 15 : 0);
        const sniff = running ? 0 : Math.sin(time * 3.1 + index) * 1.6;
        squirrel.style.transform = `translate3d(${left + range * position}px, ${-runBounce}px, 0) scaleX(${facing}) rotate(${sniff}deg)`;
        squirrel.style.opacity = '1';
        tails[index]?.setAttribute('transform', `rotate(${Math.sin(time * (running ? 10 : 2) + index) * (running ? 5 : 9)} 40 72)`);
        legs[index]?.setAttribute('transform', `translate(${running ? Math.sin(time * 17) * 3 : 0} ${running ? Math.cos(time * 17) * 1.5 : 0})`);
      });
      birds.forEach((bird, index) => {
        // Six seconds in flight, eighteen seconds of clear sky.
        const phase = (time - 5 - index * .65) % 24;
        const flying = time >= 5 + index * .65 && phase >= 0 && phase < 6;
        bird.style.opacity = flying ? `${Math.min(1, phase * 3, (6 - phase) * 3) * .78}` : '0';
        if (!flying) return;
        const progress = phase / 6;
        const direction = Math.floor((time - 5) / 24) % 2 === 0 ? 1 : -1;
        const x = direction === 1 ? -70 + (width + 140) * progress : width + 70 - (width + 140) * progress;
        const y = 110 + index * 30 + Math.sin(progress * Math.PI * 2) * 27;
        bird.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${direction}) rotate(${Math.cos(progress * Math.PI * 2) * 8}deg)`;
        wings[index]?.setAttribute('transform', `translate(28 19) scale(1 ${.25 + (Math.sin(time * 15 + index) + 1) * .55}) translate(-28 -19)`);
      });
      const season = time % 32;
      const closing = 1 - smooth((season - 27) / 4);
      blossoms.forEach((blossom, index) => {
        const opening = smooth((season - .6 - index * .8) / 3.4) * closing;
        blossom.style.opacity = `${.18 + opening * .82}`;
        blossom.style.transform = `scale(${.3 + opening * .7}) rotate(${Math.sin(time * .55 + index) * 2}deg)`;
      });
      petals.forEach((petal, index) => {
        const flower = Math.floor(index / 6);
        const opening = smooth((season - .7 - flower * .8 - index % 6 * .17) / 2.9) * closing;
        const breathe = opening > .99 ? 1 + Math.sin(time * .8 + flower) * .025 : 1;
        petal.setAttribute('transform', `rotate(${index % 6 * 60}) scale(${(.19 + opening * .81) * breathe} ${(.12 + opening * .88) * breathe})`);
      });
    };
    const tick = (now: number) => {
      if (previous) elapsed.current += Math.min((now - previous) / 1000, .06);
      previous = now;
      draw(elapsed.current);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      const running = !paused && motionAllowed && !document.hidden;
      element.dataset.running = String(running);
      if (running) frame = requestAnimationFrame(tick);
    };
    draw(elapsed.current);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', resize, { passive: true });
    sync();
    return () => {
      cancelAnimationFrame(frame);
      element.dataset.running = 'false';
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', resize);
    };
  }, [paused, motionAllowed]);

  const flower = (x: number, y: number, scale: number, index: number) => (
    <g key={index} transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="wildlife-blossom">
        {Array.from({ length: 6 }, (_, petal) => <g className="wildlife-petal" key={petal} transform={`rotate(${petal * 60}) scale(.19 .12)`}><path d="M0 0C-16-7-23-34-10-43C7-57 25-36 18-20C15-9 5-3 0 0Z" fill={paint(index % 2 === 0 ? 'petal-blush' : 'petal-cream')} stroke="#ffe6d0" strokeWidth=".8" strokeOpacity=".35" /></g>)}
        <circle r="7" fill="#cfb874" /><circle r="4.5" fill="#e9d793" /><circle cx="-1.7" cy="-1.7" r="1.8" fill="#fff0b5" />
      </g>
    </g>
  );

  const squirrel = (index: number) => <div key={index} className={`wildlife-squirrel wildlife-squirrel--${index + 1}`}>
    <svg viewBox="0 0 132 100" fill="none" focusable="false">
      <g className="wildlife-squirrel__tail">
        <path d="M52 76C30 91 2 72 8 45C10 27 4 12 23 4C44-5 66 13 57 31C52 41 39 43 30 36C24 33 24 25 29 22C17 29 20 49 35 51C51 53 69 67 52 76Z" fill={paint(index === 0 ? 'fur' : 'fur-rust')} stroke="#624339" strokeWidth="2" />
        <path d="M24 12C10 19 26 32 18 42C14 58 22 71 37 74M38 9C51 15 50 26 43 29M18 47Q26 57 38 59" stroke="#f5ce91" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
        <path d="M16 16L11 14M10 33L5 32M10 53L5 56M18 68L14 73M34 78L33 84" stroke="#b98b62" strokeWidth="2" strokeLinecap="round" />
      </g>
      <ellipse cx="69" cy="69" rx="29" ry="23" fill={paint(index === 0 ? 'fur' : 'fur-rust')} stroke="#624339" strokeWidth="1.7" />
      <path d="M79 49C100 53 100 83 77 89C64 85 67 59 79 49Z" fill="#f1dbb0" />
      <g className="wildlife-squirrel__legs" fill={paint('fur')} stroke="#684438" strokeWidth="1.5">
        <path d="M53 79Q41 86 43 92L68 93Q73 88 63 86Z" /><path d="M84 81Q77 89 81 93L101 93Q106 86 94 85Z" />
      </g>
      <path d="M82 42L83 17Q88 6 98 29M100 33Q107 13 112 16L112 40" fill={paint('fur')} stroke="#684438" strokeWidth="1.5" />
      <path d="M87 28L87 17Q93 19 96 30M103 30L109 21L109 34" fill="#dca896" />
      <path d="M77 39C85 23 109 27 115 43C126 46 127 57 117 60C114 76 89 73 81 64C76 57 73 49 77 39Z" fill={paint(index === 0 ? 'fur' : 'fur-rust')} stroke="#684438" strokeWidth="1.7" />
      <ellipse cx="110" cy="57" rx="13" ry="9" fill="#f1dbb0" />
      <ellipse cx="101" cy="44" rx="8" ry="10" fill="#47382b" /><ellipse cx="103" cy="42" rx="4.2" ry="5.4" fill="#19241e" /><circle cx="102" cy="39" r="3" fill="#fff5df" /><circle cx="105" cy="46" r="1.4" fill="#fff5df" />
      <ellipse cx="121" cy="52" rx="4" ry="3" fill="#3e302b" /><path d="M117 58Q112 62 108 59" stroke="#745342" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M90 71Q96 80 104 72" stroke="#805544" strokeWidth="8" strokeLinecap="round" /><path d="M91 68Q98 77 104 70" stroke="#c99768" strokeWidth="5" strokeLinecap="round" />
      <path d="M111 60L126 64M110 62L124 69" stroke="#e7d3b0" strokeOpacity=".65" strokeWidth=".8" />
    </svg>
  </div>;

  return <div ref={root} className={`garden-wildlife${paused || !motionAllowed ? ' garden-wildlife--paused' : ''}`} aria-hidden="true" data-running="false">
    <svg className="wildlife-definitions" width="0" height="0" focusable="false">
      <defs>
        <linearGradient id={id('fur')} x1=".2" y1="0" x2=".7" y2="1"><stop stopColor="#e2b578" /><stop offset=".6" stopColor="#ba8353" /><stop offset="1" stopColor="#946040" /></linearGradient>
        <linearGradient id={id('fur-rust')} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#d6a06e" /><stop offset=".6" stopColor="#a96d51" /><stop offset="1" stopColor="#805141" /></linearGradient>
        <linearGradient id={id('petal-blush')} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#f5c4b1" /><stop offset=".65" stopColor="#d19694" /><stop offset="1" stopColor="#a36b7c" /></linearGradient>
        <linearGradient id={id('petal-cream')} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f3eccb" /><stop offset=".65" stopColor="#d9dca8" /><stop offset="1" stopColor="#a5ba80" /></linearGradient>
      </defs>
    </svg>
    <div className="wildlife-flowers wildlife-flowers--left"><svg viewBox="0 0 240 160" fill="none" focusable="false">
      <g stroke="#7b9865" strokeWidth="2.5"><path d="M78 160Q89 108 76 69M128 160Q119 123 142 95M42 160Q56 144 49 118" /></g>
      <g fill="#5c8059"><path d="M80 133Q42 137 38 101Q77 109 80 133ZM83 117Q117 109 119 86Q87 91 83 117ZM130 144Q153 151 172 126Q140 121 130 144ZM52 149Q29 151 25 132Q45 133 52 149Z" /></g>
      {flower(76, 69, .69, 0)}{flower(142, 95, .48, 1)}{flower(49, 118, .33, 2)}
    </svg></div>
    <div className="wildlife-flowers wildlife-flowers--right"><svg viewBox="0 0 240 160" fill="none" focusable="false">
      <g stroke="#7b9865" strokeWidth="2.5"><path d="M143 160Q145 104 159 65M95 160Q104 121 80 101M189 160Q195 122 186 112" /></g>
      <g fill="#5c8059"><path d="M146 124Q108 126 107 94Q140 98 146 124ZM150 105Q175 115 196 88Q163 81 150 105ZM104 145Q73 150 62 127Q96 119 104 145ZM190 147Q216 147 220 126Q195 127 190 147Z" /></g>
      {flower(159, 65, .7, 3)}{flower(80, 101, .5, 4)}{flower(186, 112, .35, 5)}
    </svg></div>
    {[0, 1].map(squirrel)}
    {[0, 1, 2].map(index => <div className={`wildlife-bird wildlife-bird--${index + 1}`} key={index}><svg viewBox="0 0 60 45" fill="none" focusable="false">
      <path d="M18 23L2 37L9 23L2 16Z" fill="#799d85" /><path d="M13 21Q27 12 43 19Q48 21 46 24Q27 30 13 21Z" fill={index === 1 ? '#d5b89b' : '#a6c0ab'} /><path d="M45 19L57 21L46 23Z" fill="#e4cf91" />
      <g className="wildlife-bird__wing"><path d="M32 23Q17 6 13 0Q36 3 39 20Z" fill={index === 1 ? '#907b70' : '#658576'} /><path d="M28 20Q17 8 16 4Q31 8 35 19" stroke="#d0dcc0" strokeWidth="1" strokeOpacity=".55" /></g>
      <circle cx="42" cy="20" r="1.5" fill="#223c31" />
    </svg></div>)}
  </div>;
};
