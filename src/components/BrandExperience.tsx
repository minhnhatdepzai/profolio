import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { disposePortfolioAudio, getAudioEnabled, playPortfolioSound, setAudioEnabled } from './portfolioAudio';
import './brand-experience.css';

export const INTRO_DURATION_MS = 2000;
type Experience = { soundOn: boolean; toggleSound: () => Promise<void>; replay: () => void; soundError: boolean };
const ExperienceContext = createContext<Experience | null>(null);
const useExperience = () => {
  const context = useContext(ExperienceContext);
  if (!context) throw new Error('Brand controls need BrandExperience');
  return context;
};

export const SoundToggle = () => {
  const { soundOn, toggleSound, soundError } = useExperience();
  const { lang } = useLanguage();
  const label = lang === 'vi' ? (soundOn ? 'Tắt âm thanh' : 'Bật âm thanh') : (soundOn ? 'Mute sound' : 'Enable sound');
  return (
    <button type="button" className="sound-toggle" data-audio-control aria-pressed={soundOn}
      aria-label={label} title={soundError ? (lang === 'vi' ? 'Chưa phát được âm thanh · thử bấm lại' : 'Audio unavailable · click to retry') : label}
      onClick={() => void toggleSound()}>
      {soundOn ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
      <span>{lang === 'vi' ? 'Âm thanh' : 'Sound'}</span>
      <i className="sound-toggle__signal" aria-hidden="true"><b /><b /><b /></i>
    </button>
  );
};

export const IntroReplay = () => {
  const { replay } = useExperience();
  const { lang } = useLanguage();
  return <button type="button" className="intro-replay" data-audio-control onClick={replay}><RotateCcw size={14} aria-hidden="true" />{lang === 'vi' ? 'Xem lại intro · 2s' : 'Replay intro · 2s'}</button>;
};

export const BrandExperience = ({ children }: { children: ReactNode }) => {
  const { lang } = useLanguage();
  const [introOpen, setIntroOpen] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches && !location.hash);
  const [introVersion, setIntroVersion] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [soundError, setSoundError] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const vi = lang === 'vi';
  const closeIntro = useCallback(() => setIntroOpen(false), []);

  const replay = useCallback(() => {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setIntroVersion(value => value + 1);
    setIntroOpen(true);
    playPortfolioSound('intro');
  }, []);

  const toggleSound = useCallback(async () => {
    const enable = !getAudioEnabled();
    const enabled = await setAudioEnabled(enable);
    if (!mounted.current) return;
    setSoundOn(enabled); setSoundError(enable && !enabled);
    if (enabled) playPortfolioSound('click');
  }, []);

  useEffect(() => {
    mounted.current = true;
    const updateSound = () => setSoundOn(getAudioEnabled());
    const click = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('[data-audio-control], .garden-gecko')) return;
      if (event.target.closest('a,button')) playPortfolioSound('click');
    };
    const hover = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !(event.target instanceof Element)) return;
      const target = event.target.closest('a,button');
      if (!target || target.matches('[data-audio-control],.garden-gecko') || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;
      playPortfolioSound('hover');
    };
    const gecko = document.querySelector('.garden-gecko');
    let previousPhase = gecko?.getAttribute('data-phase');
    const observer = new MutationObserver(() => {
      const phase = gecko?.getAttribute('data-phase');
      if (phase === previousPhase) return;
      if (phase === 'held') playPortfolioSound('gecko-pickup');
      if (phase === 'falling') playPortfolioSound('gecko-drop');
      previousPhase = phase;
    });
    if (gecko) observer.observe(gecko, { attributes: true, attributeFilter: ['data-phase'] });
    window.addEventListener('portfolio-audio-change', updateSound);
    document.addEventListener('click', click);
    document.addEventListener('pointerover', hover, { passive: true });
    return () => {
      mounted.current = false;
      window.removeEventListener('portfolio-audio-change', updateSound);
      document.removeEventListener('click', click);
      document.removeEventListener('pointerover', hover);
      observer.disconnect();
      void disposePortfolioAudio();
    };
  }, []);

  useEffect(() => {
    if (!introOpen) {
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
      returnFocus.current = null;
      return;
    }
    document.body.classList.add('intro-is-open');
    introRef.current?.focus({ preventScroll: true });
    const timeout = window.setTimeout(closeIntro, INTRO_DURATION_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeIntro(); }
      if (event.key === 'Tab') {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.brand-intro button'));
        const first = buttons[0]; const last = buttons[buttons.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === introRef.current)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    const onVisibility = () => { if (document.hidden) closeIntro(); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(timeout);
      document.body.classList.remove('intro-is-open');
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [introOpen, introVersion, closeIntro]);

  const enableIntroSound = async () => {
    const enabled = await setAudioEnabled(true);
    if (!mounted.current) return;
    setSoundOn(enabled); setSoundError(!enabled);
    if (enabled) { setIntroVersion(value => value + 1); setIntroOpen(true); playPortfolioSound('intro'); }
  };

  return (
    <ExperienceContext.Provider value={{ soundOn, toggleSound, replay, soundError }}>
      <div className="experience-content" inert={introOpen}>{children}</div>
      {introOpen && <div key={introVersion} ref={introRef} className="brand-intro" tabIndex={-1} role="dialog" aria-modal="true" aria-label={vi ? 'Logo Lê Minh Nhật · intro 2 giây' : 'Le Minh Nhat logo · 2 second introduction'}>
        <div className="brand-intro__shutter brand-intro__shutter--top" aria-hidden="true" />
        <div className="brand-intro__shutter brand-intro__shutter--bottom" aria-hidden="true" />
        <div className="brand-intro__aura" aria-hidden="true" />
        <div className="brand-intro__rail" aria-hidden="true"><span>LN / PERSONAL PORTFOLIO</span><span>ENGINEERING × IMAGINATION</span></div>
        <div className="brand-intro__stage" aria-hidden="true">
          <div className="brand-intro__word"><span>LÊ MINH NHẬT<span className="brand-intro__period">.</span></span><small>AI ENGINEER · CREATIVE DEVELOPER</small></div>
          <div className="brand-intro__emblem"><BrandLogo /><i className="brand-intro__scan" /></div>
          <div className="brand-intro__signature"><span>LÊ MINH NHẬT</span><small>{vi ? 'TỪ Ý TƯỞNG. ĐẾN THỰC TẾ.' : 'INTELLIGENCE. MADE REAL.'}</small></div>
        </div>
        <div className="brand-intro__footer">
          <button type="button" data-audio-control onClick={closeIntro}>{vi ? 'Bỏ qua' : 'Skip'} <span>ESC ↗</span></button>
          {!soundOn && <button type="button" data-audio-control onClick={() => void enableIntroSound()}><VolumeX size={14} aria-hidden="true" />{vi ? 'Bật tiếng & xem lại' : 'Sound on & replay'}</button>}
          {soundOn && <button type="button" data-audio-control onClick={() => void toggleSound()}><Volume2 size={14} aria-hidden="true" />{vi ? 'Tắt tiếng' : 'Mute'}</button>}
        </div>
        <div className="brand-intro__progress" aria-hidden="true" />
      </div>}
    </ExperienceContext.Provider>
  );
};
