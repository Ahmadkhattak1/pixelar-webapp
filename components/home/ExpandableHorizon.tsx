"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, ArrowRight, Play } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// --- Animation Components ---

function SpriteAnimation({ isHovered }: { isHovered: boolean }) {
    return (
        <div className="relative w-48 h-48 transition-transform duration-700 ease-out group-hover:scale-105">
            <div className={cn(
                "absolute inset-0 bg-primary/20 blur-[60px] rounded-full transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* 10x10 Grid */}
            <div className={cn(
                "absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[3px] transition-opacity duration-500",
                isHovered ? "opacity-100" : "opacity-70"
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

                    if (isHead) pixelClass = 'bg-primary z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
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
                        pixelClass = 'bg-emerald-300 z-10 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
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
            {/* Glow */}
            <div className={cn(
                "absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full transition-opacity duration-500 pointer-events-none",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* Sky Background */}
            <div className={cn(
                "absolute inset-0 rounded-2xl bg-gradient-to-b from-[#0a1628] via-[#0f2027] to-[#0a1a1a] border border-white/[0.05] overflow-hidden transition-all duration-500",
                isHovered ? "scale-100 shadow-2xl" : "scale-[0.97] shadow-lg"
            )}>
                {/* Static Stars */}
                <div className="absolute inset-0 opacity-50">
                    <div className="absolute top-3 left-8 w-1 h-1 bg-white rounded-full" />
                    <div className="absolute top-7 right-10 w-0.5 h-0.5 bg-white/80 rounded-full" />
                    <div className="absolute top-5 left-1/3 w-1 h-1 bg-emerald-200/60 rounded-full" />
                    <div className="absolute top-10 left-12 w-0.5 h-0.5 bg-white/60 rounded-full" />
                    <div className="absolute top-4 right-16 w-0.5 h-0.5 bg-emerald-100/50 rounded-full" />
                </div>

                {/* Sun/Moon - pulses on hover */}
                <div className={cn(
                    "absolute top-3 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400/40 to-teal-300/20 transition-all duration-700",
                    isHovered ? "opacity-100 scale-110" : "opacity-50 scale-100"
                )}
                    style={{ animation: isHovered ? 'pulse 3s ease-in-out infinite' : 'none' }}
                />
                <div className={cn(
                    "absolute top-4 right-7 w-6 h-6 rounded-full bg-emerald-300/30 blur-md transition-opacity duration-500",
                    isHovered ? "opacity-100" : "opacity-30"
                )} />
            </div>

            {/* Mountains/Hills Layer */}
            <div className={cn(
                "absolute bottom-0 left-0 right-0 h-24 rounded-b-2xl overflow-hidden transition-all duration-500",
                isHovered ? "translate-y-0" : "translate-y-1"
            )}>
                {/* Mountain silhouettes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 100" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#065f46" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
                        </linearGradient>
                        <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#047857" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.7" />
                        </linearGradient>
                    </defs>
                    {/* Back mountain */}
                    <path
                        d="M0 100 L0 60 Q30 30, 60 50 Q90 70, 120 40 Q150 10, 180 50 Q210 90, 256 60 L256 100 Z"
                        fill="url(#mountainGrad2)"
                        className={cn("transition-transform duration-700", isHovered ? "translate-x-0" : "translate-x-2")}
                    />
                    {/* Front mountain */}
                    <path
                        d="M0 100 L0 80 Q40 50, 80 70 Q120 90, 160 60 Q200 30, 256 70 L256 100 Z"
                        fill="url(#mountainGrad1)"
                        className={cn("transition-transform duration-500", isHovered ? "translate-x-0" : "-translate-x-1")}
                    />
                </svg>
            </div>

            {/* Foreground Platform */}
            <div className={cn(
                "absolute bottom-3 inset-x-4 h-16 bg-surface/50 backdrop-blur-md rounded-xl border border-white/10 shadow-xl overflow-hidden transition-all duration-500 flex items-center justify-center",
                isHovered ? "translate-y-0 bg-surface/70 border-primary/30" : "translate-y-3"
            )}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <ImageIcon weight="duotone" className={cn(
                    "w-8 h-8 text-emerald-400/60 transition-all duration-500",
                    isHovered ? "scale-110 text-emerald-300" : "scale-100"
                )} />
            </div>

            {/* Clouds - Only animate on hover */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div
                    className={cn(
                        "absolute top-5 w-14 h-4 bg-white/10 blur-lg rounded-full transition-opacity duration-500",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        animation: isHovered ? 'scene-cloud-drift 8s ease-in-out infinite' : 'none',
                        left: '-16px'
                    }}
                />
                <div
                    className={cn(
                        "absolute top-12 w-16 h-5 bg-white/5 blur-lg rounded-full transition-opacity duration-500",
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                    style={{
                        animation: isHovered ? 'scene-cloud-drift-reverse 10s ease-in-out infinite' : 'none',
                        right: '-20px',
                        animationDelay: '1s'
                    }}
                />
            </div>
        </div>
    );
}

function MotionAnimation({ isHovered }: { isHovered: boolean }) {
    return (
        <div className="relative w-full h-40 flex items-center justify-center overflow-hidden">
            {/* Film Strips - Only animate on hover */}
            <div className={cn(
                "absolute inset-y-0 left-0 flex gap-3 h-20 top-10 w-[200%] transition-opacity duration-500",
                isHovered ? "opacity-50" : "opacity-20"
            )}
                style={{ animation: isHovered ? 'slide-strip 10s linear infinite' : 'none' }}
            >
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex-1 border border-violet-400/20 bg-violet-400/5 rounded-md relative">
                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-violet-400/20 rounded-sm" />
                    </div>
                ))}
            </div>

            {/* Play Button */}
            <div className={cn(
                "relative z-10 w-24 h-24 rounded-2xl border border-white/10 bg-violet-500/10 flex items-center justify-center shadow-2xl backdrop-blur-xl transition-all duration-500",
                isHovered ? "scale-110 border-violet-500/40 shadow-violet-500/30 bg-violet-500/20" : "scale-100"
            )}>
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent rounded-2xl" />
                <Play weight="fill" className={cn(
                    "w-10 h-10 transition-colors duration-300 relative z-10 drop-shadow-md",
                    isHovered ? "text-white" : "text-violet-300"
                )} />
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
    isActive: boolean;
    onHover: (id: string | null) => void;
    children: React.ReactNode;
}

function Panel({ id, title, href, icon: Icon, accentColor, isActive, onHover, children }: PanelProps) {
    return (
        <Link href={href} className="contents">
            <motion.div
                layout
                className={cn(
                    "relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer group transition-all duration-500",
                    isActive ? "md:grow-[2]" : "md:grow-[1]",
                    !isActive && "md:hover:grow-[1.2]"
                )}
                onMouseEnter={() => onHover(id)}
                onMouseLeave={() => onHover(null)}
                initial={false}
                animate={{ flexGrow: isActive ? 2.5 : 1 }}
            >
                {/* Glassmorphism Background */}
                <div className={cn(
                    "absolute inset-0 backdrop-blur-xl transition-all duration-500",
                    isActive ? "bg-[#0f111a]/50" : "bg-[#0f111a]/70"
                )} />

                {/* Gradient tint */}
                <div
                    className={cn(
                        "absolute inset-0 opacity-0 transition-opacity duration-700",
                        isActive ? "opacity-25" : "group-hover:opacity-10"
                    )}
                    style={{ background: `linear-gradient(to bottom right, ${accentColor}, transparent)` }}
                />

                {/* Border */}
                <div className={cn(
                    "absolute inset-0 rounded-3xl border transition-colors duration-500 pointer-events-none z-20",
                    isActive ? "border-white/20" : "border-white/5 group-hover:border-white/10"
                )} />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col p-6 md:p-8 z-10">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div
                            className={cn(
                                "p-3 rounded-2xl border transition-all duration-300 bg-white/5 border-white/5 group-hover:bg-white/10",
                                isActive ? "text-white" : "text-text-muted"
                            )}
                            style={isActive ? { backgroundColor: `${accentColor}33`, borderColor: `${accentColor}4D` } : {}}
                        >
                            <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        <motion.div
                            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10"
                            animate={{
                                opacity: isActive ? 1 : 0,
                                scale: isActive ? 1 : 0.8,
                                rotate: isActive ? 0 : -45
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
                                "text-2xl md:text-3xl font-bold tracking-tight transition-colors duration-300",
                                isActive ? "text-white" : "text-white/70"
                            )}
                        >
                            {title}
                        </motion.h3>
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
                accentColor="#10b981"
                isActive={focusedPanel === "sprite"}
                onHover={setFocusedPanel}
            >
                <SpriteAnimation isHovered={focusedPanel === "sprite"} />
            </Panel>

            <Panel
                id="scene"
                title="New Scene"
                href="/scenes"
                icon={ImageIcon}
                accentColor="#34d399"
                isActive={focusedPanel === "scene"}
                onHover={setFocusedPanel}
            >
                <SceneAnimation isHovered={focusedPanel === "scene"} />
            </Panel>

            <Panel
                id="motion"
                title="Sprite Sheet to GIF"
                href="/tools/gif-converter"
                icon={FilmStrip}
                accentColor="#8b5cf6"
                isActive={focusedPanel === "motion"}
                onHover={setFocusedPanel}
            >
                <MotionAnimation isHovered={focusedPanel === "motion"} />
            </Panel>
        </div>
    );
}
