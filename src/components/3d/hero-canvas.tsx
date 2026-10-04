'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<'torus' | 'core' | 'prism'>('torus');
  const [wireframe, setWireframe] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f2fe, 3);
    dirLight1.position.set(5, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff007f, 2.5);
    dirLight2.position.set(-5, -3, -2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00f2fe, 3, 20);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Particle field
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const radius = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i3 + 2] = radius * Math.cos(phi);

      particleColors[i3] = 0.0;
      particleColors[i3 + 1] = 0.8 + Math.random() * 0.2;
      particleColors[i3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dynamic 3D Mesh
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f2fe,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: wireframe,
      emissive: 0x031828,
    });

    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    let currentGeo: THREE.BufferGeometry;
    if (activeModel === 'torus') {
      currentGeo = new THREE.TorusKnotGeometry(1.6, 0.45, 128, 32);
    } else if (activeModel === 'core') {
      currentGeo = new THREE.IcosahedronGeometry(2, 2);
    } else {
      currentGeo = new THREE.OctahedronGeometry(2.2, 0);
    }

    const outerMesh = new THREE.Mesh(currentGeo, outerMat);
    const innerMesh = new THREE.Mesh(currentGeo, innerMat);
    innerMesh.scale.set(0.9, 0.9, 0.9);

    mainGroup.add(outerMesh);
    mainGroup.add(innerMesh);

    // Mouse Tracking & Interaction
    let targetRotX = 0;
    let targetRotY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX += deltaY * 0.008;
        prevMouseX = clientX;
        prevMouseY = clientY;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    domEl.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Continuous subtle rotation
      targetRotY += delta * 0.35;
      targetRotX += Math.sin(elapsed * 0.5) * 0.001;

      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.08;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.08;

      mainGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;
      particles.rotation.y = elapsed * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      domEl.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      currentGeo.dispose();
      outerMat.dispose();
      innerMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container.contains(domEl)) {
        container.removeChild(domEl);
      }
    };
  }, [activeModel, wireframe]);

  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[560px] flex items-center justify-center">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
      />

      {/* Floating Control HUD */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-20 flex flex-wrap items-center justify-between md:justify-end gap-2 bg-slate-950/70 backdrop-blur-xl border border-white/10 p-2.5 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-mono pl-1 hidden sm:inline">Model:</span>
          <button
            onClick={() => setActiveModel('torus')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeModel === 'torus'
                ? 'bg-cyan text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Torus
          </button>
          <button
            onClick={() => setActiveModel('core')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeModel === 'core'
                ? 'bg-cyan text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Core
          </button>
          <button
            onClick={() => setActiveModel('prism')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeModel === 'prism'
                ? 'bg-cyan text-slate-950 shadow-[0_0_12px_rgba(0,242,254,0.4)]'
                : 'text-slate-400 hover:text-white bg-white/5'
            }`}
          >
            Prism
          </button>
        </div>

        <button
          onClick={() => setWireframe((v) => !v)}
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
            wireframe
              ? 'border-pink-500 text-pink-400 bg-pink-500/15 shadow-[0_0_12px_rgba(255,0,127,0.3)]'
              : 'border-white/10 text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          {wireframe ? 'Solid' : 'Wireframe'}
        </button>
      </div>

      <div className="absolute top-4 left-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-slate-300">
        <span className="w-2 h-2 rounded-full bg-cyan animate-ping" />
        <span className="font-mono text-[11px] text-cyan">LIVE 3D RENDER &bull; 60 FPS</span>
      </div>
    </div>
  );
}
