"use client";

import { useEffect, useRef } from "react";

interface Pixel {
  x: number;
  y: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

interface GlowOrb {
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  color: string;
}

interface DataStream {
  x: number;
  chars: { y: number; char: string; alpha: number; speed: number }[];
  color: string;
}

const COLORS = {
  primary: "#9FDE5A",
  primaryBright: "#BFFF7A",
  cyan: "#4DD9FF",
  gold: "#FFE066",
  pink: "#FF66CC",
};

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const orbsRef = useRef<GlowOrb[]>([]);
  const streamsRef = useRef<DataStream[]>([]);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

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
      initEffects(rect.width, rect.height);
    };

    const initEffects = (width: number, height: number) => {
      // Initialize falling pixels (matrix-style rain)
      const pixels: Pixel[] = [];
      const pixelCount = Math.floor(width / 15);
      const colors = [COLORS.primary, COLORS.primaryBright, COLORS.cyan, COLORS.gold];

      for (let i = 0; i < pixelCount; i++) {
        pixels.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          vy: 1 + Math.random() * 3,
          size: 2 + Math.random() * 4,
          alpha: 0.3 + Math.random() * 0.7,
          color: colors[Math.floor(Math.random() * colors.length)],
          trail: [],
        });
      }
      pixelsRef.current = pixels;

      // Initialize glowing orbs
      const orbs: GlowOrb[] = [];
      const orbColors = [COLORS.primary, COLORS.cyan, COLORS.gold, COLORS.pink];
      for (let i = 0; i < 6; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 100 + Math.random() * 200,
          phase: Math.random() * Math.PI * 2,
          speed: 0.002 + Math.random() * 0.003,
          color: orbColors[Math.floor(Math.random() * orbColors.length)],
        });
      }
      orbsRef.current = orbs;

      // Initialize data streams (vertical flowing characters)
      const streams: DataStream[] = [];
      const streamCount = Math.floor(width / 60);
      const chars = "01アイウエオカキクケコピクセル";

      for (let i = 0; i < streamCount; i++) {
        const streamChars = [];
        const charCount = 5 + Math.floor(Math.random() * 10);
        const baseSpeed = 0.5 + Math.random() * 1.5;

        for (let j = 0; j < charCount; j++) {
          streamChars.push({
            y: -j * 20 - Math.random() * 200,
            char: chars[Math.floor(Math.random() * chars.length)],
            alpha: 1 - j / charCount,
            speed: baseSpeed,
          });
        }

        streams.push({
          x: i * 60 + Math.random() * 40,
          chars: streamChars,
          color: Math.random() > 0.7 ? COLORS.cyan : COLORS.primary,
        });
      }
      streamsRef.current = streams;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, width, height);
      timeRef.current += 0.016;
      const time = timeRef.current;

      // Draw pulsing gradient orbs
      orbsRef.current.forEach((orb) => {
        orb.phase += orb.speed;
        const pulse = Math.sin(orb.phase) * 0.3 + 0.7;
        const breathe = Math.sin(time * 0.5 + orb.phase) * 30;

        // Mouse attraction
        const dx = mouse.x - orb.x;
        const dy = mouse.y - orb.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          orb.x += dx * 0.001;
          orb.y += dy * 0.001;
        }

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius + breathe
        );
        gradient.addColorStop(0, `${orb.color}15`);
        gradient.addColorStop(0.5, `${orb.color}08`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, (orb.radius + breathe) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw hex grid pattern
      ctx.strokeStyle = "rgba(159, 222, 90, 0.04)";
      ctx.lineWidth = 1;
      const hexSize = 40;
      const hexHeight = hexSize * Math.sqrt(3);

      for (let row = -1; row < height / hexHeight + 1; row++) {
        for (let col = -1; col < width / (hexSize * 1.5) + 1; col++) {
          const offsetX = row % 2 === 0 ? 0 : hexSize * 0.75;
          const cx = col * hexSize * 1.5 + offsetX;
          const cy = row * hexHeight * 0.5;

          // Pulse effect based on position and time
          const wave = Math.sin(cx * 0.01 + cy * 0.01 + time * 2) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(159, 222, 90, ${0.02 + wave * 0.04})`;

          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 6;
            const hx = cx + hexSize * 0.4 * Math.cos(angle);
            const hy = cy + hexSize * 0.4 * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      // Draw data streams
      ctx.font = "14px monospace";
      streamsRef.current.forEach((stream) => {
        stream.chars.forEach((char, idx) => {
          char.y += char.speed;

          if (char.y > height + 50) {
            char.y = -20;
            char.char =
              "01アイウエオカキクケコピクセル"[
                Math.floor(Math.random() * 15)
              ];
          }

          const fadeIn = Math.min(1, char.y / 100);
          const fadeOut = Math.max(0, 1 - (char.y - height + 100) / 100);
          const alpha = char.alpha * fadeIn * fadeOut * 0.6;

          if (alpha > 0) {
            // Head of stream is brighter
            if (idx === 0) {
              ctx.fillStyle = "#ffffff";
              ctx.shadowColor = stream.color;
              ctx.shadowBlur = 10;
            } else {
              ctx.fillStyle = stream.color;
              ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = alpha;
            ctx.fillText(char.char, stream.x, char.y);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
          }
        });
      });

      // Draw falling pixels with trails
      pixelsRef.current.forEach((pixel) => {
        // Add current position to trail
        pixel.trail.unshift({ x: pixel.x, y: pixel.y, alpha: pixel.alpha });
        if (pixel.trail.length > 8) pixel.trail.pop();

        // Update position
        pixel.y += pixel.vy;

        // Mouse repulsion
        const dx = pixel.x - mouse.x;
        const dy = pixel.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (1 - dist / 100) * 2;
          pixel.x += (dx / dist) * force;
        }

        // Reset if off screen
        if (pixel.y > height + 20) {
          pixel.y = -20;
          pixel.x = Math.random() * width;
          pixel.trail = [];
        }

        // Draw trail
        pixel.trail.forEach((t, i) => {
          const trailAlpha = t.alpha * (1 - i / pixel.trail.length) * 0.5;
          ctx.fillStyle = pixel.color;
          ctx.globalAlpha = trailAlpha;
          ctx.fillRect(
            t.x - pixel.size / 2,
            t.y - pixel.size / 2,
            pixel.size,
            pixel.size
          );
        });

        // Draw main pixel with glow
        ctx.globalAlpha = pixel.alpha;
        ctx.shadowColor = pixel.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = pixel.color;
        ctx.fillRect(
          pixel.x - pixel.size / 2,
          pixel.y - pixel.size / 2,
          pixel.size,
          pixel.size
        );
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Draw connecting lines between nearby pixels
      ctx.lineWidth = 1;
      pixelsRef.current.forEach((p1, i) => {
        pixelsRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const alpha = (1 - dist / 80) * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(159, 222, 90, ${alpha})`;
            ctx.stroke();
          }
        });
      });

      // Draw scanning line effect
      const scanY = ((time * 50) % (height + 100)) - 50;
      const scanGradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGradient.addColorStop(0, "transparent");
      scanGradient.addColorStop(0.5, "rgba(159, 222, 90, 0.08)");
      scanGradient.addColorStop(1, "transparent");
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 30, width, 60);

      // Occasional flash
      if (Math.random() < 0.002) {
        const flashX = Math.random() * width;
        const flashY = Math.random() * height;
        const flashGradient = ctx.createRadialGradient(
          flashX,
          flashY,
          0,
          flashX,
          flashY,
          100
        );
        flashGradient.addColorStop(0, "rgba(159, 222, 90, 0.3)");
        flashGradient.addColorStop(0.5, "rgba(159, 222, 90, 0.1)");
        flashGradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(flashX, flashY, 100, 0, Math.PI * 2);
        ctx.fillStyle = flashGradient;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 30%, rgba(10, 10, 10, 0.6) 100%)",
        }}
      />

      {/* Top fade for navbar */}
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10, 10, 10, 0.9) 0%, transparent 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(10, 10, 10, 1) 0%, transparent 100%)",
        }}
      />

      {/* Subtle scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0, 0, 0, 0.1) 1px, rgba(0, 0, 0, 0.1) 2px)",
        }}
      />
    </div>
  );
}
