"use client";

import { Navbar } from "@/components/landing/layout/Navbar";
import { Footer } from "@/components/landing/layout/Footer";
import { HeroSection } from "@/components/landing/sections/HeroSection";
import { FeaturesSection } from "@/components/landing/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/sections/HowItWorksSection";
import { GallerySection } from "@/components/landing/sections/GallerySection";
import { PricingSection } from "@/components/landing/sections/PricingSection";
import { TestimonialsSection } from "@/components/landing/sections/TestimonialsSection";
import { CTASection } from "@/components/landing/sections/CTASection";
import { useLandingKonamiCode } from "@/hooks/useLandingKonamiCode";

export default function LandingPage() {
  useLandingKonamiCode();

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <GallerySection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
