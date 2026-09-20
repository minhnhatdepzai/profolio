import { useEffect, useRef, useState } from 'react';
import { Mascot } from 'page-mascot';
import { Clock, Moon, MousePointer2, Sun, Pause, Play, Plus, Minus, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { timePalettes, BAND_HOURS, type TimePalette } from '../data/timePalettes';
import type { EarthScene } from '../components/createEarthScene';
import { moonPhaseName, moonState, subsolarPoint, viewerLongitude } from '../components/solarPosition';
import './lab.css';

const mascotBase = `${import.meta.env.BASE_URL}mascots/`;

/** Degrees with a hemisphere letter, the way a chart would print them. */
const formatLatLon = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(1)}\u00b0${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}\u00b0${lon >= 0 ? 'E' : 'W'}`;

/**
 * A small interaction playground.
 *
 * Every piece here is live rather than illustrated: the planet is a real WebGL
 * scene, the mascots really track the cursor, and the swatch row shows the
 * palette the whole page is wearing right now. It follows the same rules as the
 * garden — animation pauses off screen, in hidden tabs and under reduced motion.
 * A still WebGL view remains interactive when automatic motion is disabled.
 */
export const Lab = ({ palette, motionAllowed = true, suspended = false }: {
  palette: TimePalette;
  motionAllowed?: boolean;
  suspended?: boolean;
}) => {
  const { lang, getStr } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const earthRef = useRef<EarthScene | null>(null);
  const controlsRef = useRef<{ refresh: () => void; zoom: (value: number) => void; reset: () => void; render: () => void } | null>(null);
  const [visible, setVisible] = useState(false);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const playbackRef = useRef({ autoRotate, motionAllowed, suspended });
  const [sky, setSky] = useState(() => ({ sun: subsolarPoint(new Date()), moon: moonState(new Date()) }));

  useEffect(() => {
    playbackRef.current = { autoRotate, motionAllowed, suspended };
    controlsRef.current?.refresh();
  }, [autoRotate, motionAllowed, suspended]);

  // The terminator moves about a quarter of a degree a minute; a minute tick is
  // finer than the globe can show and keeps the read-out honest.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      setSky({ sun: subsolarPoint(now), moon: moonState(now) });
      earthRef.current?.setTime(now);
      controlsRef.current?.render();
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

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
    if (!canvas || !visible) return;

    let cancelled = false;
    let frame = 0;
    let cleanup = () => {};

    const start = async () => {
      setFailed(false);
      const [THREE, { createEarthScene, openingLongitude }, { OrbitControls }] = await Promise.all([
        import('three'),
        import('../components/createEarthScene'),
        import('three/addons/controls/OrbitControls.js'),
      ]);
      if (cancelled) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        setFailed(true);
        return; // No WebGL: the static stage below stays as the experience.
      }

      cleanup = () => renderer.dispose();
      const earth = await createEarthScene(THREE, openingLongitude(new Date(), viewerLongitude()));
      if (cancelled) { earth.dispose(); return; }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
      camera.position.set(0, 0.16, 5.2);

      earthRef.current = earth;
      scene.add(earth.group);
      const controls = new OrbitControls(camera, canvas);
      controls.enablePan = false;
      controls.enableDamping = false;
      controls.rotateSpeed = 0.6;
      controls.zoomSpeed = 0.6;
      let baseDistance = camera.position.length();
      let currentZoom = 1;
      const render = () => {
        if (!document.hidden) renderer.render(scene, camera);
      };
      const onChange = () => {
        currentZoom = baseDistance / camera.position.length();
        setZoom(Math.round(currentZoom * 100) / 100);
        render();
      };
      controls.addEventListener('change', onChange);
      const setZoomTo = (value: number) => {
        currentZoom = Math.min(1.8, Math.max(0.75, value));
        camera.position.setLength(baseDistance / currentZoom);
        controls.update();
        onChange();
      };
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        baseDistance = Math.max(5.2, 4.6 / Math.min(camera.aspect, 1));
        controls.minDistance = baseDistance / 1.8;
        controls.maxDistance = baseDistance / 0.75;
        setZoomTo(currentZoom);
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      let last = performance.now();
      const playing = () => {
        const state = playbackRef.current;
        return state.autoRotate && state.motionAllowed && !state.suspended && !document.hidden;
      };
      const tick = (now: number) => {
        frame = 0;
        if (!playing()) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        earth.update(dt);
        render();
        frame = requestAnimationFrame(tick);
      };
      const refresh = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        render();
        if (playing()) {
          last = performance.now();
          frame = requestAnimationFrame(tick);
        }
      };
      controlsRef.current = {
        refresh, render, zoom: setZoomTo,
        reset: () => {
          camera.position.set(0, 0.16, 5.2).setLength(baseDistance);
          setZoomTo(1);
        },
      };
      document.addEventListener('visibilitychange', refresh);
      setLive(true);
      refresh();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        document.removeEventListener('visibilitychange', refresh);
        controls.removeEventListener('change', onChange);
        controls.dispose();
        earth.dispose();
        renderer.dispose();
        earthRef.current = null;
        controlsRef.current = null;
        setLive(false);
      };
    };

    start().catch(() => {
      cleanup();
      if (!cancelled) { setLive(false); setFailed(true); }
    });
    return () => { cancelled = true; cleanup(); };
  }, [visible]);

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
          <div className="lab-stage__view" data-live={live} data-rotating={live && autoRotate && motionAllowed && !suspended}>
            <div className="lab-stage__badge"><span />{lang === 'vi' ? 'TRÁI ĐẤT · GÓC NHÌN TỪ QUỸ ĐẠO' : 'EARTH · AN ORBITAL PERSPECTIVE'}</div>
            <canvas ref={canvasRef} className="lab-canvas" aria-label={lang === 'vi' ? 'Trái Đất 3D, kéo để đổi góc nhìn' : '3D Earth, drag to orbit'} />
            <div className={`lab-stage__fallback${live ? ' is-hidden' : ''}`} aria-hidden="true">
              <span className="lab-orb" />
            </div>
          </div>
          <div className="lab-controls" role="group" aria-label={lang === 'vi' ? 'Điều khiển Trái Đất' : 'Earth controls'}>
            <button type="button" className="lab-controls__rotate" aria-pressed={autoRotate && motionAllowed} disabled={!live || !motionAllowed} onClick={() => setAutoRotate((value) => !value)}>
              {autoRotate && motionAllowed ? <Pause size={15} /> : <Play size={15} />}
              {lang === 'vi' ? 'Tự động xoay' : 'Auto rotate'}
            </button>
            <div className="lab-controls__zoom">
              <button type="button" aria-label={lang === 'vi' ? 'Thu nhỏ' : 'Zoom out'} disabled={!live || zoom <= 0.75} onClick={() => controlsRef.current?.zoom(zoom - 0.15)}><Minus size={17} /></button>
              <output aria-live="polite" aria-label={lang === 'vi' ? 'Độ phóng đại' : 'Zoom level'}>{Math.round(zoom * 100)}%</output>
              <button type="button" aria-label={lang === 'vi' ? 'Phóng to' : 'Zoom in'} disabled={!live || zoom >= 1.8} onClick={() => controlsRef.current?.zoom(zoom + 0.15)}><Plus size={17} /></button>
            </div>
            <button type="button" disabled={!live} onClick={() => controlsRef.current?.reset()} aria-label={lang === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'} title={lang === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'}><RotateCcw size={16} /></button>
          </div>
          <p className="lab-stage__hint" role="status">{!live
            ? (failed ? (lang === 'vi' ? 'Chưa tải được mô hình 3D. Hãy tải lại trang để thử lại.' : '3D view unavailable. Reload the page to try again.') : (lang === 'vi' ? 'Đang tải Trái Đất…' : 'Loading Earth…'))
            : !motionAllowed ? (lang === 'vi' ? 'Chế độ giảm chuyển động · vẫn có thể kéo và phóng to.' : 'Reduced motion · dragging and zoom are available.')
              : (lang === 'vi' ? 'Kéo để khám phá · cuộn hoặc chụm hai ngón để phóng to' : 'Drag to explore · scroll or pinch to zoom')}</p>
          <div className="lab-stage__meta">
            <span>
              <Sun size={13} aria-hidden="true" />
              {lang === 'vi' ? 'Mặt trời thẳng đứng tại' : 'Sun overhead at'}{' '}
              {formatLatLon(sky.sun.lat, sky.sun.lon)}
            </span>
            <span>
              <Moon size={13} aria-hidden="true" />
              {getStr(moonPhaseName(sky.moon.phase))} · {Math.round(sky.moon.illumination * 100)}%
            </span>
          </div>
          <p className="lab-stage__note">
            {lang === 'vi'
              ? 'Đại dương sâu, địa hình, tầng mây và ánh đèn thành phố. Ranh giới ngày đêm theo vị trí Mặt Trời hiện tại; ảnh mây là ảnh tổng hợp, không phải thời tiết trực tiếp. Khoảng cách Mặt Trăng được thu gọn để cùng xuất hiện trong khung hình.'
              : 'Deep oceans, terrain, cloud cover and city lights. Day and night follow the current Sun position; clouds are a composite, not live weather. The Moon’s distance is compressed to keep it in view.'}
          </p>
          <a className="lab-stage__credit" href={`${import.meta.env.BASE_URL}earth/ATTRIBUTION.txt`} target="_blank" rel="noreferrer">{lang === 'vi' ? 'Nguồn ảnh: Solar System Scope / three.js' : 'Imagery: Solar System Scope / three.js'} ↗</a>
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
