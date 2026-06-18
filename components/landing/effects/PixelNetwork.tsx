"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  layer: number; // 0 = back, 1 = mid, 2 = front
  color: string;
}

interface EnergyPulse {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
  color: string;
}

const COLORS = {
  primary: "#9FDE5A",
  primaryDim: "#7bc234",
  accent: "#4DD9FF",
  warm: "#FFE066",
  coral: "#FF7A7A",
};

export function PixelNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const pulsesRef = useRef<EnergyPulse[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const colors = [COLORS.primary, COLORS.primaryDim, COLORS.accent, COLORS.warm];

    // Create grid-like distribution with some randomness
    const gridSize = 80;
    const cols = Math.ceil(width / gridSize) + 2;
    const rows = Math.ceil(height / gridSize) + 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Skip some positions for organic feel
        if (Math.random() > 0.7) continue;

        const baseX = i * gridSize + (Math.random() - 0.5) * gridSize * 0.8;
        const baseY = j * gridSize + (Math.random() - 0.5) * gridSize * 0.8;
        const layer = Math.floor(Math.random() * 3);

        particles.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: 0,
          vy: 0,
          size: layer === 0 ? 2 : layer === 1 ? 3 : 4,
          alpha: layer === 0 ? 0.3 : layer === 1 ? 0.5 : 0.8,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          layer,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    return particles;
  }, []);

  const getConnections = useCallback((particles: Particle[], maxDist: number) => {
    const connections: [number, number, number][] = [];

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        // Only connect particles in same or adjacent layers
        if (Math.abs(particles[i].layer - particles[j].layer) > 1) continue;

        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          connections.push([i, j, dist]);
        }
      }
    }

    return connections;
  }, []);

  const spawnPulse = useCallback((particles: Particle[], connections: [number, number, number][]) => {
    if (connections.length === 0) return null;

    const connIndex = Math.floor(Math.random() * connections.length);
    const [from, to] = connections[connIndex];
    const colors = [COLORS.primary, COLORS.accent, COLORS.warm];

    return {
      fromIndex: from,
      toIndex: to,
      progress: 0,
      speed: 0.02 + Math.random() * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      particlesRef.current = initParticles(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      timeRef.current += 0.016;
      const time = timeRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      particles.forEach((p) => {
        // Gentle floating motion
        const floatX = Math.sin(time * 0.5 + p.pulsePhase) * 3 * (p.layer + 1) * 0.3;
        const floatY = Math.cos(time * 0.3 + p.pulsePhase * 1.5) * 2 * (p.layer + 1) * 0.3;

        // Wave distortion
        const waveX = Math.sin(time * 0.2 + p.baseY * 0.01) * 5;
        const waveY = Math.cos(time * 0.15 + p.baseX * 0.01) * 5;

        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxMouseDist = 150;

        let mouseForceX = 0;
        let mouseForceY = 0;

        if (dist < maxMouseDist && dist > 0) {
          const force = (1 - dist / maxMouseDist) * 30;
          mouseForceX = (dx / dist) * force;
          mouseForceY = (dy / dist) * force;
        }

        // Apply forces with smoothing
        const targetX = p.baseX + floatX + waveX + mouseForceX;
        const targetY = p.baseY + floatY + waveY + mouseForceY;

        p.x += (targetX - p.x) * 0.1;
        p.y += (targetY - p.y) * 0.1;

        // Pulse alpha
        p.pulsePhase += p.pulseSpeed;
      });

      // Get connections
      const maxDist = 120;
      const connections = getConnections(particles, maxDist);

      // Spawn new pulses occasionally
      if (Math.random() < 0.05) {
        const pulse = spawnPulse(particles, connections);
        if (pulse) {
          pulsesRef.current.push(pulse);
        }
      }

      // Draw connections by layer
      for (let layer = 0; layer < 3; layer++) {
        connections.forEach(([i, j, dist]) => {
          const p1 = particles[i];
          const p2 = particles[j];

          // Only draw if at least one particle is in current layer
          if (p1.layer !== layer && p2.layer !== layer) return;

          const alpha = (1 - dist / maxDist) * 0.15 * (layer * 0.3 + 0.4);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(159, 222, 90, ${alpha})`;
          ctx.lineWidth = layer === 2 ? 1.5 : 1;
          ctx.stroke();
        });
      }

      // Draw and update energy pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        pulse.progress += pulse.speed;

        if (pulse.progress >= 1) return false;

        const p1 = particles[pulse.fromIndex];
        const p2 = particles[pulse.toIndex];

        if (!p1 || !p2) return false;

        const x = p1.x + (p2.x - p1.x) * pulse.progress;
        const y = p1.y + (p2.y - p1.y) * pulse.progress;

        // Draw pulse glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
        gradient.addColorStop(0, pulse.color);
        gradient.addColorStop(0.5, `${pulse.color}66`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw pulse core
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        return true;
      });

      // Draw particles by layer (back to front)
      for (let layer = 0; layer < 3; layer++) {
        particles.forEach((p) => {
          if (p.layer !== layer) return;

          const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7;
          const alpha = p.alpha * pulse;

          // Outer glow
          if (layer === 2) {
            const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
            glowGradient.addColorStop(0, `${p.color}44`);
            glowGradient.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = glowGradient;
            ctx.fill();
          }

          // Pixel (square shape for pixel art feel)
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
          ctx.globalAlpha = 1;
        });
      }

      // Draw occasional "spark" effects
      if (Math.random() < 0.02) {
        const p = particles[Math.floor(Math.random() * particles.length)];
        if (p && p.layer === 2) {
          const sparkGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
          sparkGradient.addColorStop(0, `${COLORS.primary}ff`);
          sparkGradient.addColorStop(0.3, `${COLORS.primary}44`);
          sparkGradient.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = sparkGradient;
          ctx.fill();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initParticles, getConnections, spawnPulse]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}
