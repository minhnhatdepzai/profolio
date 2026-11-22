import { readFile } from 'node:fs/promises';

// These images are loaded dynamically, so Vite cannot detect missing files.
const requiredImages = [
  'brand/ronin/sakura-valley.webp',
  'brand/ronin/ronin-poses.webp',
  'earth/day.jpg',
  'earth/night.jpg',
  'earth/clouds.png',
  'earth/ocean.jpg',
  'earth/normal.jpg',
  'earth/moon.jpg',
];

const previewSlugs = [
  'japano',
  'fanpage-chatbot',
  'saigon-77',
  'math-lab',
  'smart-classroom',
  'kho',
  'picko247',
  'happytoplay',
  'vehicle-counting',
  'task1-coach',
  'hostora-ai',
  'vocalab',
  'vector-vu-tru',
  'run-fpl',
];

const requiredPreviews = previewSlugs.flatMap((slug) => [
  `projects/previews/${slug}.webp`,
  `projects/previews/${slug}.mp4`,
]);

const required = [...requiredImages, ...requiredPreviews];
const maxPreviewBytes = 2 * 1024 * 1024;

const failures = [];
await Promise.all(required.map(async (asset) => {
  try {
    const bytes = await readFile(new URL(`../public/${asset}`, import.meta.url));
    const valid = asset.endsWith('.mp4')
      ? bytes.subarray(0, 64).includes(Buffer.from('ftyp'))
      : asset.endsWith('.webp')
      ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
      : asset.endsWith('.png')
        ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!valid) failures.push(`${asset}: invalid image content`);
    if (asset.endsWith('.mp4') && bytes.length > maxPreviewBytes) {
      failures.push(`${asset}: exceeds 2 MiB preview limit`);
    }
  } catch {
    failures.push(`${asset}: missing or unreadable`);
  }
}));

if (failures.length) {
  console.error(`Build stopped: required visual assets are unavailable.\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${requiredImages.length} intro/Solar System images and ${previewSlugs.length} project preview pairs.`);
}
