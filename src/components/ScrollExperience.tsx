import { useEffect } from 'react';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export const ScrollExperience = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const progress = document.querySelector<HTMLElement>('.scroll-progress__bar');
    let progressFrame = 0;
    const updateProgress = () => {
      progressFrame = 0;
      const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progress?.style.setProperty('transform', `scaleX(${Math.min(1, scrollY / range)})`);
    };
    const onScroll = () => {
      if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateProgress();

    const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    reveals.forEach((element) => revealObserver.observe(element));

    if (reducedMotion || window.innerWidth < 800) {
      reveals.forEach((element) => element.classList.add('is-revealed'));
      return () => {
        cancelAnimationFrame(progressFrame);
        window.removeEventListener('scroll', onScroll);
        revealObserver.disconnect();
      };
    }

    const idleWindow = window as IdleWindow;
    let cancelled = false;
    let cleanupGsap = () => undefined;
    const enhanceScroll = async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.case-study__artifact-inner').forEach((artifact) => {
          gsap.fromTo(artifact, { yPercent: -4, rotateZ: -0.35 }, {
            yPercent: 4,
            rotateZ: 0.35,
            ease: 'none',
            scrollTrigger: { trigger: artifact.closest('.case-study'), start: 'top bottom', end: 'bottom top', scrub: 0.8 },
          });
        });
        gsap.to('.about-orbit', {
          rotate: 35,
          ease: 'none',
          scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      });
      cleanupGsap = () => context.revert();
      ScrollTrigger.refresh();
    };

    const idleHandle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(() => void enhanceScroll(), { timeout: 1400 })
      : window.setTimeout(() => void enhanceScroll(), 650);

    return () => {
      cancelled = true;
      cancelAnimationFrame(progressFrame);
      window.removeEventListener('scroll', onScroll);
      revealObserver.disconnect();
      if (idleWindow.cancelIdleCallback && idleWindow.requestIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      cleanupGsap();
    };
  }, []);

  return null;
};
