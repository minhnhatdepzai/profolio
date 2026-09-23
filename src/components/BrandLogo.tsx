import { useId, type CSSProperties } from 'react';
import './brand-logo.css';

/** Original LN ligature, shared with the downloadable brand mark and favicon. */
export const BrandLogo = ({ className = '' }: { className?: string }) => {
  const id = useId().replace(/:/g, '');
  return <svg className={`brand-logo${className ? ` ${className}` : ''}`} style={{ '--ln-frame': `url(#ln-frame-${id})`, '--ln-energy': `url(#ln-energy-${id})`, '--ln-glow': `url(#ln-glow-${id})` } as CSSProperties} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`ln-frame-${id}`} x1="18" y1="15" x2="145" y2="148" gradientUnits="userSpaceOnUse"><stop stopColor="#b8ff59" /><stop offset=".42" stopColor="#647346" /><stop offset="1" stopColor="#283327" /></linearGradient>
      <linearGradient id={`ln-energy-${id}`} x1="72" y1="43" x2="122" y2="119" gradientUnits="userSpaceOnUse"><stop stopColor="#f1ffc9" /><stop offset=".45" stopColor="#c9ff4a" /><stop offset="1" stopColor="#75c92f" /></linearGradient>
      <filter id={`ln-glow-${id}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
    <path className="logo-halo" d="M80 5A75 75 0 1 1 79.9 5" />
    <path className="logo-frame" pathLength="1" d="M42 13H118Q147 13 147 42V118Q147 147 118 147H42Q13 147 13 118V42Q13 13 42 13Z" />
    <path className="logo-l" pathLength="1" d="M44 44V114H78" />
    <path className="logo-n" pathLength="1" d="M78 114V44L115 114V44" />
    <path className="logo-spark" pathLength="1" d="M127 24V36M121 30H133" />
    <circle className="logo-orbit-dot" cx="80" cy="5" r="2.5" />
  </svg>;
};
