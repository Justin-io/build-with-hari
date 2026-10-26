import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface FerrofluidSphereProps {
  className?: string;
}

export const FerrofluidSphere: React.FC<FerrofluidSphereProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL to respect performance guidelines
    const isSoftwareGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
        if (!gl) return true;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const rendererStr = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
      } catch {
        return false;
      }
    })();

    // Scene & Camera setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // Procedural Studio Environment for Pure Chrome Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Key Light (Crisp White Specular highlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(6, 6, 7);
    scene.add(keyLight);

    // Rim Light (Electric Blue Apple-style accent on spike silhouettes)
    const rimLight = new THREE.DirectionalLight(0x4778f5, 4.5);
    rimLight.position.set(-6, -3, -4);
    scene.add(rimLight);

    // Top Fill Light (Sky illumination)
    const fillLight = new THREE.DirectionalLight(0xb0cbff, 1.8);
    fillLight.position.set(0, 8, 3);
    scene.add(fillLight);

    // Create Ferrofluid Sphere Geometry
    const baseRadius = width < 640 ? 1.3 : 1.75;
    const segments = isSoftwareGl ? 48 : 64;
    const geometry = new THREE.SphereGeometry(baseRadius, segments, segments);

    // Cache original vertex positions and normals for mathematical deformation
    const posAttr = geometry.attributes.position;
    const count = posAttr.count;
    const originalPositions = new Float32Array(count * 3);
    const originalNormals = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      originalPositions[i * 3] = posAttr.getX(i);
      originalPositions[i * 3 + 1] = posAttr.getY(i);
      originalPositions[i * 3 + 2] = posAttr.getZ(i);

      // Radial unit normal
      const x = originalPositions[i * 3];
      const y = originalPositions[i * 3 + 1];
      const z = originalPositions[i * 3 + 2];
      const len = Math.hypot(x, y, z) || 1;
      originalNormals[i * 3] = x / len;
      originalNormals[i * 3 + 1] = y / len;
      originalNormals[i * 3 + 2] = z / len;
    }

    // Pure Reflective Liquid Ferrofluid Material with Blue Sheen
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0c10), // Deep obsidian liquid metal
      roughness: 0.07,
      metalness: 0.98,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      ior: 1.55,
      sheen: 1.0,
      sheenColor: new THREE.Color(0x4778f5),
      sheenRoughness: 0.2,
    });

    const ferroMesh = new THREE.Mesh(geometry, material);
    scene.add(ferroMesh);

    // Responsive initial position
    const updateMeshPosition = () => {
      const curW = window.innerWidth;
      if (curW < 1024) {
        ferroMesh.position.set(0, 0.35, -0.6);
        ferroMesh.scale.setScalar(curW < 640 ? 0.8 : 0.95);
      } else {
        ferroMesh.position.set(2.0, 0.1, 0);
        ferroMesh.scale.setScalar(1.0);
      }
    };

    updateMeshPosition();

    // Magnetic interaction state
    const targetMagnet = new THREE.Vector3(0, 0, 1);
    const currentMagnet = new THREE.Vector3(0, 0, 1);
    let ripplePulse = 0;
    let mouseVelocity = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const updateMouse3D = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      // Track cursor velocity for fluid impulse
      const delta = Math.hypot(x - prevMouseX, y - prevMouseY);
      mouseVelocity = mouseVelocity * 0.8 + delta * 3.5;
      prevMouseX = x;
      prevMouseY = y;

      // Project 2D screen coordinate to 3D magnetic attraction pole relative to mesh
      const relativeX = x * 4.0 - ferroMesh.position.x;
      const relativeY = y * 4.0 - ferroMesh.position.y;
      targetMagnet.set(relativeX, relativeY, 2.5).normalize();
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      updateMouse3D(e.clientX, e.clientY);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateMouse3D(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleWindowClick = () => {
      // Trigger a fluid wave impulse
      ripplePulse = 1.0;
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: true });
    window.addEventListener('click', handleWindowClick, { passive: true });

    // Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;

      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);

      updateMeshPosition();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Animation & Physics Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Smooth magnetic interpolation (Apple-like spring damping)
      currentMagnet.lerp(targetMagnet, delta * 3.5);

      // Natural floating bobbing & gentle rotation
      if (!prefersReducedMotion) {
        const baseY = window.innerWidth < 1024 ? 0.35 : 0.1;
        ferroMesh.position.y = baseY + Math.sin(elapsedTime * 1.3) * 0.1;
        ferroMesh.rotation.y += delta * 0.12;
        ferroMesh.rotation.x = Math.sin(elapsedTime * 0.7) * 0.05;
      }

      // Decay ripple impulse & mouse velocity
      ripplePulse *= 0.94;
      mouseVelocity *= 0.92;

      // Deform sphere vertices based on Ferrofluid Physics:
      const positions = geometry.attributes.position;
      const strength = 1.35;
      const magDir = currentMagnet;

      for (let i = 0; i < count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];

        const nx = originalNormals[i * 3];
        const ny = originalNormals[i * 3 + 1];
        const nz = originalNormals[i * 3 + 2];

        // Alignment with magnetic pole
        const dotMag = nx * magDir.x + ny * magDir.y + nz * magDir.z;
        const poleAlignment = Math.max(0, dotMag);

        // Multi-frequency Rosensweig spike lattice formula
        const freq = 5.5;
        const s1 = Math.sin(ox * freq + elapsedTime * 1.1);
        const s2 = Math.cos(oy * freq + elapsedTime * 0.9);
        const s3 = Math.sin(oz * freq * 0.9);

        // Smooth normalized lattice value
        const rawLattice = Math.max(0, (s1 * s2 * s3 + 1.0) * 0.5);

        // Hermite smoothstep sharpening: peaks rise conical, valleys remain smooth liquid
        const sharpPeak = rawLattice * rawLattice * (3.0 - 2.0 * rawLattice);

        // Base resting liquid surface wave
        const ambientWave =
          Math.sin(elapsedTime * 1.8 + ox * 1.5) * 0.03 +
          Math.cos(elapsedTime * 1.4 + oz * 1.5) * 0.03;

        // Directional elongation toward cursor
        const directionalSpike =
          Math.pow(poleAlignment, 2.8) * (0.35 + sharpPeak * 0.85) * strength;

        // Fluid ripple wave triggered by clicks or rapid cursor motion
        const distFromCenter = Math.hypot(ox, oy, oz);
        const rippleWave =
          Math.sin(distFromCenter * 7.0 - elapsedTime * 7.5) *
          (ripplePulse * 0.3 + mouseVelocity * 0.07);

        // Total outward displacement along radial surface normal
        const totalDisplacement =
          ambientWave +
          sharpPeak * 0.18 * strength +
          directionalSpike * 0.65 +
          rippleWave;

        positions.setXYZ(
          i,
          ox + nx * totalDisplacement,
          oy + ny * totalDisplacement,
          oz + nz * totalDisplacement
        );
      }

      positions.needsUpdate = true;
      geometry.computeVertexNormals();

      // Render scene
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      scene.environment?.dispose();
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 ${className} opacity-40 md:opacity-90`}
      aria-hidden="true"
    >
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
