import { Leaf, Pause, Play, Timer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import type { GardenMode, GardenPhase } from './useGardenActivity';

type GardenControlProps = {
  mode: GardenMode;
  phase: GardenPhase;
  onToggle: () => void;
  onAuto: () => void;
};

export const GardenControl = ({ mode, phase, onToggle, onAuto }: GardenControlProps) => {
  const { lang } = useLanguage();
  const running = phase === 'playing';
  const vi = lang === 'vi';
  const label = running ? (vi ? 'Tạm dừng khu vườn' : 'Pause the garden') : (vi ? 'Bật khu vườn' : 'Wake the garden');
  const hint = phase === 'reduced'
    ? (vi ? 'Đang giảm chuyển động · bấm để bật riêng khu vườn' : 'Reduced motion · play to enable this garden')
    : phase === 'paused'
      ? (vi ? 'Đã tạm dừng · không tự bật lại' : 'Paused · stays still until you choose')
      : mode === 'auto'
        ? (running ? (vi ? 'Bạn đang nghỉ · khu vườn đang chơi' : 'You’re resting · the garden is playing') : (vi ? 'Tự thức sau 10 giây không tương tác' : 'Wakes after 10 seconds without interaction'))
        : (vi ? 'Đang chuyển động · bấm để tạm dừng' : 'Playing now · pause whenever you like');
  return (
    <div className="garden-controls">
      <p className="garden-control__hint" role="status" aria-live="polite">{hint}</p>
      <div className="garden-controls__buttons">
        <button type="button" className={`garden-control${running ? '' : ' garden-control--resting'}`} onClick={onToggle} aria-pressed={running}>
          <Leaf size={15} aria-hidden="true" /><span>{label}</span>
          {running ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
        </button>
        <button type="button" className="garden-auto" onClick={onAuto} aria-pressed={mode === 'auto'} aria-label={vi ? 'Tự động chạy sau 10 giây không tương tác' : 'Automatically play after 10 seconds of inactivity'}>
          <Timer size={13} aria-hidden="true" /><span>Auto · 10s</span>
        </button>
      </div>
    </div>
  );
};
