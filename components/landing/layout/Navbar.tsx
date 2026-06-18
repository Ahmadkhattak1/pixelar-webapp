"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/landing-constants";
import { Button } from "@/components/landing/ui/Button";
import { Container } from "./Container";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#262626]"
          : "bg-transparent"
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <Image
                src="/logo.svg"
                alt="Pixelar Logo"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-[#9FDE5A] opacity-0 group-hover:opacity-30 blur-lg transition-opacity rounded-lg" />
            </div>
            <span className="font-pixel text-sm sm:text-base text-white group-hover:text-[#9FDE5A] transition-colors">
              PIXELAR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#a1a1aa] hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9FDE5A] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* App links */}
          <div className="hidden md:flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="primary" size="sm" glow>
              <Link href="/home">Open App</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen && "rotate-45 translate-y-2"
                )}
              />
              <span
                className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "w-full h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen && "-rotate-45 -translate-y-2"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4 border-t border-[#262626]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#a1a1aa] hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button asChild variant="secondary" size="sm">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="primary" size="sm" glow>
                <Link href="/home" onClick={() => setIsMobileMenuOpen(false)}>
                  Open App
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
