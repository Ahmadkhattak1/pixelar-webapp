"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkle } from "@phosphor-icons/react";

const templates = [
    {
        id: "t1",
        title: "Cyberpunk Character",
        image: "/templates/cyberpunk.png",
        prompt: "Cyberpunk street samurai, neon armor, glowing katana, pixel art style",
        color: "from-pink-500/20 to-purple-500/20",
    },
    {
        id: "t2",
        title: "Fantasy Landscape",
        image: "/templates/fantasy.png",
        prompt: "Magical forest clearing, ancient ruins, floating crystals, ethereal lighting",
        color: "from-green-500/20 to-emerald-500/20",
    },
    {
        id: "t3",
        title: "Space Station",
        image: "/templates/space.png",
        prompt: "Sci-fi space station interior, metallic walls, control panels, holographic displays",
        color: "from-blue-500/20 to-cyan-500/20",
    },
    {
        id: "t4",
        title: "Dungeon Boss",
        image: "/templates/boss.png",
        prompt: "Menacing dungeon boss, dark armor, flaming sword, red eyes, pixel art",
        color: "from-red-500/20 to-orange-500/20",
    },
];

export function TemplateSection() {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Image
                        src="/svg-assets/template.svg"
                        alt="Templates"
                        width={20}
                        height={20}
                        style={{
                            filter: 'invert(84%) sepia(35%) saturate(1000%) hue-rotate(95deg) brightness(103%) contrast(96%)'
                        }}
                    />
                    Use Templates
                </h2>
                <Button variant="ghost" className="text-text-muted hover:text-primary">
                    View All
                </Button>
            </div>

            <div className="p-6 rounded-xl border border-primary/10 bg-surface/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-surface cursor-pointer hover:border-primary transition-colors duration-150"
                        >
                            {/* Placeholder for Image - In real app, use actual images */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-50 group-hover:opacity-70 transition-opacity duration-150`} />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <h3 className="font-semibold text-white mb-1">
                                    {template.title}
                                </h3>
                                <p className="text-xs text-white/70 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    {template.prompt}
                                </p>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <Sparkle className="w-4 h-4 text-primary-foreground" weight="fill" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
