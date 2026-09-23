import * as THREE from "three";

export type CelestialBody = {
  id: string;
  name: string;
  object: THREE.Object3D;
  radius: number;
};

// Seeded stars and dust keep composition stable across mounts and screenshots.
const randomGenerator = () => {
  let seed = 82631;
  return () => {
    seed = (1664525 * seed + 1013904223) >>> 0;
    return seed / 4294967296;
  };
};

const vertex = `
varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal;
void main() {
  vLocal = position; vWorld = (modelMatrix * vec4(position, 1.)).xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

const noise = `
float hash(vec3 p) { p = fract(p * .3183099 + vec3(.1,.2,.3)); p *= 17.; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise3(vec3 p) {
  vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
    mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p) { float v=0., a=.5; for(int i=0;i<4;i++){v+=noise3(p)*a;p=p*2.07+vec3(12.7,4.3,8.1);a*=.5;} return v; }
`;

export function createSolarEnvironment() {
  const group = new THREE.Group();
  const random = randomGenerator();
  const time = { value: 0 };
  const reveal = { value: 0 };
  const bodies: CelestialBody[] = [];
  const animated: Array<{
    mesh: THREE.Mesh;
    distance: number;
    phase: number;
    speed: number;
  }> = [];
  const geometry = new THREE.SphereGeometry(1, 64, 40);
  const specs = [
    {
      id: "mercury",
      name: "Mercury",
      distance: 3.1,
      radius: 0.22,
      color: "#93897b",
      gas: 0,
      phase: 2.6,
      speed: 0.065,
    },
    {
      id: "venus",
      name: "Venus",
      distance: 5.1,
      radius: 0.44,
      color: "#d8ae71",
      gas: 1,
      phase: 3.5,
      speed: 0.048,
    },
    {
      id: "mars",
      name: "Mars",
      distance: 10.5,
      radius: 0.34,
      color: "#b36943",
      gas: 0,
      phase: 5.5,
      speed: 0.025,
    },
    {
      id: "jupiter",
      name: "Jupiter",
      distance: 13.8,
      radius: 1.32,
      color: "#c2a383",
      gas: 2,
      phase: 0.48,
      speed: 0.011,
    },
    {
      id: "saturn",
      name: "Saturn",
      distance: 17.5,
      radius: 1.04,
      color: "#d5c095",
      gas: 3,
      phase: 3.65,
      speed: 0.008,
    },
    {
      id: "uranus",
      name: "Uranus",
      distance: 21.2,
      radius: 0.65,
      color: "#92d1d0",
      gas: 4,
      phase: 2.45,
      speed: 0.005,
    },
    {
      id: "neptune",
      name: "Neptune",
      distance: 24.8,
      radius: 0.62,
      color: "#497fdb",
      gas: 4,
      phase: 5.45,
      speed: 0.003,
    },
  ];
  const orbitMaterial = new THREE.LineBasicMaterial({
    color: 0x74849b,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  });
  for (const distance of [3.1, 5.1, 8.2, 10.5, 13.8, 17.5, 21.2, 24.8]) {
    const points = Array.from(
      { length: 256 },
      (_, i) =>
        new THREE.Vector3(
          Math.cos((i / 256) * Math.PI * 2) * distance,
          0,
          Math.sin((i / 256) * Math.PI * 2) * distance,
        ),
    );
    group.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        orbitMaterial,
      ),
    );
  }
  specs.forEach((spec) => {
    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: { value: new THREE.Color(spec.color) },
        uGas: { value: spec.gas },
        uReveal: reveal,
      },
      vertexShader: vertex,
      fragmentShader: `
        varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal;
        uniform vec3 uColor; uniform float uGas; uniform float uReveal;
        ${noise}
        void main() {
          vec3 p=normalize(vLocal); float detail=fbm(p*19.);
          float swirl=fbm(p*5.); float band=sin(p.y*95.+swirl*12.);
          vec3 albedo=uColor*(.7+detail*.6);
          if(uGas>.5) {
            float bands=sin(p.y*42.+swirl*5.)*.5+.5;
            albedo=mix(uColor*.48,uColor*1.3,bands*.55+detail*.45);
            albedo+=vec3(.11,.085,.06)*band;
            if(uGas>1.5 && uGas<2.5) {
              float spot=length((p.xy-vec2(.45,-.22))*vec2(4.,9.));
              albedo=mix(albedo,vec3(.48,.19,.09),(1.-smoothstep(.2,1.,spot))*smoothstep(.2,.7,p.z));
            }
            if(uGas>3.5) albedo=mix(uColor,albedo,.23);
          } else { albedo*=.65+fbm(p*65.)*.7; }
          vec3 N=normalize(vNormal), L=normalize(-vWorld), V=normalize(cameraPosition-vWorld);
          float diffuse=max(dot(N,L),0.);
          float rim=pow(1.-max(dot(N,V),0.),4.);
          vec3 col=albedo*(.07+diffuse*1.6);
          if(uGas>.5) col+=uColor*rim*.15*smoothstep(-.3,.4,dot(N,L));
          gl_FragColor=vec4(col,uReveal);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(spec.radius);
    group.add(mesh);
    bodies.push({
      id: spec.id,
      name: spec.name,
      object: mesh,
      radius: spec.id === "saturn" ? spec.radius * 2.25 : spec.radius,
    });
    animated.push({ mesh, ...spec });
    if (spec.id === "saturn") {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1.3, 2.25, 192),
        new THREE.ShaderMaterial({
          uniforms: { uReveal: reveal },
          vertexShader: vertex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          fragmentShader: `varying vec3 vLocal; varying vec3 vWorld; uniform float uReveal;
        void main(){
          float r=length(vLocal.xy); float bands=.6+.2*sin(r*125.)+.14*sin(r*287.);
          float gap=smoothstep(.008,.025,abs(r-1.78));
          float alpha=bands*gap*smoothstep(1.3,1.38,r)*(1.-smoothstep(2.15,2.25,r));
          vec3 color=mix(vec3(.22,.17,.11),vec3(.8,.69,.48),bands);
          gl_FragColor=vec4(color,alpha*.85*uReveal);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
        }),
      );
      ring.rotation.x = -1.15;
      mesh.add(ring);
    }
  });

  const sun = new THREE.Mesh(
    geometry,
    new THREE.ShaderMaterial({
      uniforms: { uTime: time, uReveal: reveal },
      transparent: true,
      vertexShader: vertex,
      fragmentShader: `varying vec3 vLocal; varying vec3 vWorld; varying vec3 vNormal; uniform float uTime; uniform float uReveal;
    ${noise}
    void main(){
      vec3 p=normalize(vLocal); float n=fbm(p*11.+vec3(uTime*.045));
      float cells=noise3(p*95.+n*3.);
      float limb=pow(max(dot(normalize(vNormal),normalize(cameraPosition-vWorld)),0.),.3);
      vec3 col=mix(vec3(1.9,.35,.025),vec3(4.,2.5,.65),n*.7+cells*.3);
      gl_FragColor=vec4(col*(.6+.4*limb),uReveal);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
    }),
  );
  sun.scale.setScalar(1.45);
  group.add(sun);
  bodies.unshift({ id: "sun", name: "Sun", object: sun, radius: 1.45 });
  const corona = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.ShaderMaterial({
      uniforms: { uTime: time, uReveal: reveal },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `varying vec2 vUv; uniform float uTime; uniform float uReveal;
      void main(){
        vec2 p=(vUv-.5)*2.; float r=length(p); float angle=atan(p.y,p.x);
        float rays=1.+.1*sin(angle*13.+uTime*.1)+.08*sin(angle*29.-uTime*.14);
        float halo=exp(-r*9.)*.65+exp(-pow((r-.24)*21.,2.))*.32;
        float streak=exp(-abs(p.y)*140.)*exp(-abs(p.x)*4.)*.18;
        gl_FragColor=vec4(vec3(1.,.42,.1)*(halo*rays+streak),(1.-smoothstep(.6,1.,r))*uReveal);
      }`,
    }),
  );
  group.add(corona);

  const positions: number[] = [],
    colors: number[] = [],
    sizes: number[] = [];
  const starColor = new THREE.Color();
  for (let i = 0; i < 2600; i++) {
    const az = random() * Math.PI * 2,
      z = random() * 2 - 1,
      r = 240 + random() * 100;
    const planar = Math.sqrt(1 - z * z);
    positions.push(r * planar * Math.cos(az), r * z, r * planar * Math.sin(az));
    starColor.setHSL(
      0.56 + random() * 0.1,
      0.12 + random() * 0.32,
      0.5 + random() * 0.4,
    );
    colors.push(starColor.r, starColor.g, starColor.b);
    sizes.push(0.55 + Math.pow(random(), 6) * 2.8);
  }
  const starsGeometry = new THREE.BufferGeometry();
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  starsGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
  starsGeometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizes, 1),
  );
  const stars = new THREE.Points(
    starsGeometry,
    new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      vertexShader: `attribute float aSize; varying vec3 vColor; void main(){vColor=color; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);gl_PointSize=aSize;}`,
      fragmentShader: `varying vec3 vColor; void main(){float d=length(gl_PointCoord-.5)*2.; gl_FragColor=vec4(vColor,pow(max(0.,1.-d),1.7));}`,
    }),
  );
  group.add(stars);

  const dustPositions: number[] = [];
  for (let i = 0; i < 1800; i++) {
    const angle = random() * Math.PI * 2,
      r = 11.7 + random() * 0.8;
    dustPositions.push(
      Math.cos(angle) * r,
      (random() - 0.5) * 0.3,
      Math.sin(angle) * r,
    );
  }
  const belt = new THREE.Points(
    new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dustPositions, 3),
    ),
    new THREE.PointsMaterial({
      color: 0xb8a18a,
      size: 0.024,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    }),
  );
  group.add(belt);

  const update = (dt: number, camera?: THREE.Camera, visibility = 0) => {
    reveal.value = visibility;
    orbitMaterial.opacity = 0.15 * visibility;
    belt.material.opacity = 0.28 * visibility;
    group.children.forEach((object) => {
      if (object !== stars) object.visible = visibility > 0.001;
    });
    time.value += dt;
    animated.forEach(({ mesh, distance, phase, speed }) => {
      const angle = phase + time.value * speed;
      mesh.position.set(
        Math.cos(angle) * distance,
        0,
        -Math.sin(angle) * distance,
      );
      mesh.rotation.y += dt * 0.035;
    });
    belt.rotation.y += dt * 0.002;
    if (camera) corona.quaternion.copy(camera.quaternion);
  };
  update(0);
  return {
    group,
    bodies,
    update,
    dispose: () => {
      const resources = new Set<{ dispose: () => void }>();
      group.traverse((object) => {
        const renderable = object as THREE.Mesh;
        if (renderable.geometry) resources.add(renderable.geometry);
        if (renderable.material)
          (Array.isArray(renderable.material)
            ? renderable.material
            : [renderable.material]
          ).forEach((m) => resources.add(m));
      });
      resources.forEach((resource) => resource.dispose());
    },
  };
}
