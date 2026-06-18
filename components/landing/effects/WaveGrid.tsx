"use client";

import { useEffect, useRef } from "react";

export function WaveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      const gridSpacing = 40;
      const cols = Math.ceil(width / gridSpacing) + 1;
      const rows = Math.ceil(height / gridSpacing) + 1;

      // Draw horizontal flowing lines
      ctx.strokeStyle = "rgba(159, 222, 90, 0.08)";
      ctx.lineWidth = 1;

      for (let j = 0; j < rows; j++) {
        ctx.beginPath();

        for (let i = 0; i <= cols; i++) {
          const x = i * gridSpacing;
          const baseY = j * gridSpacing;

          // Multiple wave frequencies for complexity
          const wave1 = Math.sin(x * 0.01 + time * 2 + j * 0.5) * 8;
          const wave2 = Math.sin(x * 0.02 - time * 1.5 + j * 0.3) * 4;
          const wave3 = Math.cos(x * 0.005 + time + j * 0.8) * 12;

          const y = baseY + wave1 + wave2 + wave3;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Draw vertical flowing lines with different wave pattern
      ctx.strokeStyle = "rgba(77, 217, 255, 0.05)";

      for (let i = 0; i < cols; i++) {
        ctx.beginPath();

        for (let j = 0; j <= rows; j++) {
          const baseX = i * gridSpacing;
          const y = j * gridSpacing;

          // Different wave pattern for vertical
          const wave1 = Math.sin(y * 0.015 + time * 1.8 + i * 0.4) * 6;
          const wave2 = Math.cos(y * 0.008 - time * 1.2 + i * 0.6) * 10;

          const x = baseX + wave1 + wave2;

          if (j === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // Draw intersection points with pulsing effect
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const baseX = i * gridSpacing;
          const baseY = j * gridSpacing;

          // Same wave calculations
          const hWave = Math.sin(baseX * 0.01 + time * 2 + j * 0.5) * 8 +
                       Math.sin(baseX * 0.02 - time * 1.5 + j * 0.3) * 4 +
                       Math.cos(baseX * 0.005 + time + j * 0.8) * 12;

          const vWave = Math.sin(baseY * 0.015 + time * 1.8 + i * 0.4) * 6 +
                       Math.cos(baseY * 0.008 - time * 1.2 + i * 0.6) * 10;

          const x = baseX + vWave;
          const y = baseY + hWave;

          // Pulsing alpha based on position and time
          const pulse = Math.sin(time * 3 + i * 0.5 + j * 0.7) * 0.5 + 0.5;
          const alpha = 0.1 + pulse * 0.15;

          // Only draw some intersections
          if ((i + j) % 3 === 0) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(159, 222, 90, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // Occasional bright flash at random intersection
      if (Math.random() < 0.03) {
        const i = Math.floor(Math.random() * cols);
        const j = Math.floor(Math.random() * rows);
        const baseX = i * gridSpacing;
        const baseY = j * gridSpacing;

        const hWave = Math.sin(baseX * 0.01 + time * 2 + j * 0.5) * 8 +
                     Math.sin(baseX * 0.02 - time * 1.5 + j * 0.3) * 4 +
                     Math.cos(baseX * 0.005 + time + j * 0.8) * 12;

        const vWave = Math.sin(baseY * 0.015 + time * 1.8 + i * 0.4) * 6 +
                     Math.cos(baseY * 0.008 - time * 1.2 + i * 0.6) * 10;

        const x = baseX + vWave;
        const y = baseY + hWave;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        gradient.addColorStop(0, "rgba(159, 222, 90, 0.4)");
        gradient.addColorStop(0.5, "rgba(159, 222, 90, 0.1)");
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

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
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  );
}
