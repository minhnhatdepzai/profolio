export type ProjectPreviewMode = 'poster' | 'hover' | 'scroll';

export interface PreviewEnvironment {
  finePointer: boolean;
  touch: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  effectiveType?: string;
}

export interface PreviewCandidate {
  slug: string;
  top: number;
  bottom: number;
  intersectionRatio: number;
}

export function resolvePreviewUrl(path: string, baseUrl: string): string {
  const normalizedBase = `/${baseUrl.replace(/^\/+|\/+$/g, '')}`;
  const base = normalizedBase === '/' ? '' : normalizedBase;
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function youtubeEmbedUrl(youtubeId: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    controls: '0',
    loop: '1',
    playlist: youtubeId,
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
  });

  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?${params}`;
}

export function autoplayMode(environment: PreviewEnvironment): ProjectPreviewMode {
  const constrainedConnection = environment.effectiveType === '2g' || environment.effectiveType === 'slow-2g';

  if (environment.reducedMotion || environment.saveData || constrainedConnection) {
    return 'poster';
  }

  if (environment.finePointer) {
    return 'hover';
  }

  if (environment.touch) {
    return 'scroll';
  }

  return 'poster';
}

export function pickCenteredPreview(candidates: PreviewCandidate[], viewportHeight: number): string | null {
  const viewportCenter = viewportHeight / 2;
  let selected: { slug: string; distance: number } | null = null;

  for (const candidate of candidates) {
    const visible = candidate.intersectionRatio >= 0.15 && candidate.bottom > 0 && candidate.top < viewportHeight;
    if (!visible) continue;

    const center = (candidate.top + candidate.bottom) / 2;
    const distance = Math.abs(center - viewportCenter);
    if (!selected || distance < selected.distance) {
      selected = { slug: candidate.slug, distance };
    }
  }

  return selected?.slug ?? null;
}
