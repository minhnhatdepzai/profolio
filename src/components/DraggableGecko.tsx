import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { clamp, createGeckoPose, geckoBounds, releaseGecko, stepGecko, type GeckoPhase } from './geckoMotion';

type Props = { children: ReactNode; paused: boolean; motionAllowed: boolean; suspended: boolean };

export const DraggableGecko = ({ children, paused, motionAllowed, suspended }: Props) => {
  const { lang } = useLanguage();
  const hintId = useId();
  const geckoRef = useRef<HTMLButtonElement>(null);
  const poseRef = useRef(createGeckoPose());
  const playbackRef = useRef({ paused, motionAllowed, suspended });
  const syncRef = useRef<() => void>(() => {});
  const [phase, setPhase] = useState<GeckoPhase>('roaming');
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    playbackRef.current = { paused, motionAllowed, suspended };
    syncRef.current();
  }, [paused, motionAllowed, suspended]);

  useEffect(() => {
    const gecko = geckoRef.current;
    if (!gecko) return;
    const pose = poseRef.current;
    let width = innerWidth;
    let height = innerHeight;
    let frame = 0;
    let previousTime = 0;
    let routeTime = 0;
    let pointerId: number | null = null;
    let offset = { x: 0, y: 0 };
    let lastMove = { x: 0, time: 0 };
    let pointer = { x: -1000, y: -1000 };
    const allowed = () => playbackRef.current.motionAllowed && !playbackRef.current.suspended && !document.hidden;
    const active = () => allowed() && (pose.phase !== 'roaming' || !playbackRef.current.paused);
    const publish = () => {
      gecko.dataset.phase = pose.phase;
      setPhase(pose.phase);
    };
    const route = (delta: number) => {
      const { inset, floor } = geckoBounds(width, height);
      const top = Math.min(width < 700 ? 130 : 150, floor - 30);
      const mid = top + (floor - top) * .52;
      const edge = width - inset;
      const points = [
        [edge, floor - 65, 0], [edge - 3, top, .18], [width * .54, top + 26, .32],
        [inset, mid, .46], [inset + 8, floor - 95, .55], [width * .49, mid + 35, .68],
        [edge - 8, mid - 20, .8], [width * .53, floor, .91], [edge, floor - 65, 1],
      ];
      const cycle = (routeTime / 26000) % 1;
      const index = points.findIndex((point, i) => i < points.length - 1 && cycle >= point[2] && cycle < points[i + 1][2]);
      const from = points[Math.max(0, index)];
      const to = points[Math.max(0, index) + 1];
      const progress = clamp((cycle - from[2]) / (to[2] - from[2]), 0, 1);
      const ease = progress * progress * (3 - 2 * progress);
      pose.x = from[0] + (to[0] - from[0]) * ease;
      pose.y = from[1] + (to[1] - from[1]) * ease;
      const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
      const difference = Math.atan2(Math.sin(angle - pose.angle), Math.cos(angle - pose.angle));
      pose.angle += difference * Math.min(1, delta / 130);
      pose.opacity = 1; pose.scaleX = 1; pose.scaleY = 1;
    };
    const paint = () => {
      const scared = ['held', 'falling', 'fleeing'].includes(pose.phase);
      const time = pose.phase === 'roaming' ? routeTime / 1000 : pose.elapsed;
      const step = Math.sin(time * (scared ? 44 : 9.5)) * (scared ? 1.55 : 1);
      const distance = Math.hypot(pointer.x - pose.x, pointer.y - pose.y);
      const curiosity = pose.phase === 'roaming' && width >= 700 ? Math.max(0, 1 - distance / 155) : 0;
      gecko.style.transform = `translate3d(${pose.x.toFixed(2)}px,${pose.y.toFixed(2)}px,0) translate(-50%,-50%) rotate(${pose.angle.toFixed(4)}rad) scale(${pose.scaleX.toFixed(3)},${pose.scaleY.toFixed(3)})`;
      gecko.style.opacity = String(pose.opacity);
      gecko.style.setProperty('--gecko-step', step.toFixed(3));
      gecko.style.setProperty('--gecko-curiosity', curiosity.toFixed(3));
      gecko.style.setProperty('--gecko-look', `${((pointer.y - pose.y) / Math.max(100, distance) * curiosity * 2).toFixed(2)}px`);
      gecko.style.setProperty('--gecko-tail-angle', `${(Math.sin(time * (scared ? 29 : 1.85)) * (scared ? 20 : 5)).toFixed(2)}deg`);
      const blink = (routeTime % 6700) / 6700;
      gecko.style.setProperty('--gecko-blink', scared ? '1.2' : String(blink > .44 && blink < .475 ? Math.max(.06, Math.abs(blink - .4575) / .0175) : 1));
    };
    const animate = (time: number) => {
      frame = 0;
      if (!active()) { previousTime = 0; return; }
      const delta = previousTime ? Math.min(40, time - previousTime) : 16;
      previousTime = time;
      const previousPhase = pose.phase;
      if (pose.phase === 'roaming') { routeTime += delta; route(delta); }
      else {
        stepGecko(pose, delta, width, height);
        if (pose.phase === 'roaming') routeTime = 0;
      }
      if (pose.phase !== previousPhase) publish();
      paint();
      if (active()) frame = requestAnimationFrame(animate);
    };
    const release = () => {
      if (pose.phase !== 'held') return;
      const captured = pointerId;
      pointerId = null;
      if (captured !== null && gecko.hasPointerCapture(captured)) gecko.releasePointerCapture(captured);
      releaseGecko(pose); publish();
    };
    const sync = () => {
      cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      if (!allowed() && pose.phase === 'held') release();
      if (active()) frame = requestAnimationFrame(animate);
    };
    const pickUp = () => {
      if (!allowed() || pose.phase === 'hidden' || pose.phase === 'returning') return false;
      pose.phase = 'held'; pose.elapsed = 0; pose.vx = 0; pose.opacity = 1;
      setDiscovered(true); publish(); sync(); return true;
    };
    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0 || !pickUp()) return;
      event.preventDefault();
      gecko.focus({ preventScroll: true });
      pointerId = event.pointerId;
      offset = { x: pose.x - event.clientX, y: pose.y - event.clientY };
      lastMove = { x: event.clientX, time: event.timeStamp };
      gecko.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (event.pointerId !== pointerId || pose.phase !== 'held') return;
      const { inset, floor } = geckoBounds(width, height);
      pose.x = clamp(event.clientX + offset.x, inset, width - inset);
      pose.y = clamp(event.clientY + offset.y, 60, floor);
      pose.vx = clamp((event.clientX - lastMove.x) / Math.max(.016, (event.timeStamp - lastMove.time) / 1000), -260, 260);
      lastMove = { x: event.clientX, time: event.timeStamp };
      paint();
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      if (event.timeStamp - lastMove.time > 100) pose.vx = 0;
      release(); sync();
    };
    const onCancel = () => { release(); sync(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); if (event.repeat) return;
        if (pose.phase === 'held') { release(); sync(); } else pickUp();
      } else if (event.key === 'Escape' && pose.phase === 'held') {
        event.preventDefault(); release(); sync();
      } else if (event.key.startsWith('Arrow') && pose.phase === 'held') {
        event.preventDefault();
        const { inset, floor } = geckoBounds(width, height);
        const step = event.shiftKey ? 64 : 28;
        pose.x = clamp(pose.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0), inset, width - inset);
        pose.y = clamp(pose.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0), 60, floor);
        paint();
      }
    };
    const onResize = () => {
      width = innerWidth; height = innerHeight;
      const { inset, floor } = geckoBounds(width, height);
      if (pose.phase === 'roaming') route(0);
      else { pose.x = clamp(pose.x, inset, width - inset); pose.y = Math.min(pose.y, floor); }
      paint();
    };
    route(0); paint(); syncRef.current = sync; sync();
    gecko.addEventListener('pointerdown', onDown);
    gecko.addEventListener('pointerup', onUp);
    gecko.addEventListener('pointercancel', onCancel);
    gecko.addEventListener('lostpointercapture', onCancel);
    gecko.addEventListener('keydown', onKey);
    gecko.addEventListener('blur', onCancel);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('blur', onCancel);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(frame); syncRef.current = () => {};
      gecko.removeEventListener('pointerdown', onDown);
      gecko.removeEventListener('pointerup', onUp);
      gecko.removeEventListener('pointercancel', onCancel);
      gecko.removeEventListener('lostpointercapture', onCancel);
      gecko.removeEventListener('keydown', onKey);
      gecko.removeEventListener('blur', onCancel);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('blur', onCancel);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const vi = lang === 'vi';
  const cues: Record<GeckoPhase, string> = vi
    ? { roaming: 'Kéo thử mình ↗', held: 'Á! Thả mình ra!', falling: 'Áaaa!', landing: 'Ối!', fleeing: 'Trốn thôi!', hidden: 'Đang tàng hình…', returning: 'Suỵt… mình đây!' }
    : { roaming: 'Drag me ↗', held: 'Eek! Put me down!', falling: 'Aaaah!', landing: 'Oof!', fleeing: 'Gotta hide!', hidden: 'Camouflaged…', returning: 'Psst… I’m back!' };
  const unavailable = !motionAllowed || suspended || phase === 'hidden' || phase === 'returning';
  return (
    <>
      <button ref={geckoRef} type="button" className="garden-gecko" data-phase={phase} data-discovered={discovered}
        aria-label={vi ? 'Tắc kè Moss: kéo rồi thả để chơi' : 'Moss the gecko: drag and drop to play'}
        aria-describedby={hintId} aria-disabled={unavailable} aria-pressed={phase === 'held'} tabIndex={unavailable ? -1 : 0}>
        {children}
        <span className="garden-gecko__panic" aria-hidden="true">!</span>
        <span className="garden-gecko__dust" aria-hidden="true" />
        <span className="garden-gecko__cue" aria-hidden="true">{cues[phase]}</span>
      </button>
      <span id={hintId} className="sr-only">{vi ? 'Enter hoặc Space để nhấc lên; phím mũi tên để di chuyển; Enter hoặc Escape để thả. Tắc kè sẽ rơi, chạy trốn rồi tàng hình một lát.' : 'Enter or Space to pick up; arrow keys to move; Enter or Escape to drop. The gecko lands, scurries away and briefly camouflages.'}</span>
      <span className="sr-only" role="status" aria-live="polite">{discovered ? cues[phase] : ''}</span>
    </>
  );
};
