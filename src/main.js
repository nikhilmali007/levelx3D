import * as THREE from 'three';

// --- Scene, Camera, Renderer ---
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x07090e, 0.015);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 7);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// --- State Variables ---
let currentThemeColor = 0x00f2fe;
let rotationSpeedMultiplier = 1.0;
let isWireframe = false;
let activeModelType = 'torus';

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

const accentLight = new THREE.PointLight(currentThemeColor, 3, 20);
accentLight.position.set(-4, -2, -3);
scene.add(accentLight);

const coreLight = new THREE.PointLight(currentThemeColor, 2, 10);
scene.add(coreLight);

// --- Particle Background Nebula ---
const particleCount = 12500;
const particleGeometry = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);

const colorObj = new THREE.Color(currentThemeColor);

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  const radius = 10 + Math.random() * 35;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(Math.random() * 2 - 1);

  particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
  particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
  particlePositions[i3 + 2] = radius * Math.cos(phi);

  const mixFactor = Math.random();
  particleColors[i3] = THREE.MathUtils.lerp(0.1, colorObj.r, mixFactor);
  particleColors[i3 + 1] = THREE.MathUtils.lerp(0.3, colorObj.g, mixFactor);
  particleColors[i3 + 2] = THREE.MathUtils.lerp(0.8, colorObj.b, mixFactor);
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

const particleMaterial = new THREE.PointsMaterial({
  size: 0.05,
  vertexColors: true,
  transparent: true,
  opacity: 0.75,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// --- Geometries & Materials ---
const geometries = {
  torus: new THREE.TorusKnotGeometry(1.5, 0.45, 128, 32),
  icosahedron: new THREE.IcosahedronGeometry(2, 2),
  sphere: new THREE.SphereGeometry(2, 64, 64),
  cube: new THREE.BoxGeometry(2.5, 2.5, 2.5, 8, 8, 8)
};

const outerMaterial = new THREE.MeshPhysicalMaterial({
  color: currentThemeColor,
  metalness: 0.85,
  roughness: 0.2,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
  wireframe: isWireframe,
  emissive: 0x051525,
  reflectivity: 0.9
});

const innerMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.35
});

const modelGroup = new THREE.Group();
scene.add(modelGroup);

let outerMesh = new THREE.Mesh(geometries.torus, outerMaterial);
let innerMesh = new THREE.Mesh(geometries.torus, innerMaterial);
innerMesh.scale.set(0.96, 0.96, 0.96);

modelGroup.add(outerMesh);
modelGroup.add(innerMesh);

// Function to switch active geometry
function switchGeometry(type) {
  if (!geometries[type]) return;
  activeModelType = type;

  modelGroup.remove(outerMesh);
  modelGroup.remove(innerMesh);

  outerMesh.geometry.dispose();
  innerMesh.geometry.dispose();

  outerMesh = new THREE.Mesh(geometries[type], outerMaterial);
  innerMesh = new THREE.Mesh(geometries[type], innerMaterial);
  innerMesh.scale.set(0.96, 0.96, 0.96);

  modelGroup.add(outerMesh);
  modelGroup.add(innerMesh);

  // Little pulse effect
  modelGroup.scale.set(0.7, 0.7, 0.7);
}

// --- Interactive Mouse & Drag Controls ---
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let mouseNormalized = { x: 0, y: 0 };

window.addEventListener('mousedown', (e) => {
  if (e.target.closest('.hero-content') || e.target.closest('.hud-panel') || e.target.closest('.navbar')) return;
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
});

window.addEventListener('mousemove', (e) => {
  mouseNormalized.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouseNormalized.y = -(e.clientY / window.innerHeight) * 2 + 1;

  if (isDragging) {
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.007;
    targetRotation.x += deltaY * 0.007;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

// Touch support for mobile
window.addEventListener('touchstart', (e) => {
  if (e.touches.length === 1) {
    if (e.target.closest('.hero-content') || e.target.closest('.hud-panel')) return;
    isDragging = true;
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
});

window.addEventListener('touchmove', (e) => {
  if (isDragging && e.touches.length === 1) {
    const deltaX = e.touches[0].clientX - previousMousePosition.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.y;

    targetRotation.y += deltaX * 0.007;
    targetRotation.x += deltaY * 0.007;

    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
});

window.addEventListener('touchend', () => {
  isDragging = false;
});

// Zoom with mouse wheel
window.addEventListener('wheel', (e) => {
  camera.position.z += e.deltaY * 0.003;
  camera.position.z = Math.max(3.5, Math.min(15, camera.position.z));
});

// --- UI Controls Event Listeners ---
document.querySelectorAll('.model-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.model-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    switchGeometry(btn.getAttribute('data-model'));
  });
});

const wireframeBtn = document.getElementById('btn-wireframe');
wireframeBtn.addEventListener('click', () => {
  isWireframe = !isWireframe;
  outerMaterial.wireframe = isWireframe;
  wireframeBtn.textContent = isWireframe ? 'Solid View' : 'Toggle Wireframe';
});

const speedSlider = document.getElementById('speed-slider');
const speedValDisplay = document.getElementById('rot-speed-val');
speedSlider.addEventListener('input', (e) => {
  rotationSpeedMultiplier = parseFloat(e.target.value);
  speedValDisplay.textContent = `${rotationSpeedMultiplier.toFixed(1)}x`;
});

document.querySelectorAll('.color-dot').forEach((dot) => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.color-dot').forEach((d) => d.classList.remove('active'));
    dot.classList.add('active');

    const colorHex = dot.getAttribute('data-color');
    currentThemeColor = parseInt(colorHex.replace('#', '0x'), 16);

    outerMaterial.color.setHex(currentThemeColor);
    accentLight.color.setHex(currentThemeColor);
    coreLight.color.setHex(currentThemeColor);

    // Update particles tone
    const c = new THREE.Color(currentThemeColor);
    const colors = particleGeometry.attributes.color.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const mix = Math.random();
      colors[i3] = THREE.MathUtils.lerp(0.1, c.r, mix);
      colors[i3 + 1] = THREE.MathUtils.lerp(0.2, c.g, mix);
      colors[i3 + 2] = THREE.MathUtils.lerp(0.7, c.b, mix);
    }
    particleGeometry.attributes.color.needsUpdate = true;
  });
});

document.getElementById('btn-explore').addEventListener('click', () => {
  // Trigger quick interactive spin + zoom in
  targetRotation.y += Math.PI * 2;
  const initialZ = camera.position.z;
  let t = 0;
  const zoomInterval = setInterval(() => {
    t += 0.05;
    camera.position.z = initialZ - Math.sin(t * Math.PI) * 1.5;
    if (t >= 1) clearInterval(zoomInterval);
  }, 16);
});

// Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- Performance & FPS Counter ---
let lastTime = performance.now();
let frameCount = 0;
const fpsDisplay = document.getElementById('fps-counter');

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // FPS measurement
  frameCount++;
  const currentTime = performance.now();
  if (currentTime - lastTime >= 1000) {
    fpsDisplay.textContent = frameCount;
    frameCount = 0;
    lastTime = currentTime;
  }

  // Smooth rotation with damping
  const speed = 0.4 * rotationSpeedMultiplier;
  modelGroup.rotation.x += (targetRotation.x - modelGroup.rotation.x) * 0.08 + delta * speed * 0.5;
  modelGroup.rotation.y += (targetRotation.y - modelGroup.rotation.y) * 0.08 + delta * speed;

  // Subtle hovering float
  modelGroup.position.y = Math.sin(elapsedTime * 1.8) * 0.15;

  // Return scale smoothly back to 1 if scaled during switch
  modelGroup.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);

  // Rotate particle galaxy slowly
  particles.rotation.y = elapsedTime * 0.03 * rotationSpeedMultiplier;
  particles.rotation.x = mouseNormalized.y * 0.05;

  // Core light pulse
  coreLight.intensity = 1.5 + Math.sin(elapsedTime * 4) * 0.8;

  renderer.render(scene, camera);
}

animate();
