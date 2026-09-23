import { readFile } from 'node:fs/promises';

// These images are loaded dynamically, so Vite cannot detect missing files.
const required = [
  'brand/ronin/sakura-valley.webp',
  'brand/ronin/ronin-poses.webp',
  'earth/day.jpg',
  'earth/night.jpg',
  'earth/clouds.png',
  'earth/ocean.jpg',
  'earth/normal.jpg',
  'earth/moon.jpg',
];

const failures = [];
await Promise.all(required.map(async (asset) => {
  try {
    const bytes = await readFile(new URL(`../public/${asset}`, import.meta.url));
    const valid = asset.endsWith('.webp')
      ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
      : asset.endsWith('.png')
        ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!valid) failures.push(`${asset}: invalid image content`);
  } catch {
    failures.push(`${asset}: missing or unreadable`);
  }
}));

if (failures.length) {
  console.error(`Build stopped: required visual assets are unavailable.\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${required.length} required intro and Solar System images.`);
}
