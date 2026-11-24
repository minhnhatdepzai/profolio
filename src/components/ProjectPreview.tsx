import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { FeaturedProject } from '../data/projects';
import { resolvePreviewUrl, youtubeEmbedUrl } from './projectPreviewPolicy';
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
  const isYoutube = project.preview.kind === 'youtube';
  const poster = resolvePreviewUrl(project.preview.poster, import.meta.env.BASE_URL);
  const videoSource = project.preview.kind === 'local'
    ? resolvePreviewUrl(project.preview.video, import.meta.env.BASE_URL)
    : undefined;
  const sourceLoaded = project.preview.kind === 'local' && (preload || active || explicitRequested);

  const startPlayback = useCallback((explicit = false) => {
    if (!explicit && playbackFailed) return;
    if (explicit) setPlaybackFailed(false);

    if (isYoutube) {
      setReady(false);
      setPaused(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    const token = ++activationTokenRef.current;
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
  }, [isYoutube, onDeactivate, playbackFailed]);

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
    if (isYoutube) return;
    if (sourceLoaded) return;
    const video = videoRef.current;
    if (!video) return;
    video.removeAttribute('src');
    video.load();
  }, [isYoutube, sourceLoaded]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) resetPlayback();
      else if (active && (isYoutube || sourceLoaded)) startPlayback();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [active, isYoutube, resetPlayback, sourceLoaded, startPlayback]);

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
    if (active && !paused) {
      activationTokenRef.current += 1;
      if (video && !video.paused) video.pause();
      setReady(false);
      setPaused(true);
      return;
    }

    if (!isYoutube && !sourceLoaded && video && videoSource) {
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
      {project.preview.kind === 'youtube' ? (
        active && !paused && (
          <iframe
            className={`project-preview__youtube${ready ? ' is-ready' : ''}`}
            src={youtubeEmbedUrl(project.preview.youtubeId)}
            title={`${project.title} — ${getStr(project.preview.sourceLabel)}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="eager"
            aria-hidden="true"
            tabIndex={-1}
            onLoad={() => {
              if (!active) return;
              setReady(true);
              setPaused(false);
            }}
            onError={() => {
              setPlaybackFailed(true);
              setReady(false);
              setPaused(true);
              onDeactivate();
            }}
          />
        )
      ) : (
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
      )}
      <div className="project-preview__status" aria-hidden="true">
        <i />
        <span>{project.preview.kind === 'youtube'
          ? (lang === 'vi' ? 'YOUTUBE · VIDEO THẬT' : 'YOUTUBE · REAL DEMO')
          : (lang === 'vi' ? 'VIDEO GIỚI THIỆU' : 'VIDEO PREVIEW')}</span>
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
