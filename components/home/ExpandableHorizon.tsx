"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, ArrowRight, Play, Cube, Mountains, Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";


// --- Animation Components ---

// 16x16 sprite pixel map - each character represents a pixel type
// . = empty, H = hair, F = face, E = eye, B = body, A = arm, L = leg frame 1, l = leg frame 2, S = slime, s = slime highlight
const SPRITE_MAP = `
................
................
.....HHHH.......
....HHHHHH......
....FFFFFF......
....FEEFEF......
....FFFFFF......
.....FFFF.......
....BBBBBB......
...ABBBBBBA.....
...ABBBBBBA.....
....BBBBBB......
.....BBBB.......
....Ll..lL......
....Ll..lL......
................
`;

const SLIME_MAP = `
................
................
................
................
................
................
................
................
............SS..
...........SSSS.
...........sSSS.
...........SSSS.
............SS..
................
................
................
`;

function SpriteAnimation({ isHovered }: { isHovered: boolean }) {
    const spriteRows = SPRITE_MAP.trim().split('\n');
    const slimeRows = SLIME_MAP.trim().split('\n');

    const getPixelType = (row: number, col: number): string => {
        if (row < spriteRows.length && col < spriteRows[row].length) {
            return spriteRows[row][col];
        }
        return '.';
    };

    const getSlimeType = (row: number, col: number): string => {
        if (row < slimeRows.length && col < slimeRows[row].length) {
            return slimeRows[row][col];
        }
        return '.';
    };

    return (
        <div className="relative w-48 h-48 transition-transform duration-700 ease-out">
            <div className={cn(
                "absolute inset-0 bg-primary/20 blur-[80px] rounded-full transition-opacity duration-700",
                isHovered ? "opacity-60" : "opacity-0"
            )} />

            {/* 16x16 Grid */}
            <div className={cn(
                "absolute inset-0 grid gap-[1px] transition-all duration-500",
                isHovered ? "opacity-100 scale-105" : "opacity-70 scale-100"
            )}
                style={{ gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(16, 1fr)' }}
            >
                {[...Array(256)].map((_, i) => {
                    const row = Math.floor(i / 16);
                    const col = i % 16;
                    const pixelType = getPixelType(row, col);
                    const slimeType = getSlimeType(row, col);

                    let pixelClass = 'bg-white/[0.03]';
                    let style: React.CSSProperties = {};

                    // Character pixels
                    switch (pixelType) {
                        case 'H': // Hair
                            pixelClass = 'bg-primary z-10';
                            break;
                        case 'F': // Face
                            pixelClass = 'bg-[#ffdbac] z-10';
                            break;
                        case 'E': // Eyes
                            pixelClass = 'bg-[#2d3748] z-10';
                            break;
                        case 'B': // Body
                            pixelClass = 'bg-primary/90 z-10';
                            break;
                        case 'A': // Arms
                            pixelClass = 'bg-primary/70 z-10';
                            style = { animation: isHovered ? 'arm-swing 0.6s ease-in-out infinite alternate' : 'none' };
                            break;
                        case 'L': // Leg frame 1
                            pixelClass = 'bg-[#4a5568] z-10';
                            style = { animation: isHovered ? 'toggle-visibility 0.5s steps(1) infinite' : 'none' };
                            break;
                        case 'l': // Leg frame 2
                            pixelClass = 'bg-[#4a5568] z-10';
                            style = { opacity: 0, animation: isHovered ? 'toggle-visibility-reverse 0.5s steps(1) infinite' : 'none' };
                            break;
                    }

                    // Slime pixels (overlay)
                    if (slimeType === 'S') {
                        pixelClass = 'bg-[#9FDE5A] z-10';
                        style = { animation: isHovered ? 'slime-bounce 0.8s ease-in-out infinite' : 'none' };
                    } else if (slimeType === 's') {
                        pixelClass = 'bg-[#c4f084] z-10';
                        style = { animation: isHovered ? 'slime-bounce 0.8s ease-in-out infinite' : 'none' };
                    }

                    return (
                        <div
                            key={i}
                            className={`rounded-[1px] transition-all duration-300 ${pixelClass}`}
                            style={style}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// 16x12 pixel art scene map
// . = sky, * = star, S = sun, C = cloud, M = mountain back, m = mountain front, T = tree trunk, t = tree leaves, G = grass, W = water, w = water highlight
const SCENE_MAP = `
...*...S...*....
....C.....*.....
...CCC..........
................
.MMM..MMMMMM....
MMMMMMMMMMMMMM..
mmmmttmmmmttmmmm
GGGGTtGGGGTtGGGG
GGGGTTGGGGTTGGGG
GGGGGGGGGGGGwwww
wwwwwwwwwwwWWWWW
WWWWWWWWWWWWwwww
`;

function SceneAnimation({ isHovered }: { isHovered: boolean }) {
    const sceneRows = SCENE_MAP.trim().split('\n');

    const getScenePixel = (row: number, col: number): string => {
        if (row < sceneRows.length && col < sceneRows[row].length) {
            return sceneRows[row][col];
        }
        return '.';
    };

    return (
        <div className="relative w-56 h-44 flex items-center justify-center">
            {/* Glow */}
            <div className={cn(
                "absolute inset-0 bg-teal-500/20 blur-[60px] rounded-full transition-opacity duration-500 pointer-events-none",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* Pixel Grid Container */}
            <div className={cn(
                "absolute inset-0 rounded-2xl overflow-hidden border transition-all duration-500",
                isHovered
                    ? "border-white/[0.15] shadow-2xl scale-100"
                    : "border-white/[0.08] shadow-lg scale-[0.97]"
            )}>
                {/* Sky base */}
                <div className="absolute inset-0 bg-[#0c1929]" />

                {/* 16x12 Pixel Grid */}
                <div
                    className={cn(
                        "absolute inset-0 grid gap-[1px] transition-all duration-500",
                        isHovered ? "opacity-100" : "opacity-80"
                    )}
                    style={{ gridTemplateColumns: 'repeat(16, 1fr)', gridTemplateRows: 'repeat(12, 1fr)' }}
                >
                    {[...Array(192)].map((_, i) => {
                        const row = Math.floor(i / 16);
                        const col = i % 16;
                        const pixelType = getScenePixel(row, col);

                        let pixelClass = 'bg-transparent';
                        let style: React.CSSProperties = {};

                        switch (pixelType) {
                            case '*': // Stars
                                pixelClass = 'bg-white/90 rounded-full';
                                style = {
                                    boxShadow: '0 0 4px rgba(255,255,255,0.8)',
                                    animationName: isHovered ? 'twinkle-star' : 'none',
                                    animationDuration: '2s',
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${(col * 0.3) % 2}s`
                                };
                                break;
                            case 'S': // Sun
                                pixelClass = 'bg-amber-300 rounded-full';
                                style = {
                                    boxShadow: isHovered ? '0 0 12px rgba(251,191,36,0.8)' : '0 0 6px rgba(251,191,36,0.5)',
                                    animation: isHovered ? 'pulse-sun 3s ease-in-out infinite' : 'none'
                                };
                                break;
                            case 'C': // Clouds
                                pixelClass = 'bg-white/30 rounded-sm';
                                style = {
                                    animationName: isHovered ? 'float-cloud' : 'none',
                                    animationDuration: '4s',
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${col * 0.1}s`
                                };
                                break;
                            case 'M': // Mountain back
                                pixelClass = 'bg-teal-800/80';
                                break;
                            case 'm': // Mountain front
                                pixelClass = 'bg-teal-700/90';
                                break;
                            case 'T': // Tree trunk
                                pixelClass = 'bg-amber-900';
                                break;
                            case 't': // Tree leaves
                                pixelClass = 'bg-emerald-500';
                                style = {
                                    animationName: isHovered ? 'sway-tree' : 'none',
                                    animationDuration: '2s',
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${col * 0.2}s`
                                };
                                break;
                            case 'G': // Grass
                                pixelClass = 'bg-emerald-600';
                                break;
                            case 'W': // Water deep
                                pixelClass = 'bg-cyan-600';
                                style = {
                                    animationName: isHovered ? 'wave-water' : 'none',
                                    animationDuration: '1.5s',
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${col * 0.1}s`
                                };
                                break;
                            case 'w': // Water highlight
                                pixelClass = 'bg-cyan-400';
                                style = {
                                    animationName: isHovered ? 'wave-water' : 'none',
                                    animationDuration: '1.5s',
                                    animationTimingFunction: 'ease-in-out',
                                    animationIterationCount: 'infinite',
                                    animationDelay: `${col * 0.1 + 0.2}s`
                                };
                                break;
                        }

                        return (
                            <div
                                key={i}
                                className={`transition-all duration-300 ${pixelClass}`}
                                style={style}
                            />
                        );
                    })}
                </div>

                {/* Animated birds */}
                <div className={cn(
                    "absolute top-6 transition-all duration-700",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                    style={{ animation: isHovered ? 'fly-bird 6s linear infinite' : 'none' }}
                >
                    <div className="flex gap-[2px]">
                        <div className="w-1 h-1 bg-slate-700 rounded-full" style={{ animation: isHovered ? 'flap-wing 0.3s ease-in-out infinite' : 'none' }} />
                        <div className="w-1.5 h-1 bg-slate-800 rounded-full" />
                        <div className="w-1 h-1 bg-slate-700 rounded-full" style={{ animation: isHovered ? 'flap-wing 0.3s ease-in-out infinite reverse' : 'none' }} />
                    </div>
                </div>

                {/* Second bird */}
                <div className={cn(
                    "absolute top-10 transition-all duration-700",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
                    style={{
                        animationName: isHovered ? 'fly-bird' : 'none',
                        animationDuration: '8s',
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                        animationDelay: '2s'
                    }}
                >
                    <div className="flex gap-[1px] scale-75">
                        <div className="w-1 h-1 bg-slate-600 rounded-full" style={{ animation: isHovered ? 'flap-wing 0.25s ease-in-out infinite' : 'none' }} />
                        <div className="w-1 h-1 bg-slate-700 rounded-full" />
                        <div className="w-1 h-1 bg-slate-600 rounded-full" style={{ animation: isHovered ? 'flap-wing 0.25s ease-in-out infinite reverse' : 'none' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MotionAnimation({ isHovered }: { isHovered: boolean }) {
    return (
        <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
            {/* Film Strips */}
            <div className={cn("absolute inset-y-0 left-0 flex gap-3 h-20 top-10 w-[200%] transition-opacity duration-500", isHovered ? "opacity-50" : "opacity-20")}
                style={{ animation: isHovered ? 'slide-strip 10s linear infinite' : 'none' }}>
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 border border-violet-400/30 bg-violet-400/10 rounded-md relative backdrop-blur-sm">
                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-violet-400/30 rounded-sm" />
                    </div>
                ))}
            </div>

            {/* Play Button */}
            <div className={cn(
                "relative z-10 w-24 h-24 rounded-2xl border bg-violet-500/20 flex items-center justify-center shadow-2xl backdrop-blur-xl transition-all duration-500",
                isHovered ? "scale-110 border-violet-400/50 shadow-[0_0_40px_rgba(139,92,246,0.4)]" : "scale-100 border-white/10"
            )}>
                <div className="absolute inset-0 bg-violet-500/20 rounded-2xl" />
                <Play weight="fill" className={cn("w-10 h-10 transition-all duration-300 relative z-10 drop-shadow-md", isHovered ? "text-white" : "text-violet-300")} />
            </div>
        </div>
    );
}

// --- Main Panel Component ---

interface PanelProps {
    id: string;
    title: string;
    href: string;
    icon: any;
    accentColor: string;
    glowColor: string;
    isActive: boolean;
    onHover: (id: string | null) => void;
    children: React.ReactNode;
}

function Panel({ id, title, href, icon: Icon, accentColor, glowColor, isActive, onHover, children }: PanelProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
        onHover(id);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        onHover(null);
    };

    return (
        <Link href={href} className="contents">
            <motion.div
                ref={cardRef}
                layout
                className={cn(
                    "relative h-[400px] md:h-[500px] rounded-3xl cursor-pointer group",
                    isActive ? "md:grow-[2]" : "md:grow-[1]",
                    !isActive && "md:hover:grow-[1.2]"
                )}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                initial={false}
                animate={{
                    flexGrow: isActive ? 2.5 : 1,
                    y: isActive ? -4 : 0,
                    scale: isActive ? 1.01 : 1
                }}
                transition={{
                    flexGrow: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    },
                    layout: {
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    },
                    y: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    },
                    scale: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25
                    }
                }}
            >
                {/* BORDER GLOW - only visible on the border edge */}
                <div
                    className="absolute inset-0 rounded-3xl transition-opacity duration-300 pointer-events-none"
                    style={{
                        opacity: isHovering ? 1 : 0,
                        background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}, ${glowColor} 30%, transparent 60%)`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        padding: '2px',
                        borderRadius: '24px',
                    }}
                />

                {/* Glass Card - FROSTED GLASS */}
                <div
                    className={cn(
                        "absolute inset-[1px] rounded-[23px] overflow-hidden backdrop-blur-2xl border z-10 transition-all duration-500",
                        isActive
                            ? "bg-white/[0.06] border-white/[0.2] shadow-2xl"
                            : "bg-white/[0.03] border-white/[0.12] shadow-lg group-hover:bg-white/[0.05] group-hover:border-white/[0.18] group-hover:shadow-xl"
                    )}
                    style={{
                        boxShadow: isActive
                            ? `0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)`
                            : `0 10px 40px -10px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`
                    }}
                >
                    {/* Frosted overlay */}
                    <div className="absolute inset-0 bg-[#0a0d12]/50" />

                    {/* Inner depth - top highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-white/25" />

                    {/* Inner depth - left highlight */}
                    <div className="absolute inset-y-0 left-0 w-px bg-white/10" />

                    {/* Inner depth - bottom shadow */}
                    <div className="absolute inset-x-0 bottom-0 h-px bg-black/40" />

                    {/* Corner accents */}
                    <div className={cn(
                        "absolute top-3 left-3 w-10 h-[1px] bg-white/25 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-40 group-hover:opacity-80"
                    )} />
                    <div className={cn(
                        "absolute top-3 left-3 w-[1px] h-10 bg-white/25 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-40 group-hover:opacity-80"
                    )} />
                    <div className={cn(
                        "absolute bottom-3 right-3 w-10 h-[1px] bg-white/15 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-20 group-hover:opacity-60"
                    )} />
                    <div className={cn(
                        "absolute bottom-3 right-3 w-[1px] h-10 bg-white/15 transition-opacity duration-300",
                        isActive ? "opacity-100" : "opacity-20 group-hover:opacity-60"
                    )} />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col p-6 md:p-8 z-10">
                        {/* Header with vibrant icon */}
                        <div className="flex items-start justify-between">
                            <div
                                className={cn(
                                    "p-3.5 rounded-2xl border transition-all duration-500",
                                    isActive
                                        ? "border-transparent"
                                        : "bg-white/5 border-white/5 group-hover:bg-white/10"
                                )}
                                style={isActive ? {
                                    background: `${accentColor}30`,
                                    boxShadow: `0 0 25px ${accentColor}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                                } : {}}
                            >
                                <Icon
                                    weight="fill"
                                    className={cn(
                                        "w-7 h-7 transition-all duration-300",
                                        isActive ? "text-white drop-shadow-lg" : "text-white/60 group-hover:text-white/80"
                                    )}
                                    style={isActive ? { filter: `drop-shadow(0 0 8px ${accentColor})` } : {}}
                                />
                            </div>

                            <motion.div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-300",
                                    isActive ? "bg-white/15 border-white/20" : "bg-white/5 border-white/10"
                                )}
                                animate={{
                                    opacity: isActive ? 1 : 0,
                                    scale: isActive ? 1 : 0.8,
                                    x: isActive ? 0 : 10
                                }}
                            >
                                <ArrowRight className="w-5 h-5 text-white" />
                            </motion.div>
                        </div>

                        {/* Animation Area */}
                        <div className="flex-1 flex items-center justify-center relative my-4">
                            {children}
                        </div>

                        {/* Title */}
                        <div className="relative z-10">
                            <motion.h3
                                layout
                                className={cn(
                                    "text-2xl md:text-3xl font-bold tracking-tight transition-all duration-300",
                                    isActive ? "text-white" : "text-white/60"
                                )}
                            >
                                {title}
                            </motion.h3>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

export function ExpandableHorizon() {
    const [focusedPanel, setFocusedPanel] = useState<string | null>(null);

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 min-h-[500px]">
            <Panel
                id="sprite"
                title="New Sprite"
                href="/sprites"
                icon={Sparkle}
                accentColor="#9FDE5A"
                glowColor="#9FDE5A80"
                isActive={focusedPanel === "sprite"}
                onHover={setFocusedPanel}
            >
                <SpriteAnimation isHovered={focusedPanel === "sprite"} />
            </Panel>

            <Panel
                id="scene"
                title="New Scene"
                href="/scenes"
                icon={Mountains}
                accentColor="#14b8a6"
                glowColor="#14b8a680"
                isActive={focusedPanel === "scene"}
                onHover={setFocusedPanel}
            >
                <SceneAnimation isHovered={focusedPanel === "scene"} />
            </Panel>

            <Panel
                id="motion"
                title="Sprite Sheet to GIF"
                href="/tools/gif-converter"
                icon={Lightning}
                accentColor="#8b5cf6"
                glowColor="#8b5cf680"
                isActive={focusedPanel === "motion"}
                onHover={setFocusedPanel}
            >
                <MotionAnimation isHovered={focusedPanel === "motion"} />
            </Panel>
        </div>
    );
}
