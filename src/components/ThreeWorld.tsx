import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createTerrarium } from './createTerrarium';
import './cinematic-motion.css';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Decorative enhancement; the hero is complete before the optional 3D bundle arrives. */
export const ThreeWorld = ({ paused = false, motionAllowed = true }: { paused?: boolean; motionAllowed?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const [enhanced, setEnhanced] = useState(false);
  const pausedRef = useRef(paused);
  const playbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    playbackRef.current?.();
  }, [paused]);

  useEffect(() => {
    setStage(document.querySelector<HTMLElement>('.hero-stage'));
    const desktop = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const syncEnhancement = () => setEnhanced(
      motionAllowed && desktop.matches && (navigator.hardwareConcurrency ?? 4) > 2,
    );
    syncEnhancement();
    desktop.addEventListener('change', syncEnhancement);
    return () => {
      desktop.removeEventListener('change', syncEnhancement);
    };
  }, [motionAllowed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!stage || !canvas || !enhanced) return;

    const idleWindow = window as IdleWindow;
    let cancelled = false;
    let cleanupScene = () => {};

    const start = async () => {
      const THREE = await import('three');
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return;
      }
      cleanupScene = () => renderer.dispose();
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 40);
      camera.position.set(0, 0.12, 9.4);

      // A small procedural light studio gives eyes and leaves gentle reflections.
      const studio = new THREE.Scene();
      studio.background = new THREE.Color(0x252724);
      const panelGeometry = new THREE.PlaneGeometry(1, 1);
      const whitePanel = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      const warmPanel = new THREE.MeshBasicMaterial({ color: 0xd8ddca, side: THREE.DoubleSide });
      const acidPanel = new THREE.MeshBasicMaterial({ color: 0xc9ff4a, side: THREE.DoubleSide });
      const panel = (x: number, y: number, z: number, width: number, height: number, material: typeof whitePanel) => {
        const light = new THREE.Mesh(panelGeometry, material);
        light.position.set(x, y, z);
        light.scale.set(width, height, 1);
        light.lookAt(0, 0, 0);
        studio.add(light);
      };
      panel(-4, 2, 4, 3, 10, whitePanel);
      panel(4, 0, 2, 1.6, 9, whitePanel);
      panel(0, 6, -1, 8, 3, warmPanel);
      panel(-2, -3, -4, 6, 1.6, whitePanel);
      panel(5, -2, -2, 1.2, 6, acidPanel);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(studio, 0.035, 0.1, 30, { size: 128 });
      scene.environment = environment.texture;
      panelGeometry.dispose();
      whitePanel.dispose();
      warmPanel.dispose();
      acidPanel.dispose();
      pmrem.dispose();

      const habitat = createTerrarium(THREE);
      const sculpture = habitat.world;
      sculpture.rotation.set(0.12, -0.12, -0.035);
      scene.add(sculpture);
      const key = new THREE.DirectionalLight(0xfff0d2, 2.6);
      key.position.set(-3, 5, 5);
      const rim = new THREE.DirectionalLight(0xc8f5a9, 2.2);
      rim.position.set(3, 2, -3);
      scene.add(key, rim, new THREE.HemisphereLight(0xe8f6df, 0x283929, 1.75));

      let frame = 0;
      let isIntersecting = false;
      let previousTime = 0;
      let elapsed = 0;
      let scrollProgress = 0;
      let pointerX = 0;
      let pointerY = 0;
      let ready = false;
      let failed = false;
      const hero = stage.closest<HTMLElement>('.hero') ?? stage;
      const canRender = () => !cancelled && !failed && isIntersecting && !document.hidden && (!pausedRef.current || !ready);
      const resize = () => {
        const { width, height } = stage.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        // Resizing clears the canvas, even when the garden is resting.
        if (ready && pausedRef.current && !failed && !document.hidden) renderer.render(scene, camera);
      };
      const onScroll = () => {
        const rect = hero.getBoundingClientRect();
        scrollProgress = THREE.MathUtils.clamp(-rect.top / Math.max(1, rect.height), 0, 1);
      };
      const render = (time: number) => {
        frame = 0;
        if (!canRender()) return;
        const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
        previousTime = time;
        elapsed += delta;
        const easing = 1 - Math.exp(-delta * 4);
        sculpture.rotation.y += (-0.12 + pointerX * 0.18 + scrollProgress * 0.72 - sculpture.rotation.y) * easing;
        sculpture.rotation.x += (0.12 + pointerY * 0.07 + scrollProgress * 0.15 - sculpture.rotation.x) * easing;
        sculpture.rotation.z = -0.035 + Math.sin(elapsed * 0.27) * 0.018;
        sculpture.position.y = Math.sin(elapsed * 0.58) * 0.065 + scrollProgress * 0.18;
        habitat.animate(elapsed, pointerX, pointerY);
        camera.position.z += (9.4 - scrollProgress * 0.8 - camera.position.z) * easing;
        renderer.render(scene, camera);
        if (!ready) { ready = true; stage.classList.add('has-three-world'); }
        frame = requestAnimationFrame(render);
      };
      const syncPlayback = () => {
        if (canRender()) {
          if (!frame) { previousTime = 0; frame = requestAnimationFrame(render); }
        } else { cancelAnimationFrame(frame); frame = 0; }
        stage.classList.toggle('has-three-world', ready && !failed && !cancelled);
      };
      playbackRef.current = syncPlayback;
      const onPointer = (event: PointerEvent) => {
        if (!isIntersecting) return;
        const rect = stage.getBoundingClientRect();
        pointerX = THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width - 0.5, -0.8, 0.8);
        pointerY = THREE.MathUtils.clamp((event.clientY - rect.top) / rect.height - 0.5, -0.8, 0.8);
      };
      const resetPointer = () => { pointerX = 0; pointerY = 0; };
      const onContextLost = () => { failed = true; syncPlayback(); };
      const intersection = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncPlayback();
      }, { threshold: 0 });
      const dimensions = new ResizeObserver(resize);
      intersection.observe(hero);
      dimensions.observe(stage);
      resize();
      onScroll();
      hero.addEventListener('pointermove', onPointer, { passive: true });
      hero.addEventListener('pointerleave', resetPointer);
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', syncPlayback);
      canvas.addEventListener('webglcontextlost', onContextLost);

      cleanupScene = () => {
        cancelAnimationFrame(frame);
        intersection.disconnect();
        dimensions.disconnect();
        hero.removeEventListener('pointermove', onPointer);
        hero.removeEventListener('pointerleave', resetPointer);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', syncPlayback);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        stage.classList.remove('has-three-world');
        playbackRef.current = null;
        habitat.dispose();
        environment.dispose();
        renderer.dispose();
      };
    };

    const run = () => void start().catch(() => { cleanupScene(); stage.classList.remove('has-three-world'); });
    const idleHandle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(run, { timeout: 700 })
      : window.setTimeout(run, 180);
    return () => {
      cancelled = true;
      if (idleWindow.cancelIdleCallback && idleWindow.requestIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      cleanupScene();
    };
  }, [stage, enhanced]);

  return stage ? createPortal(<canvas ref={canvasRef} className="three-world" aria-hidden="true" />, stage) : null;
};
