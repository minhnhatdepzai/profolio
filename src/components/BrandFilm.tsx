import { useEffect, useId, useState, type CSSProperties } from 'react';

const sceneUrl = `${import.meta.env.BASE_URL}brand/ronin/sakura-valley.webp`;
const actorUrl = `${import.meta.env.BASE_URL}brand/ronin/ronin-poses.webp`;

/** Layered film plates, animated character poses, sword trails and independent petals. */
export function BrandFilm({ onReady }: { onReady: () => void }) {
  const [assets, setAssets] = useState({ scene: false, actor: false });
  const id = useId().replace(/:/g, '');
  useEffect(() => {
    let cancelled = false, finished = false;
    const images: HTMLImageElement[] = [];
    const finish = (scene: boolean, actor: boolean) => {
      if (cancelled || finished) return;
      finished = true;
      window.clearTimeout(timeout);
      setAssets({ scene, actor });
      onReady();
    };
    // Slow or unavailable assets must never trap the visitor in a loading intro.
    const timeout = window.setTimeout(() => finish(false, false), 5000);
    const load = (src: string) => new Promise<boolean>(resolve => {
      const image = new Image();
      images.push(image);
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
      image.src = src;
    });
    Promise.all([load(sceneUrl), load(actorUrl)]).then(([scene, actor]) => finish(scene, actor));
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      images.forEach(image => { image.onload = null; image.onerror = null; });
    };
  }, [onReady]);

  return <div className="ronin-film" data-scene={assets.scene} data-actor={assets.actor} aria-hidden="true">
    <div className="ronin-landscape" style={{ backgroundImage: `url(${sceneUrl})` }} />
    <div className="ronin-grade" />
    <div className="ronin-mist ronin-mist--far" />
    <div className="ronin-petals ronin-petals--back">
      {Array.from({ length: 24 }, (_, i) => <i key={i} style={{
        '--x': `${(i * 41 + 3) % 106 - 3}vw`,
        '--y': `${(i * 17) % 100 - 20}vh`,
        '--size': `${4 + (i * 3) % 7}px`,
        '--drift': `${35 + (i * 19) % 90}px`,
        '--fall': `${6 + (i % 5)}s`,
        '--delay': `-${(i * .43) % 7}s`,
        '--turn': `${i * 37}deg`,
      } as CSSProperties} />)}
    </div>
    <div className="ronin-character">
      <div className="ronin-character__shadow" />
      <div className="ronin-character__sprite" style={{ backgroundImage: `url(${actorUrl})` }} />
    </div>
    <div className="ronin-mist ronin-mist--near" />
    <svg className="ronin-slash" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`blade-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dcefff" stopOpacity="0" /><stop offset=".45" stopColor="#fff8e9" /><stop offset="1" stopColor="#f3b8b3" stopOpacity=".1" />
        </linearGradient>
        <filter id={`bloom-${id}`} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path className="ronin-slash__glow" d="M640 70 Q270 200 470 630" stroke={`url(#blade-${id})`} filter={`url(#bloom-${id})`} pathLength="1" />
      <path className="ronin-slash__edge" d="M640 70 Q270 200 470 630" stroke={`url(#blade-${id})`} pathLength="1" />
      <path className="ronin-slash__echo" d="M645 80 Q340 210 480 590" stroke={`url(#blade-${id})`} pathLength="1" />
    </svg>
    <div className="ronin-cut" />
    <div className="ronin-impact" />
    <div className="ronin-mark">
      <svg className="ronin-letter ronin-letter--l" viewBox="0 0 160 160">
        <defs><linearGradient id={`silver-${id}`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fffdf2" /><stop offset=".38" stopColor="#bdc8cd" /><stop offset=".5" stopColor="#fff" /><stop offset=".75" stopColor="#859499" /><stop offset="1" stopColor="#e5e3db" /></linearGradient></defs>
        <path d="M44 44V114H78" fill="none" stroke={`url(#silver-${id})`} strokeWidth="12" strokeLinejoin="miter" />
      </svg>
      <svg className="ronin-letter ronin-letter--n" viewBox="0 0 160 160">
        <defs><linearGradient id={`rose-${id}`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#fff2df" /><stop offset=".4" stopColor="#e5b9b0" /><stop offset=".52" stopColor="#fff4dd" /><stop offset="1" stopColor="#a47672" /></linearGradient></defs>
        <path d="M78 114V44L115 114V44" fill="none" stroke={`url(#rose-${id})`} strokeWidth="11" strokeLinejoin="bevel" />
      </svg>
      <div className="ronin-mark__seal" />
      <div className="ronin-mark__light" />
    </div>
    <div className="ronin-petals ronin-petals--front">
      {Array.from({ length: 12 }, (_, i) => <i key={i} style={{
        '--x': `${(i * 37 + 11) % 110 - 5}vw`,
        '--y': `${(i * 23) % 100 - 20}vh`,
        '--size': `${12 + (i * 5) % 15}px`,
        '--drift': `${90 + (i * 23) % 150}px`,
        '--fall': `${4 + (i % 4)}s`,
        '--delay': `-${(i * .73) % 6}s`,
        '--turn': `${i * 61}deg`,
      } as CSSProperties} />)}
    </div>
    <div className="ronin-vignette" />
    <div className="ronin-letterbox ronin-letterbox--top" />
    <div className="ronin-letterbox ronin-letterbox--bottom" />
  </div>;
}
