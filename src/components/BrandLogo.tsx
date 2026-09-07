import './brand-logo.css';

/** Original LN ligature, shared with the downloadable brand mark and favicon. */
export const BrandLogo = ({ className = '' }: { className?: string }) => (
  <svg className={`brand-logo${className ? ` ${className}` : ''}`} viewBox="0 0 160 160" aria-hidden="true" focusable="false">
    <path className="logo-frame" pathLength="1" d="M42 13H118Q147 13 147 42V118Q147 147 118 147H42Q13 147 13 118V42Q13 13 42 13Z" />
    <path className="logo-l" pathLength="1" d="M44 44V114H78" />
    <path className="logo-n" pathLength="1" d="M78 114V44L115 114V44" />
    <path className="logo-spark" pathLength="1" d="M127 24V36M121 30H133" />
  </svg>
);
