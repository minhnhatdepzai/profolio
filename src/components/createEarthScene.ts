import type * as THREE_NS from 'three';
import { directionFrom, moonState, subsolarPoint } from './solarPosition';

type THREE = typeof THREE_NS;

export interface EarthScene {
  group: THREE_NS.Group;
  update: (dt: number) => void;
  setTime: (date: Date) => void;
  dispose: () => void;
}

// SphereGeometry UVs run east-positive towards -Z. Convert solar vectors at
// this boundary, retaining the existing solar calculation's public convention.
export const spinToLongitude = (lon: number) => -lon * Math.PI / 180 - Math.PI / 2;

const VERT = `
  varying vec2 vUv;
  varying vec3 vDir;
  varying vec3 vNormalW;
  varying vec3 vPositionW;
  void main() {
    vUv = uv;
    vDir = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vPositionW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const EARTH_FRAG = `
  varying vec2 vUv;
  varying vec3 vDir;
  varying vec3 vNormalW;
  varying vec3 vPositionW;
  uniform sampler2D uDay;
  uniform sampler2D uNight;
  uniform sampler2D uClouds;
  uniform sampler2D uOcean;
  uniform sampler2D uNormal;
  uniform vec3 uSun;
  uniform vec3 uSunWorld;
  uniform float uCloudOffset;
  void main() {
    vec3 N = normalize(vDir);
    vec3 V = normalize(cameraPosition - vPositionW);
    float sun = dot(N, uSun);
    float daylight = smoothstep(-0.08, 0.16, sun);
    vec3 east = normalize(vec3(N.z, 0.0, -N.x));
    vec3 north = normalize(cross(N, east));
    vec3 relief = texture2D(uNormal, vUv).xyz * 2.0 - 1.0;
    vec3 surface = normalize(N + 0.22 * (east * relief.x + north * relief.y));
    float diffuse = max(dot(surface, uSun), 0.0);
    vec3 albedo = texture2D(uDay, vUv).rgb;
    float clouds = texture2D(uClouds, vec2(vUv.x + uCloudOffset + 0.001, vUv.y)).a;
    vec3 col = albedo * (0.009 + daylight * (0.055 + 1.15 * diffuse));
    col *= 1.0 - clouds * daylight * 0.22;
    // Satellite night imagery preserves connected urban regions.
    vec3 night = texture2D(uNight, vUv).rgb;
    col += night * (1.0 - smoothstep(-0.18, 0.03, sun)) * 1.25;
    // Restrained sun glint on water, with a Fresnel response.
    vec3 normalW = normalize(vNormalW);
    vec3 H = normalize(V + uSunWorld);
    float water = texture2D(uOcean, vUv).r;
    float fresnel = 0.025 + 0.20 * pow(1.0 - max(dot(normalW, V), 0.0), 5.0);
    col += vec3(1.0, 0.91, 0.78) * pow(max(dot(normalW, H), 0.0), 100.0)
      * water * fresnel * daylight * 1.5;
    float rim = pow(1.0 - max(dot(normalW, V), 0.0), 3.8);
    vec3 air = mix(vec3(0.55, 0.16, 0.035), vec3(0.11, 0.38, 0.85), smoothstep(-0.08, 0.3, sun));
    col += air * rim * smoothstep(-0.3, 0.2, sun) * 0.38;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const CLOUD_FRAG = `
  varying vec2 vUv;
  varying vec3 vDir;
  uniform sampler2D uClouds;
  uniform vec3 uSun;
  uniform float uCloudOffset;
  void main() {
    float cover = texture2D(uClouds, vec2(vUv.x + uCloudOffset, vUv.y)).a;
    float sun = dot(normalize(vDir), uSun);
    float light = smoothstep(-0.08, 0.12, sun);
    vec3 col = vec3(0.88, 0.94, 1.0) * (0.012 + light * (0.15 + max(sun, 0.0)));
    gl_FragColor = vec4(col, cover * 0.91);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

const AIR_FRAG = `
  varying vec3 vDir;
  varying vec3 vNormalW;
  varying vec3 vPositionW;
  uniform vec3 uSun;
  void main() {
    vec3 V = normalize(cameraPosition - vPositionW);
    float rim = pow(1.0 - abs(dot(normalize(vNormalW), V)), 4.0);
    float sun = dot(normalize(vDir), uSun);
    vec3 air = mix(vec3(0.7, 0.22, 0.06), vec3(0.18, 0.48, 1.0), smoothstep(-0.12, 0.3, sun));
    gl_FragColor = vec4(air, rim * smoothstep(-0.35, 0.2, sun) * 0.48);
    #include <colorspace_fragment>
  }
`;

const MOON_FRAG = `
  varying vec2 vUv;
  varying vec3 vDir;
  uniform sampler2D uMap;
  uniform vec3 uSun;
  void main() {
    float sun = dot(normalize(vDir), uSun);
    vec3 col = texture2D(uMap, vUv).rgb * (0.006 + max(sun, 0.0) * 1.5);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const createEarthScene = async (THREE: THREE, openingLon = 0): Promise<EarthScene> => {
  const loader = new THREE.TextureLoader();
  // Settling all requests also lets us dispose successful siblings on failure.
  const files = ['day.jpg', 'night.jpg', 'clouds.png', 'ocean.jpg', 'normal.jpg', 'moon.jpg'];
  const loaded = await Promise.allSettled(files.map((file) => loader.loadAsync(`${import.meta.env.BASE_URL}earth/${file}`)));
  if (loaded.some((result) => result.status === 'rejected')) {
    loaded.forEach((result) => { if (result.status === 'fulfilled') result.value.dispose(); });
    throw new Error('Earth textures could not be loaded');
  }
  const textures = loaded.map((result) => (result as PromiseFulfilledResult<THREE_NS.Texture>).value);
  const [day, night, clouds, ocean, normal, lunar] = textures;
  textures.forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.anisotropy = 4;
  });
  [day, night, lunar].forEach((texture) => { texture.colorSpace = THREE.SRGBColorSpace; });

  const group = new THREE.Group();
  const frame = new THREE.Group();
  frame.rotation.z = 23.44 * Math.PI / 180;
  const globe = new THREE.Group();
  globe.rotation.y = spinToLongitude(openingLon);
  frame.add(globe);
  group.add(frame);
  const sun = new THREE.Vector3();
  const sunWorld = new THREE.Vector3();
  const cloudOffset = { value: 0 };
  const surface = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: EARTH_FRAG,
    uniforms: {
      uDay: { value: day }, uNight: { value: night }, uClouds: { value: clouds },
      uOcean: { value: ocean }, uNormal: { value: normal },
      uSun: { value: sun }, uSunWorld: { value: sunWorld }, uCloudOffset: cloudOffset,
    },
  });
  const cloudMaterial = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: CLOUD_FRAG,
    uniforms: { uClouds: { value: clouds }, uSun: { value: sun }, uCloudOffset: cloudOffset },
    transparent: true, depthWrite: false,
  });
  const atmosphere = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: AIR_FRAG,
    uniforms: { uSun: { value: sun } },
    transparent: true, depthWrite: false, side: THREE.BackSide, blending: THREE.AdditiveBlending,
  });
  const moonMaterial = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: MOON_FRAG,
    uniforms: { uMap: { value: lunar }, uSun: { value: sun } },
  });
  const sphere = new THREE.SphereGeometry(1, 128, 96);
  const moonGeometry = new THREE.SphereGeometry(0.2727, 48, 32);
  const earth = new THREE.Mesh(sphere, surface);
  const cloudShell = new THREE.Mesh(sphere, cloudMaterial);
  cloudShell.scale.setScalar(1.006);
  const air = new THREE.Mesh(sphere, atmosphere);
  air.scale.setScalar(1.025);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  globe.add(earth, cloudShell, air, moon);

  const syncSun = () => {
    globe.updateWorldMatrix(true, false);
    sunWorld.copy(sun).transformDirection(globe.matrixWorld);
  };
  const setTime = (date: Date) => {
    const s = directionFrom(subsolarPoint(date));
    sun.set(s.x, s.y, -s.z).normalize();
    const m = directionFrom(moonState(date));
    // True direction and size ratio; the orbit is compressed for framing.
    moon.position.set(m.x, m.y, -m.z).multiplyScalar(2.3);
    syncSun();
  };
  setTime(new Date());
  return {
    group,
    update: (dt) => {
      // Inspect the whole system without advancing simulated time: the Moon,
      // Earth and sunlight retain one shared reference frame during rotation.
      globe.rotation.y += dt * 0.065;
      cloudOffset.value = (cloudOffset.value + dt * 0.0005) % 1;
      syncSun();
    },
    setTime,
    dispose: () => {
      textures.forEach((texture) => texture.dispose());
      [sphere, moonGeometry, surface, cloudMaterial, atmosphere, moonMaterial].forEach((resource) => resource.dispose());
    },
  };
};

/** Prefer a sunlit landmass so a Pacific-only opening does not hide the terrain. */
export const openingLongitude = (date: Date, viewerLon: number) => {
  const sunLon = subsolarPoint(date).lon;
  const gap = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
  return [25, 105, -70, -115]
    .sort((a, b) => (gap(a, sunLon) + 0.15 * gap(a, viewerLon)) - (gap(b, sunLon) + 0.15 * gap(b, viewerLon)))[0];
};
