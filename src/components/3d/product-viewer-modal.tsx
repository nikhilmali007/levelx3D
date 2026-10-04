'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShoppingBag, Eye, RotateCw } from 'lucide-react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/use-cart';

interface ProductViewerModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductViewerModal({ product, onClose }: ProductViewerModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const [currentColor, setCurrentColor] = useState('#00f2fe');
  const { addItem } = useCart();

  useEffect(() => {
    if (!product || !canvasRef.current) return;

    const container = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(4, 5, 5);
    scene.add(mainLight);

    const colorLight = new THREE.PointLight(
      parseInt(currentColor.replace('#', '0x'), 16),
      3,
      15
    );
    colorLight.position.set(-3, -2, 2);
    scene.add(colorLight);

    // Create Geometry corresponding to product
    let geometry: THREE.BufferGeometry;
    switch (product.geometryType) {
      case 'torus':
        geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(1.6, 64, 64);
        break;
      case 'cyber-cube':
        geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10);
        break;
      case 'headset':
        geometry = new THREE.TorusGeometry(1.4, 0.35, 32, 100);
        break;
      default:
        geometry = new THREE.IcosahedronGeometry(1.6, 2);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color: parseInt(currentColor.replace('#', '0x'), 16),
      metalness: 0.85,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: wireframe,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Interaction
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      targetY += dx * 0.01;
      targetX += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      targetY += 0.005;
      mesh.rotation.y += (targetY - mesh.rotation.y) * 0.1;
      mesh.rotation.x += (targetX - mesh.rotation.x) * 0.1;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, [product, wireframe, currentColor]);

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 3D Canvas Area */}
          <div className="w-full md:w-1/2 relative min-h-[340px] md:min-h-[480px] bg-gradient-to-b from-slate-950/40 to-slate-900 flex flex-col items-center justify-center">
            <div
              ref={canvasRef}
              className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing"
            />

            {/* 3D Overlay Help Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/70 border border-white/10 px-3 py-1.5 rounded-full text-xs text-cyan">
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>360° Realtime View</span>
            </div>

            {/* Controls in Canvas Footer */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between bg-slate-950/80 border border-white/10 p-2 rounded-xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-mono">Finishes:</span>
                {[
                  { color: '#00f2fe', label: 'Cyan' },
                  { color: '#ff007f', label: 'Pink' },
                  { color: '#7928ca', label: 'Purple' },
                  { color: '#10b981', label: 'Emerald' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setCurrentColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-5 h-5 rounded-full transition-transform ${
                      currentColor === c.color
                        ? 'ring-2 ring-white scale-125'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setWireframe((v) => !v)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono transition-colors"
              >
                {wireframe ? 'Solid' : 'Wireframe'}
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">{product.category}</Badge>
                {product.badge && <Badge variant="neon">{product.badge}</Badge>}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {product.name}
              </h2>
              <p className="text-sm text-cyan mb-4">{product.tagline}</p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specs Grid */}
              <div className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 mb-6">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan" />
                  3D Manufacturing Specs
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Material:</span>
                    <span className="text-slate-200 font-medium">{product.specs.material}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Resolution:</span>
                    <span className="text-slate-200 font-medium">{product.specs.resolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Finish:</span>
                    <span className="text-slate-200 font-medium">{product.specs.finish}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dimensions:</span>
                    <span className="text-slate-200 font-medium">{product.specs.dimensions}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                onClick={() => {
                  addItem(product);
                  onClose();
                }}
                className="gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
