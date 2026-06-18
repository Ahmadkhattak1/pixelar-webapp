"use client";

import Link from "next/link";
import { Container } from "@/components/landing/layout/Container";
import { SectionTitle } from "@/components/landing/ui/SectionTitle";
import { Button } from "@/components/landing/ui/Button";
import { Badge } from "@/components/landing/ui/Badge";
import { PRICING_TIERS } from "@/lib/landing-constants";
import { cn } from "@/lib/utils";

// Character sprites for each tier
function TierCharacter({ tier }: { tier: string }) {
  const glowColors: Record<string, string> = {
    free: "#718096",
    pro: "#9FDE5A",
    byok: "#4DD9FF",
  };

  return (
    <div className="relative group">
      <svg
        width="80"
        height="96"
        viewBox="0 0 20 24"
        className="pixelated group-hover:animate-bounce-subtle"
      >
        {tier === "free" && (
          <>
            {/* Wanderer - Hooded traveler with staff and backpack */}
            {/* Hood */}
            <rect x="6" y="1" width="8" height="3" fill="#718096" />
            <rect x="5" y="3" width="10" height="2" fill="#718096" />
            {/* Face */}
            <rect x="7" y="4" width="6" height="5" fill="#FFD5B0" />
            {/* Eyes */}
            <rect x="8" y="5" width="1" height="1" fill="#2D3748" />
            <rect x="11" y="5" width="1" height="1" fill="#2D3748" />
            {/* Cloak Body */}
            <rect x="5" y="9" width="10" height="8" fill="#718096" />
            <rect x="6" y="10" width="8" height="6" fill="#A0AEC0" />
            {/* Belt */}
            <rect x="6" y="13" width="8" height="1" fill="#8B4513" />
            {/* Backpack (side view) */}
            <rect x="14" y="9" width="3" height="6" fill="#8B4513" />
            <rect x="15" y="10" width="1" height="4" fill="#A0AEC0" />
            {/* Walking Staff */}
            <rect x="2" y="4" width="2" height="18" fill="#8B4513" />
            <rect x="1" y="3" width="4" height="2" fill="#8B4513" />
            {/* Legs */}
            <rect x="6" y="17" width="3" height="5" fill="#4A5568" />
            <rect x="11" y="17" width="3" height="5" fill="#4A5568" />
            {/* Feet */}
            <rect x="5" y="22" width="4" height="2" fill="#2D3748" />
            <rect x="11" y="22" width="4" height="2" fill="#2D3748" />
          </>
        )}
        {tier === "pro" && (
          <>
            {/* Knight - Full armor with sword and shield */}
            {/* Helmet */}
            <rect x="6" y="0" width="8" height="3" fill="#718096" />
            <rect x="5" y="2" width="10" height="2" fill="#718096" />
            <rect x="8" y="1" width="4" height="1" fill="#FFD700" />
            {/* Helmet visor */}
            <rect x="7" y="3" width="6" height="1" fill="#2D3748" />
            {/* Face through visor */}
            <rect x="7" y="4" width="6" height="4" fill="#FFD5B0" />
            <rect x="6" y="4" width="1" height="4" fill="#718096" />
            <rect x="13" y="4" width="1" height="4" fill="#718096" />
            {/* Eyes */}
            <rect x="8" y="5" width="1" height="1" fill="#2D3748" />
            <rect x="11" y="5" width="1" height="1" fill="#2D3748" />
            {/* Armor Body */}
            <rect x="5" y="8" width="10" height="8" fill="#718096" />
            <rect x="7" y="9" width="6" height="5" fill="#A0AEC0" />
            <rect x="8" y="10" width="4" height="3" fill="#9FDE5A" />
            <rect x="9" y="11" width="2" height="1" fill="#FFD700" />
            {/* Shield (left) */}
            <rect x="1" y="8" width="4" height="7" fill="#9FDE5A" />
            <rect x="2" y="9" width="2" height="5" fill="#7bc234" />
            <rect x="2" y="10" width="2" height="1" fill="#FFD700" />
            {/* Sword (right) */}
            <rect x="15" y="4" width="2" height="10" fill="#A0AEC0" />
            <rect x="14" y="13" width="4" height="2" fill="#8B4513" />
            <rect x="15" y="3" width="2" height="1" fill="#E2E8F0" />
            {/* Legs */}
            <rect x="6" y="16" width="3" height="6" fill="#718096" />
            <rect x="11" y="16" width="3" height="6" fill="#718096" />
            {/* Feet */}
            <rect x="5" y="22" width="4" height="2" fill="#4A5568" />
            <rect x="11" y="22" width="4" height="2" fill="#4A5568" />
          </>
        )}
        {tier === "byok" && (
          <>
            {/* BYOK - Robot/Cyber character with key symbol */}
            {/* Robot Head */}
            <rect x="6" y="1" width="8" height="6" fill="#4DD9FF" />
            <rect x="5" y="2" width="10" height="4" fill="#38B2AC" />
            {/* Antenna */}
            <rect x="9" y="0" width="2" height="2" fill="#9FDE5A" />
            {/* Eyes (LED) */}
            <rect x="7" y="3" width="2" height="2" fill="#9FDE5A" />
            <rect x="11" y="3" width="2" height="2" fill="#9FDE5A" />
            {/* Mouth grid */}
            <rect x="8" y="5" width="4" height="1" fill="#0a0a0a" />
            {/* Body - Circuit patterns */}
            <rect x="5" y="7" width="10" height="9" fill="#38B2AC" />
            <rect x="6" y="8" width="8" height="7" fill="#4DD9FF" />
            {/* Key symbol on chest */}
            <rect x="9" y="9" width="2" height="4" fill="#FFD700" />
            <rect x="8" y="9" width="4" height="1" fill="#FFD700" />
            <rect x="10" y="11" width="2" height="1" fill="#FFD700" />
            {/* Circuit lines */}
            <rect x="6" y="10" width="2" height="1" fill="#9FDE5A" />
            <rect x="12" y="10" width="2" height="1" fill="#9FDE5A" />
            <rect x="6" y="13" width="2" height="1" fill="#9FDE5A" />
            <rect x="12" y="13" width="2" height="1" fill="#9FDE5A" />
            {/* Arms */}
            <rect x="2" y="8" width="3" height="6" fill="#38B2AC" />
            <rect x="15" y="8" width="3" height="6" fill="#38B2AC" />
            <rect x="2" y="12" width="3" height="2" fill="#4DD9FF" />
            <rect x="15" y="12" width="3" height="2" fill="#4DD9FF" />
            {/* Legs */}
            <rect x="6" y="16" width="3" height="6" fill="#38B2AC" />
            <rect x="11" y="16" width="3" height="6" fill="#38B2AC" />
            {/* Feet */}
            <rect x="5" y="22" width="4" height="2" fill="#4DD9FF" />
            <rect x="11" y="22" width="4" height="2" fill="#4DD9FF" />
          </>
        )}
      </svg>

      {/* Glow effect */}
      <div
        className="absolute -inset-4 opacity-0 group-hover:opacity-30 transition-opacity blur-xl"
        style={{ backgroundColor: glowColors[tier] || "#718096" }}
      />
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-[#141414] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-pixel-grid opacity-20" />

      {/* Floating decorations */}
      <div className="absolute top-20 left-[10%] w-3 h-3 bg-[#9FDE5A]/20 animate-float" />
      <div className="absolute bottom-40 right-[15%] w-4 h-4 bg-[#9FDE5A]/20 animate-float-slow" />
      <div className="absolute top-1/2 left-[5%] w-2 h-2 bg-[#FFD700]/20 animate-float" />

      <Container className="relative z-10">
        <SectionTitle
          title="CHOOSE YOUR CLASS"
          subtitle="Select the perfect plan for your game development needs"
        />

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative bg-[#0a0a0a] border transition-all group",
                tier.popular
                  ? "border-[#9FDE5A] scale-105 md:-translate-y-2"
                  : "border-[#262626] hover:border-[#9FDE5A]/50"
              )}
            >
              {/* Popular badge */}
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="popular">
                    <span className="flex items-center gap-1">
                      <span className="animate-pulse">★</span>
                      POPULAR
                      <span className="animate-pulse">★</span>
                    </span>
                  </Badge>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* Character */}
                <div className="flex justify-center mb-6">
                  <TierCharacter tier={tier.id} />
                </div>

                {/* Tier name */}
                <h3 className="font-pixel text-lg text-center text-white mb-2">
                  {tier.name.toUpperCase()}
                </h3>

                {/* Price */}
                <div className="text-center mb-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  {tier.period && (
                    <span className="text-[#a1a1aa]">{tier.period}</span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-[#a1a1aa] text-center mb-6">
                  {tier.description}
                </p>

                {/* Credits highlight */}
                <div className="bg-[#141414] border border-[#262626] p-3 mb-6 text-center">
                  <span className="text-sm text-[#a1a1aa]">Credits: </span>
                  <span className={cn(
                    "font-pixel text-sm",
                    tier.id === "byok" ? "text-[#4DD9FF]" : "text-[#9FDE5A]"
                  )}>
                    {tier.credits}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <svg
                        className="w-4 h-4 mt-0.5 text-[#9FDE5A] flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-[#a1a1aa]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  asChild
                  variant={tier.popular ? "primary" : "secondary"}
                  className="w-full"
                  glow={tier.popular}
                >
                  <Link href={tier.id === "byok" ? "/home" : "/login"}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#9FDE5A] opacity-50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#9FDE5A] opacity-50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#9FDE5A] opacity-50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#9FDE5A] opacity-50" />

              {/* Hover glow */}
              {tier.popular && (
                <div className="absolute -inset-px bg-[#9FDE5A] opacity-20 blur-sm -z-10" />
              )}
            </div>
          ))}
        </div>

        {/* Credit costs info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#a1a1aa]">
            Credit usage:{" "}
            <span className="text-white">Sprite (5)</span>
            {" • "}
            <span className="text-white">Scene (8)</span>
            {" • "}
            <span className="text-white">Animation (10)</span>
          </p>
        </div>
      </Container>
    </section>
  );
}
