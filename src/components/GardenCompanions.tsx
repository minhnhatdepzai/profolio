import { useEffect, useId, useRef } from 'react';
import { DraggableGecko } from './DraggableGecko';
import './garden-companions.css';

export const GardenGeckoArt = () => {
  const skinId = useId();
  const headId = useId();
  return (
  <svg className="garden-gecko__drawing" viewBox="0 0 170 112" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id={skinId} x1="72" y1="28" x2="98" y2="82" gradientUnits="userSpaceOnUse"><stop stopColor="#e2ff92" /><stop offset=".46" stopColor="#bce960" /><stop offset="1" stopColor="#719f32" /></linearGradient>
      <linearGradient id={headId} x1="119" y1="32" x2="135" y2="81" gradientUnits="userSpaceOnUse"><stop stopColor="#eaffad" /><stop offset="1" stopColor="#a2cf52" /></linearGradient>
    </defs>

    <g className="garden-gecko__tail" strokeLinecap="round" strokeLinejoin="round">
      <path d="M62 58C43 62 23 71 15 59C4 42 17 21 34 27C52 32 49 55 35 55C25 55 24 42 33 41" stroke="#283c20" strokeWidth="13" />
      <path d="M62 56C43 60 23 69 15 57C4 40 17 19 34 25C52 30 49 53 35 53C25 53 24 40 33 39" stroke="#abdb54" strokeWidth="9" />
      <path d="M54 55C43 58 25 65 18 56C8 42 19 23 33 28" stroke="#e2ff98" strokeWidth="2.6" />
    </g>

    <g className="garden-gecko__leg garden-gecko__leg--back-top" strokeLinecap="round" strokeLinejoin="round">
      <path d="M73 43L63 28L51 25" stroke="#283c20" strokeWidth="10" /><path d="M73 42L63 27L51 24" stroke="#b5df64" strokeWidth="6.5" />
      <path d="M51 24L43 16M51 24L40 25M51 24L44 32" stroke="#8bbe4d" strokeWidth="4" /><g fill="#d9f69c" stroke="#36542b" strokeWidth="1.2"><circle cx="42" cy="15" r="3" /><circle cx="39" cy="25" r="3" /><circle cx="43" cy="33" r="3" /></g>
    </g>
    <g className="garden-gecko__leg garden-gecko__leg--front-top" strokeLinecap="round" strokeLinejoin="round">
      <path d="M98 43L109 29L121 23" stroke="#283c20" strokeWidth="10" /><path d="M98 42L109 28L121 22" stroke="#c6ed76" strokeWidth="6.5" />
      <path d="M121 22L128 12M121 22L133 20M121 22L131 28" stroke="#a2cf58" strokeWidth="4" /><g fill="#e2ffa6" stroke="#36542b" strokeWidth="1.2"><circle cx="128" cy="11" r="3" /><circle cx="134" cy="20" r="3" /><circle cx="132" cy="29" r="3" /></g>
    </g>
    <g className="garden-gecko__leg garden-gecko__leg--back-bottom" strokeLinecap="round" strokeLinejoin="round">
      <path d="M72 69L62 86L49 88" stroke="#283c20" strokeWidth="10" /><path d="M72 68L62 85L49 87" stroke="#9dc64e" strokeWidth="6.5" />
      <path d="M49 87L42 78M49 87L37 88M49 87L42 97" stroke="#87b344" strokeWidth="4" /><g fill="#d3ed90" stroke="#36542b" strokeWidth="1.2"><circle cx="41" cy="77" r="3" /><circle cx="36" cy="88" r="3" /><circle cx="41" cy="98" r="3" /></g>
    </g>
    <g className="garden-gecko__leg garden-gecko__leg--front-bottom" strokeLinecap="round" strokeLinejoin="round">
      <path d="M98 69L109 83L122 88" stroke="#283c20" strokeWidth="10" /><path d="M98 68L109 82L122 87" stroke="#b0d85f" strokeWidth="6.5" />
      <path d="M122 87L130 78M122 87L135 86M122 87L131 98" stroke="#96c14c" strokeWidth="4" /><g fill="#e2f8a5" stroke="#36542b" strokeWidth="1.2"><circle cx="131" cy="77" r="3" /><circle cx="136" cy="86" r="3" /><circle cx="132" cy="99" r="3" /></g>
    </g>

    <g className="garden-gecko__body">
      <path d="M53 57C52 40 69 30 86 33C102 32 115 43 115 57C115 75 98 83 80 81C66 80 52 71 53 57Z" fill={`url(#${skinId})`} stroke="#283c20" strokeWidth="2.8" />
      <path d="M61 56C62 46 71 39 83 40C93 40 100 43 104 49" stroke="#efffc2" strokeWidth="3.5" strokeLinecap="round" opacity=".85" />
      <path d="M62 68C76 78 94 78 105 67" stroke="#597d30" strokeWidth="2" strokeLinecap="round" opacity=".65" />
      <g fill="#557c35" opacity=".5"><ellipse cx="70" cy="54" rx="3" ry="2" transform="rotate(-25 70 54)" /><ellipse cx="87" cy="50" rx="3.8" ry="2.5" transform="rotate(20 87 50)" /><ellipse cx="95" cy="64" rx="3" ry="2.2" /><ellipse cx="78" cy="66" rx="4" ry="2.5" transform="rotate(30 78 66)" /><circle cx="60" cy="61" r="1.5" /></g>
      <g fill="#f1ffd0" opacity=".75"><circle cx="78" cy="46" r="1.2" /><circle cx="91" cy="58" r="1.1" /><circle cx="68" cy="64" r="1" /></g>
    </g>

    <g className="garden-gecko__head">
      <path d="M104 44L111 29L121 36C135 34 147 43 153 51C159 61 149 72 132 77C117 81 107 74 104 65Z" fill={`url(#${headId})`} stroke="#283c20" strokeWidth="2.8" strokeLinejoin="round" />
      <path d="M129 69Q143 74 150 61" stroke="#405929" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M142 47L147 49" stroke="#fff6ce" strokeWidth="2.8" strokeLinecap="round" /><circle cx="151" cy="55" r="1.5" fill="#293f21" />
      <circle cx="126" cy="43" r="12.5" fill="#accf5b" stroke="#2d4322" strokeWidth="2.5" />
      <circle cx="119" cy="65" r="11" fill="#aac952" stroke="#2d4322" strokeWidth="2.5" />
      <g className="garden-gecko__eye garden-gecko__eye--top"><ellipse cx="129" cy="42" rx="7.6" ry="8" fill="#fff9d9" /><g className="garden-gecko__pupil"><ellipse cx="132" cy="42" rx="3.1" ry="5.1" fill="#202b1a" /><circle cx="132.5" cy="39.5" r="1.4" fill="white" /></g></g>
      <g className="garden-gecko__eye garden-gecko__eye--bottom"><ellipse cx="122" cy="65" rx="7" ry="7.3" fill="#fff9d9" /><g className="garden-gecko__pupil"><ellipse cx="124.5" cy="65" rx="2.9" ry="4.8" fill="#202b1a" /><circle cx="125" cy="62.5" r="1.3" fill="white" /></g></g>
      <path d="M116 37Q122 30 132 35" stroke="#edffb9" strokeWidth="2" strokeLinecap="round" /><path d="M109 67Q108 58 114 56" stroke="#e4f7a1" strokeWidth="1.8" strokeLinecap="round" />
      <ellipse cx="139" cy="61" rx="3.2" ry="2" fill="#d6aa71" opacity=".5" />
    </g>
  </svg>
  );
};

const ButterflyDrawing = () => (
  <svg className="garden-butterfly__drawing" viewBox="0 0 100 110" fill="none" aria-hidden="true">
    <defs><linearGradient id="garden-wing" x1="12" y1="15" x2="74" y2="84" gradientUnits="userSpaceOnUse"><stop stopColor="#f4d6ee" /><stop offset=".55" stopColor="#c5b7eb" /><stop offset="1" stopColor="#99bdda" /></linearGradient></defs>
    <g className="garden-butterfly__wing garden-butterfly__wing--left">
      <path d="M48 53C41 28 25 8 13 15C-3 25 9 53 36 59C14 54 10 72 23 84C35 95 48 74 48 53Z" fill="url(#garden-wing)" stroke="#6c627c" strokeWidth="1.6" />
      <path d="M45 51C31 43 22 30 18 23M44 55L17 44M44 65L25 78" stroke="#9783b5" strokeWidth="1.3" opacity=".7" />
      <path d="M16 23C11 31 16 38 22 38C29 39 28 29 24 26C21 23 18 22 16 23Z" fill="#f7e7ca" /><ellipse cx="27" cy="72" rx="6" ry="7" fill="#e4d8f8" /><ellipse cx="28" cy="72" rx="2.5" ry="3.5" fill="#8879a1" />
      <circle cx="12" cy="42" r="2" fill="#fff2dd" /><circle cx="17" cy="49" r="1.7" fill="#fff2dd" /><circle cx="22" cy="53" r="1.5" fill="#fff2dd" />
    </g>
    <g className="garden-butterfly__wing garden-butterfly__wing--right">
      <path d="M52 53C59 28 75 8 87 15C103 25 91 53 64 59C86 54 90 72 77 84C65 95 52 74 52 53Z" fill="url(#garden-wing)" stroke="#6c627c" strokeWidth="1.6" />
      <path d="M55 51C69 43 78 30 82 23M56 55L83 44M56 65L75 78" stroke="#9783b5" strokeWidth="1.3" opacity=".7" />
      <path d="M84 23C89 31 84 38 78 38C71 39 72 29 76 26C79 23 82 22 84 23Z" fill="#f7e7ca" /><ellipse cx="73" cy="72" rx="6" ry="7" fill="#e4d8f8" /><ellipse cx="72" cy="72" rx="2.5" ry="3.5" fill="#8879a1" />
      <circle cx="88" cy="42" r="2" fill="#fff2dd" /><circle cx="83" cy="49" r="1.7" fill="#fff2dd" /><circle cx="78" cy="53" r="1.5" fill="#fff2dd" />
    </g>
    <path d="M48 40Q39 26 37 33M52 40Q61 26 63 33" stroke="#74647b" strokeWidth="1.6" strokeLinecap="round" /><circle cx="37" cy="33" r="1.8" fill="#c8ff79" /><circle cx="63" cy="33" r="1.8" fill="#c8ff79" />
    <ellipse cx="50" cy="58" rx="4" ry="17" fill="#73637f" /><path d="M50 48V70" stroke="#d4c9e6" strokeWidth="1.4" strokeLinecap="round" /><circle cx="50" cy="42" r="4.5" fill="#90839c" /><circle cx="48" cy="41" r=".8" fill="#f9f7dc" /><circle cx="52" cy="41" r=".8" fill="#f9f7dc" />
  </svg>
);

/** Only the gecko is interactive; the rest of the viewport remains click-through. */
export const GardenCompanions = ({ paused, motionAllowed = true, suspended = false }: { paused: boolean; motionAllowed?: boolean; suspended?: boolean }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const butterflyRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const butterfly = butterflyRef.current;
    if (!root || !butterfly) return;
    let frame = 0;
    let previousTime = 0;
    const paint = () => {
      const width = innerWidth;
      const height = innerHeight;
      const mobile = width < 700;
      const time = elapsedRef.current / 1000;
      const orbit = time * (Math.PI * 2 / 22) - Math.PI / 2;
      const x = width * .5 + Math.sin(orbit) * (width * .5 - (mobile ? 31 : 49));
      const top = mobile ? 133 : 157;
      const bottom = height - (mobile ? 155 : 135);
      const y = (top + bottom) / 2 + Math.sin(orbit * 2) * Math.max(35, (bottom - top) / 2) + Math.cos(time * 2) * 6;
      butterfly.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) rotate(${(Math.sin(orbit * 2) * 25).toFixed(2)}deg)`;
      butterfly.style.setProperty('--butterfly-flap', (.25 + (Math.sin(time * 21) + 1) * .375).toFixed(3));
      butterfly.style.setProperty('--butterfly-flutter', `${(Math.cos(time * 21) * 4).toFixed(2)}deg`);
    };
    const animate = (time: number) => {
      frame = 0;
      elapsedRef.current += previousTime ? Math.min(50, time - previousTime) : 16;
      previousTime = time;
      paint();
      frame = requestAnimationFrame(animate);
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      const running = !paused && motionAllowed && !document.hidden;
      root.dataset.running = String(running);
      if (running) frame = requestAnimationFrame(animate);
    };
    paint(); sync();
    window.addEventListener('resize', paint, { passive: true });
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame);
      root.dataset.running = 'false';
      window.removeEventListener('resize', paint);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused, motionAllowed]);

  return (
    <div ref={rootRef} className="garden-companions" data-running="false">
      <DraggableGecko paused={paused} motionAllowed={motionAllowed} suspended={suspended}><GardenGeckoArt /></DraggableGecko>
      <div ref={butterflyRef} className="garden-butterfly" aria-hidden="true"><ButterflyDrawing /></div>
    </div>
  );
};
