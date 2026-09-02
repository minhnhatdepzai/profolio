import { useEffect, useRef } from 'react';

type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export const ThreeWorld = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lightweightMode = window.innerWidth < 760 || (navigator.hardwareConcurrency ?? 4) <= 2;
    if (!canvas || reducedMotion || lightweightMode) return;

    const idleWindow = window as IdleWindow;
    let cancelled = false;
    let cleanupScene = () => undefined;

    const start = async () => {
      const THREE = await import('three');
      if (cancelled) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
      camera.position.set(0, 0, 9.4);

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: window.devicePixelRatio < 2,
          powerPreference: 'high-performance',
        });
      } catch {
        canvas.classList.add('three-world--unavailable');
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const world = new THREE.Group();
      world.position.set(2.15, 0.2, 0);
      world.rotation.set(-0.12, -0.28, -0.06);
      scene.add(world);

      const lime = new THREE.MeshStandardMaterial({ color: 0xc9ff4a, roughness: 0.28, metalness: 0.58 });
      const ivory = new THREE.MeshStandardMaterial({ color: 0xf3f0e7, roughness: 0.42, metalness: 0.18 });
      const violet = new THREE.MeshStandardMaterial({ color: 0x7761ff, roughness: 0.34, metalness: 0.5 });
      const barGeometry = new THREE.BoxGeometry(0.42, 3.55, 0.5);

      const addBar = (x: number, y: number, rotation: number, material: typeof lime, scaleY = 1) => {
        const bar = new THREE.Mesh(barGeometry, material);
        bar.position.set(x, y, 0);
        bar.rotation.z = rotation;
        bar.scale.y = scaleY;
        world.add(bar);
      };

      addBar(-2.05, 0, 0, lime);
      addBar(-1.2, -1.55, Math.PI / 2, lime, 0.55);
      addBar(0.05, 0, 0, ivory);
      addBar(1.08, 0, -0.48, violet, 1.08);
      addBar(2.08, 0, 0, ivory);

      const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc9ff4a, transparent: true, opacity: 0.16 });
      const rings = [3.35, 4.2].map((radius, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 5, 150), ringMaterial);
        ring.rotation.x = Math.PI / (2.8 + index * 0.35);
        ring.rotation.y = index * 0.5;
        world.add(ring);
        return ring;
      });

      const pointGeometry = new THREE.BufferGeometry();
      const pointCount = window.innerWidth < 700 ? 80 : 160;
      const positions = new Float32Array(pointCount * 3);
      for (let index = 0; index < pointCount; index += 1) {
        const radius = 4.2 + Math.random() * 3.8;
        const theta = Math.random() * Math.PI * 2;
        positions[index * 3] = Math.cos(theta) * radius;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[index * 3 + 2] = Math.sin(theta) * radius - 2;
      }
      pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pointMaterial = new THREE.PointsMaterial({ color: 0xdfffa0, size: 0.028, transparent: true, opacity: 0.52 });
      const points = new THREE.Points(pointGeometry, pointMaterial);
      scene.add(points);

      scene.add(new THREE.HemisphereLight(0xffffff, 0x24173a, 2.3));
      const key = new THREE.PointLight(0xd7ff63, 46, 22);
      key.position.set(4.5, 4, 5);
      scene.add(key);
      const rim = new THREE.PointLight(0x7761ff, 42, 20);
      rim.position.set(-4, -2, 4);
      scene.add(rim);

      const pointer = { x: 0, y: 0 };
      let scrollProgress = 0;
      let frame = 0;
      let visible = !document.hidden;
      const clock = new THREE.Clock();

      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 720 ? 1 : 1.45));
        renderer.setSize(width, height, false);
      };

      const onPointerMove = (event: PointerEvent) => {
        pointer.x = event.clientX / window.innerWidth - 0.5;
        pointer.y = event.clientY / window.innerHeight - 0.5;
      };
      const onScroll = () => {
        const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        scrollProgress = Math.min(1, scrollY / range);
      };
      const render = () => {
        if (!visible) return;
        const elapsed = clock.getElapsedTime();
        world.rotation.y += (pointer.x * 0.28 + scrollProgress * Math.PI * 1.35 - world.rotation.y) * 0.035;
        world.rotation.x += (-pointer.y * 0.18 - 0.08 - world.rotation.x) * 0.035;
        world.position.y = 0.2 + Math.sin(elapsed * 0.58) * 0.08 - scrollProgress * 1.5;
        world.position.x = (window.innerWidth < 800 ? 0.4 : 2.15) - scrollProgress * 4.2;
        rings[0].rotation.z = elapsed * 0.07;
        rings[1].rotation.z = -elapsed * 0.05;
        points.rotation.y = elapsed * 0.012;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };
      const onVisibility = () => {
        visible = !document.hidden;
        if (visible) {
          clock.start();
          frame = requestAnimationFrame(render);
        }
      };

      resize();
      onScroll();
      window.addEventListener('resize', resize, { passive: true });
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('scroll', onScroll, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      frame = requestAnimationFrame(render);

      cleanupScene = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        document.removeEventListener('visibilitychange', onVisibility);
        barGeometry.dispose();
        rings.forEach((ring) => ring.geometry.dispose());
        pointGeometry.dispose();
        lime.dispose();
        ivory.dispose();
        violet.dispose();
        ringMaterial.dispose();
        pointMaterial.dispose();
        renderer.dispose();
      };
    };

    const idleHandle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(() => void start(), { timeout: 900 })
      : window.setTimeout(() => void start(), 250);

    return () => {
      cancelled = true;
      if (idleWindow.cancelIdleCallback && idleWindow.requestIdleCallback) idleWindow.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      cleanupScene();
    };
  }, []);

  return <canvas ref={canvasRef} className="three-world" aria-hidden="true" />;
};
