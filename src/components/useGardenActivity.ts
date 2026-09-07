import { useEffect, useState } from 'react';

export type GardenMode = 'auto' | 'play' | 'pause';
export type GardenPhase = 'waiting' | 'playing' | 'paused' | 'reduced' | 'hidden';
export const GARDEN_IDLE_MS = 10_000;

/** One motion decision for the whole garden. Explicit play is a session-only opt-in. */
export const useGardenActivity = () => {
  const [mode, setMode] = useState<GardenMode>(() => {
    try {
      const stored = localStorage.getItem('portfolio_garden_mode');
      if (stored !== null) return stored === 'pause' ? 'pause' : 'auto';
      return localStorage.getItem('portfolio_garden_paused') === 'true' ? 'pause' : 'auto';
    } catch { return 'auto'; }
  });
  const [reducedMotion, setReducedMotion] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [idle, setIdle] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [autoRevision, setAutoRevision] = useState(0);
  const [motionOptIn, setMotionOptIn] = useState(false);
  const motionAllowed = !reducedMotion || motionOptIn;

  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    const overlay = () => setOverlayOpen(document.body.classList.contains('nav-is-open') || document.body.classList.contains('dialog-is-open'));
    const observer = new MutationObserver(overlay);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    overlay();
    return () => {
      query.removeEventListener('change', update);
      document.removeEventListener('visibilitychange', visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      setIdle(false);
      if (mode === 'auto' && !hidden && !overlayOpen && motionAllowed) timer = window.setTimeout(() => setIdle(true), GARDEN_IDLE_MS);
    };
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'resize'] as const;
    events.forEach(event => window.addEventListener(event, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, reset));
    };
  }, [mode, hidden, overlayOpen, motionAllowed, autoRevision]);

  const running = motionAllowed && !hidden && !overlayOpen && (mode === 'play' || (mode === 'auto' && idle));
  const phase: GardenPhase = mode === 'pause' ? 'paused' : !motionAllowed ? 'reduced'
    : hidden || overlayOpen ? 'hidden' : running ? 'playing' : 'waiting';

  useEffect(() => {
    document.documentElement.classList.toggle('garden-is-paused', !running);
    document.documentElement.classList.toggle('garden-motion-opt-in', motionOptIn);
    document.documentElement.dataset.gardenMode = mode;
    document.documentElement.dataset.gardenPhase = phase;
    try { localStorage.setItem('portfolio_garden_mode', mode === 'pause' ? 'pause' : 'auto'); }
    catch { /* Controls do not depend on storage availability. */ }
    return () => {
      document.documentElement.classList.remove('garden-is-paused', 'garden-motion-opt-in');
      delete document.documentElement.dataset.gardenMode;
      delete document.documentElement.dataset.gardenPhase;
    };
  }, [mode, running, phase, motionOptIn]);

  return {
    mode, phase, running, motionAllowed, reducedMotion,
    toggle: () => { setMotionOptIn(true); setMode(current => current === 'play' || running ? 'pause' : 'play'); },
    enableAuto: () => { setMotionOptIn(true); setMode('auto'); setIdle(false); setAutoRevision(value => value + 1); },
  };
};
