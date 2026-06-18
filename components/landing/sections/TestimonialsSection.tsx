"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/landing/layout/Container";
import { SectionTitle } from "@/components/landing/ui/SectionTitle";
import { TESTIMONIALS } from "@/lib/landing-constants";
import { cn } from "@/lib/utils";

// Pixel avatar
function PixelAvatar({ seed }: { seed: number }) {
  const colors = ["#9FDE5A", "#7bc234", "#FFE066", "#FF7A7A", "#4DD9FF"];
  const color = colors[seed % colors.length];

  return (
    <div
      className="w-12 h-12 flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <svg width="32" height="32" viewBox="0 0 8 8" className="pixelated">
        {/* Simple face */}
        <rect x="1" y="1" width="6" height="6" fill="#FFD5B0" />
        <rect x="2" y="2" width="1" height="1" fill="#2D3748" />
        <rect x="5" y="2" width="1" height="1" fill="#2D3748" />
        <rect x="3" y="4" width="2" height="1" fill="#2D3748" />
        {/* Hair */}
        <rect x="1" y="0" width="6" height="2" fill="#4A5568" />
      </svg>
    </div>
  );
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="py-20 sm:py-32 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute inset-0 bg-pixel-grid opacity-30" />

      <Container className="relative z-10">
        <SectionTitle
          title="QUEST COMPLETED"
          subtitle="What developers are saying about Pixelar"
        />

        <div className="max-w-4xl mx-auto">
          {/* Achievement box style testimonial */}
          <div
            className="relative bg-[#141414] border-2 border-[#9FDE5A] p-6 sm:p-10"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Trophy icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#FFD700] flex items-center justify-center">
              <svg
                className="w-6 h-6 text-[#0a0a0a]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Achievement header */}
            <div className="text-center mb-6 pt-4">
              <span className="font-pixel text-xs text-[#FFD700] animate-pulse-glow">
                ACHIEVEMENT UNLOCKED
              </span>
            </div>

            {/* Testimonial content */}
            <div className="min-h-[150px] flex flex-col justify-center">
              <blockquote className="text-xl sm:text-2xl text-white text-center mb-6 leading-relaxed">
                &ldquo;{TESTIMONIALS[activeIndex].quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <PixelAvatar seed={TESTIMONIALS[activeIndex].id} />
                <div className="text-left">
                  <p className="font-pixel text-xs text-white">
                    {TESTIMONIALS[activeIndex].author.toUpperCase()}
                  </p>
                  <p className="text-sm text-[#a1a1aa]">
                    {TESTIMONIALS[activeIndex].role}, {TESTIMONIALS[activeIndex].company}
                  </p>
                </div>
              </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Previous button */}
            <button
              onClick={() => {
                setActiveIndex((prev) =>
                  prev === 0 ? TESTIMONIALS.length - 1 : prev - 1
                );
                setIsAutoPlaying(false);
              }}
              className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={cn(
                    "w-3 h-3 transition-all",
                    activeIndex === index
                      ? "bg-[#9FDE5A]"
                      : "bg-[#262626] hover:bg-[#9FDE5A]/50"
                  )}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              onClick={() => {
                setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
                setIsAutoPlaying(false);
              }}
              className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
