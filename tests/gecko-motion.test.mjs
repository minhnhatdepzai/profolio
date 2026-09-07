import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/geckoMotion.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { createGeckoPose, releaseGecko, stepGecko, geckoBounds } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

for (const width of [320, 390, 1440]) {
  for (const x of [50, width / 2, width - 50]) {
    test(`drop, land, flee, camouflage and reappear at ${width}px / x=${x}`, () => {
      const pose = createGeckoPose();
      Object.assign(pose, { phase: 'held', x, y: 160 });
      releaseGecko(pose);
      const phases = new Set();
      let visibleFade = false;
      for (let i = 0; i < 500; i++) {
        stepGecko(pose, 16, width, 900);
        phases.add(pose.phase);
        assert(Number.isFinite(pose.x + pose.y + pose.angle));
        assert(pose.opacity >= 0 && pose.opacity <= 1);
        if (pose.phase === 'landing') assert.equal(pose.y, geckoBounds(width, 900).floor);
        if (pose.phase === 'fleeing' && pose.opacity > 0 && pose.opacity < 1) visibleFade = true;
      }
      assert.deepEqual([...phases], ['falling', 'landing', 'fleeing', 'hidden', 'returning', 'roaming']);
      assert(visibleFade);
      assert.equal(pose.opacity, 1);
      assert.equal(pose.x, width - geckoBounds(width, 900).inset);
    });
  }
}

test('release velocity is bounded and a long frame cannot teleport the gecko', () => {
  const pose = createGeckoPose();
  Object.assign(pose, { phase: 'held', x: 300, y: 200, vx: 50_000 });
  releaseGecko(pose);
  assert.equal(pose.vx, 260);
  stepGecko(pose, 30_000, 1440, 900);
  assert(pose.y < 210);
  assert(pose.x < 315);
});
