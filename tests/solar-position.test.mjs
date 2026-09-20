import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transpileModule, ModuleKind, ScriptTarget } from 'typescript';

/** Load the TS module by stripping types — no build step needed for the suite. */
const load = async (path) => {
  const source = readFileSync(new URL(path, import.meta.url), 'utf8');
  const { outputText } = transpileModule(source, {
    compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
};

const {
  subsolarPoint, moonState, directionFrom, viewerLongitude, daysSinceJ2000, moonPhaseName,
} = await load('../src/components/solarPosition.ts');

const utc = (y, m, d, h = 0, min = 0) => new Date(Date.UTC(y, m - 1, d, h, min));

test('J2000 epoch is day zero', () => {
  assert.ok(Math.abs(daysSinceJ2000(utc(2000, 1, 1, 12))) < 1e-6);
});

test('at solar noon UTC the sun stands over the Greenwich meridian', () => {
  // The equation of time shifts the subsolar point up to about +/-4 degrees
  // across the year, so check a band rather than an exact zero.
  for (const month of [1, 4, 7, 10]) {
    const { lon } = subsolarPoint(utc(2026, month, 15, 12));
    assert.ok(Math.abs(lon) < 5, `month ${month}: expected near 0, got ${lon.toFixed(2)}`);
  }
});

test('the subsolar point sweeps westward at 15 degrees an hour', () => {
  const a = subsolarPoint(utc(2026, 6, 1, 0));
  const b = subsolarPoint(utc(2026, 6, 1, 6));
  let delta = b.lon - a.lon;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  assert.ok(Math.abs(delta - -90) < 1, `expected about -90 degrees, got ${delta.toFixed(2)}`);
});

test('solar declination tracks the seasons', () => {
  // Solstices reach the tropics; equinoxes cross the equator.
  assert.ok(subsolarPoint(utc(2026, 6, 21, 12)).lat > 23, 'June solstice should be near +23.4');
  assert.ok(subsolarPoint(utc(2026, 12, 21, 12)).lat < -23, 'December solstice should be near -23.4');
  assert.ok(Math.abs(subsolarPoint(utc(2026, 3, 20, 12)).lat) < 1.5, 'March equinox should cross 0');
  assert.ok(Math.abs(subsolarPoint(utc(2026, 9, 23, 12)).lat) < 1.5, 'September equinox should cross 0');
});

test('declination never leaves the tropics', () => {
  for (let day = 0; day < 365; day += 7) {
    const { lat } = subsolarPoint(new Date(Date.UTC(2026, 0, 1) + day * 86400000));
    assert.ok(Math.abs(lat) <= 23.5, `day ${day}: declination ${lat.toFixed(2)} is out of range`);
  }
});

test('longitudes stay inside -180..180 all year', () => {
  for (let hour = 0; hour < 24 * 40; hour += 7) {
    const date = new Date(Date.UTC(2026, 0, 1) + hour * 3600000);
    const sun = subsolarPoint(date);
    const moon = moonState(date);
    assert.ok(sun.lon >= -180 && sun.lon <= 180, `sun lon out of range: ${sun.lon}`);
    assert.ok(moon.lon >= -180 && moon.lon <= 180, `moon lon out of range: ${moon.lon}`);
  }
});

test('directionFrom builds unit vectors in the textured frame', () => {
  const len = (v) => Math.hypot(v.x, v.y, v.z);

  const pole = directionFrom({ lat: 90, lon: 0 });
  assert.ok(Math.abs(pole.y - 1) < 1e-9, 'north pole should sit on +Y');

  const greenwich = directionFrom({ lat: 0, lon: 0 });
  assert.ok(Math.abs(greenwich.x - 1) < 1e-9, 'longitude 0 should point down +X');

  const east = directionFrom({ lat: 0, lon: 90 });
  assert.ok(Math.abs(east.z - 1) < 1e-9, 'longitude +90 should point down +Z');

  for (const p of [{ lat: 10, lon: 20 }, { lat: -45, lon: 170 }, { lat: 60, lon: -120 }]) {
    assert.ok(Math.abs(len(directionFrom(p)) - 1) < 1e-9, 'vectors must be unit length');
  }
});

test('the moon runs a full synodic cycle in about 29.5 days', () => {
  // Track the illuminated fraction from a known new moon and count the minima.
  const start = Date.UTC(2026, 0, 1);
  let crossings = 0;
  let previous = moonState(new Date(start)).phase;
  for (let day = 1; day <= 295; day += 1) {
    const phase = moonState(new Date(start + day * 86400000)).phase;
    if (phase < previous) crossings += 1; // wrapped past new moon
    previous = phase;
  }
  assert.ok(crossings >= 9 && crossings <= 11, `expected about 10 cycles in 295 days, got ${crossings}`);
});

test('illumination is consistent with the phase it reports', () => {
  for (let day = 0; day < 60; day += 1) {
    const { phase, illumination } = moonState(new Date(Date.UTC(2026, 0, 1) + day * 86400000));
    assert.ok(illumination >= 0 && illumination <= 1, 'illumination must be a fraction');
    // Near new the disc is dark; near full it is lit.
    if (phase < 0.02 || phase > 0.98) assert.ok(illumination < 0.05, 'new moon should be dark');
    if (Math.abs(phase - 0.5) < 0.02) assert.ok(illumination > 0.95, 'full moon should be lit');
  }
});

test('moon phase names cover the cycle and wrap cleanly', () => {
  assert.equal(moonPhaseName(0).en, 'New moon');
  assert.equal(moonPhaseName(0.5).en, 'Full moon');
  assert.equal(moonPhaseName(1).en, 'New moon', 'a full cycle must wrap back to new');
  assert.equal(moonPhaseName(0.25).en, 'First quarter');
});

test('viewer longitude follows the timezone offset', () => {
  // getTimezoneOffset is minutes *behind* UTC, so UTC+7 reports -420.
  assert.equal(viewerLongitude({ getTimezoneOffset: () => -420 }), 105);
  assert.equal(viewerLongitude({ getTimezoneOffset: () => 0 }), 0);
  assert.equal(viewerLongitude({ getTimezoneOffset: () => 300 }), -75);
});
