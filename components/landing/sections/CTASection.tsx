"use client";

import Link from "next/link";
import { Container } from "@/components/landing/layout/Container";
import { Button } from "@/components/landing/ui/Button";

const ASCII_LOGO = `
================================
             PIXELAR
================================
`.trim();

function FloatingPixels() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-none"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 17) % 100}%`,
            backgroundColor:
              i % 3 === 0 ? "#9FDE5A" : i % 3 === 1 ? "#7bc234" : "#FFE066",
            opacity: 0.3 + (((i * 29) % 40) / 100),
            animation: `float ${4 + ((i * 19) % 40) / 10}s ease-in-out infinite`,
            animationDelay: `${((i * 23) % 30) / 10}s`,
          }}
        />
      ))}
    </div>
  );
}

export function CTASection() {
  return (
    <section className="py-20 sm:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-pixel-grid opacity-30" />
      <div className="absolute inset-0 bg-stars opacity-20" />
      <FloatingPixels />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(159,222,90,0.1)_0%,transparent_70%)]" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 overflow-x-auto">
            <pre className="font-mono text-[6px] sm:text-[8px] md:text-[10px] lg:text-xs text-[#9FDE5A] whitespace-pre inline-block">
              {ASCII_LOGO}
            </pre>
          </div>

          <div className="mb-8">
            <span className="font-pixel text-lg sm:text-xl md:text-2xl text-white animate-blink">
              PRESS START
            </span>
          </div>

          <p className="text-lg sm:text-xl text-[#a1a1aa] mb-10 max-w-xl mx-auto">
            Join thousands of game developers creating amazing pixel art with AI.
            Start your adventure today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild variant="primary" size="lg" glow className="min-w-[200px]">
              <Link href="/login">Start Your Adventure</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link href="/home">Open App</Link>
            </Button>
          </div>

          <p className="text-sm text-[#a1a1aa]">
            Insert coin... or{" "}
            <span className="text-[#9FDE5A]">start free</span> today
          </p>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="font-pixel text-2xl sm:text-3xl text-[#9FDE5A] mb-2">10K+</div>
              <div className="text-sm text-[#a1a1aa]">Developers</div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-2xl sm:text-3xl text-[#9FDE5A] mb-2">500K+</div>
              <div className="text-sm text-[#a1a1aa]">Sprites Created</div>
            </div>
            <div className="text-center">
              <div className="font-pixel text-2xl sm:text-3xl text-[#FFD700] mb-2">4.9/5</div>
              <div className="text-sm text-[#a1a1aa]">Rating</div>
            </div>
          </div>

          <div className="mt-16 flex justify-center gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2"
                style={{
                  backgroundColor:
                    i < 7 ? "#9FDE5A" : i < 14 ? "#7bc234" : "#FFE066",
                  opacity: 0.3 + (Math.abs(i - 10) / 10) * 0.7,
                }}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
