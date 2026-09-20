import { useEffect, useRef, useState } from 'react';
import { Mascot } from 'page-mascot';
import { Clock, MousePointer2, Orbit } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { timePalettes, BAND_HOURS, type TimePalette } from '../data/timePalettes';
import type { OrbitalCity } from '../components/createOrbitalCity';
import './lab.css';

const mascotBase = `${import.meta.env.BASE_URL}mascots/`;

/**
 * A small interaction playground.
 *
 * Every piece here is live rather than illustrated: the planet is a real WebGL
 * scene, the mascots really track the cursor, and the swatch row shows the
 * palette the whole page is wearing right now. It follows the same rules as the
 * garden — it only starts when the section is on screen, stands down in hidden
 * tabs, and never runs under `prefers-reduced-motion`.
 */
export const Lab = ({ palette, motionAllowed = true, suspended = false }: {
  palette: TimePalette;
  motionAllowed?: boolean;
  suspended?: boolean;
}) => {
  const { lang, getStr } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<OrbitalCity | null>(null);
  const [visible, setVisible] = useState(false);
  const [live, setLive] = useState(false);

  // Only build the scene once the reader has actually scrolled to it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !visible || !motionAllowed || suspended) return;
    if ((navigator.hardwareConcurrency ?? 4) <= 2) return;

    let cancelled = false;
    let frame = 0;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import('three');
      const { createOrbitalCity } = await import('../components/createOrbitalCity');
      if (cancelled) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return; // No WebGL: the static stage below stays as the experience.
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
      camera.position.set(0, 0.18, 4.6);

      const city = createOrbitalCity(THREE);
      cityRef.current = city;
      city.setPalette(palette.accent, palette.wash[2]);
      scene.add(city.group);

      const pointer = { x: 0, y: 0 };
      const onPointer = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      };
      window.addEventListener('pointermove', onPointer, { passive: true });

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      setLive(true);
      let last = performance.now();
      const tick = (now: number) => {
        frame = requestAnimationFrame(tick);
        // Clamp dt so a backgrounded tab does not resume with a huge jump.
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (document.hidden) return;
        city.update(dt, pointer);
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener('pointermove', onPointer);
        city.dispose();
        renderer.dispose();
        cityRef.current = null;
        setLive(false);
      };
    };

    start();
    return () => { cancelled = true; cleanup(); };
  }, [visible, motionAllowed, suspended]);

  // Palette changes cross into the running scene without rebuilding it.
  useEffect(() => {
    cityRef.current?.setPalette(palette.accent, palette.wash[2]);
  }, [palette]);

  const bandLabel = `${String(palette.from).padStart(2, '0')}:00 – ${String((palette.from + BAND_HOURS) % 24).padStart(2, '0')}:00`;

  return (
    <section id="lab" className="lab-section section-pad">
      <header className="section-heading section-heading--split" data-reveal>
        <div>
          <span className="eyebrow">04 · {lang === 'vi' ? 'PHÒNG THÍ NGHIỆM' : 'LAB'}</span>
          <h2>{lang === 'vi' ? 'Thử đi. Rồi hãy tin.' : 'Try it. Then believe it.'}</h2>
        </div>
        <p>{lang === 'vi'
          ? 'Một sân chơi nhỏ về tương tác — mọi thứ ở đây đều đang chạy thật, không phải ảnh chụp.'
          : 'A small interaction playground — everything here is running live, not a screenshot.'}</p>
      </header>

      <div className="lab-grid">
        <div className="lab-stage" ref={stageRef} data-reveal>
          <canvas ref={canvasRef} className="lab-canvas" aria-hidden="true" />
          <div className={`lab-stage__fallback${live ? ' is-hidden' : ''}`} aria-hidden="true">
            <span className="lab-orb" />
          </div>
          <div className="lab-stage__meta">
            <span><Orbit size={13} aria-hidden="true" />{lang === 'vi' ? 'Hành tinh dựng bằng code' : 'Planet built in code'}</span>
            <span>{lang === 'vi' ? 'Thành phố instanced · 1 draw call' : 'Instanced city · 1 draw call'}</span>
          </div>
          <p className="lab-stage__note">
            {lang === 'vi'
              ? 'Địa hình sinh từ fractal noise trong shader, toà nhà là một instanced mesh. Không tải model hay texture nào.'
              : 'Terrain comes out of a fractal-noise shader, the towers are a single instanced mesh. No model or texture is downloaded.'}
          </p>
        </div>

        <div className="lab-side">
          <article className="lab-card" data-reveal>
            <div className="lab-card__top">
              <MousePointer2 size={15} aria-hidden="true" />
              <span>{lang === 'vi' ? 'MASCOT DÕI THEO CHUỘT' : 'CURSOR-TRACKING MASCOTS'}</span>
            </div>
            <div className="lab-mascots">
              <Mascot
                directions={`${mascotBase}gearbot-directions.webp`}
                reactions={`${mascotBase}gearbot-reactions.webp`}
                size={112}
                label="Gearbot"
              />
              <Mascot
                directions={`${mascotBase}scout-directions.webp`}
                reactions={`${mascotBase}scout-reactions.webp`}
                size={112}
                label="Scout"
              />
            </div>
            <p>{lang === 'vi'
              ? 'Đầu quay theo góc con trỏ và đổi biểu cảm khi bị chạm. Chỉ bật khi có chuột thật.'
              : 'Their heads turn to the pointer angle and their expression changes when poked. Only active with a fine pointer.'}</p>
          </article>

          <article className="lab-card" data-reveal>
            <div className="lab-card__top">
              <Clock size={15} aria-hidden="true" />
              <span>{lang === 'vi' ? 'MÀU THEO GIỜ CỦA BẠN' : 'PALETTE FOLLOWS YOUR CLOCK'}</span>
            </div>
            <div className="lab-bands" role="list">
              {timePalettes.map((band) => (
                <div
                  key={band.key}
                  role="listitem"
                  className={`lab-band${band.key === palette.key ? ' is-active' : ''}`}
                  style={{ ['--band-a' as string]: band.wash[0], ['--band-b' as string]: band.wash[2], ['--band-c' as string]: band.accent }}
                  title={`${getStr(band.label)} · ${String(band.from).padStart(2, '0')}:00`}
                >
                  <span className="lab-band__swatch" aria-hidden="true" />
                  <span className="lab-band__name">{getStr(band.label)}</span>
                </div>
              ))}
            </div>
            <p className="lab-now">
              <strong>{getStr(palette.label)}</strong>
              <span>{bandLabel}</span>
            </p>
            <p>{lang === 'vi'
              ? `Sáu bảng màu trải đều một ngày, mỗi bảng ${BAND_HOURS} tiếng. Trang tự đổi khi sang khung giờ mới.`
              : `Six palettes across the day, ${BAND_HOURS} hours each. The page turns over on its own at each boundary.`}</p>
          </article>
        </div>
      </div>
    </section>
  );
};
