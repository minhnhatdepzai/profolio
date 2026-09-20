import { useEffect, useState } from 'react';
import { msUntilNextBand, paletteForDate, type TimePalette } from '../data/timePalettes';

/**
 * Tracks the reader's local clock and publishes the active palette as CSS
 * custom properties on `:root`.
 *
 * The timer re-arms against the next band boundary rather than ticking on a
 * fixed interval, so a tab left open overnight still turns over on the hour.
 * A visibility change re-checks immediately, because background tabs are
 * throttled and a long sleep can overshoot the boundary entirely.
 */
export const useTimePalette = (): TimePalette => {
  const [palette, setPalette] = useState(() => paletteForDate(new Date()));

  useEffect(() => {
    let timer = 0;

    const sync = () => {
      const now = new Date();
      setPalette(paletteForDate(now));
      window.clearTimeout(timer);
      timer = window.setTimeout(sync, msUntilNextBand(now));
    };

    sync();
    const onVisible = () => { if (!document.hidden) sync(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.timeband = palette.key;
    root.style.setProperty('--aura-a', palette.wash[0]);
    root.style.setProperty('--aura-b', palette.wash[1]);
    root.style.setProperty('--aura-c', palette.wash[2]);
    root.style.setProperty('--aura-accent', palette.accent);
  }, [palette]);

  return palette;
};
