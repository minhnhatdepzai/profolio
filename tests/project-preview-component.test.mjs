import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const component = readFileSync(new URL('../src/components/ProjectPreview.tsx', import.meta.url), 'utf8');
const projects = readFileSync(new URL('../src/sections/Projects.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/components/project-preview.css', import.meta.url), 'utf8');

test('video is silent, inline, lazy and uses a stable poster fallback', () => {
  assert.match(component, /muted/);
  assert.match(component, /playsInline/);
  assert.match(component, /loop/);
  assert.match(component, /preload="none"/);
  assert.match(component, /project\.preview\.poster/);
  assert.match(component, /resolvePreviewUrl/);
});

test('owner-supplied previews mount a direct YouTube player only while active', () => {
  assert.match(component, /project\.preview\.kind === 'youtube'/);
  assert.match(component, /youtubeEmbedUrl\(project\.preview\.youtubeId\)/);
  assert.match(component, /active && !paused/);
  assert.match(component, /<iframe/);
  assert.match(component, /allow="autoplay; encrypted-media; picture-in-picture"/);
  assert.match(component, /referrerPolicy="strict-origin-when-cross-origin"/);
  assert.match(component, /project-preview__youtube/);
  assert.match(styles, /\.project-preview__youtube\.is-ready/);
});

test('playback is guarded against stale async play promises and rejected playback', () => {
  assert.match(component, /activationTokenRef/);
  assert.match(component, /token !== activationTokenRef\.current/);
  assert.match(component, /\.play\(\)/);
  assert.match(component, /catch/);
  assert.match(component, /setPlaybackFailed\(true\)/);
  assert.doesNotMatch(component, /token !== activationTokenRef\.current\) \{\s*video\.pause/);
  assert.match(component, /startPlayback\(true\)/);
  assert.match(component, /if \(!explicit && playbackFailed\) return/);
});

test('preview has accessible pause and replay controls', () => {
  assert.match(component, /aria-label=/);
  assert.match(component, /Pause preview|Tạm dừng video/);
  assert.match(component, /Replay preview|Phát lại video/);
  assert.match(component, /onClick=/);
});

test('cleanup covers visibility, dialog state, deactivation and unmount', () => {
  assert.match(component, /visibilitychange/);
  assert.match(projects, /openSlug/);
  assert.match(projects, /setActivePreviewSlug\(null\)/);
  assert.match(component, /video\.pause\(\)/);
  assert.match(component, /currentTime = 0/);
  assert.match(component, /return \(\) =>/);
});

test('gallery coordinates one active preview across pointer, focus and centered scroll', () => {
  assert.match(projects, /activePreviewSlug/);
  assert.match(projects, /autoplayMode/);
  assert.match(projects, /pickCenteredPreview/);
  assert.match(projects, /IntersectionObserver/);
  assert.match(projects, /onPointerEnter/);
  assert.match(projects, /onFocusCapture/);
  assert.match(projects, /<ProjectPreview/);
  assert.match(projects, /preload=\{/);
  assert.match(projects, /activePreviewIndex/);
});

test('distant cards detach video sources instead of retaining all fourteen files', () => {
  assert.match(component, /preload\?: boolean/);
  assert.match(component, /preload \|\| active \|\| explicitRequested/);
  assert.match(component, /video\.removeAttribute\('src'\)/);
  assert.match(component, /video\.load\(\)/);
});

test('preview styling preserves the card frame and honors reduced motion', () => {
  assert.match(styles, /position:\s*absolute/);
  assert.match(styles, /object-fit:\s*cover/);
  assert.match(styles, /\.project-preview__video\.is-ready/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /focus-visible/);
});
