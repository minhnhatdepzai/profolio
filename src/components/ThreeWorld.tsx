import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './cinematic-motion.css';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Decorative enhancement; the hero is complete before the optional 3D bundle arrives. */
export const ThreeWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    setStage(document.querySelector<HTMLElement>('.hero-stage'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    const syncEnhancement = () => setEnhanced(
      !motion.matches && desktop.matches && (navigator.hardwareConcurrency ?? 4) > 2,
    );
    syncEnhancement();
    motion.addEventListener('change', syncEnhancement);
    desktop.addEventListener('change', syncEnhancement);
    return () => {
      motion.removeEventListener('change', syncEnhancement);
      desktop.removeEventListener('change', syncEnhancement);
    };
  }, []);

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
      camera.position.set(0, 0.15, 10.5);

      // Procedural studio panels produce broad chrome reflections without a remote HDRI.
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

      const sculpture = new THREE.Group();
      sculpture.rotation.set(0.22, -0.35, -0.3);
      scene.add(sculpture);
      const chrome = new THREE.MeshStandardMaterial({ color: 0xe5e7df, metalness: 1, roughness: 0.17, envMapIntensity: 1.5 });
      const acid = new THREE.MeshStandardMaterial({ color: 0xc9ff4a, metalness: 0.45, roughness: 0.23, emissive: 0x607d14, emissiveIntensity: 0.25 });
      const wire = new THREE.MeshBasicMaterial({ color: 0xc9ff4a, transparent: true, opacity: 0.52 });
      const silverWire = new THREE.MeshBasicMaterial({ color: 0xe2e5da, transparent: true, opacity: 0.22 });
      const knotGeometry = new THREE.TorusKnotGeometry(1.43, 0.39, 192, 24, 2, 3);
      const knot = new THREE.Mesh(knotGeometry, chrome);
      knot.scale.set(0.96, 1.06, 0.96);
      sculpture.add(knot);
      const coreGeometry = new THREE.IcosahedronGeometry(0.36, 1);
      const core = new THREE.Mesh(coreGeometry, acid);
      sculpture.add(core);

      const orbitGeometry = new THREE.TorusGeometry(2.64, 0.009, 5, 160);
      const orbit = new THREE.Mesh(orbitGeometry, silverWire);
      orbit.rotation.set(0.7, -0.38, 0.2);
      sculpture.add(orbit);
      const arcGeometry = new THREE.TorusGeometry(2.65, 0.023, 6, 80, Math.PI * 0.38);
      const arc = new THREE.Mesh(arcGeometry, wire);
      orbit.add(arc);
      const dial = new THREE.Group();
      dial.rotation.set(0.18, 0.35, 0);
      sculpture.add(dial);
      const tickGeometry = new THREE.BoxGeometry(0.014, 0.075, 0.014);
      const ticks = new THREE.InstancedMesh(tickGeometry, silverWire, 48);
      const tick = new THREE.Object3D();
      for (let index = 0; index < 48; index += 1) {
        const angle = index / 48 * Math.PI * 2;
        tick.position.set(Math.sin(angle) * 2.95, Math.cos(angle) * 2.95, 0);
        tick.rotation.z = -angle;
        tick.scale.y = index % 4 === 0 ? 1.75 : 1;
        tick.updateMatrix();
        ticks.setMatrixAt(index, tick.matrix);
      }
      dial.add(ticks);
      const key = new THREE.DirectionalLight(0xf0eee6, 3);
      key.position.set(-3, 5, 5);
      scene.add(key, new THREE.AmbientLight(0xffffff, 0.5));

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
      const canRender = () => !cancelled && !failed && isIntersecting && !document.hidden;
      const resize = () => {
        const { width, height } = stage.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
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
        sculpture.rotation.y += (-0.35 + pointerX * 0.32 + scrollProgress * 1.75 - sculpture.rotation.y) * easing;
        sculpture.rotation.x += (0.22 + pointerY * 0.16 + scrollProgress * 0.5 - sculpture.rotation.x) * easing;
        sculpture.rotation.z = -0.3 + Math.sin(elapsed * 0.16) * 0.045;
        sculpture.position.y = Math.sin(elapsed * 0.55) * 0.1 + scrollProgress * 0.25;
        knot.rotation.z = elapsed * 0.055;
        core.rotation.set(elapsed * 0.15, elapsed * 0.22, 0);
        orbit.rotation.z = elapsed * 0.085;
        dial.rotation.z = -elapsed * 0.035;
        camera.position.z += (10.5 - scrollProgress * 2 - camera.position.z) * easing;
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
        [knotGeometry, coreGeometry, orbitGeometry, arcGeometry, tickGeometry].forEach((geometry) => geometry.dispose());
        [chrome, acid, wire, silverWire].forEach((material) => material.dispose());
        environment.dispose();
        ticks.dispose();
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
