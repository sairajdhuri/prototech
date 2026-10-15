import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";

/** Construction illustration, not a production fabrication stack-up. @param {HTMLElement} host */
export async function createPCBScene(host) {
  const loader = new THREE.TextureLoader();
  const [maskTexture, copperTexture, coreTexture, metalnessTexture] = await Promise.all([
    "pcb-mask-v3.webp", "pcb-copper-v3.webp", "pcb-core-v3.webp", "pcb-finish-v3.webp",
  ].map(file => loader.loadAsync(`/media/${file}`)));
  for (const texture of [maskTexture, copperTexture, coreTexture]) {
    texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  }
  const mobile = window.matchMedia("(max-width: 900px)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const reflections = pmrem.fromScene(environment, 0.04, 0.1, 100, { size: 128 });
  scene.environment = reflections.texture;
  scene.environmentIntensity = 0.2;
  scene.environmentRotation.set(0.4, -0.7, 0.2);
  environment.dispose(); pmrem.dispose();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 60);
  camera.position.set(8, 5.5, 12); camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xfff3df, 0x18251e, 0.18));
  RectAreaLightUniformsLib.init();
  const softbox = new THREE.RectAreaLight(0xffd49a, 3, 5, 2);
  softbox.position.set(-5, 5, -9); softbox.lookAt(0, 0, 0); scene.add(softbox);
  const key = new THREE.DirectionalLight(0xffe0aa, 0.65);
  key.position.set(-4, 8, -6); key.castShadow = true;
  key.shadow.mapSize.set(mobile ? 512 : 1024, mobile ? 512 : 1024);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 24 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.normalBias = 0.01; key.shadow.bias = -0.0002; key.shadow.radius = 8; key.shadow.blurSamples = 8; scene.add(key);
  const rim = new THREE.DirectionalLight(0xd9e8ff, 0.65);
  rim.position.set(8, 4, -5); scene.add(rim);
  const w = 3.3, h = 2.75, r = 0.055;
  const shape = new THREE.Shape();
  shape.moveTo(-w + r, -h);
  shape.lineTo(w - r, -h); shape.quadraticCurveTo(w, -h, w, -h + r);
  shape.lineTo(w, h - r); shape.quadraticCurveTo(w, h, w - r, h);
  shape.lineTo(-w + r, h); shape.quadraticCurveTo(-w, h, -w, h - r);
  shape.lineTo(-w, -h + r); shape.quadraticCurveTo(-w, -h, -w + r, -h);
  const holes = [[-2.98, -2.43], [2.98, -2.43], [-2.98, 2.43], [2.98, 2.43]];
  for (const [x, y] of holes) {
    const hole = new THREE.Path(); hole.absarc(x, y, 0.115, 0, Math.PI * 2, true); shape.holes.push(hole);
  }
  const bodyGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.038, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.012, bevelThickness: 0.006, curveSegments: 24 });
  bodyGeometry.rotateX(-Math.PI / 2);
  const faceGeometry = new THREE.ShapeGeometry(shape, 24);
  const position = faceGeometry.attributes.position, uv = faceGeometry.attributes.uv;
  for (let i = 0; i < position.count; i++) uv.setXY(i, (position.getX(i) + w) / (w * 2), (position.getY(i) + h) / (h * 2));
  faceGeometry.rotateX(-Math.PI / 2);
  const mask = new THREE.MeshPhysicalMaterial({ map: maskTexture, metalnessMap: metalnessTexture, roughnessMap: metalnessTexture, bumpMap: metalnessTexture, bumpScale: 0.018, metalness: 1, roughness: 1, specularIntensity: 0.4, clearcoat: 0.08, clearcoatRoughness: 0.28 });
  const copper = new THREE.MeshPhysicalMaterial({ map: copperTexture, bumpMap: metalnessTexture, bumpScale: 0.012, roughness: 0.2, metalness: 0.96, clearcoat: 0.25 });
  const dielectric = new THREE.MeshPhysicalMaterial({ color: 0xf1dfb7, roughness: 0.38, metalness: 0, transparent: true, opacity: 0.28, depthWrite: false, side: THREE.DoubleSide });
  const coreFace = dielectric.clone(); coreFace.map = coreTexture; coreFace.color.set(0xffffff); coreFace.opacity = 0.72;
  for (const material of [mask, copper, coreFace]) {
    // shortcut: the key approximates softbox occlusion; use path tracing for exact area shadows.
    material.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace("#include <shadowmap_pars_fragment>", "#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>").replace("#include <lights_fragment_begin>", THREE.ShaderChunk.lights_fragment_begin.replace("rectAreaLight = rectAreaLights[ i ];", "rectAreaLight = rectAreaLights[ i ]; rectAreaLight.color *= mix(0.25, 1.0, getShadowMask());"));
    };
  }
  const edge = new THREE.MeshStandardMaterial({ color: 0x123c2e, roughness: 0.5 });
  const copperEdge = new THREE.MeshStandardMaterial({ color: 0xc08b48, roughness: 0.28, metalness: 0.8 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xe6b864, roughness: 0.23, metalness: 0.85 });
  const ringGeometry = new THREE.TorusGeometry(0.15, 0.034, 12, 40); ringGeometry.rotateX(-Math.PI / 2);
  const barrelGeometry = new THREE.CylinderGeometry(0.115, 0.115, 0.055, 24, 1, true);
  const barrel = gold.clone(); barrel.side = THREE.DoubleSide;
  const board = new THREE.Group(), layers = [];
  for (let i = 0; i < 6; i++) {
    const group = new THREE.Group(), outer = i === 0 || i === 5, conducting = i === 1 || i === 4;
    const surface = outer ? mask : conducting ? copper : coreFace;
    const body = new THREE.Mesh(bodyGeometry, outer ? edge : conducting ? copperEdge : dielectric);
    body.castShadow = true; body.receiveShadow = true; group.add(body);
    const face = new THREE.Mesh(faceGeometry, surface);
    face.position.y = 0.047; face.receiveShadow = true; group.add(face);
    for (const [x, y] of holes) {
      const ring = new THREE.Mesh(ringGeometry, gold); ring.position.set(x, 0.052, -y); group.add(ring);
      const sleeve = new THREE.Mesh(barrelGeometry, barrel); sleeve.position.set(x, 0.025, -y); group.add(sleeve);
    }
    board.add(group); layers.push(group);
  }
  scene.add(board);
  const pinGeometry = new THREE.CylinderGeometry(0.022, 0.022, 1, 16);
  const pins = holes.map(([x, y]) => {
    const pin = new THREE.Mesh(pinGeometry, gold);
    pin.position.set(x, 0.025, -y); pin.castShadow = true; board.add(pin);
    return pin;
  });
  const shadow = new THREE.ShadowMaterial({ opacity: 0.3 });
  shadow.onBeforeCompile = shader => {
    shader.vertexShader = shader.vertexShader.replace("void main() {", "varying vec3 floorPoint; void main() { floorPoint = position;");
    shader.fragmentShader = shader.fragmentShader.replace("void main() {", "varying vec3 floorPoint; void main() {").replace("#include <tonemapping_fragment>", "gl_FragColor.a *= 1.0 - smoothstep(2.8, 4.8, length(floorPoint.xy));\n#include <tonemapping_fragment>");
  };
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), shadow);
  floor.rotation.x = -Math.PI / 2; floor.position.y = -2.3; floor.receiveShadow = true; scene.add(floor);
  const state = { spread: 1, turn: -0.3, tilt: 0.035, scale: 1, dark: 0 };
  let contextLost = false;
  function render() {
    if (contextLost) return;
    board.rotation.set(state.tilt, state.turn, 0); board.scale.setScalar(state.scale);
    layers.forEach((layer, i) => {
      layer.position.y = (i - 2.5) * (0.065 + state.spread * 0.7);
    });
    pins.forEach(pin => { pin.scale.y = 5 * (0.065 + state.spread * 0.7) + 0.05; });
    floor.material.opacity = 0.3 * (1 - state.dark); renderer.render(scene, camera);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    const aspect = width / height, viewHeight = Math.max(7.4, 9.2 / aspect);
    camera.left = -viewHeight * aspect / 2; camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2; camera.updateProjectionMatrix();
    renderer.setSize(width, height); render();
  }
  await renderer.compileAsync(scene, camera);
  const observer = new ResizeObserver(resize); observer.observe(host);
  const onLost = event => { event.preventDefault(); contextLost = true; host.parentElement.classList.remove("webgl-ready"); };
  const onRestored = () => { contextLost = false; render(); host.parentElement.classList.add("webgl-ready"); };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.domElement.addEventListener("webglcontextrestored", onRestored); resize();
  return {
    state, render,
    dispose() {
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      const geometries = new Set(), materials = new Set();
      scene.traverse(object => {
        if (object.isMesh) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
      maskTexture.dispose(); copperTexture.dispose(); coreTexture.dispose(); metalnessTexture.dispose(); reflections.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
