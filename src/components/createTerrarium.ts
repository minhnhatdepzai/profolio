import type * as Three from 'three';

/** Original procedural character and miniature habitat; no model or texture downloads. */
export function createTerrarium(THREE: typeof Three) {
  const world = new THREE.Group();
  const geometries = new Set<Three.BufferGeometry>();
  const materials = new Set<Three.Material>();
  const material = (color: number, roughness = 0.65, extra: Three.MeshStandardMaterialParameters = {}) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness, ...extra });
    materials.add(result);
    return result;
  };
  const skin = material(0xadd95b, 0.43);
  const lightSkin = material(0xd5eb8c, 0.49);
  const darkSkin = material(0x7aaa45, 0.5);
  const cream = material(0xf4f1d8, 0.25);
  const pupilMaterial = material(0x18291b, 0.13);
  const glintMaterial = material(0xffffff, 0.13, { emissive: 0xffffff, emissiveIntensity: 0.4 });
  const mouthMaterial = material(0x46692a);
  const bark = material(0x534d37, 0.92);
  const barkLight = material(0x888166, 0.9);
  const moss = material(0x526a39, 0.94);
  const mossLight = material(0x7f9c49, 0.95);
  const earth = material(0x2b3c31, 0.94, { flatShading: true });
  const leafGreen = material(0x42734a, 0.58, { side: THREE.DoubleSide });
  const leafLight = material(0x8cac58, 0.58, { side: THREE.DoubleSide });
  const leafVein = material(0xb8d777, 0.6);
  const glow = material(0xe0ffa2, 0.38, { emissive: 0xc9ff4a, emissiveIntensity: 1.5 });
  const mushroomCap = material(0xd9c59a, 0.66);
  const sphereGeometry = new THREE.SphereGeometry(1, 24, 16);
  const stoneGeometry = new THREE.IcosahedronGeometry(1, 1);
  geometries.add(sphereGeometry);
  geometries.add(stoneGeometry);

  const blob = (parent: Three.Object3D, mat: Three.Material, position: number[], scale: number[], geo: Three.BufferGeometry = sphereGeometry) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(position[0], position[1], position[2]);
    mesh.scale.set(scale[0], scale[1], scale[2]);
    parent.add(mesh);
    return mesh;
  };
  const tube = (parent: Three.Object3D, points: number[][], radius: number, mat: Three.Material, segments = 24) => {
    const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point as [number, number, number])));
    const geometry = new THREE.TubeGeometry(curve, segments, radius, 8, false);
    geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat);
    parent.add(mesh);
    return mesh;
  };

  // Floating stone has a soft, uneven moss cap and visible hanging roots.
  blob(world, earth, [0.05, -1.47, -0.08], [1.64, 0.63, 0.92], stoneGeometry);
  blob(world, earth, [0.3, -1.87, -0.04], [0.98, 0.48, 0.61], stoneGeometry);
  blob(world, moss, [0, -1.12, -0.04], [1.67, 0.19, 0.93]);
  const tufts = [[-1.2,-1.01,.15,.42],[-.77,-1.02,.62,.44],[.19,-.99,.65,.5],[.96,-1.02,.33,.48],[1.2,-1.04,-.28,.41],[-.65,-1.0,-.52,.43]];
  tufts.forEach(([x,y,z,s]) => blob(world, mossLight, [x,y,z], [s,.14,s*.7]));
  for (let index = 0; index < 6; index += 1) {
    const x = -0.95 + index * 0.37;
    tube(world, [[x,-1.4,.4],[x+.1,-1.83,.45],[x-.05,-2.1+(index%2)*.16,.3]], .028, bark, 12);
  }

  tube(world, [[-1.8,-.37,.22],[-1.06,-.36,.18],[-.1,-.22,.02],[.75,.13,-.18],[1.43,.74,-.38]], .17, bark, 38);
  tube(world, [[-.1,-1.14,-.28],[.18,-.75,-.21],[.6,-.24,-.18],[.88,.26,-.23]], .15, bark, 24);
  tube(world, [[.64,.05,-.12],[1.24,.23,.13],[1.75,.34,.23]], .076, bark, 18);
  blob(world, barkLight, [-1.81,-.365,.23], [.025,.135,.135]);
  // Fine branch growth lines add shape without a texture dependency.
  tube(world, [[-1.55,-.25,.25],[-.9,-.23,.29],[-.12,-.13,.18],[.5,.14,-.05]], .011, barkLight, 24);

  const plantGroups: Three.Group[] = [];
  const leaf = (x: number, y: number, z: number, length: number, angle: number, mat: Three.Material, width = 0.36) => {
    const pivot = new THREE.Group();
    pivot.position.set(x,y,z);
    pivot.rotation.set(-.08, -.22, angle);
    world.add(pivot);
    const positions: number[] = [];
    const indices: number[] = [];
    const rows = 12;
    for (let row = 0; row <= rows; row += 1) {
      const t = row / rows;
      const leafWidth = Math.pow(Math.sin(t * Math.PI), .8) * width;
      const spineZ = Math.sin(t * Math.PI) * .2 + t*t*.18;
      positions.push(-leafWidth,t*length,spineZ-.075*Math.sin(t*Math.PI),0,t*length,spineZ,leafWidth,t*length,spineZ-.075*Math.sin(t*Math.PI));
      if (row < rows) {
        const base = row*3;
        indices.push(base,base+3,base+1,base+1,base+3,base+4,base+1,base+4,base+2,base+2,base+4,base+5);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    geometries.add(geometry);
    pivot.add(new THREE.Mesh(geometry,mat));
    tube(pivot, [[0,0,.012],[0,length*.35,.2],[0,length*.7,.23],[0,length,.19]],.012,leafVein,16);
    for (let vein=1;vein<5;vein+=1) {
      const t=vein/6;
      const w=Math.pow(Math.sin(t*Math.PI),.8)*width;
      for (const side of [-1,1]) tube(pivot,[[0,length*t,.21],[side*w*.7,length*(t+.09),.2],[side*w*.95,length*(t+.11),.16]],.004,leafVein,6);
    }
    plantGroups.push(pivot);
    return pivot;
  };
  // Oversized botanical silhouette frames the animal rather than hiding its face.
  tube(world, [[.95,-1.02,-.55],[1.45,-.18,-.66],[1.65,.72,-.65]], .035, leafGreen, 18);
  leaf(1.42,-.2,-.66,1.65,-.36,leafGreen,.42);
  leaf(1.5,.27,-.62,1.34,-.92,leafLight,.35);
  leaf(1.56,.66,-.68,1.05,.43,leafGreen,.3);
  leaf(-1.15,-1.04,-.48,1.43,.67,leafGreen,.36);
  leaf(-1.05,-1.03,-.51,1.55,.05,leafLight,.28);
  leaf(-1.37,-1.05,.3,.65,1.11,leafLight,.22);
  leaf(.95,-1.08,.53,.71,-1.15,leafGreen,.28);
  leaf(.54,-1.08,.68,.62,-.22,leafLight,.22);

  // Three tiny mushrooms give the island an inviting, storybook scale.
  for (const [x,y,z,s] of [[-.9,-.91,.59,.28],[-.59,-.93,.76,.19],[.82,-.92,.52,.23]]) {
    tube(world,[[x,y,z],[x+.025,y+s*.7,z],[x+.02,y+s,z]],.025,mushroomCap,8);
    blob(world,mushroomCap,[x+.02,y+s,z],[s*.6,s*.23,s*.57]);
    blob(world,glow,[x+.02,y+s-.025,z],[s*.46,.02,s*.42]);
  }

  const gecko = new THREE.Group();
  gecko.position.set(-.03,.19,.17);
  gecko.rotation.y = -.09;
  world.add(gecko);
  const body = blob(gecko,skin,[.03,.16,0],[.88,.44,.42]);
  blob(gecko,lightSkin,[-.08,.04,.255],[.71,.3,.22]);
  // Curled, tapering chameleon tail, built as overlapping tube sections.
  const tail = new THREE.Group();
  tail.position.set(.68,.14,-.025);
  gecko.add(tail);
  const tailPoints: number[][] = [[0,0,0],[.38,-.02,-.04],[.78,.05,-.07],[1.02,.33,-.07],[.94,.66,-.06],[.62,.83,-.025],[.32,.7,0],[.27,.45,.015],[.46,.34,.025],[.63,.43,.03],[.59,.56,.04]];
  const tailCurve = new THREE.CatmullRomCurve3(tailPoints.map((point)=>new THREE.Vector3(...point as [number,number,number])));
  const tailGeometry = new THREE.TubeGeometry(tailCurve,64,.13,10,false);
  const tailPositions = tailGeometry.attributes.position;
  for(let ring=0;ring<=64;ring+=1) {
    const center=tailCurve.getPointAt(ring/64);
    const taper=1-ring/64*.84;
    for(let segment=0;segment<=10;segment+=1) {
      const index=ring*11+segment;
      tailPositions.setXYZ(index,center.x+(tailPositions.getX(index)-center.x)*taper,center.y+(tailPositions.getY(index)-center.y)*taper,center.z+(tailPositions.getZ(index)-center.z)*taper);
    }
  }
  tailGeometry.computeVertexNormals();
  geometries.add(tailGeometry);
  tail.add(new THREE.Mesh(tailGeometry,skin));

  const legPivots: Three.Group[] = [];
  for (const side of [-1,1]) {
    for (const front of [true,false]) {
      const x=front ? -.49 : .55;
      const leg = new THREE.Group();
      leg.position.set(x,.06,side*.25);
      gecko.add(leg);
      const direction=front ? -.15 : .23;
      tube(leg,[[0,0,0],[direction,-.05,side*.25],[direction+.08,-.28,side*.34],[direction-.04,-.44,side*.25]],.095,side===1 ? skin : darkSkin,16);
      blob(leg,skin,[direction+.05,-.14,side*.29],[.115,.13,.115]);
      blob(leg,lightSkin,[direction-.045,-.44,side*.25],[.13,.065,.12]);
      for (let toe=0;toe<3;toe+=1) {
        const spread=(toe-1)*.095;
        tube(leg,[[direction-.045+spread*.5,-.44,side*.25],[direction-.1+spread,-.48,side*.4],[direction-.14+spread,-.52,side*.44]],.026,lightSkin,8);
        blob(leg,lightSkin,[direction-.14+spread,-.52,side*.44],[.045,.022,.045]);
      }
      legPivots.push(leg);
    }
  }

  const head = new THREE.Group();
  head.position.set(-.71,.34,.035);
  gecko.add(head);
  blob(head,skin,[-.12,.035,0],[.53,.39,.4]);
  blob(head,lightSkin,[-.3,-.16,.14],[.41,.18,.32]);
  blob(head,skin,[-.44,-.025,.04],[.28,.21,.34]);
  // Large raised sockets and glossy irises keep the expression readable at hero scale.
  const eyes: { eye: Three.Group; pupil: Three.Mesh; blink: Three.Mesh }[] = [];
  for (const [x,y,z,scale] of [[-.34,.24,.26,1],[.04,.31,.04,.91]]) {
    const eye=new THREE.Group();
    eye.position.set(x,y,z);
    eye.scale.setScalar(scale);
    head.add(eye);
    blob(eye,darkSkin,[0,0,0],[.26,.28,.235]);
    const blink=blob(eye,cream,[-.025,.01,.13],[.19,.215,.16]);
    const pupil=blob(eye,pupilMaterial,[-.056,.01,.261],[.096,.127,.041]);
    blob(pupil,glintMaterial,[-.33,.35,.62],[.22,.17,.27]);
    blob(pupil,glintMaterial,[.35,-.3,.72],[.075,.07,.15]);
    eyes.push({eye,pupil,blink});
  }
  tube(head,[[-.64,-.13,.21],[-.48,-.2,.32],[-.21,-.21,.36],[.05,-.15,.3]],.013,mouthMaterial,18);
  blob(head,mouthMaterial,[-.55,.005,.314],[.024,.02,.012]);
  blob(head,lightSkin,[-.3,-.04,.368],[.072,.04,.015]);

  // Small dorsal crest and irregular freckles signal a chameleon, not a generic toy.
  const crestGeometry=new THREE.ConeGeometry(.08,.17,5);
  geometries.add(crestGeometry);
  for(let index=0;index<9;index+=1) {
    const x=-.43+index*.135;
    const y=.5-Math.pow((x-.02)/1.15,2)*.16;
    const crest=new THREE.Mesh(crestGeometry,lightSkin);
    crest.position.set(x,y,-.09);
    crest.rotation.z=-.15;
    gecko.add(crest);
  }
  for(let index=0;index<19;index+=1) {
    const x=-.5+(index%7)*.17;
    const y=.14+Math.floor(index/7)*.088;
    const z=.35-Math.abs(x)*.08;
    blob(gecko,index%3===0 ? lightSkin : darkSkin,[x,y,z],[.035+(index%3)*.006,.023,.016]);
  }

  const fireflies: Three.Mesh[]=[];
  for(let index=0;index<9;index+=1) {
    const angle=index*2.399;
    const point=blob(world,glow,[Math.cos(angle)*(1.65+(index%3)*.18),-.4+(index%4)*.57,Math.sin(angle)*.9],[.023,.023,.023]);
    fireflies.push(point);
  }
  const leafAngles=plantGroups.map((plant)=>plant.rotation.z);
  const fireflyOrigins=fireflies.map((point)=>point.position.clone());

  return {
    world,
    animate(elapsed: number,pointerX: number,pointerY: number) {
      body.scale.y=.44+Math.sin(elapsed*1.6)*.012;
      head.rotation.y=pointerX*.14+Math.sin(elapsed*.43)*.055;
      head.rotation.z=Math.sin(elapsed*.63)*.035-pointerY*.04;
      tail.rotation.z=Math.sin(elapsed*.72)*.05;
      const blinkPhase=elapsed%5.8;
      const blink=blinkPhase>5.45 ? Math.max(.06,Math.abs((blinkPhase-5.625)/.175)) : 1;
      eyes.forEach(({pupil,blink:eyeball})=>{
        eyeball.scale.y=.215*blink;
        pupil.scale.y=.127*blink;
        pupil.position.x=-.056+pointerX*.047;
        pupil.position.y=.01-pointerY*.057;
      });
      legPivots.forEach((leg,index)=>{
        const phase=(elapsed+index*.63)%8;
        const step=phase<1.5 ? Math.sin(phase/1.5*Math.PI) : 0;
        leg.rotation.x=(index<2 ? 1 : -1)*step*.17;
        leg.rotation.z=step*.13;
      });
      plantGroups.forEach((plant,index)=>plant.rotation.z=leafAngles[index]+Math.sin(elapsed*.62+index)*.035);
      fireflies.forEach((point,index)=>{
        point.position.y=fireflyOrigins[index].y+Math.sin(elapsed*.8+index)*.11;
        point.position.x=fireflyOrigins[index].x+Math.cos(elapsed*.3+index)*.08;
        point.scale.setScalar(.018+(Math.sin(elapsed*1.8+index)+1)*.007);
      });
    },
    dispose() {
      geometries.forEach((geometry)=>geometry.dispose());
      materials.forEach((entry)=>entry.dispose());
    },
  };
}
