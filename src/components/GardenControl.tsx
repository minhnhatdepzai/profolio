import { Leaf, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const GardenControl = ({ paused, onToggle }: { paused: boolean; onToggle: () => void }) => {
  const { lang } = useLanguage();
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  const resting = paused || reduced;
  const label = reduced
    ? (lang === 'vi' ? 'Khu vườn · tĩnh' : 'Garden · still')
    : resting
      ? (lang === 'vi' ? 'Đánh thức khu vườn' : 'Wake the garden')
      : (lang === 'vi' ? 'Khu vườn đang sống' : 'The garden is alive');
  return (
    <button
      type="button"
      className={`garden-control${resting ? ' garden-control--resting' : ''}`}
      onClick={onToggle}
      disabled={reduced}
      aria-pressed={!resting}
      aria-label={reduced
        ? (lang === 'vi' ? 'Đang dùng tùy chọn giảm chuyển động của thiết bị' : 'Using your device’s reduced-motion preference')
        : (lang === 'vi' ? (paused ? 'Bật chuyển động khu vườn' : 'Tạm dừng chuyển động khu vườn') : (paused ? 'Resume garden animation' : 'Pause garden animation'))}
    >
      <Leaf size={15} aria-hidden="true" />
      <span>{label}</span>
      {resting ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
    </button>
  );
};
