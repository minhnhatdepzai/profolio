import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

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
    const assetUrl = new URL(`../public/${asset}`, import.meta.url);
    const bytes = await readFile(assetUrl);
    const valid = asset.endsWith('.mp4')
      ? bytes.subarray(0, 64).includes(Buffer.from('ftyp'))
      : asset.endsWith('.webp')
      ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
      : asset.endsWith('.png')
        ? bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!valid) failures.push(`${asset}: invalid file content`);
    if (asset.endsWith('.mp4') && bytes.length > maxPreviewBytes) {
      failures.push(`${asset}: exceeds 2 MiB preview limit`);
    }
    if (asset.endsWith('.mp4')) {
      const moov = bytes.indexOf(Buffer.from('moov'));
      const mdat = bytes.indexOf(Buffer.from('mdat'));
      if (moov < 0 || mdat < 0 || moov > mdat) {
        failures.push(`${asset}: moov must precede mdat for faststart playback`);
      }

      const metadata = JSON.parse(execFileSync('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration:stream=codec_name,codec_type,width,height,pix_fmt',
        '-of', 'json',
        fileURLToPath(assetUrl),
      ], { encoding: 'utf8' }));
      const video = metadata.streams.filter((stream) => stream.codec_type === 'video');
      const audio = metadata.streams.filter((stream) => stream.codec_type === 'audio');
      const duration = Number(metadata.format.duration);
      if (video.length !== 1) failures.push(`${asset}: expected exactly one video stream`);
      if (audio.length !== 0) failures.push(`${asset}: audio streams are not allowed`);
      if (video[0]?.codec_name !== 'h264') failures.push(`${asset}: codec must be H.264`);
      if (video[0]?.width !== 960 || video[0]?.height !== 540) failures.push(`${asset}: dimensions must be 960x540`);
      if (video[0]?.pix_fmt !== 'yuv420p') failures.push(`${asset}: pixel format must be yuv420p`);
      if (!Number.isFinite(duration) || duration < 6 || duration > 10) failures.push(`${asset}: duration must be between 6s and 10s`);
    }
  } catch {
    failures.push(`${asset}: missing, unreadable or ffprobe metadata unavailable`);
  }
}));

if (failures.length) {
  console.error(`Build stopped: required visual assets are unavailable.\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Verified ${requiredImages.length} intro/Solar System images and ${previewSlugs.length} project preview pairs.`);
}
