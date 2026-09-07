export type GeckoPhase = 'roaming' | 'held' | 'falling' | 'landing' | 'fleeing' | 'hidden' | 'returning';
export type GeckoPose = {
  phase: GeckoPhase; x: number; y: number; angle: number; vx: number; vy: number;
  elapsed: number; opacity: number; scaleX: number; scaleY: number; direction: number;
};
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export const geckoBounds = (width: number, height: number) => ({
  inset: width < 700 ? 40 : 62,
  floor: Math.max(80, height - (width < 700 ? 130 : 51)),
});
export const createGeckoPose = (): GeckoPose => ({
  phase: 'roaming', x: 0, y: 0, angle: -Math.PI / 2, vx: 0, vy: 0,
  elapsed: 0, opacity: 1, scaleX: 1, scaleY: 1, direction: 1,
});
export const releaseGecko = (pose: GeckoPose) => {
  pose.phase = 'falling'; pose.elapsed = 0; pose.vy = 60;
  pose.vx = clamp(pose.vx, -260, 260);
};

/** Local, bounded cartoon physics; no timers or DOM dependencies. */
export const stepGecko = (pose: GeckoPose, deltaMs: number, width: number, height: number) => {
  const dt = Math.min(deltaMs, 40) / 1000;
  const bounds = geckoBounds(width, height);
  pose.elapsed += dt;
  if (pose.phase === 'held') {
    pose.angle = -Math.PI / 2 + Math.sin(pose.elapsed * 35) * .13;
    pose.scaleX = 1.08; pose.scaleY = 1.08;
  } else if (pose.phase === 'falling') {
    pose.vy += 1850 * dt;
    pose.x = clamp(pose.x + pose.vx * dt, bounds.inset, width - bounds.inset);
    pose.y += pose.vy * dt;
    pose.angle += (0 - pose.angle) * Math.min(1, dt * 7);
    pose.scaleX = .95; pose.scaleY = 1.08;
    if (pose.y >= bounds.floor) {
      pose.y = bounds.floor; pose.phase = 'landing'; pose.elapsed = 0;
      pose.direction = pose.x < width / 2 ? -1 : 1;
      pose.angle = 0; pose.scaleX = 1.2; pose.scaleY = .7;
    }
  } else if (pose.phase === 'landing') {
    const recovery = clamp(pose.elapsed / .24, 0, 1);
    pose.scaleX = (1.2 - recovery * .2) * pose.direction;
    pose.scaleY = .7 + recovery * .3;
    if (pose.elapsed >= .24) { pose.phase = 'fleeing'; pose.elapsed = 0; }
  } else if (pose.phase === 'fleeing') {
    pose.x += pose.direction * (280 + pose.elapsed * 1150) * dt;
    pose.y = bounds.floor + Math.sin(pose.elapsed * 48) * 2;
    pose.scaleX = pose.direction; pose.scaleY = 1;
    pose.opacity = 1 - clamp((pose.elapsed - .18) / .62, 0, 1);
    if (pose.elapsed >= .88 || pose.x < -80 || pose.x > width + 80) {
      pose.phase = 'hidden'; pose.elapsed = 0; pose.opacity = 0;
    }
  } else if (pose.phase === 'hidden' && pose.elapsed >= 2.6) {
    pose.phase = 'returning'; pose.elapsed = 0;
    pose.x = width - bounds.inset; pose.y = bounds.floor - 65;
    pose.angle = -Math.PI / 2; pose.scaleX = 1; pose.scaleY = 1;
  } else if (pose.phase === 'returning') {
    pose.opacity = clamp(pose.elapsed / .7, 0, 1);
    if (pose.elapsed >= .7) { pose.phase = 'roaming'; pose.elapsed = 0; }
  }
};
