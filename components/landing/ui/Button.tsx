"use client";

import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      glow = false,
      asChild = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Variants - No gradients, solid colors
          variant === "primary" && [
            "bg-[#9FDE5A] text-[#0a0a0a]",
            "hover:bg-[#7bc234]",
            "active:scale-95",
          ],
          variant === "secondary" && [
            "bg-[#1f1f1f] text-white border border-[#262626]",
            "hover:bg-[#262626] hover:border-[#9FDE5A]",
            "active:scale-95",
          ],
          variant === "outline" && [
            "bg-transparent text-[#9FDE5A] border-2 border-[#9FDE5A]",
            "hover:bg-[#9FDE5A]/10",
            "active:scale-95",
          ],
          variant === "ghost" && [
            "bg-transparent text-[#a1a1aa]",
            "hover:text-white hover:bg-white/5",
            "active:scale-95",
          ],
          // Sizes
          size === "sm" && "text-sm px-4 py-2",
          size === "md" && "text-base px-6 py-3",
          size === "lg" && "text-lg px-8 py-4",
          // Glow effect
          glow && variant === "primary" && [
            "shadow-lg shadow-[#9FDE5A]/30",
            "hover:shadow-xl hover:shadow-[#9FDE5A]/40",
          ],
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
