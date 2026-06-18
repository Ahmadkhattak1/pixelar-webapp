"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/landing/layout/Container";
import { SectionTitle } from "@/components/landing/ui/SectionTitle";
import { cn } from "@/lib/utils";

type FilterType = "all" | "sprites" | "scenes";

// Gallery items with real images from public folder
const GALLERY_ITEMS = [
  { id: 1, type: "sprites", title: "Knight Warrior", image: "/Knight Warrior.png" },
  { id: 2, type: "sprites", title: "Forest Goblin", image: "/Forest_Goblin.png" },
  { id: 3, type: "scenes", title: "Enchanted Forest", image: "/Enchanted_Forest.png" },
  { id: 4, type: "sprites", title: "Wizard Mage", image: "/Wizard_Mage.png" },
  { id: 5, type: "scenes", title: "Castle Dungeon", image: "/Castle_Dungeon.png" },
  { id: 6, type: "sprites", title: "Treasure Chest", image: "/Treasure_Chest.png" },
  { id: 7, type: "scenes", title: "Space Station", image: "/Space_Station.png" },
  { id: 8, type: "sprites", title: "Magic Potion", image: "/Potion.png" },
];

export function GallerySection() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredItems = filter === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.type === filter);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Sprites", value: "sprites" },
    { label: "Scenes", value: "scenes" },
  ];

  return (
    <section id="gallery" className="py-20 sm:py-32 bg-[#0a0a0a] relative">
      <div className="absolute inset-0 bg-pixel-grid opacity-30" />

      <Container className="relative z-10">
        <SectionTitle
          title="PLAYER CREATIONS"
          subtitle="See what's possible with Pixelar's AI generation"
        />

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all",
                filter === f.value
                  ? "bg-[#9FDE5A] text-white"
                  : "bg-[#141414] text-[#a1a1aa] hover:text-white hover:bg-[#262626]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-[#141414] border border-[#262626] overflow-hidden cursor-pointer hover:border-[#9FDE5A] transition-all"
            >
              {/* Real Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover pixelated group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-[#0a0a0a]/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-pixel text-[10px] text-white">{item.title.toUpperCase()}</p>
                  <p className="text-xs text-[#a1a1aa] capitalize">{item.type}</p>
                </div>
              </div>

              {/* Type badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0a0a0a]/80 text-[8px] text-[#a1a1aa] uppercase">
                {item.type}
              </div>

              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#9FDE5A] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#9FDE5A] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#9FDE5A] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#9FDE5A] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#141414] border border-[#262626] text-[#a1a1aa] hover:text-white hover:border-[#9FDE5A] transition-all">
            <span>View More Examples</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
}
