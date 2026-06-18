"use client";

import { useEffect, useRef } from "react";

interface FloatingShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
  alpha: number;
  type: "diamond" | "cross" | "square" | "triangle" | "heart" | "star";
  color: string;
  pulsePhase: number;
}

const COLORS = ["#9FDE5A", "#7bc234", "#4DD9FF", "#FFE066", "#FF7A7A"];

export function FloatingShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<FloatingShape[]>([]);
  const animationRef = useRef<number | null>(null);

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

      // Initialize shapes
      const shapes: FloatingShape[] = [];
      const types: FloatingShape["type"][] = ["diamond", "cross", "square", "triangle", "heart", "star"];

      for (let i = 0; i < 25; i++) {
        shapes.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.1, // Slight upward drift
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.01,
          scale: 0.5 + Math.random() * 1,
          alpha: 0.1 + Math.random() * 0.2,
          type: types[Math.floor(Math.random() * types.length)],
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }

      shapesRef.current = shapes;
    };

    resize();
    window.addEventListener("resize", resize);

    const drawPixelShape = (
      ctx: CanvasRenderingContext2D,
      type: FloatingShape["type"],
      size: number,
      color: string
    ) => {
      const s = size; // Base pixel size

      ctx.fillStyle = color;

      switch (type) {
        case "diamond":
          // Diamond made of pixels
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(0, 0, s, s);
          ctx.fillRect(0, -s, s, s);
          ctx.fillRect(0, s, s, s);
          ctx.fillRect(-s * 2, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(0, -s * 2, s, s);
          ctx.fillRect(0, s * 2, s, s);
          break;

        case "cross":
          // Plus/cross shape
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(0, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(0, -s, s, s);
          ctx.fillRect(0, s, s, s);
          break;

        case "square":
          // Hollow square
          ctx.fillRect(-s, -s, s, s);
          ctx.fillRect(0, -s, s, s);
          ctx.fillRect(s, -s, s, s);
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(-s, s, s, s);
          ctx.fillRect(0, s, s, s);
          ctx.fillRect(s, s, s, s);
          break;

        case "triangle":
          // Pixel triangle pointing up
          ctx.fillRect(0, -s * 2, s, s);
          ctx.fillRect(-s, -s, s, s);
          ctx.fillRect(0, -s, s, s);
          ctx.fillRect(s, -s, s, s);
          ctx.fillRect(-s * 2, 0, s, s);
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(0, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(s * 2, 0, s, s);
          break;

        case "heart":
          // Pixel heart
          ctx.fillRect(-s, -s, s, s);
          ctx.fillRect(s, -s, s, s);
          ctx.fillRect(-s * 2, 0, s, s);
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(0, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(s * 2, 0, s, s);
          ctx.fillRect(-s, s, s, s);
          ctx.fillRect(0, s, s, s);
          ctx.fillRect(s, s, s, s);
          ctx.fillRect(0, s * 2, s, s);
          break;

        case "star":
          // 4-point pixel star
          ctx.fillRect(0, -s * 2, s, s);
          ctx.fillRect(0, -s, s, s);
          ctx.fillRect(-s * 2, 0, s, s);
          ctx.fillRect(-s, 0, s, s);
          ctx.fillRect(0, 0, s, s);
          ctx.fillRect(s, 0, s, s);
          ctx.fillRect(s * 2, 0, s, s);
          ctx.fillRect(0, s, s, s);
          ctx.fillRect(0, s * 2, s, s);
          // Diagonal accents
          ctx.fillRect(-s, -s, s, s);
          ctx.fillRect(s, -s, s, s);
          ctx.fillRect(-s, s, s, s);
          ctx.fillRect(s, s, s, s);
          break;
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      shapesRef.current.forEach((shape) => {
        // Update position
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;
        shape.pulsePhase += 0.02;

        // Wrap around screen
        if (shape.x < -50) shape.x = width + 50;
        if (shape.x > width + 50) shape.x = -50;
        if (shape.y < -50) shape.y = height + 50;
        if (shape.y > height + 50) shape.y = -50;

        // Pulsing alpha
        const pulseAlpha = shape.alpha * (0.7 + Math.sin(shape.pulsePhase) * 0.3);

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.scale(shape.scale, shape.scale);
        ctx.globalAlpha = pulseAlpha;

        // Draw glow
        const glowSize = 20 * shape.scale;
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        gradient.addColorStop(0, `${shape.color}22`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(-glowSize, -glowSize, glowSize * 2, glowSize * 2);

        // Draw shape
        drawPixelShape(ctx, shape.type, 3, shape.color);

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
