import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/projectPreviewPolicy.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const policy = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('resolves preview assets under both root and GitHub Pages bases', () => {
  assert.equal(policy.resolvePreviewUrl('projects/previews/japano.mp4', '/'), '/projects/previews/japano.mp4');
  assert.equal(policy.resolvePreviewUrl('/projects/previews/japano.mp4', '/profolio/'), '/profolio/projects/previews/japano.mp4');
  assert.equal(policy.resolvePreviewUrl('projects/previews/japano.mp4', '/profolio'), '/profolio/projects/previews/japano.mp4');
});

test('reduced motion, Save-Data and 2G remain poster-only', () => {
  const base = { finePointer: true, touch: false, reducedMotion: false, saveData: false, effectiveType: '4g' };
  assert.equal(policy.autoplayMode({ ...base, reducedMotion: true }), 'poster');
  assert.equal(policy.autoplayMode({ ...base, saveData: true }), 'poster');
  assert.equal(policy.autoplayMode({ ...base, effectiveType: '2g' }), 'poster');
  assert.equal(policy.autoplayMode({ ...base, effectiveType: 'slow-2g' }), 'poster');
});

test('fine pointers use hover and touch devices use centered scroll', () => {
  const base = { reducedMotion: false, saveData: false, effectiveType: '4g' };
  assert.equal(policy.autoplayMode({ ...base, finePointer: true, touch: false }), 'hover');
  assert.equal(policy.autoplayMode({ ...base, finePointer: false, touch: true }), 'scroll');
  assert.equal(policy.autoplayMode({ ...base, finePointer: false, touch: false }), 'poster');
});

test('selects exactly the eligible card nearest the viewport center', () => {
  const candidates = [
    { slug: 'first', top: -30, bottom: 300, intersectionRatio: 0.7 },
    { slug: 'middle', top: 230, bottom: 650, intersectionRatio: 0.8 },
    { slug: 'last', top: 700, bottom: 980, intersectionRatio: 0.2 },
  ];
  assert.equal(policy.pickCenteredPreview(candidates, 800), 'middle');
});

test('center selection is stable for ties and returns null with no eligible card', () => {
  const tied = [
    { slug: 'first', top: 100, bottom: 300, intersectionRatio: 0.5 },
    { slug: 'second', top: 500, bottom: 700, intersectionRatio: 0.5 },
  ];
  assert.equal(policy.pickCenteredPreview(tied, 800), 'first');
  assert.equal(policy.pickCenteredPreview([], 800), null);
  assert.equal(policy.pickCenteredPreview([
    { slug: 'offscreen', top: 900, bottom: 1200, intersectionRatio: 0.1 },
  ], 800), null);
});
