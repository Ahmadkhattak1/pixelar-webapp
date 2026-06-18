"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  glowColor?: "primary" | "green" | "cyan" | "pink";
}

export function Card({
  children,
  className,
  hover = false,
  glow = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[#141414] border border-[#262626] rounded-none",
        hover && [
          "transition-all duration-300",
          "hover:-translate-y-1",
          "hover:border-[#9FDE5A]/50",
        ],
        glow && [
          "hover:shadow-lg",
          "hover:shadow-[#9FDE5A]/20",
        ],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 border-b border-[#262626]", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-6 border-t border-[#262626]", className)}>
      {children}
    </div>
  );
}
