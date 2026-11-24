import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/data/projects.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const { featuredProjects } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('owner-supplied project videos use their exact YouTube IDs', () => {
  const youtubeProjects = Object.fromEntries(
    featuredProjects
      .filter((project) => project.preview.kind === 'youtube')
      .map((project) => [project.slug, project.preview.youtubeId]),
  );

  assert.deepEqual(youtubeProjects, {
    japano: 'D8jqwvPUfFc',
    'math-lab': 'Ee5RhmHy5AE',
    'hostora-ai': '-17sYrbp7pU',
  });
});

test('projects without an owner-supplied video retain local MP4 previews', () => {
  const localProjects = featuredProjects.filter((project) => project.preview.kind === 'local');

  assert.equal(localProjects.length, 11);
  for (const project of localProjects) {
    assert.equal(project.preview.video, `projects/previews/${project.slug}.mp4`);
    assert.equal(project.preview.youtubeId, undefined);
  }
});
