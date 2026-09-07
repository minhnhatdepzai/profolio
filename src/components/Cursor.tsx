import { useEffect, useRef } from 'react';

export const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    const finePointer = window.matchMedia('(pointer: fine)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!cursor || !label) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let frame = 0;
    const render = () => {
      frame = 0;
      if (document.hidden || motion.matches || !finePointer.matches) return;
      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(currentX - targetX) + Math.abs(currentY - targetY) > 0.2) frame = requestAnimationFrame(render);
    };
    const hide = () => {
      cursor.classList.remove('is-visible');
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (motion.matches || !finePointer.matches || document.hidden || !(event.target instanceof Element)) return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!cursor.classList.contains('is-visible')) { currentX = targetX; currentY = targetY; }
      cursor.classList.add('is-visible');
      const target = event.target.closest<HTMLElement>('[data-cursor], a, button');
      const mode = target?.dataset.cursor || (target ? 'focus' : '');
      cursor.dataset.mode = mode;
      label.textContent = mode === 'view' ? 'VIEW' : mode === 'play' ? 'PLAY' : '';
      if (!frame) frame = requestAnimationFrame(render);
    };
    const onVisibility = () => { if (document.hidden) hide(); };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', hide);
    finePointer.addEventListener('change', hide);

    return () => {
      hide();
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', hide);
      finePointer.removeEventListener('change', hide);
    };
  }, []);

  return <div ref={cursorRef} className="cursor" aria-hidden="true"><span ref={labelRef} /></div>;
};
