"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/landing/layout/Container";
import { Button } from "@/components/landing/ui/Button";
import { HeroBackground } from "@/components/landing/effects/HeroBackground";
import { cn } from "@/lib/utils";

// Pixel character with walking animation
function PixelCharacter({
  variant,
  className,
}: {
  variant: "knight" | "wizard" | "archer" | "slime";
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="animate-bounce-subtle">
        <svg
          width="64"
          height="64"
          viewBox="0 0 16 16"
          className="pixelated"
          style={{ imageRendering: "pixelated" }}
        >
          {variant === "knight" && (
            <>
              {/* Helmet */}
              <rect x="5" y="0" width="6" height="2" fill="#718096" />
              <rect x="4" y="2" width="8" height="1" fill="#718096" />
              <rect x="7" y="1" width="2" height="1" fill="#FFE066" />
              {/* Face through helmet */}
              <rect x="5" y="3" width="6" height="4" fill="#FFD5B0" />
              <rect x="4" y="3" width="1" height="4" fill="#718096" />
              <rect x="11" y="3" width="1" height="4" fill="#718096" />
              {/* Eyes */}
              <rect x="6" y="4" width="1" height="1" fill="#262626" />
              <rect x="9" y="4" width="1" height="1" fill="#262626" />
              {/* Armor Body */}
              <rect x="4" y="7" width="8" height="5" fill="#718096" />
              <rect x="6" y="8" width="4" height="3" fill="#A0AEC0" />
              <rect x="7" y="9" width="2" height="1" fill="#FFE066" />
              {/* Shield (left) */}
              <rect x="1" y="7" width="3" height="4" fill="#4DD9FF" />
              <rect x="2" y="8" width="1" height="2" fill="#FFE066" />
              {/* Sword (right) */}
              <rect x="12" y="5" width="1" height="6" fill="#A0AEC0" />
              <rect x="11" y="10" width="3" height="1" fill="#8B4513" />
              {/* Legs */}
              <rect x="5" y="12" width="2" height="4" fill="#4A5568" />
              <rect x="9" y="12" width="2" height="4" fill="#4A5568" />
            </>
          )}
          {variant === "wizard" && (
            <>
              {/* Pointed Hat */}
              <rect x="7" y="0" width="2" height="1" fill="#9333EA" />
              <rect x="6" y="1" width="4" height="1" fill="#9333EA" />
              <rect x="5" y="2" width="6" height="1" fill="#9333EA" />
              <rect x="4" y="3" width="8" height="1" fill="#9333EA" />
              <rect x="7" y="1" width="2" height="1" fill="#FFE066" />
              {/* Face */}
              <rect x="5" y="4" width="6" height="4" fill="#FFD5B0" />
              {/* Eyes */}
              <rect x="6" y="5" width="1" height="1" fill="#262626" />
              <rect x="9" y="5" width="1" height="1" fill="#262626" />
              {/* Beard */}
              <rect x="6" y="7" width="4" height="1" fill="#E2E8F0" />
              {/* Robe Body */}
              <rect x="4" y="8" width="8" height="5" fill="#9333EA" />
              <rect x="5" y="9" width="6" height="1" fill="#7C3AED" />
              <rect x="7" y="10" width="2" height="2" fill="#FFE066" />
              {/* Staff (left hand) */}
              <rect x="2" y="3" width="1" height="10" fill="#8B4513" />
              <rect x="1" y="2" width="3" height="2" fill="#9FDE5A" />
              <rect x="2" y="1" width="1" height="1" fill="#9FDE5A" />
              {/* Right arm */}
              <rect x="12" y="8" width="2" height="3" fill="#9333EA" />
              {/* Robe bottom */}
              <rect x="4" y="13" width="3" height="3" fill="#9333EA" />
              <rect x="9" y="13" width="3" height="3" fill="#9333EA" />
            </>
          )}
          {variant === "archer" && (
            <>
              {/* Hood */}
              <rect x="5" y="0" width="6" height="2" fill="#22543D" />
              <rect x="4" y="2" width="8" height="2" fill="#22543D" />
              {/* Face */}
              <rect x="5" y="3" width="6" height="4" fill="#FFD5B0" />
              {/* Eyes */}
              <rect x="6" y="4" width="1" height="1" fill="#262626" />
              <rect x="9" y="4" width="1" height="1" fill="#262626" />
              {/* Tunic Body */}
              <rect x="5" y="7" width="6" height="5" fill="#276749" />
              <rect x="6" y="8" width="4" height="1" fill="#22543D" />
              <rect x="7" y="9" width="2" height="1" fill="#8B4513" />
              {/* Bow (left side) */}
              <rect x="1" y="4" width="1" height="8" fill="#8B4513" />
              <rect x="2" y="3" width="1" height="1" fill="#8B4513" />
              <rect x="2" y="12" width="1" height="1" fill="#8B4513" />
              <rect x="2" y="5" width="1" height="6" fill="#E2E8F0" />
              {/* Quiver on back */}
              <rect x="12" y="6" width="2" height="5" fill="#8B4513" />
              <rect x="12" y="5" width="1" height="1" fill="#FF7A7A" />
              <rect x="13" y="4" width="1" height="2" fill="#FF7A7A" />
              <rect x="14" y="5" width="1" height="1" fill="#FF7A7A" />
              {/* Arms */}
              <rect x="3" y="7" width="2" height="3" fill="#FFD5B0" />
              {/* Legs */}
              <rect x="5" y="12" width="2" height="4" fill="#4A5568" />
              <rect x="9" y="12" width="2" height="4" fill="#4A5568" />
            </>
          )}
          {variant === "slime" && (
            <>
              {/* Slime body - blob shape */}
              <rect x="4" y="8" width="8" height="6" fill="#9FDE5A" />
              <rect x="3" y="9" width="10" height="4" fill="#9FDE5A" />
              <rect x="5" y="7" width="6" height="1" fill="#9FDE5A" />
              <rect x="6" y="6" width="4" height="1" fill="#9FDE5A" />
              {/* Shine/highlight */}
              <rect x="5" y="8" width="2" height="2" fill="#C6F6D5" />
              <rect x="6" y="7" width="1" height="1" fill="#C6F6D5" />
              {/* Eyes */}
              <rect x="6" y="10" width="1" height="2" fill="#262626" />
              <rect x="9" y="10" width="1" height="2" fill="#262626" />
              {/* Mouth */}
              <rect x="7" y="12" width="2" height="1" fill="#276749" />
              {/* Shadow underneath */}
              <rect x="3" y="14" width="10" height="2" fill="#276749" />
            </>
          )}
        </svg>
      </div>
      {/* Shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/30 rounded-full blur-sm" />
    </div>
  );
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Complex Animated Background */}
      <HeroBackground />

      <Container className="relative z-10 pt-20">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="mb-6 animate-slide-up opacity-0" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#9FDE5A]/10 border border-[#9FDE5A]/30 text-[#9FDE5A] text-sm">
              <span className="w-2 h-2 bg-[#9FDE5A] rounded-full animate-pulse" />
              AI-Powered Game Asset Generation
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 animate-slide-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            <span className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight block mb-2">
              CREATE GAME-READY
            </span>
            <span className="font-pixel text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white leading-tight block mb-2">
              SPRITES IN{" "}
              <span className="text-[#9FDE5A] glow-green">MINUTES</span>
            </span>
            <span className="font-pixel text-xl sm:text-2xl md:text-3xl text-[#a1a1aa] block">
              NOT DAYS
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-[#a1a1aa] max-w-2xl mb-8 animate-slide-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
            Generate pixel art characters, scenes, and animations with simple text prompts.
            Perfect for indie developers and game studios.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <Button asChild variant="primary" size="lg" glow>
              <Link href="/login">Start Creating Free</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/home" className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                Open App
              </Link>
            </Button>
          </div>

          {/* Character Showcase */}
          <div className="w-full max-w-3xl animate-slide-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
            <div className="relative bg-[#141414]/50 border border-[#262626] p-8 sm:p-12">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#9FDE5A]" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#9FDE5A]" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#9FDE5A]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#9FDE5A]" />

              {/* Characters */}
              <div className="flex justify-center items-end gap-8 sm:gap-16">
                <div className="text-center">
                  <PixelCharacter variant="knight" className="mb-3" />
                  <span className="font-pixel text-[8px] text-[#a1a1aa]">KNIGHT</span>
                </div>
                <div className="text-center">
                  <PixelCharacter variant="wizard" className="mb-3" />
                  <span className="font-pixel text-[8px] text-[#a1a1aa]">WIZARD</span>
                </div>
                <div className="text-center">
                  <PixelCharacter variant="archer" className="mb-3" />
                  <span className="font-pixel text-[8px] text-[#a1a1aa]">ARCHER</span>
                </div>
                <div className="text-center">
                  <PixelCharacter variant="slime" className="mb-3" />
                  <span className="font-pixel text-[8px] text-[#a1a1aa]">SLIME</span>
                </div>
              </div>

              {/* Generation indicator */}
              <div className="mt-8 pt-6 border-t border-[#262626]">
                <div className="flex items-center justify-center gap-4 text-sm text-[#a1a1aa]">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#9FDE5A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Generated in 8 seconds
                  </span>
                  <span className="w-1 h-1 bg-[#262626] rounded-full" />
                  <span>Multiple variations</span>
                  <span className="w-1 h-1 bg-[#262626] rounded-full" />
                  <span>Transparent background</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <svg
              className="w-6 h-6 text-[#9FDE5A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </Container>
    </section>
  );
}
