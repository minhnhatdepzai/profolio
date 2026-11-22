import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
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
  });
}
