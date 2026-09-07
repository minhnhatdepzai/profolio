export type PortfolioSound = 'intro' | 'click' | 'hover' | 'gecko-pickup' | 'gecko-drop';

type Voice = {
  oscillator: OscillatorNode;
  envelope: GainNode;
  release: () => void;
};

type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

const STATE_EVENT = 'portfolio-audio-change';
const MAX_VOICES = 8;
const SOUND_COOLDOWN: Record<PortfolioSound, number> = {
  intro: 1800,
  click: 80,
  hover: 150,
  'gecko-pickup': 150,
  'gecko-drop': 150,
};

let context: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let revision = 0;
let listenersInstalled = false;
let lastUiSound = -Infinity;
const voices = new Set<Voice>();
const lastSounds = new Map<PortfolioSound, number>();

const announce = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STATE_EVENT, { detail: { enabled } }));
  }
};

const updateEnabled = (value: boolean) => {
  if (enabled === value) return;
  enabled = value;
  announce();
};

const stopVoices = () => {
  [...voices].forEach((voice) => {
    try { voice.oscillator.stop(); } catch { /* Already ended. */ }
    voice.release();
  });
};

const onVisibility = () => {
  // Returning to the tab requires another explicit sound-button gesture.
  if (document.hidden) void setAudioEnabled(false);
};

const onContextState = () => {
  if (context?.state !== 'running') {
    stopVoices();
    updateEnabled(false);
  }
};

/** Subscribe to window's `portfolio-audio-change` event to synchronize a sound toggle. */
export const getAudioEnabled = () => enabled;

/**
 * Call `setAudioEnabled(true)` directly from an explicit user gesture, such as a
 * sound-toggle click. The context is never created or resumed by play methods,
 * effects, page load, pointer hover, visibility restoration or stored preferences.
 */
export async function setAudioEnabled(value: boolean): Promise<boolean> {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  if (!value) {
    revision += 1;
    updateEnabled(false);
    stopVoices();
    if (context && context.state !== 'closed') {
      try { await context.suspend(); } catch { /* Some browsers already suspend a hidden tab. */ }
    }
    return false;
  }

  if (enabled && context?.state === 'running' && !document.hidden) return true;
  if (document.hidden || (navigator.userActivation && !navigator.userActivation.isActive)) return false;

  const request = ++revision;
  try {
    if (!context || context.state === 'closed') {
      const Context = window.AudioContext ?? (window as AudioWindow).webkitAudioContext;
      if (!Context) return false;
      context = new Context({ latencyHint: 'interactive' });
      master = context.createGain();
      master.gain.value = 0.22;
      master.connect(context.destination);
      context.addEventListener('statechange', onContextState);
      if (!listenersInstalled) {
        document.addEventListener('visibilitychange', onVisibility);
        listenersInstalled = true;
      }
    }

    // This call runs before the first await, while the click's activation is live.
    await context.resume();
    if (request !== revision) return enabled;
    if (document.hidden) return setAudioEnabled(false);
    updateEnabled(context.state === 'running');
    return enabled;
  } catch {
    if (request === revision) {
      stopVoices();
      updateEnabled(false);
    }
    return false;
  }
}

const tone = (
  start: number,
  duration: number,
  frequency: number,
  endFrequency: number,
  peak = 0.09,
  waveform: OscillatorType = 'sine',
) => {
  if (!context || !master || voices.size >= MAX_VOICES) return;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  const attack = Math.min(0.025, duration * 0.2);
  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), start + duration);
  envelope.gain.setValueAtTime(0, start);
  envelope.gain.linearRampToValueAtTime(Math.min(0.12, Math.max(0, peak)), start + attack);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(master);

  const voice: Voice = {
    oscillator,
    envelope,
    release: () => {
      if (!voices.delete(voice)) return;
      oscillator.disconnect();
      envelope.disconnect();
    },
  };
  voices.add(voice);
  oscillator.addEventListener('ended', voice.release, { once: true });
  oscillator.start(start);
  oscillator.stop(start + duration + 0.025);
};

/** Returns false when muted, throttled, hidden, unsupported or browser-suspended. */
export function playPortfolioSound(sound: PortfolioSound): boolean {
  if (!enabled || !context || context.state !== 'running' || document.hidden) return false;
  const now = performance.now();
  if (now - (lastSounds.get(sound) ?? -Infinity) < SOUND_COOLDOWN[sound]) return false;
  if ((sound === 'hover' || sound === 'click') && now - lastUiSound < 65) return false;
  if (voices.size > MAX_VOICES - 3) return false;
  lastSounds.set(sound, now);
  if (sound === 'hover' || sound === 'click') lastUiSound = now;
  const start = context.currentTime + 0.006;

  switch (sound) {
    case 'intro':
      // A short, warm rising chord for the wordmark-to-monogram transition.
      tone(start, 1.35, 146.83, 164.81, 0.08, 'triangle');
      tone(start + 0.16, 1.15, 293.66, 329.63, 0.065);
      tone(start + 0.42, 0.82, 440, 659.25, 0.07);
      break;
    case 'click':
      tone(start, 0.085, 620, 440, 0.085);
      break;
    case 'hover':
      tone(start, 0.055, 880, 1046.5, 0.035);
      break;
    case 'gecko-pickup':
      tone(start, 0.19, 260, 520, 0.085, 'triangle');
      tone(start + 0.055, 0.15, 520, 780, 0.055);
      break;
    case 'gecko-drop':
      tone(start, 0.16, 390, 165, 0.09, 'triangle');
      tone(start + 0.1, 0.11, 260, 330, 0.05);
      break;
  }
  return true;
}

/** Stop sources, detach listeners and close the context when the app unmounts. */
export async function disposePortfolioAudio(): Promise<void> {
  revision += 1;
  updateEnabled(false);
  stopVoices();
  lastSounds.clear();
  lastUiSound = -Infinity;
  if (listenersInstalled && typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', onVisibility);
    listenersInstalled = false;
  }
  const previous = context;
  context = null;
  master?.disconnect();
  master = null;
  if (previous) {
    previous.removeEventListener('statechange', onContextState);
    if (previous.state !== 'closed') {
      try { await previous.close(); } catch { /* Context may already be closing. */ }
    }
  }
}
