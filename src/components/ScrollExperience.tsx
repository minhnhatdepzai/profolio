import { useEffect } from 'react';
import './cinematic-motion.css';

export const ScrollExperience = () => {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const progress = document.querySelector<HTMLElement>('.scroll-progress__bar');
    const hero = document.querySelector<HTMLElement>('.hero');
    const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
    let frame = 0;
    let activeCard: HTMLElement | null = null;
    let activeMagnet: HTMLElement | null = null;
    const reveals = new Set<HTMLElement>();

    const updateScroll = () => {
      frame = 0;
      const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progress?.style.setProperty('transform', `scaleX(${Math.min(1, scrollY / range)})`);
      if (!hero || !heroCopy) return;
      const amount = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight));
      const enhanced = !motion.matches && desktop.matches;
      heroCopy.style.translate = enhanced ? `0 ${amount * 65}px` : '';
      heroCopy.style.opacity = enhanced ? `${1 - amount * 0.7}` : '';
    };
    const scheduleScroll = () => {
      if (!frame && !document.hidden) frame = requestAnimationFrame(updateScroll);
    };

    document.documentElement.classList.add('has-scroll-reveals');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
        reveals.delete(entry.target as HTMLElement);
      });
    }, { rootMargin: '0px 0px -35px 0px', threshold: 0.06 });
    const registerReveal = (element: HTMLElement) => {
      if (reveals.has(element) || element.classList.contains('is-revealed')) return;
      if (motion.matches) element.classList.add('is-revealed');
      else { reveals.add(element); revealObserver.observe(element); }
    };
    const scan = (element: Element | Document) => {
      if (element instanceof HTMLElement && element.matches('[data-reveal]')) registerReveal(element);
      element.querySelectorAll<HTMLElement>('[data-reveal]').forEach(registerReveal);
    };
    scan(document);
    // Filters and project dialogs can introduce new cards after the first render.
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => { if (node instanceof Element) scan(node); });
        record.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          reveals.forEach((element) => {
            if (element === node || node.contains(element)) { revealObserver.unobserve(element); reveals.delete(element); }
          });
        });
      });
      scheduleScroll();
    });
    mutations.observe(document.querySelector('.site-shell') ?? document.body, { childList: true, subtree: true });

    const resetCard = () => {
      activeCard?.classList.remove('is-pointer-active');
      ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'].forEach((property) => activeCard?.style.removeProperty(property));
      activeCard = null;
    };
    const resetMagnet = () => {
      if (activeMagnet) activeMagnet.style.translate = '';
      activeMagnet = null;
    };
    const resetPointer = () => { resetCard(); resetMagnet(); };
    const onPointer = (event: PointerEvent) => {
      if (motion.matches || !desktop.matches || document.hidden || !(event.target instanceof Element)) return;
      const card = event.target.closest<HTMLElement>('.project-card')?.querySelector<HTMLElement>('.project-card__visual') ?? null;
      if (card !== activeCard) resetCard();
      if (card) {
        activeCard = card;
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 4}deg`);
        card.style.setProperty('--tilt-y', `${(x - 0.5) * 4}deg`);
        card.style.setProperty('--pointer-x', `${x * 100}%`);
        card.style.setProperty('--pointer-y', `${y * 100}%`);
        card.classList.add('is-pointer-active');
      }
      const magnet = event.target.closest<HTMLElement>('[data-magnetic]');
      if (magnet !== activeMagnet) resetMagnet();
      if (magnet) {
        activeMagnet = magnet;
        const rect = magnet.getBoundingClientRect();
        magnet.style.translate = `${(event.clientX - rect.left - rect.width / 2) * 0.13}px ${(event.clientY - rect.top - rect.height / 2) * 0.18}px`;
      }
    };
    const onPreference = () => {
      resetPointer();
      if (motion.matches) reveals.forEach((element) => element.classList.add('is-revealed'));
      updateScroll();
    };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; resetPointer(); }
      else scheduleScroll();
    };

    updateScroll();
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer);
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener('change', onPreference);
    desktop.addEventListener('change', onPreference);

    return () => {
      cancelAnimationFrame(frame);
      resetPointer();
      mutations.disconnect();
      revealObserver.disconnect();
      document.documentElement.classList.remove('has-scroll-reveals');
      if (heroCopy) { heroCopy.style.translate = ''; heroCopy.style.opacity = ''; }
      window.removeEventListener('scroll', scheduleScroll);
      window.removeEventListener('resize', scheduleScroll);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', onPreference);
      desktop.removeEventListener('change', onPreference);
    };
  }, []);

  return null;
};
