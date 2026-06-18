"use client";

import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  centered = true,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(centered && "text-center", "mb-12 sm:mb-16", className)}>
      <h2 className="font-pixel text-lg sm:text-xl md:text-2xl text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      {/* Decorative pixel line */}
      <div className={cn("flex gap-1 mt-6", centered && "justify-center")}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#9FDE5A]"
            style={{ opacity: i === 2 ? 1 : 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}
