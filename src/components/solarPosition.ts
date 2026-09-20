/**
 * Where the sun and the moon actually are, right now.
 *
 * Low-precision formulae from the NOAA solar position notes and the standard
 * simplified lunar series. Both are good to a small fraction of a degree across
 * 1950–2050 — far below what a globe a few hundred pixels wide can show, and
 * enough that the day/night terminator lands on the correct meridian.
 *
 * Everything is returned in the Earth-fixed frame the globe is textured in:
 * +Y is the north pole and longitude 0 (Greenwich) points down +X.
 */

const DEG = Math.PI / 180;
const norm360 = (deg: number) => ((deg % 360) + 360) % 360;
const norm180 = (deg: number) => ((((deg + 180) % 360) + 360) % 360) - 180;

/** Days since the J2000.0 epoch (2000-01-01 12:00 UT). */
export const daysSinceJ2000 = (date: Date) => date.getTime() / 86400000 + 2440587.5 - 2451545;

/** Greenwich mean sidereal time, in hours. */
const gmstHours = (n: number) => ((18.697374558 + 24.06570982441908 * n) % 24 + 24) % 24;

/** Mean obliquity of the ecliptic, in degrees. */
const obliquity = (n: number) => 23.439 - 0.0000004 * n;

export interface SkyPoint {
  /** Latitude directly beneath the body, in degrees. */
  lat: number;
  /** Longitude directly beneath the body, in degrees, -180..180. */
  lon: number;
}

/** The point on Earth where the sun is straight overhead. */
export const subsolarPoint = (date: Date): SkyPoint => {
  const n = daysSinceJ2000(date);
  const meanLon = norm360(280.46 + 0.9856474 * n);
  const meanAnom = norm360(357.528 + 0.9856003 * n) * DEG;
  const lambda = (meanLon + 1.915 * Math.sin(meanAnom) + 0.02 * Math.sin(2 * meanAnom)) * DEG;
  const eps = obliquity(n) * DEG;

  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda)) / DEG;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda)) / DEG;

  return { lat: dec, lon: norm180(ra - gmstHours(n) * 15) };
};

export interface MoonState extends SkyPoint {
  /** Illuminated fraction of the disc, 0 (new) to 1 (full). */
  illumination: number;
  /**
   * Age through the synodic cycle, 0..1. Below 0.5 the moon is waxing, which is
   * what decides whether the lit limb is on the leading or trailing side.
   */
  phase: number;
}

/** Where the moon sits, and how much of it the sun is lighting. */
export const moonState = (date: Date): MoonState => {
  const n = daysSinceJ2000(date);
  const meanLon = norm360(218.316 + 13.176396 * n);
  const meanAnom = norm360(134.963 + 13.064993 * n) * DEG;
  const argLat = norm360(93.272 + 13.22935 * n) * DEG;

  const lambda = (meanLon + 6.289 * Math.sin(meanAnom)) * DEG;
  const beta = 5.128 * Math.sin(argLat) * DEG;
  const eps = obliquity(n) * DEG;

  // Ecliptic -> equatorial.
  const cb = Math.cos(beta), sb = Math.sin(beta);
  const cl = Math.cos(lambda), sl = Math.sin(lambda);
  const x = cb * cl;
  const y = Math.cos(eps) * cb * sl - Math.sin(eps) * sb;
  const z = Math.sin(eps) * cb * sl + Math.cos(eps) * sb;

  const dec = Math.asin(z) / DEG;
  const ra = Math.atan2(y, x) / DEG;

  // Phase from the sun-moon elongation in ecliptic longitude.
  const sunMeanLon = norm360(280.46 + 0.9856474 * n);
  const sunAnom = norm360(357.528 + 0.9856003 * n) * DEG;
  const sunLambda = sunMeanLon + 1.915 * Math.sin(sunAnom) + 0.02 * Math.sin(2 * sunAnom);
  const elongation = norm360(lambda / DEG - sunLambda);

  return {
    lat: dec,
    lon: norm180(ra - gmstHours(n) * 15),
    illumination: (1 - Math.cos(elongation * DEG)) / 2,
    phase: elongation / 360,
  };
};

/** Unit vector in the Earth-fixed frame for a latitude/longitude in degrees. */
export const directionFrom = ({ lat, lon }: SkyPoint) => {
  const latRad = lat * DEG;
  const lonRad = lon * DEG;
  const r = Math.cos(latRad);
  return { x: r * Math.cos(lonRad), y: Math.sin(latRad), z: r * Math.sin(lonRad) };
};

/**
 * The viewer's longitude, inferred from their timezone offset.
 *
 * A whole timezone is 15° wide, so this is the centre of their zone rather than
 * their actual meridian — enough to open the globe on the part of the world
 * they live in.
 */
export const viewerLongitude = (date = new Date()) => {
  const lon = -date.getTimezoneOffset() / 4;
  // Negating a zero offset yields -0, which would surface as "-0.0" in the UI.
  return lon === 0 ? 0 : lon;
};

const PHASE_NAMES = [
  { en: 'New moon', vi: 'Trăng mới' },
  { en: 'Waxing crescent', vi: 'Trăng lưỡi liềm đầu tháng' },
  { en: 'First quarter', vi: 'Trăng bán nguyệt đầu tháng' },
  { en: 'Waxing gibbous', vi: 'Trăng khuyết đầu tháng' },
  { en: 'Full moon', vi: 'Trăng tròn' },
  { en: 'Waning gibbous', vi: 'Trăng khuyết cuối tháng' },
  { en: 'Last quarter', vi: 'Trăng bán nguyệt cuối tháng' },
  { en: 'Waning crescent', vi: 'Trăng lưỡi liềm cuối tháng' },
];

/** Name of the current phase; the eight conventional divisions of the cycle. */
export const moonPhaseName = (phase: number) => PHASE_NAMES[Math.round(phase * 8) % 8];
