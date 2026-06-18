"use client";

import { Container } from "@/components/landing/layout/Container";
import { SectionTitle } from "@/components/landing/ui/SectionTitle";
import { Card, CardContent } from "@/components/landing/ui/Card";
import { CreditBadge } from "@/components/landing/ui/Badge";
import { FEATURES } from "@/lib/landing-constants";
import { cn } from "@/lib/utils";

// Feature icons as pixel-style SVGs
function FeatureIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactNode> = {
    zap: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)}>
        <rect x="7" y="0" width="2" height="3" fill="currentColor" />
        <rect x="6" y="3" width="4" height="2" fill="currentColor" />
        <rect x="5" y="5" width="6" height="2" fill="currentColor" />
        <rect x="4" y="7" width="8" height="2" fill="currentColor" />
        <rect x="7" y="9" width="2" height="2" fill="currentColor" />
        <rect x="7" y="11" width="2" height="3" fill="currentColor" />
        <rect x="6" y="14" width="4" height="2" fill="currentColor" />
      </svg>
    ),
    mountain: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)}>
        <rect x="7" y="2" width="2" height="2" fill="currentColor" />
        <rect x="6" y="4" width="4" height="2" fill="currentColor" />
        <rect x="5" y="6" width="6" height="2" fill="currentColor" />
        <rect x="4" y="8" width="8" height="2" fill="currentColor" />
        <rect x="3" y="10" width="10" height="2" fill="currentColor" />
        <rect x="2" y="12" width="12" height="2" fill="currentColor" />
        <rect x="1" y="14" width="14" height="2" fill="currentColor" />
      </svg>
    ),
    film: (
      <svg viewBox="0 0 16 16" className={cn("w-full h-full", className)}>
        <rect x="1" y="1" width="14" height="14" fill="currentColor" />
        <rect x="2" y="2" width="2" height="2" fill="#0a0a0a" />
        <rect x="2" y="6" width="2" height="2" fill="#0a0a0a" />
        <rect x="2" y="10" width="2" height="2" fill="#0a0a0a" />
        <rect x="12" y="2" width="2" height="2" fill="#0a0a0a" />
        <rect x="12" y="6" width="2" height="2" fill="#0a0a0a" />
        <rect x="12" y="10" width="2" height="2" fill="#0a0a0a" />
        <rect x="5" y="4" width="6" height="8" fill="#0a0a0a" />
        <rect x="6" y="6" width="2" height="4" fill="currentColor" />
        <rect x="8" y="7" width="2" height="2" fill="currentColor" />
      </svg>
    ),
  };

  return icons[type] || null;
}

// Animated feature demo
function FeatureDemo({ type }: { type: string }) {
  if (type === "sprite") {
    return (
      <div className="grid grid-cols-3 gap-2">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-12 h-12 bg-[#1f1f1f] flex items-center justify-center animate-pulse-glow"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="w-8 h-8 bg-[#9FDE5A]" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "scene") {
    return (
      <div className="relative w-full h-24 overflow-hidden">
        {/* Sky */}
        <div className="absolute inset-0 bg-[#141414]" />
        {/* Stars */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-blink-soft"
            style={{
              left: `${10 + i * 12}%`,
              top: `${10 + (i % 3) * 15}%`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="absolute bottom-0 left-[10%] w-0 h-0 border-l-[40px] border-r-[40px] border-b-[50px] border-l-transparent border-r-transparent border-b-[#262626]" />
          <div className="absolute bottom-0 left-[40%] w-0 h-0 border-l-[50px] border-r-[50px] border-b-[60px] border-l-transparent border-r-transparent border-b-[#3a3a5a]" />
          <div className="absolute bottom-0 right-[15%] w-0 h-0 border-l-[35px] border-r-[35px] border-b-[45px] border-l-transparent border-r-transparent border-b-[#262626]" />
        </div>
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#141414]" />
      </div>
    );
  }

  if (type === "animation") {
    return (
      <div className="flex items-center justify-center gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div
              className="w-10 h-14 bg-[#1f1f1f] flex items-center justify-center"
              style={{
                animation: i === 0 ? "none" : `bounce-subtle 0.5s ease-in-out infinite`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <svg
                width="32"
                height="48"
                viewBox="0 0 8 12"
                className="pixelated"
              >
                {/* Simple walking frame */}
                <rect x="2" y="0" width="4" height="3" fill="#FFD5B0" />
                <rect x="2" y="3" width="4" height="3" fill="#9FDE5A" />
                <rect
                  x={i % 2 === 0 ? 2 : 4}
                  y="6"
                  width="2"
                  height="3"
                  fill="#4A5568"
                />
                <rect
                  x={i % 2 === 0 ? 4 : 2}
                  y="6"
                  width="2"
                  height="3"
                  fill="#4A5568"
                  style={{ transform: i % 2 === 0 ? "translateY(2px)" : "none" }}
                />
              </svg>
            </div>
            <span className="font-pixel text-[6px] text-[#a1a1aa] mt-1 block text-center">
              F{i + 1}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-[#0a0a0a] relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-pixel-grid opacity-30" />

      <Container className="relative z-10">
        <SectionTitle
          title="YOUR PIXEL ARSENAL"
          subtitle="Everything you need to create stunning game assets with AI"
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <Card
              key={feature.id}
              hover
              glow
              className="group relative overflow-hidden"
            >
              <CardContent className="p-6 sm:p-8">
                {/* Icon */}
                <div className="w-12 h-12 mb-6 text-[#9FDE5A] group-hover:text-[#7bc234] transition-colors">
                  <FeatureIcon type={feature.icon} />
                </div>

                {/* Title and Credits */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="font-pixel text-sm text-white">{feature.title.toUpperCase()}</h3>
                  <CreditBadge credits={feature.credits} />
                </div>

                {/* Description */}
                <p className="text-[#a1a1aa] mb-6">{feature.description}</p>

                {/* Demo Area */}
                <div className="bg-[#0a0a0a] border border-[#262626] p-4 rounded-none">
                  <FeatureDemo type={feature.id} />
                </div>

                {/* Examples */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {feature.examples.slice(0, 3).map((example) => (
                    <span
                      key={example}
                      className="text-xs px-2 py-1 bg-[#1f1f1f] text-[#a1a1aa]"
                    >
                      {example}
                    </span>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#9FDE5A]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
