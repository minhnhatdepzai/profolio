import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/portfolioAudio.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const sounds = ['intro', 'click', 'hover', 'gecko-pickup', 'gecko-drop'];
let moduleInstance = 0;

function createEnvironment() {
  const savedGlobals = new Map(['window', 'document', 'navigator', 'performance'].map((name) => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const env = { now: 0, contexts: [], rejectResume: false, stateEvents: [] };

  class TrackedTarget extends EventTarget {
    listeners = new Map();
    addEventListener(type, callback, options) {
      if (!this.listeners.has(type)) this.listeners.set(type, new Set());
      this.listeners.get(type).add(callback);
      super.addEventListener(type, callback, options);
    }
    removeEventListener(type, callback, options) {
      this.listeners.get(type)?.delete(callback);
      super.removeEventListener(type, callback, options);
    }
    listenerCount(type) { return this.listeners.get(type)?.size ?? 0; }
  }

  class Parameter {
    value = 0;
    events = [];
    setValueAtTime(value, time) { this.events.push({ method: 'set', value, time }); }
    linearRampToValueAtTime(value, time) { this.events.push({ method: 'linear', value, time }); }
    exponentialRampToValueAtTime(value, time) { this.events.push({ method: 'exponential', value, time }); }
  }

  class Gain {
    gain = new Parameter();
    connections = new Set();
    disconnected = false;
    connect(destination) { this.connections.add(destination); }
    disconnect() { this.disconnected = true; this.connections.clear(); }
  }

  class Oscillator extends EventTarget {
    frequency = new Parameter();
    connections = new Set();
    starts = [];
    scheduledStops = [];
    immediateStops = 0;
    disconnected = false;
    connect(destination) { this.connections.add(destination); }
    disconnect() { this.disconnected = true; this.connections.clear(); }
    start(time) { this.starts.push(time); }
    stop(time) {
      // A scheduled stop does not emit `ended` until the audio clock reaches it.
      if (time === undefined) this.immediateStops += 1;
      else this.scheduledStops.push(time);
    }
    finish() { this.dispatchEvent(new Event('ended')); }
  }

  class MockAudioContext extends TrackedTarget {
    state = 'suspended';
    currentTime = 4;
    destination = {};
    gains = [];
    oscillators = [];
    resumeCalls = 0;
    suspendCalls = 0;
    closeCalls = 0;
    constructor(options) { super(); this.options = options; env.contexts.push(this); }
    createGain() { const node = new Gain(); this.gains.push(node); return node; }
    createOscillator() { const node = new Oscillator(); this.oscillators.push(node); return node; }
    async resume() {
      this.resumeCalls += 1;
      if (env.rejectResume) throw new Error('Audio playback is not allowed');
      this.state = 'running';
      this.dispatchEvent(new Event('statechange'));
    }
    async suspend() {
      this.suspendCalls += 1;
      this.state = 'suspended';
      this.dispatchEvent(new Event('statechange'));
    }
    async close() {
      this.closeCalls += 1;
      this.state = 'closed';
      this.dispatchEvent(new Event('statechange'));
    }
  }

  env.window = Object.assign(new TrackedTarget(), { AudioContext: MockAudioContext });
  env.document = Object.assign(new TrackedTarget(), { hidden: false });
  env.navigator = { userActivation: { isActive: false } };
  env.window.addEventListener('portfolio-audio-change', (event) => env.stateEvents.push(event.detail.enabled));
  const replacements = { window: env.window, document: env.document, navigator: env.navigator, performance: { now: () => env.now } };
  for (const [name, value] of Object.entries(replacements)) Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
  env.restore = () => {
    for (const [name, descriptor] of savedGlobals) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  };
  env.activate = () => { env.navigator.userActivation.isActive = true; };
  return env;
}

// Every case gets a fresh module singleton and restored globals; no overlapping tests.
test('portfolio audio respects consent, lifecycle and sound limits', { concurrency: false }, async (t) => {
  const check = async (name, run) => {
    await t.test(name, { concurrency: false }, async () => {
      const env = createEnvironment();
      let audio;
      try {
        audio = await import(`${moduleUrl}#case-${++moduleInstance}`);
        await run(audio, env);
      } finally {
        try { await audio?.disposePortfolioAudio(); }
        finally { env.restore(); }
      }
    });
  };

  await check('starts muted and playing sounds never creates or resumes a context', async (audio, env) => {
    assert.equal(audio.getAudioEnabled(), false);
    sounds.forEach((sound) => assert.equal(audio.playPortfolioSound(sound), false));
    assert.equal(env.contexts.length, 0);
    assert.equal(env.document.listenerCount('visibilitychange'), 0);
    assert.deepEqual(env.stateEvents, []);
  });

  await check('requires active user activation and a visible tab before creating audio', async (audio, env) => {
    assert.equal(await audio.setAudioEnabled(true), false);
    assert.equal(env.contexts.length, 0);
    env.activate();
    env.document.hidden = true;
    assert.equal(await audio.setAudioEnabled(true), false);
    assert.equal(env.contexts.length, 0);
    assert.equal(await audio.setAudioEnabled(false), false);
  });

  await check('explicit enable resumes before its first await and reports enabled state', async (audio, env) => {
    env.activate();
    const result = audio.setAudioEnabled(true);
    assert.equal(env.contexts.length, 1);
    assert.equal(env.contexts[0].resumeCalls, 1);
    assert.equal(await result, true);
    assert.equal(audio.getAudioEnabled(), true);
    assert.deepEqual(env.stateEvents, [true]);
    assert.equal(env.document.listenerCount('visibilitychange'), 1);
    assert.equal(env.contexts[0].listenerCount('statechange'), 1);
    assert.equal(await audio.setAudioEnabled(true), true);
    assert.equal(env.contexts[0].resumeCalls, 1, 'An already-running context needs no extra resume');
  });

  await check('bounds voice count, gain, scheduling and releases naturally ended nodes', async (audio, env) => {
    env.activate();
    await audio.setAudioEnabled(true);
    const ctx = env.contexts[0];
    for (let index = 0; index < 20; index += 1) {
      env.now += 2000;
      audio.playPortfolioSound(sounds[index % sounds.length]);
    }
    assert(ctx.oscillators.length > 0 && ctx.oscillators.length <= 8);
    assert(ctx.gains[0].gain.value > 0 && ctx.gains[0].gain.value <= 0.25);
    ctx.oscillators.forEach((oscillator) => {
      assert.equal(oscillator.starts.length, 1);
      assert.equal(oscillator.scheduledStops.length, 1);
      assert(oscillator.starts[0] >= ctx.currentTime);
      assert(oscillator.scheduledStops[0] > oscillator.starts[0]);
      assert(oscillator.scheduledStops[0] - oscillator.starts[0] < 1.5);
    });
    ctx.gains.slice(1).forEach((gain) => {
      gain.gain.events.forEach(({ value }) => assert(value >= 0 && value <= 0.12));
    });
    const previous = ctx.oscillators.length;
    ctx.oscillators.forEach((oscillator) => oscillator.finish());
    assert(ctx.oscillators.every((oscillator) => oscillator.disconnected));
    assert(ctx.gains.slice(1).every((gain) => gain.disconnected));
    env.now += 2000;
    assert.equal(audio.playPortfolioSound('intro'), true);
    assert.equal(ctx.oscillators.length, previous + 3, 'Ended voices free space for another cue');
  });

  await check('throttles hover and nearby UI sounds without queuing delayed audio', async (audio, env) => {
    env.activate();
    await audio.setAudioEnabled(true);
    const ctx = env.contexts[0];
    assert.equal(audio.playPortfolioSound('hover'), true);
    assert.equal(audio.playPortfolioSound('hover'), false);
    env.now = 30;
    assert.equal(audio.playPortfolioSound('click'), false);
    env.now = 149;
    assert.equal(audio.playPortfolioSound('hover'), false);
    assert.equal(ctx.oscillators.length, 1);
    env.now = 150;
    assert.equal(audio.playPortfolioSound('hover'), true);
    assert.equal(ctx.oscillators.length, 2);
  });

  await check('mute immediately stops and disconnects active voices and suspends context', async (audio, env) => {
    env.activate();
    await audio.setAudioEnabled(true);
    audio.playPortfolioSound('intro');
    const ctx = env.contexts[0];
    assert.equal(await audio.setAudioEnabled(false), false);
    assert.equal(audio.getAudioEnabled(), false);
    assert.equal(ctx.state, 'suspended');
    assert.equal(ctx.suspendCalls, 1);
    assert(ctx.oscillators.every((oscillator) => oscillator.immediateStops === 1 && oscillator.disconnected));
    assert(ctx.gains.slice(1).every((gain) => gain.disconnected));
    assert.equal(audio.playPortfolioSound('gecko-pickup'), false);
    assert.deepEqual(env.stateEvents, [true, false]);
  });

  await check('hidden tabs mute and suspend without automatically resuming on return', async (audio, env) => {
    env.activate();
    await audio.setAudioEnabled(true);
    audio.playPortfolioSound('gecko-drop');
    const ctx = env.contexts[0];
    env.document.hidden = true;
    env.document.dispatchEvent(new Event('visibilitychange'));
    await Promise.resolve();
    assert.equal(audio.getAudioEnabled(), false);
    assert.equal(ctx.state, 'suspended');
    assert.equal(ctx.suspendCalls, 1);
    assert(ctx.oscillators.every((oscillator) => oscillator.immediateStops === 1 && oscillator.disconnected));
    env.document.hidden = false;
    env.navigator.userActivation.isActive = false;
    env.document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(audio.playPortfolioSound('click'), false);
    assert.equal(ctx.resumeCalls, 1);
    assert.equal(await audio.setAudioEnabled(true), false);
    env.activate();
    assert.equal(await audio.setAudioEnabled(true), true);
    assert.equal(ctx.resumeCalls, 2);
  });

  await check('dispose closes context, disconnects nodes and removes lifecycle listeners', async (audio, env) => {
    env.activate();
    await audio.setAudioEnabled(true);
    audio.playPortfolioSound('intro');
    const ctx = env.contexts[0];
    await audio.disposePortfolioAudio();
    assert.equal(audio.getAudioEnabled(), false);
    assert.equal(ctx.closeCalls, 1);
    assert.equal(ctx.listenerCount('statechange'), 0);
    assert.equal(env.document.listenerCount('visibilitychange'), 0);
    assert(ctx.gains.every((gain) => gain.disconnected));
    assert(ctx.oscillators.every((oscillator) => oscillator.disconnected));
    assert.equal(audio.playPortfolioSound('intro'), false);
    await audio.disposePortfolioAudio();
    assert.equal(ctx.closeCalls, 1, 'Repeated disposal is safe');
    assert.equal(await audio.setAudioEnabled(true), true, 'A later mount can explicitly enable fresh audio');
    assert.equal(env.contexts.length, 2);
    assert.equal(audio.playPortfolioSound('intro'), true, 'Disposal resets stale sound cooldowns');
  });

  await check('a rejected resume stays muted and recovers on a later explicit gesture', async (audio, env) => {
    env.activate();
    env.rejectResume = true;
    assert.equal(await audio.setAudioEnabled(true), false);
    assert.equal(audio.getAudioEnabled(), false);
    assert.equal(audio.playPortfolioSound('intro'), false);
    assert.equal(env.contexts[0].oscillators.length, 0);
    assert.deepEqual(env.stateEvents, []);
    env.rejectResume = false;
    assert.equal(await audio.setAudioEnabled(true), true);
    assert.equal(env.contexts.length, 1);
    assert.equal(env.contexts[0].resumeCalls, 2);
    assert.deepEqual(env.stateEvents, [true]);
    assert.equal(audio.playPortfolioSound('intro'), true);
  });
});
