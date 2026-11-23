import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const slugs = [
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

const assetUrl = (slug, extension) => new URL(`../public/projects/previews/${slug}.${extension}`, import.meta.url);

test('the production build gate probes codec, duration, dimensions, audio and faststart', async () => {
  const verifier = await readFile(new URL('../scripts/verify-public-assets.mjs', import.meta.url), 'utf8');
  assert.match(verifier, /ffprobe/);
  assert.match(verifier, /codec_name/);
  assert.match(verifier, /pix_fmt/);
  assert.match(verifier, /codec_type/);
  assert.match(verifier, /moov/);
  assert.match(verifier, /mdat/);
});

for (const slug of slugs) {
  test(`${slug} ships a valid WebP poster`, async () => {
    const bytes = await readFile(assetUrl(slug, 'webp'));
    assert(bytes.length > 0, 'poster must not be empty');
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
  });

  test(`${slug} ships a bounded MP4 preview`, async () => {
    const url = assetUrl(slug, 'mp4');
    const [bytes, info] = await Promise.all([readFile(url), stat(url)]);
    assert(bytes.length > 0, 'preview must not be empty');
    assert(bytes.subarray(0, 64).includes(Buffer.from('ftyp')), 'preview must contain an MP4 ftyp box');
    assert(info.size <= 2 * 1024 * 1024, `preview is ${info.size} bytes; expected at most 2 MiB`);
    assert(bytes.indexOf(Buffer.from('moov')) > 0, 'preview must contain a moov box');
    assert(bytes.indexOf(Buffer.from('moov')) < bytes.indexOf(Buffer.from('mdat')), 'moov must precede mdat for faststart');

    const metadata = JSON.parse(execFileSync('ffprobe', [
      '-v', 'error',
      '-show_entries', 'format=duration:stream=codec_name,codec_type,width,height,pix_fmt',
      '-of', 'json',
      fileURLToPath(url),
    ], { encoding: 'utf8' }));
    const video = metadata.streams.filter((stream) => stream.codec_type === 'video');
    const audio = metadata.streams.filter((stream) => stream.codec_type === 'audio');
    const duration = Number(metadata.format.duration);
    assert.equal(video.length, 1, 'preview must contain exactly one video stream');
    assert.equal(audio.length, 0, 'preview must not contain audio');
    assert.equal(video[0].codec_name, 'h264');
    assert.equal(video[0].width, 960);
    assert.equal(video[0].height, 540);
    assert.equal(video[0].pix_fmt, 'yuv420p');
    assert(duration >= 6 && duration <= 10, `duration ${duration}s must stay between 6s and 10s`);
  });
}
