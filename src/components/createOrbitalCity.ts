import type * as THREE_NS from 'three';

/**
 * A rotating micro-planet with a city standing on its continents.
 *
 * Everything is generated in code — no model, texture or heightmap is
 * downloaded, which keeps the project's "no remote model or texture files"
 * promise intact.
 *
 * The terrain is baked once into an equirectangular heightmap held in memory.
 * The shader samples that map to paint the coastline, and tower placement reads
 * the very same array, so the skyline provably lands on land. Running the noise
 * twice — once in GLSL, once in JS — would not agree: the `sin`-based hash
 * amplifies the difference between GPU float and JS double into an entirely
 * different continent.
 */

type THREE = typeof THREE_NS;

export interface OrbitalCity {
  group: THREE_NS.Group;
  /** Advance the simulation. `dt` in seconds, `pointer` in clip space (-1..1). */
  update: (dt: number, pointer: { x: number; y: number }) => void;
  /** Recolour the planet and its lights to the active time band. */
  setPalette: (accent: string, glow: string) => void;
  dispose: () => void;
}

const PLANET_RADIUS = 1;
const TOWER_SLOTS = 520;
const MAP_W = 512;
const MAP_H = 256;
const SEA_LEVEL = 0.5;

/* ---------- terrain, baked once on the CPU ---------- */

const hash3 = (x: number, y: number, z: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

const valueNoise = (x: number, y: number, z: number) => {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let fx = x - ix, fy = y - iy, fz = z - iz;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  fz = fz * fz * (3 - 2 * fz);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(ix + dx, iy + dy, iz + dz);
  return lerp(
    lerp(lerp(c(0, 0, 0), c(1, 0, 0), fx), lerp(c(0, 1, 0), c(1, 1, 0), fx), fy),
    lerp(lerp(c(0, 0, 1), c(1, 0, 1), fx), lerp(c(0, 1, 1), c(1, 1, 1), fx), fy),
    fz,
  );
};

const fbm = (x: number, y: number, z: number) => {
  let sum = 0, amp = 0.5;
  for (let i = 0; i < 5; i += 1) {
    sum += valueNoise(x, y, z) * amp;
    x *= 2.02; y *= 2.02; z *= 2.02;
    amp *= 0.5;
  }
  return sum;
};

/** Height in 0..1 on an equirectangular grid; index is the shared source of truth. */
const bakeHeightMap = () => {
  const data = new Float32Array(MAP_W * MAP_H);
  for (let y = 0; y < MAP_H; y += 1) {
    const phi = (y / (MAP_H - 1)) * Math.PI;
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    for (let x = 0; x < MAP_W; x += 1) {
      const theta = (x / MAP_W) * Math.PI * 2;
      // Sample in 3D so the map wraps seamlessly and the poles do not pinch.
      const n = fbm(Math.cos(theta) * sinPhi * 2.4, cosPhi * 2.4, Math.sin(theta) * sinPhi * 2.4);
      data[y * MAP_W + x] = n;
    }
  }
  return data;
};

/** Read the baked map from a unit direction — matches the shader's lookup. */
const heightAt = (map: Float32Array, x: number, y: number, z: number) => {
  const u = (Math.atan2(z, x) / (Math.PI * 2) + 0.5) % 1;
  const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI;
  const px = Math.min(MAP_W - 1, Math.floor(u * MAP_W));
  const py = Math.min(MAP_H - 1, Math.floor(v * (MAP_H - 1)));
  return map[py * MAP_W + px];
};

/** Evenly spread points on a sphere — no clustering at the poles. */
const fibonacciPoint = (i: number, total: number) => {
  const y = 1 - (i / (total - 1)) * 2;
  const radius = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = i * Math.PI * (3 - Math.sqrt(5));
  return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
};

/** Deterministic per-tower jitter, so the skyline is identical on every visit. */
const jitter = (n: number) => {
  const s = Math.sin(n * 91.7) * 9871.13;
  return s - Math.floor(s);
};

/* ---------- shaders ---------- */

const PLANET_VERT = `
  varying vec3 vNormalW;
  varying vec3 vDir;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PLANET_FRAG = `
  varying vec3 vNormalW;
  varying vec3 vDir;
  uniform sampler2D uHeight;
  uniform vec3 uOcean;
  uniform vec3 uLand;
  uniform vec3 uAccent;

  const float PI = 3.141592653589793;

  void main() {
    // Same equirectangular lookup the CPU uses to place the towers.
    float u = atan(vDir.z, vDir.x) / (2.0 * PI) + 0.5;
    float v = acos(clamp(vDir.y, -1.0, 1.0)) / PI;
    float h = texture2D(uHeight, vec2(u, v)).r;

    float land = smoothstep(${SEA_LEVEL.toFixed(3)}, ${(SEA_LEVEL + 0.035).toFixed(3)}, h);
    float shore = smoothstep(${(SEA_LEVEL - 0.04).toFixed(3)}, ${SEA_LEVEL.toFixed(3)}, h) * (1.0 - land);

    vec3 base = mix(uOcean, uLand, land);
    base = mix(base, uAccent, shore * 0.5);

    vec3 key = normalize(vec3(0.55, 0.5, 0.75));
    float diffuse = clamp(dot(vNormalW, key), 0.0, 1.0);
    float rim = pow(1.0 - clamp(dot(vNormalW, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.2);

    // Ambient floor keeps the night side readable instead of crushing to black.
    vec3 col = base * (0.42 + diffuse * 0.85);
    col += uAccent * rim * 0.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const GLOW_VERT = `
  varying vec3 vNormalV;
  void main() {
    vNormalV = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAG = `
  varying vec3 vNormalV;
  uniform vec3 uGlow;
  void main() {
    // Back faces are rendered, so the fresnel band lands on the outer limb.
    float f = pow(1.0 - abs(dot(vNormalV, vec3(0.0, 0.0, 1.0))), 3.0);
    gl_FragColor = vec4(uGlow, f * 0.8);
  }
`;

/* ---------- scene ---------- */

export const createOrbitalCity = (THREE: THREE): OrbitalCity => {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];

  const heightMap = bakeHeightMap();
  const heightTexture = new THREE.DataTexture(heightMap, MAP_W, MAP_H, THREE.RedFormat, THREE.FloatType);
  heightTexture.wrapS = THREE.RepeatWrapping;
  heightTexture.minFilter = THREE.LinearFilter;
  heightTexture.magFilter = THREE.LinearFilter;
  heightTexture.needsUpdate = true;
  disposables.push(heightTexture);

  const planetGeometry = new THREE.IcosahedronGeometry(PLANET_RADIUS, 20);
  const planetMaterial = new THREE.ShaderMaterial({
    vertexShader: PLANET_VERT,
    fragmentShader: PLANET_FRAG,
    uniforms: {
      uHeight: { value: heightTexture },
      uOcean: { value: new THREE.Color('#14344b') },
      uLand: { value: new THREE.Color('#3a6b4c') },
      uAccent: { value: new THREE.Color('#c9ff4a') },
    },
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  disposables.push(planetGeometry, planetMaterial);

  const glowGeometry = new THREE.IcosahedronGeometry(PLANET_RADIUS * 1.2, 12);
  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    uniforms: { uGlow: { value: new THREE.Color('#c9ff4a') } },
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  disposables.push(glowGeometry, glowMaterial);

  // Collect the land sites first, so the instanced mesh is sized to what is used.
  const sites: { x: number; y: number; z: number; seed: number }[] = [];
  for (let i = 0; i < TOWER_SLOTS; i += 1) {
    const p = fibonacciPoint(i, TOWER_SLOTS);
    if (heightAt(heightMap, p.x, p.y, p.z) <= SEA_LEVEL + 0.01) continue;
    sites.push({ ...p, seed: i });
  }

  const towerGeometry = new THREE.BoxGeometry(1, 1, 1);
  // three only multiplies `vColor` into the fragment under USE_COLOR, so instance
  // colours need `vertexColors: true` — which in turn makes the shader read an
  // `attribute vec3 color` the box does not have. A missing attribute reads as
  // (0,0,0) and every tower renders black, so supply a white one as the identity.
  towerGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(towerGeometry.attributes.position.count * 3).fill(1), 3),
  );
  const towerMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  const towers = new THREE.InstancedMesh(towerGeometry, towerMaterial, Math.max(1, sites.length));
  disposables.push(towerGeometry, towerMaterial, towers);

  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const colour = new THREE.Color();
  const litWindows: number[] = [];

  sites.forEach((site, index) => {
    normal.set(site.x, site.y, site.z).normalize();
    // Short and dense reads as a city; tall and thin reads as a sea urchin.
    const height = 0.022 + jitter(site.seed * 1.7) * 0.075;
    const width = 0.016 + jitter(site.seed * 3.1) * 0.018;

    position.copy(normal).multiplyScalar(PLANET_RADIUS + height / 2 - 0.004);
    quaternion.setFromUnitVectors(up, normal);
    scale.set(width, height, width);
    matrix.compose(position, quaternion, scale);
    towers.setMatrixAt(index, matrix);

    const lit = jitter(site.seed * 7.3) > 0.55;
    if (lit) litWindows.push(index);
    colour.set(lit ? '#c9ff4a' : '#8c9a86').multiplyScalar(lit ? 1 : 0.7 + jitter(site.seed * 5.9) * 0.3);
    towers.setColorAt(index, colour);
  });
  towers.instanceMatrix.needsUpdate = true;
  if (towers.instanceColor) towers.instanceColor.needsUpdate = true;

  // A slim ring, tilted, to give the planet a sense of scale and orientation.
  const ringGeometry = new THREE.TorusGeometry(PLANET_RADIUS * 1.5, 0.0035, 8, 180);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: '#c9ff4a', transparent: true, opacity: 0.35 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.set(Math.PI / 2.3, 0, 0.32);
  disposables.push(ringGeometry, ringMaterial);

  const planetSpin = new THREE.Group();
  planetSpin.add(planet, towers);
  planetSpin.rotation.z = 0.28;
  group.add(planetSpin, glow, ring);

  let elapsed = 0;
  const towerColour = new THREE.Color();

  return {
    group,
    update: (dt, pointer) => {
      elapsed += dt;
      planetSpin.rotation.y += dt * 0.11;
      ring.rotation.z += dt * 0.04;

      // Parallax follows the pointer rather than snapping to it.
      const targetX = pointer.y * 0.2;
      const targetY = pointer.x * 0.32;
      group.rotation.x += (targetX - group.rotation.x) * Math.min(1, dt * 2.4);
      group.rotation.y += (targetY - group.rotation.y) * Math.min(1, dt * 2.4);

      // Window lights breathe out of phase so the city looks inhabited.
      for (let i = 0; i < litWindows.length; i += 1) {
        const index = litWindows[i];
        const pulse = 0.7 + Math.sin(elapsed * 1.5 + index) * 0.3;
        towerColour.copy(planetMaterial.uniforms.uAccent.value).multiplyScalar(pulse);
        towers.setColorAt(index, towerColour);
      }
      if (towers.instanceColor) towers.instanceColor.needsUpdate = true;
    },
    setPalette: (accent, glowColour) => {
      planetMaterial.uniforms.uAccent.value.set(accent);
      glowMaterial.uniforms.uGlow.value.set(glowColour);
      ringMaterial.color.set(accent);
    },
    dispose: () => {
      disposables.forEach((item) => item.dispose());
    },
  };
};
