"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, ArrowRight, Play, Cube, Mountains, Lightning } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";


// --- Animation Components ---

function SpriteAnimation({ isHovered }: { isHovered: boolean }) {
    return (
        <div className="relative w-48 h-48 transition-transform duration-700 ease-out">
            <div className={cn(
                "absolute inset-0 bg-primary/30 blur-[60px] rounded-full transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* 10x10 Grid */}
            <div className={cn(
                "absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[3px] transition-all duration-500",
                isHovered ? "opacity-100 scale-105" : "opacity-70 scale-100"
            )}>
                {[...Array(100)].map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const isHead = (row === 2 && col >= 4 && col <= 5) || (row === 3 && col >= 4 && col <= 5);
                    const isTorso = (row >= 4 && row <= 6) && (col >= 3 && col <= 6);
                    const isLegsF1 = (row === 7 && (col === 2 || col === 7)) || (row === 8 && (col === 2 || col === 7));
                    const isLegsF2 = (row === 7 && (col === 4 || col === 5)) || (row === 8 && (col === 4 || col === 5));
                    const isPet = (row >= 7 && row <= 8) && (col >= 8 && col <= 9);

                    let pixelClass = 'bg-white/[0.04]';
                    let style: React.CSSProperties = {};

                    if (isHead) pixelClass = 'bg-primary z-10 shadow-[0_0_12px_rgba(16,185,129,0.6)]';
                    else if (isTorso) pixelClass = 'bg-primary/90 z-10';
                    else if (isLegsF1) {
                        pixelClass = 'bg-primary/80 z-10';
                        style = { animation: isHovered ? 'toggle-visibility 0.8s steps(1) infinite' : 'none' };
                    }
                    else if (isLegsF2) {
                        pixelClass = 'bg-primary/80 z-10';
                        style = { opacity: 0, animation: isHovered ? 'toggle-visibility-reverse 0.8s steps(1) infinite' : 'none' };
                    }
                    if (isPet) {
                        pixelClass = 'bg-[#b4e86b] z-10 shadow-[0_0_10px_rgba(159,222,90,0.9)]';
                        style = { animation: isHovered ? 'slime-bounce 1s ease-in-out infinite' : 'none' };
                    }

                    return (
                        <div key={i} className={`rounded-[1px] transition-all duration-300 ${pixelClass}`} style={style} />
                    );
                })}
            </div>
        </div>
    );
}

function SceneAnimation({ isHovered }: { isHovered: boolean }) {
    return (
        <div className="relative w-64 h-48 perspective-[1000px] flex items-center justify-center">
            <div className={cn(
                "absolute inset-0 bg-teal-500/20 blur-[60px] rounded-full transition-opacity duration-500 pointer-events-none",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* Sky Background */}
            <div className={cn(
                "absolute inset-0 rounded-2xl bg-[#0a1220] border border-white/[0.08] overflow-hidden transition-all duration-500",
                isHovered ? "scale-100 shadow-2xl" : "scale-[0.97] shadow-lg"
            )}>
                {/* Static Stars */}
                <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-3 left-8 w-1 h-1 bg-white rounded-full" />
                    <div className="absolute top-7 right-10 w-0.5 h-0.5 bg-white/80 rounded-full" />
                    <div className="absolute top-5 left-1/3 w-1 h-1 bg-teal-200/60 rounded-full" />
                    <div className="absolute top-10 left-12 w-0.5 h-0.5 bg-white/60 rounded-full" />
                </div>

                {/* Sun/Moon */}
                <div className={cn(
                    "absolute top-3 right-6 w-8 h-8 rounded-full bg-primary/40 transition-all duration-700",
                    isHovered ? "opacity-100 scale-110" : "opacity-40 scale-100"
                )}
                    style={{ animation: isHovered ? 'pulse 3s ease-in-out infinite' : 'none', boxShadow: isHovered ? '0 0 20px rgba(45, 212, 191, 0.5)' : 'none' }}
                />
            </div>

            {/* Mountains */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl overflow-hidden transition-all duration-500",
                isHovered ? "translate-y-0" : "translate-y-1"
            )}>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#042f2e" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <path d="M0 100 L0 60 Q30 30, 60 50 Q90 70, 120 40 Q150 10, 180 50 Q210 90, 256 60 L256 100 Z" fill="url(#mountainGrad2)" />
                    <path d="M0 100 L0 80 Q40 50, 80 70 Q120 90, 160 60 Q200 30, 256 70 L256 100 Z" fill="url(#mountainGrad1)" />
                </svg>
            </div>

            {/* Foreground */}
            <div className={cn(
                "absolute bottom-3 inset-x-4 h-14 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl transition-all duration-500 flex items-center justify-center",
                isHovered ? "translate-y-0 bg-white/10 border-teal-500/30" : "translate-y-2"
            )}>
                <ImageIcon weight="duotone" className={cn(
                    "w-7 h-7 text-teal-400/70 transition-all duration-500",
                    isHovered ? "scale-110 text-teal-300" : "scale-100"
                )} />
            </div>

            {/* Clouds */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div className={cn("absolute top-5 w-14 h-4 bg-white/10 blur-lg rounded-full transition-opacity duration-500", isHovered ? "opacity-100" : "opacity-0")}
                    style={{ animation: isHovered ? 'scene-cloud-drift 8s ease-in-out infinite' : 'none', left: '-16px' }} />
                <div className={cn("absolute top-12 w-16 h-5 bg-white/5 blur-lg rounded-full transition-opacity duration-500", isHovered ? "opacity-100" : "opacity-0")}
                    style={{ animation: isHovered ? 'scene-cloud-drift-reverse 10s ease-in-out infinite' : 'none', right: '-20px', animationDelay: '1s' }} />
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
                animate={{ flexGrow: isActive ? 2.5 : 1 }}
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
                <div className="absolute inset-[1px] rounded-[23px] overflow-hidden backdrop-blur-2xl bg-white/[0.03] border border-white/[0.1] z-10">
                    {/* Frosted overlay */}
                    <div className="absolute inset-0 bg-[#0a0d12]/50" />

                    {/* Glass shine - top edge */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                    {/* Glass shine - left edge */}
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-white/15 via-transparent to-transparent" />

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
