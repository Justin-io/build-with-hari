import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

export const FluidMagneticBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates & state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140, // magnetic interaction radius
      isActive: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isActive = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.isActive = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.isActive = true;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Build particle grid
    let particles: Particle[] = [];
    const spacing = Math.max(48, Math.min(64, Math.floor(width / 22)));

    const initGrid = () => {
      particles = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const originX = i * spacing;
          const originY = j * spacing;
          particles.push({
            x: originX,
            y: originY,
            originX,
            originY,
            vx: 0,
            vy: 0,
            radius: (i + j) % 3 === 0 ? 1.6 : 1.1,
            baseAlpha: (i + j) % 4 === 0 ? 0.35 : 0.18,
            color: '#4778F5',
          });
        }
      }
    };

    initGrid();

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Physics parameters
    const friction = 0.88;
    const springFactor = 0.04;
    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      const count = particles.length;
      for (let i = 0; i < count; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Gentle ambient wave
          const waveX = Math.sin(time + p.originY * 0.01) * 2;
          const waveY = Math.cos(time + p.originX * 0.01) * 2;

          // Magnetic attraction / repulsion relative to mouse
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius && mouse.isActive) {
            // Fluid magnetic push effect
            const force = (1 - distance / mouse.radius) * 26;
            const angle = Math.atan2(dy, dx);
            // Repel slightly away from cursor with magnetic curvature
            p.vx -= Math.cos(angle) * force * 0.3;
            p.vy -= Math.sin(angle) * force * 0.3;
          }

          // Spring return to origin
          const homeDx = p.originX + waveX - p.x;
          const homeDy = p.originY + waveY - p.y;
          p.vx += homeDx * springFactor;
          p.vy += homeDy * springFactor;

          // Apply velocity and friction
          p.vx *= friction;
          p.vy *= friction;
          p.x += p.vx;
          p.y += p.vy;
        }

        // Proximity highlight
        const distToMouse = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        const isNear = distToMouse < mouse.radius;
        const proximityBoost = isNear ? (1 - distToMouse / mouse.radius) * 0.45 : 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius + proximityBoost * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isNear
          ? `rgba(71, 120, 245, ${Math.min(0.8, p.baseAlpha + proximityBoost)})`
          : `rgba(107, 107, 115, ${p.baseAlpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
};
