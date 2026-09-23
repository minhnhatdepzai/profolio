import { useEffect, useRef, useState } from 'react';
import { Mascot } from 'page-mascot';
import { Clock, Moon, MousePointer2, Sun, Pause, Play, Plus, Minus, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { timePalettes, BAND_HOURS, type TimePalette } from '../data/timePalettes';
import type { Observatory } from '../components/createObservatory';
import { moonPhaseName, moonState, subsolarPoint } from '../components/solarPosition';
import './lab.css';
import './observatory.css';

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
  const labelsRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<Observatory | null>(null);
  const [tour, setTour] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activated, setActivated] = useState(false);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const playbackRef = useRef({ autoRotate, motionAllowed, suspended });
  const [sky, setSky] = useState(() => ({ sun: subsolarPoint(new Date()), moon: moonState(new Date()) }));

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggleFullscreen = async () => {
    setFullscreenError(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stageRef.current?.requestFullscreen();
    } catch { setFullscreenError(true); }
  };

  useEffect(() => {
    playbackRef.current = { autoRotate, motionAllowed, suspended: suspended || !visible };
    controlsRef.current?.refresh();
  }, [autoRotate, motionAllowed, suspended, visible]);

  // The terminator moves about a quarter of a degree a minute; a minute tick is
  // finer than the globe can show and keeps the read-out honest.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = new Date();
      setSky({ sun: subsolarPoint(now), moon: moonState(now) });
      controlsRef.current?.setTime(now);
      controlsRef.current?.render();
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  // Only build the scene once the reader has actually scrolled to it.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => { setVisible(entry.isIntersecting); if (entry.isIntersecting) setActivated(true); },
      { rootMargin: '120px' },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, labels = labelsRef.current;
    if (!canvas || !labels || !activated) return;
    let cancelled = false;
    let observatory: Observatory | undefined;
    setFailed(false);
    import('../components/createObservatory')
      .then(({ createObservatory }) => {
        if (cancelled) return;
        return createObservatory(canvas, labels, () => playbackRef.current, setZoom, setTour);
      })
      .then((view) => {
        if (!view) return;
        if (cancelled) { view.dispose(); return; }
        observatory = view; controlsRef.current = view; setLive(true);
      })
      .catch(() => { if (!cancelled) { setLive(false); setFailed(true); } });
    return () => {
      cancelled = true; observatory?.dispose(); controlsRef.current = null;
      setLive(false); setTour(false);
    };
  }, [activated]);

  const bandLabel = `${String(palette.from).padStart(2, '0')}:00 – ${String((palette.from + BAND_HOURS) % 24).padStart(2, '0')}:00`;

  return (
    <section id="lab" className="lab-section section-pad" data-observing={visible}>
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
          <div className="lab-stage__view" data-tour={tour} data-live={live} data-rotating={live && autoRotate && motionAllowed && !suspended}>
            <div className="lab-stage__badge"><span />{zoom < .24 ? (lang === 'vi' ? 'HỆ MẶT TRỜI · TOÀN CẢNH' : 'SOLAR SYSTEM · DEEP VIEW') : (lang === 'vi' ? 'TRÁI ĐẤT · GÓC NHÌN TỪ QUỸ ĐẠO' : 'EARTH · AN ORBITAL PERSPECTIVE')}</div>
            <div className="lab-stage__title" aria-hidden="true"><span>THE OBSERVATORY</span><strong>{zoom < .24 ? (lang === 'vi' ? 'Vượt khỏi chân trời.' : 'Beyond the horizon.') : (lang === 'vi' ? 'Một hành tinh. Vô vàn điều kỳ diệu.' : 'One planet. Infinite wonder.')}</strong></div>
            <div ref={labelsRef} className="planet-labels" aria-hidden="true" />
            <span className="lab-stage__edition" aria-hidden="true">01 — 08 / SOLAR ATLAS</span>
            {document.fullscreenEnabled && <button type="button" className="lab-fullscreen" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? (lang === 'vi' ? 'Thoát toàn màn hình' : 'Exit fullscreen') : (lang === 'vi' ? 'Xem toàn màn hình' : 'View fullscreen')}>
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>}
            <canvas ref={canvasRef} className="lab-canvas" aria-label={lang === 'vi' ? 'Hệ Mặt Trời 3D, kéo để xoay, cuộn để phóng to' : '3D Solar System, drag to orbit, scroll to zoom'} />
            <div className={`lab-stage__fallback${live ? ' is-hidden' : ''}`} aria-hidden="true">
              <span className="lab-orb" />
            </div>
          </div>
          <div className="lab-view-tabs" role="group" aria-label={lang === 'vi' ? 'Góc nhìn' : 'View presets'}>
            <button type="button" disabled={!live} aria-pressed={!tour && zoom > .24} onClick={() => controlsRef.current?.reset()}>{lang === 'vi' ? '01 / Trái Đất' : '01 / Earth'}</button>
            <button type="button" disabled={!live} aria-pressed={!tour && zoom <= .24} onClick={() => controlsRef.current?.wide()}>{lang === 'vi' ? '02 / Hệ Mặt Trời' : '02 / Solar System'}</button>
            <button type="button" disabled={!live || !motionAllowed} aria-pressed={tour} onClick={() => controlsRef.current?.tour()}><Play size={12} />{tour ? (lang === 'vi' ? 'Dừng phim' : 'Stop film') : (lang === 'vi' ? 'Chuyến bay cinematic' : 'Cinematic flight')}</button>
          </div>
          <div className="lab-controls" role="group" aria-label={lang === 'vi' ? 'Điều khiển Trái Đất' : 'Earth controls'}>
            <button type="button" className="lab-controls__rotate" aria-pressed={autoRotate && motionAllowed} disabled={!live || !motionAllowed} onClick={() => setAutoRotate((value) => !value)}>
              {autoRotate && motionAllowed ? <Pause size={15} /> : <Play size={15} />}
              {lang === 'vi' ? 'Tự động xoay' : 'Auto rotate'}
            </button>
            <div className="lab-controls__zoom">
              <button type="button" aria-label={lang === 'vi' ? 'Thu nhỏ' : 'Zoom out'} disabled={!live || zoom <= 0.055} onClick={() => controlsRef.current?.zoom(zoom / 1.5)}><Minus size={17} /></button>
              <output aria-live="polite" aria-label={lang === 'vi' ? 'Độ phóng đại' : 'Zoom level'}>{Math.round(zoom * 100)}%</output>
              <button type="button" aria-label={lang === 'vi' ? 'Phóng to' : 'Zoom in'} disabled={!live || zoom >= 1.65} onClick={() => controlsRef.current?.zoom(zoom * 1.5)}><Plus size={17} /></button>
            </div>
            <button type="button" disabled={!live} onClick={() => controlsRef.current?.reset()} aria-label={lang === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'} title={lang === 'vi' ? 'Đặt lại góc nhìn' : 'Reset view'}><RotateCcw size={16} /></button>
          </div>
          <p className="lab-stage__hint" role="status">{fullscreenError ? (lang === 'vi' ? 'Trình duyệt chưa cho phép toàn màn hình.' : 'Fullscreen is unavailable in this browser.') : !live
            ? (failed ? (lang === 'vi' ? 'Chưa tải được mô hình 3D. Hãy tải lại trang để thử lại.' : '3D view unavailable. Reload the page to try again.') : (lang === 'vi' ? 'Đang tải Trái Đất…' : 'Loading Earth…'))
            : !motionAllowed ? (lang === 'vi' ? 'Chế độ giảm chuyển động · vẫn có thể kéo và phóng to.' : 'Reduced motion · dragging and zoom are available.')
              : (lang === 'vi' ? 'Kéo để khám phá · thu nhỏ để bay ra toàn bộ Hệ Mặt Trời' : 'Drag to explore · zoom out to reveal the entire Solar System')}</p>
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
              ? 'Đại dương sâu, địa hình, tầng mây và ánh đèn thành phố. Ranh giới ngày đêm theo vị trí Mặt Trời hiện tại; ảnh mây là ảnh tổng hợp, không phải thời tiết trực tiếp. Kích thước, khoảng cách và chuyển động của hệ Mặt Trời được cách điệu để dễ khám phá.'
              : 'Deep oceans, terrain, cloud cover and city lights. Day and night follow the current Sun position; clouds are a composite, not live weather. Solar System sizes, distances and orbital motion are stylized for exploration.'}
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
