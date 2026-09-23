import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createEarthScene, openingLongitude } from "./createEarthScene";
import { viewerLongitude } from "./solarPosition";

export type ObservatoryState = {
  autoRotate: boolean;
  motionAllowed: boolean;
  suspended: boolean;
};
export type Observatory = Awaited<ReturnType<typeof createObservatory>>;
const MIN_ZOOM = 0.055;
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export async function createObservatory(
  canvas: HTMLCanvasElement,
  labels: HTMLDivElement,
  state: () => ObservatoryState,
  onZoom: (value: number) => void,
  onTour: (value: boolean) => void,
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(
    Math.min(
      devicePixelRatio,
      matchMedia("(max-width: 760px)").matches ? 1.35 : 1.75,
    ),
  );
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.setClearColor(0x020408, 1);
  let earth: Awaited<ReturnType<typeof createEarthScene>>;
  try {
    earth = await createEarthScene(
      THREE,
      openingLongitude(new Date(), viewerLongitude()),
    );
  } catch (error) {
    renderer.dispose();
    throw error;
  }
  const scene = new THREE.Scene();
  scene.add(earth.group);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.06, 600);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.rotateSpeed = 0.42;
  controls.zoomSpeed = 0.75;
  controls.target.copy(earth.earthPosition);
  const homeDirection = earth.sunDirection
    .clone()
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), 1.02)
    .normalize();
  homeDirection.y += 0.12;
  homeDirection.normalize();
  camera.position.copy(controls.target).addScaledVector(homeDirection, 4.6);
  controls.update();

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.65, 1.08);
  const output = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(bloom);
  composer.addPass(output);
  let baseDistance = 4.6,
    zoom = 1,
    frame = 0,
    last = performance.now(),
    disposed = false;
  let updating = false,
    tour = false,
    tourTime = 0;
  let flight: {
    start: THREE.Vector3;
    target: THREE.Vector3;
    end: THREE.Vector3;
    endTarget: THREE.Vector3;
    elapsed: number;
    duration: number;
  } | null = null;
  const origin = new THREE.Vector3();
  const offset = new THREE.Vector3();
  const target = new THREE.Vector3();
  const projected = new THREE.Vector3();
  const world = new THREE.Vector3();
  const labelNodes = earth.bodies.map((body) => {
    const node = document.createElement("span");
    node.className = "planet-label";
    node.textContent = body.name.toUpperCase();
    labels.appendChild(node);
    return { body, node };
  });
  let lastZoom = -1;
  const render = () => {
    if (disposed || document.hidden) return;
    earth.update(0, camera);
    composer.render();
    zoom = baseDistance / camera.position.distanceTo(controls.target);
    const rounded = Math.round(zoom * 1000) / 1000;
    if (rounded !== lastZoom) {
      onZoom(rounded);
      lastZoom = rounded;
    }
    const width = canvas.clientWidth,
      height = canvas.clientHeight;
    labelNodes.forEach(({ body, node }) => {
      body.object.getWorldPosition(world);
      projected.copy(world).project(camera);
      const x = (projected.x * 0.5 + 0.5) * width,
        y = (-projected.y * 0.5 + 0.5) * height;
      const radius =
        ((body.radius / camera.position.distanceTo(world)) * height) /
        Math.tan(THREE.MathUtils.degToRad(19)) /
        2;
      const visible =
        zoom < 0.24 &&
        projected.z < 1 &&
        projected.z > 0 &&
        x > 35 &&
        x < width - 35 &&
        y > 45 &&
        y < height - 80;
      node.style.opacity = visible
        ? String(1 - THREE.MathUtils.smoothstep(zoom, 0.14, 0.24))
        : "0";
      node.style.transform = `translate(${x}px,${y + radius + 12}px) translateX(-50%)`;
    });
  };
  const allowed = () =>
    state().motionAllowed && !state().suspended && !document.hidden;
  const wideZoom = () => Math.min(0.068, MIN_ZOOM * Math.max(1, camera.aspect));
  const stopTour = () => {
    if (tour) {
      tour = false;
      onTour(false);
    }
  };
  const frameCamera = (value: number, direction?: THREE.Vector3) => {
    const bounded = THREE.MathUtils.clamp(value, MIN_ZOOM, 1.65);
    const reveal = 1 - THREE.MathUtils.smoothstep(bounded, 0.1, 0.5);
    target.lerpVectors(earth.earthPosition, origin, reveal);
    offset
      .copy(direction ?? camera.position.clone().sub(controls.target))
      .normalize();
    controls.target.copy(target);
    camera.position
      .copy(target)
      .addScaledVector(offset, baseDistance / bounded);
    updating = true;
    controls.update();
    updating = false;
  };
  const tick = (now: number) => {
    frame = 0;
    if (disposed || !allowed()) return;
    const dt = Math.min((now - last) / 1000, 0.2);
    last = now;
    if (state().autoRotate) earth.update(Math.min(dt, 0.05), camera);
    if (tour) {
      tourTime += dt;
      // 26 seconds: linger at home, pull back, orbit the full system, return.
      const t = tourTime % 26;
      const reveal =
        t < 4
          ? 0
          : t < 14
            ? ease((t - 4) / 10)
            : t < 20
              ? 1
              : 1 - ease((t - 20) / 6);
      const z = Math.exp(
        THREE.MathUtils.lerp(Math.log(1.2), Math.log(wideZoom()), reveal),
      );
      const az = 0.08 + Math.sin(tourTime * 0.08) * 0.22;
      const elevation = THREE.MathUtils.lerp(0.12, 0.72, reveal);
      const wideDirection = new THREE.Vector3(
        Math.sin(az),
        elevation,
        Math.cos(az),
      );
      frameCamera(
        z,
        homeDirection.clone().lerp(wideDirection, reveal).normalize(),
      );
    } else if (flight) {
      flight.elapsed += dt;
      const p = ease(Math.min(1, flight.elapsed / flight.duration));
      camera.position.lerpVectors(flight.start, flight.end, p);
      controls.target.lerpVectors(flight.target, flight.endTarget, p);
      updating = true;
      controls.update();
      updating = false;
      if (p === 1) flight = null;
    }
    render();
    if (state().autoRotate || tour || flight)
      frame = requestAnimationFrame(tick);
  };
  const refresh = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!state().motionAllowed) {
      stopTour();
      flight = null;
    }
    render();
    if (allowed() && (state().autoRotate || tour || flight)) {
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };
  const travel = (value: number, wide = false) => {
    stopTour();
    const start = camera.position.clone(),
      startTarget = controls.target.clone();
    frameCamera(value, wide ? new THREE.Vector3(0.12, 0.74, 1) : undefined);
    const end = camera.position.clone(),
      endTarget = controls.target.clone();
    if (allowed()) {
      camera.position.copy(start);
      controls.target.copy(startTarget);
      flight = {
        start,
        target: startTarget,
        end,
        endTarget,
        elapsed: 0,
        duration: wide ? 2.8 : 1.1,
      };
      updating = true;
      controls.update();
      updating = false;
    }
    refresh();
  };
  const onChange = () => {
    if (updating || disposed) return;
    const value = baseDistance / camera.position.distanceTo(controls.target);
    frameCamera(value);
    render();
  };
  const onStart = () => {
    stopTour();
    flight = null;
  };
  controls.addEventListener("change", onChange);
  controls.addEventListener("start", onStart);
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    composer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    baseDistance = Math.max(4.6, 4.6 / Math.min(camera.aspect, 1));
    controls.minDistance = baseDistance / 1.65;
    controls.maxDistance = baseDistance / MIN_ZOOM;
    flight = null;
    frameCamera(zoom);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  document.addEventListener("visibilitychange", refresh);
  resize();
  refresh();
  return {
    refresh,
    render,
    setTime: earth.setTime,
    zoom: (value: number) => travel(value),
    wide: () => travel(wideZoom(), true),
    reset: () => {
      stopTour();
      flight = null;
      frameCamera(1, homeDirection);
      refresh();
    },
    tour: () => {
      if (tour) stopTour();
      else if (allowed()) {
        flight = null;
        tour = true;
        tourTime = 0;
        onTour(true);
      }
      refresh();
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      controls.removeEventListener("change", onChange);
      controls.removeEventListener("start", onStart);
      controls.dispose();
      labelNodes.forEach(({ node }) => node.remove());
      earth.dispose();
      bloom.dispose();
      output.dispose();
      renderPass.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
