"use client";

import { cn } from "@/lib/utils";

interface PixelSpriteProps {
  type: "knight" | "wizard" | "goblin" | "slime" | "chest" | "potion";
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

// CSS-based pixel art sprites (no external images needed)
const SPRITE_DATA = {
  knight: {
    colors: ["#4a5568", "#718096", "#FFD700", "#805AD5", "#F56565"],
    pixels: [
      "  XX  ",
      " XXXX ",
      "XXXXXX",
      " XXXX ",
      " X  X ",
      " X  X ",
    ],
  },
  wizard: {
    colors: ["#805AD5", "#9F7AEA", "#FFD700", "#F8F8FF", "#4299E1"],
    pixels: [
      "  X   ",
      " XXX  ",
      "XXXXX ",
      " XXX  ",
      " XXX  ",
      " X X  ",
    ],
  },
  goblin: {
    colors: ["#48BB78", "#68D391", "#F56565", "#2D3748", "#F6E05E"],
    pixels: [
      " XXXX ",
      "XXXXXX",
      "X XX X",
      " XXXX ",
      "  XX  ",
      " X  X ",
    ],
  },
  slime: {
    colors: ["#48BB78", "#68D391", "#9AE6B4", "#2D3748", "#C6F6D5"],
    pixels: [
      "      ",
      " XXXX ",
      "XXXXXX",
      "XXXXXX",
      " XXXX ",
      "      ",
    ],
  },
  chest: {
    colors: ["#D69E2E", "#ECC94B", "#805AD5", "#2D3748", "#F6E05E"],
    pixels: [
      "XXXXXX",
      "XXXXXX",
      "XXXXXX",
      "X XX X",
      "XXXXXX",
      "XXXXXX",
    ],
  },
  potion: {
    colors: ["#805AD5", "#9F7AEA", "#D53F8C", "#4A5568", "#F8F8FF"],
    pixels: [
      "  XX  ",
      "  XX  ",
      " XXXX ",
      "XXXXXX",
      "XXXXXX",
      " XXXX ",
    ],
  },
};

const sizes = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
};

export function PixelSprite({
  type,
  size = "md",
  animated = false,
  className,
}: PixelSpriteProps) {
  const sprite = SPRITE_DATA[type];
  const pixelSize = sizes[size];

  return (
    <div
      className={cn(
        "inline-block",
        animated && "animate-bounce-subtle",
        className
      )}
      style={{
        width: pixelSize * 6,
        height: pixelSize * 6,
      }}
    >
      <div
        className="grid pixelated"
        style={{
          gridTemplateColumns: `repeat(6, ${pixelSize}px)`,
          gridTemplateRows: `repeat(6, ${pixelSize}px)`,
        }}
      >
        {sprite.pixels.map((row, rowIndex) =>
          row.split("").map((pixel, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: pixelSize,
                height: pixelSize,
                backgroundColor:
                  pixel === "X"
                    ? sprite.colors[(rowIndex + colIndex) % sprite.colors.length]
                    : "transparent",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Simple animated character for hero section
export function AnimatedCharacter({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Character body */}
      <div className="relative w-16 h-20 animate-bounce-subtle">
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#FFD5B0]">
          {/* Eyes */}
          <div className="absolute top-3 left-2 w-2 h-2 bg-[#2D3748]" />
          <div className="absolute top-3 right-2 w-2 h-2 bg-[#2D3748]" />
          {/* Mouth */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-[#2D3748]" />
        </div>
        {/* Hair/Helmet */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#9FDE5A]" />
        {/* Body */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-12 h-8 bg-[#9FDE5A]" />
        {/* Arms */}
        <div className="absolute top-12 left-0 w-2 h-6 bg-[#FFD5B0]" />
        <div className="absolute top-12 right-0 w-2 h-6 bg-[#FFD5B0]" />
        {/* Legs */}
        <div className="absolute bottom-0 left-4 w-3 h-4 bg-[#2D3748]" />
        <div className="absolute bottom-0 right-4 w-3 h-4 bg-[#2D3748]" />
      </div>
    </div>
  );
}
