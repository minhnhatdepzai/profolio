import type { EdgeAuraPaletteName } from 'edge-aura';
import type { LangStr } from './cv';

/**
 * Ambient palettes that follow the reader's local clock.
 *
 * Six looks spread across the day. `BAND_HOURS` is the only knob: at 4 the six
 * bands tile a full 24 hours, so the colour on screen agrees with the actual
 * time of day. Setting it to 2 gives a literal two-hourly rotation, at the cost
 * of the cycle repeating twice — a midnight palette would then appear at noon.
 */
export const BAND_HOURS = 4;

export interface TimePalette {
  /** Stable key, also written to `data-timeband` for CSS hooks. */
  key: string;
  label: LangStr;
  /** Hour the band opens, in the reader's own timezone. */
  from: number;
  /** Three stops for the ambient background wash. */
  wash: [string, string, string];
  /** Accent used for hairlines and small highlights in the lab section. */
  accent: string;
  /** Ring palette handed to edge-aura. */
  aura: EdgeAuraPaletteName;
}

export const timePalettes: TimePalette[] = [
  {
    key: 'deep-night',
    label: { en: 'Deep night', vi: 'Đêm sâu' },
    from: 0,
    wash: ['#06131f', '#0a2b3d', '#123f4b'],
    accent: '#5fd0d8',
    aura: 'ocean',
  },
  {
    key: 'first-light',
    label: { en: 'First light', vi: 'Rạng sáng' },
    from: 4,
    wash: ['#1d1020', '#4a1f38', '#8a4358'],
    accent: '#f0a7b4',
    aura: 'sakura',
  },
  {
    key: 'morning',
    label: { en: 'Morning', vi: 'Buổi sáng' },
    from: 8,
    wash: ['#071a18', '#0f3b33', '#1c6b57'],
    accent: '#63e2ac',
    aura: 'aurora',
  },
  {
    key: 'midday',
    label: { en: 'Midday', vi: 'Giữa trưa' },
    from: 12,
    wash: ['#101207', '#2b3510', '#59701d'],
    accent: '#c9ff4a',
    aura: 'opal',
  },
  {
    key: 'golden-hour',
    label: { en: 'Golden hour', vi: 'Giờ vàng' },
    from: 16,
    wash: ['#200d08', '#5a2410', '#a8541b'],
    accent: '#ffb057',
    aura: 'sunset',
  },
  {
    key: 'nightfall',
    label: { en: 'Nightfall', vi: 'Chạng vạng' },
    from: 20,
    wash: ['#14091f', '#31144d', '#552a86'],
    accent: '#b78cf5',
    aura: 'ultraviolet',
  },
];

/** Which band a given moment falls into. Exported so tests can pin the clock. */
export const paletteForDate = (date: Date): TimePalette => {
  const index = Math.floor(date.getHours() / BAND_HOURS) % timePalettes.length;
  return timePalettes[index];
};

/** Milliseconds until the next band opens, so the timer never drifts. */
export const msUntilNextBand = (date: Date): number => {
  const next = new Date(date);
  next.setMinutes(0, 0, 0);
  next.setHours((Math.floor(date.getHours() / BAND_HOURS) + 1) * BAND_HOURS);
  return Math.max(1000, next.getTime() - date.getTime());
};
