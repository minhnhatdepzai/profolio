import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../worker/index.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const worker = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('parses bounded, open-ended and suffix byte ranges', () => {
  assert.deepEqual(worker.parseRangeHeader('bytes=0-1023', 5000), { start: 0, end: 1023 });
  assert.deepEqual(worker.parseRangeHeader('bytes=4096-', 5000), { start: 4096, end: 4999 });
  assert.deepEqual(worker.parseRangeHeader('bytes=-500', 5000), { start: 4500, end: 4999 });
  assert.equal(worker.parseRangeHeader('items=0-10', 5000), null);
  assert.equal(worker.parseRangeHeader('bytes=5000-6000', 5000), null);
});

test('returns an RFC 7233 partial response for static MP4 assets', async () => {
  const body = Uint8Array.from({ length: 2048 }, (_, index) => index % 251);
  const env = {
    ASSETS: {
      fetch: async () => new Response(body, {
        status: 200,
        headers: { 'Content-Type': 'video/mp4', 'Cache-Control': 'public, max-age=86400' },
      }),
    },
  };
  const request = new Request('https://example.com/projects/previews/japano.mp4', {
    headers: { Range: 'bytes=256-511' },
  });
  const response = await worker.default.fetch(request, env);
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('Content-Type'), 'video/mp4');
  assert.equal(response.headers.get('Accept-Ranges'), 'bytes');
  assert.equal(response.headers.get('Content-Range'), 'bytes 256-511/2048');
  assert.equal(response.headers.get('Content-Length'), '256');
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body.slice(256, 512));
});

test('returns 416 for an unsatisfiable range', async () => {
  const env = {
    ASSETS: {
      fetch: async () => new Response(new Uint8Array(128), { headers: { 'Content-Type': 'video/mp4' } }),
    },
  };
  const request = new Request('https://example.com/projects/previews/japano.mp4', {
    headers: { Range: 'bytes=128-200' },
  });
  const response = await worker.default.fetch(request, env);
  assert.equal(response.status, 416);
  assert.equal(response.headers.get('Content-Range'), 'bytes */128');
});
