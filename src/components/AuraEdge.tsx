import { useEffect, useState } from 'react';
import { EdgeAura } from 'edge-aura/react';
import type { EdgeAuraPaletteName } from 'edge-aura';

/**
 * Organic glow hugging the viewport edges, tinted by the current time band.
 *
 * The ring is decorative, so it stays out of the way of everything that
 * matters: it sits under the navigation, never takes pointer events, and the
 * library's own `prefers-reduced-motion` path freezes it to a static frame.
 * It also stands down while the garden is paused or a dialog is open, so the
 * reader's explicit "stop moving" applies to the whole page, not just the 3D.
 */
export const AuraEdge = ({ palette, suspended = false }: { palette: EdgeAuraPaletteName; suspended?: boolean }) => {
  const [mounted, setMounted] = useState(false);

  // Let the page paint and settle before a full-viewport canvas joins the frame.
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 900);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return (
    <EdgeAura
      palette={palette}
      active={!suspended}
      quiescentFps={20}
      className="site-aura"
      style={{ zIndex: 3 }}
    />
  );
};
