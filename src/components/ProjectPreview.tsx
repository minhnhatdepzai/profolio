import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { FeaturedProject } from '../data/projects';
import { resolvePreviewUrl } from './projectPreviewPolicy';
import './project-preview.css';

interface ProjectPreviewProps {
  project: FeaturedProject;
  active: boolean;
  preload?: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export const ProjectPreview = ({ project, active, preload = false, onActivate, onDeactivate }: ProjectPreviewProps) => {
  const { getStr, lang } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activationTokenRef = useRef(0);
  const explicitStartRef = useRef(false);
  const [explicitRequested, setExplicitRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(true);
  const [playbackFailed, setPlaybackFailed] = useState(false);
  const poster = resolvePreviewUrl(project.preview.poster, import.meta.env.BASE_URL);
  const videoSource = resolvePreviewUrl(project.preview.video, import.meta.env.BASE_URL);
  const sourceLoaded = preload || active || explicitRequested;

  const startPlayback = useCallback((explicit = false) => {
    const video = videoRef.current;
    if (!video) return;
    if (!explicit && playbackFailed) return;

    const token = ++activationTokenRef.current;
    if (explicit) setPlaybackFailed(false);
    const playPromise = video.play();
    playPromise?.then(() => {
      if (token !== activationTokenRef.current) return;
      setPaused(false);
    }).catch(() => {
      if (token !== activationTokenRef.current) return;
      setPlaybackFailed(true);
      setReady(false);
      setPaused(true);
      onDeactivate();
    });
  }, [onDeactivate, playbackFailed]);

  const resetPlayback = useCallback(() => {
    activationTokenRef.current += 1;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setReady(false);
    setPaused(true);
  }, []);

  useEffect(() => {
    if (!active) {
      resetPlayback();
      if (!preload) setExplicitRequested(false);
      return;
    }
    if (explicitStartRef.current) {
      explicitStartRef.current = false;
      return;
    }
    startPlayback();
  }, [active, preload, resetPlayback, startPlayback]);

  useEffect(() => {
    if (sourceLoaded) return;
    const video = videoRef.current;
    if (!video) return;
    video.removeAttribute('src');
    video.load();
  }, [sourceLoaded]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) resetPlayback();
      else if (active && sourceLoaded) startPlayback();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [active, resetPlayback, sourceLoaded, startPlayback]);

  useEffect(() => () => {
    activationTokenRef.current += 1;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (active && video && !video.paused) {
      activationTokenRef.current += 1;
      video.pause();
      setPaused(true);
      return;
    }

    if (!sourceLoaded) {
      setExplicitRequested(true);
      video.src = videoSource;
      video.load();
    }
    explicitStartRef.current = true;
    onActivate();
    startPlayback(true);
  };

  const controlLabel = active && !paused
    ? (lang === 'vi' ? 'Tạm dừng video' : 'Pause preview')
    : (playbackFailed
      ? (lang === 'vi' ? 'Phát lại video' : 'Replay preview')
      : (lang === 'vi' ? 'Phát video giới thiệu' : 'Play preview'));

  return (
    <div
      ref={rootRef}
      className={`project-preview${active ? ' is-active' : ''}${playbackFailed ? ' has-failed' : ''}`}
      data-preview-slug={project.slug}
    >
      <img
        className="project-preview__poster"
        src={poster}
        alt={getStr(project.preview.alt)}
        loading="lazy"
        decoding="async"
      />
      <video
        ref={videoRef}
        className={`project-preview__video${ready ? ' is-ready' : ''}`}
        src={sourceLoaded ? videoSource : undefined}
        poster={poster}
        muted
        playsInline
        loop
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => {
          if (!active) return;
          setReady(true);
          setPaused(false);
        }}
        onPause={() => setPaused(true)}
        onError={() => {
          setPlaybackFailed(true);
          setReady(false);
          setPaused(true);
          onDeactivate();
        }}
      />
      <div className="project-preview__status" aria-hidden="true">
        <i />
        <span>{lang === 'vi' ? 'VIDEO GIỚI THIỆU' : 'VIDEO PREVIEW'}</span>
      </div>
      <span className="project-preview__source">{getStr(project.preview.sourceLabel)}</span>
      <button
        type="button"
        className="project-preview__control"
        aria-label={`${controlLabel}: ${project.title}`}
        onClick={(event) => {
          event.stopPropagation();
          togglePlayback();
        }}
      >
        {active && !paused ? <Pause aria-hidden="true" /> : (playbackFailed ? <RotateCcw aria-hidden="true" /> : <Play aria-hidden="true" />)}
      </button>
    </div>
  );
};
