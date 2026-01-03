"use client";

import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, ArrowRight, Play, SquaresFour } from "@phosphor-icons/react";
import { Sidebar } from "@/components/navigation/Sidebar";

// --- Styles for Custom Animations ---
const customStyles = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotateX(12deg); }
  50% { transform: translateY(-8px) rotateX(12deg); }
}
@keyframes float-scene {
  0%, 100% { transform: translateY(0px) translateX(0px) rotateX(12deg); }
  50% { transform: translateY(-5px) translateX(2px) rotateX(12deg); }
}
@keyframes pixel-breathe {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1); }
}
@keyframes slide-strip {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes pan-bg {
  0% { transform: translateX(0) scale(0.9); }
  100% { transform: translateX(-10px) scale(0.9); }
}
@keyframes pan-fg {
  0% { transform: translateX(0) rotateX(12deg); }
  100% { transform: translateX(-15px) rotateX(12deg); }
}

/* 
   HARD PIXEL SWAP ANIMATION 
   0% - 49.99%: Visible
   50% - 100%: Hidden
*/
@keyframes toggle-visibility {
    0%, 49.99% { opacity: 1; }
    50%, 100% { opacity: 0; }
}
@keyframes toggle-visibility-reverse {
    0%, 49.99% { opacity: 0; }
    50%, 100% { opacity: 1; }
}

.group:hover .animate-slide-strip { animation: slide-strip 6s linear infinite; }
.group:hover .animate-pan-bg { animation: pan-bg 4s ease-in-out infinite alternate; }
.group:hover .animate-pan-fg { animation: pan-fg 4s ease-in-out infinite alternate; }
`;

function MainCard({
    children,
    className = "",
    href,
    accentColor = "rgba(16, 185, 129)"
}: {
    children: React.ReactNode;
    className?: string;
    href: string;
    accentColor?: string;
}) {
    return (
        <Link href={href} className="block h-full group isolate">
            <div className={`relative h-full overflow-hidden rounded-3xl bg-surface border border-white/[0.08] transition-all duration-500 hover:shadow-2xl hover:border-white/[0.15] hover:-translate-y-1 ${className}`}>
                {/* 1. Base Ambient Glow (Static) */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle at center, ${accentColor}, transparent 70%)` }}
                />

                {/* 2. Inner Content */}
                <div className="relative z-20 h-full p-8 flex flex-col pointer-events-none">
                    {children}
                </div>
            </div>
        </Link>
    );
}

// --- Template Card ---
function TemplateCard({ title, type, colorClass }: { title: string, type: string, colorClass: string }) {
    return (
        <div className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer bg-surface border border-white/[0.05] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="mb-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] uppercase tracking-wider font-bold text-white backdrop-blur-sm">
                        {type}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight drop-shadow-md">{title}</h3>

                {/* Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-5 h-5 text-white/90" />
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen w-full flex bg-background selection:bg-primary/30">
            <style jsx global>{customStyles}</style>
            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col relative overflow-hidden">
                <div className="flex-1 overflow-y-auto app-scroll px-6 md:px-12 relative z-10 custom-scrollbar">
                    <div className="max-w-7xl mx-auto pt-20 pb-12">

                        {/* High-Impact Minimal Header */}
                        <div className="mb-16">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                                Studio
                            </h1>
                            <p className="text-text-muted text-base max-w-xl">
                                Create professional game assets with specialized AI engines.
                            </p>
                        </div>

                        {/* Main Tools Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">

                            {/* Card 1: New Sprite */}
                            <MainCard
                                href="/sprites"
                                className="h-[28rem]"
                                accentColor="rgba(16, 185, 129, 0.4)"
                            >
                                {/* Visual Area - Animated Character */}
                                <div className="flex-1 flex items-center justify-center relative mb-8">
                                    <div className="relative w-48 h-48 transition-transform duration-700 ease-out group-hover:scale-105">
                                        {/* Core Glow */}
                                        <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* 10x10 Pixel Grid Container */}
                                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[3px] opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                            {/* Static Background Grid */}
                                            <div className="absolute inset-0 border border-white/[0.05] rounded-xl z-0" />

                                            {[...Array(100)].map((_, i) => {
                                                const row = Math.floor(i / 10);
                                                const col = i % 10;

                                                // --- PIXEL ART DEFINITION ---
                                                // Head
                                                const isHead = (row === 2 && col >= 4 && col <= 5) || (row === 3 && col >= 4 && col <= 5);
                                                // Torso
                                                const isTorso = (row >= 4 && row <= 6) && (col >= 3 && col <= 6);
                                                // Static Arms (resting at sides)
                                                // const isArm = (row >= 4 && row <= 5) && (col === 2 || col === 7);

                                                // --- FRAME 1: Wide Stance ---
                                                // Left leg out, Right leg out
                                                const isLegsF1 = (row === 7 && (col === 2 || col === 7)) || (row === 8 && (col === 2 || col === 7));

                                                // --- FRAME 2: Narrow Stance ---
                                                // Legs straight down
                                                const isLegsF2 = (row === 7 && (col === 4 || col === 5)) || (row === 8 && (col === 4 || col === 5));

                                                let pixelClass = 'bg-white/[0.04]'; // Empty pixel
                                                let style = {};

                                                if (isHead) pixelClass = 'bg-primary z-10';
                                                else if (isTorso) pixelClass = 'bg-primary/80 z-10';

                                                else if (isLegsF1) {
                                                    pixelClass = 'bg-primary/70 z-10';
                                                    // Start visible, toggle to hidden
                                                    style = { animation: 'toggle-visibility 0.8s steps(1) infinite' };
                                                }
                                                else if (isLegsF2) {
                                                    pixelClass = 'bg-primary/70 z-10';
                                                    // Start hidden, toggle to visible
                                                    style = { animation: 'toggle-visibility-reverse 0.8s steps(1) infinite' };
                                                }

                                                return (
                                                    <div
                                                        key={i}
                                                        className={`rounded-[1px] transition-colors duration-200 ${pixelClass} group-hover:[animation-play-state:running] [animation-play-state:paused]`}
                                                        style={style}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                            <Sparkle weight="fill" className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">New Sprite</h3>
                                    </div>
                                    <p className="text-text-muted text-sm font-medium pl-14">Generate characters & objects</p>
                                </div>
                            </MainCard>

                            {/* Card 2: New Scene */}
                            <MainCard
                                href="/scenes"
                                className="h-[28rem]"
                                accentColor="rgba(52, 211, 153, 0.4)"
                            >
                                {/* Visual Area - Animated Floating World */}
                                <div className="flex-1 flex items-center justify-center relative mb-8">
                                    <div className="relative w-64 h-48 perspective-[1200px] transition-transform duration-700 ease-out">
                                        {/* Deep Glow */}
                                        <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                        {/* Layer 1: Background Base (Slow Pan) */}
                                        <div className="absolute inset-x-8 top-0 bottom-16 bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/10 rounded-xl transform rotate-x-12 translate-z-[-40px] scale-90 animate-pan-bg [animation-play-state:paused] group-hover:[animation-play-state:running]"></div>

                                        {/* Layer 2: Main Terrain (Medium Pan) */}
                                        <div className="absolute inset-x-4 top-6 bottom-10 bg-gradient-to-br from-emerald-500/10 to-teal-900/40 border border-emerald-500/30 rounded-xl backdrop-blur-[2px] shadow-2xl shadow-emerald-900/30 overflow-hidden animate-pan-fg [animation-play-state:paused] group-hover:[animation-play-state:running]">
                                            {/* Grid lines moving */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl" />
                                        </div>

                                        {/* Layer 3: Floating Objects (Fast Pan with Float) */}
                                        <div className="absolute bottom-6 right-12 w-16 h-20 bg-emerald-400/20 border border-emerald-400/40 rounded-lg transform rotate-x-12 translate-z-[30px] backdrop-blur-md transition-transform duration-500 group-hover:translate-x-[-10px] shadow-lg" />
                                        <div className="absolute bottom-10 left-12 w-12 h-14 bg-emerald-400/20 border border-emerald-400/40 rounded-lg transform rotate-x-12 translate-z-[15px] backdrop-blur-md transition-transform duration-500 group-hover:translate-x-[-5px]" />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <ImageIcon weight="fill" className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">New Scene</h3>
                                    </div>
                                    <p className="text-text-muted text-sm font-medium pl-14">Create worlds & backgrounds</p>
                                </div>
                            </MainCard>

                            {/* Card 3: Sprite Sheet to GIF */}
                            <MainCard
                                href="/tools/gif-converter"
                                className="h-[28rem]"
                                accentColor="rgba(167, 139, 250, 0.4)"
                            >
                                {/* Visual Area - Film Strip sliding animation */}
                                <div className="flex-1 flex items-center justify-center relative mb-8 overflow-hidden rounded-xl">
                                    <div className="relative w-full h-40 flex items-center justify-center group-hover:opacity-100 opacity-80 transition-opacity">

                                        {/* Sliding Background Strip */}
                                        <div className="absolute inset-y-0 left-0 flex gap-3 h-20 top-10 w-[200%] animate-slide-strip [animation-play-state:paused] group-hover:[animation-play-state:running] opacity-30 group-hover:opacity-50 transition-opacity">
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className="flex-1 border border-violet-400/20 bg-violet-400/5 rounded-md relative group/frame">
                                                    <div className="absolute bottom-2 left-2 w-4 h-4 bg-violet-400/20 rounded-sm group-hover/frame:bg-violet-400/40 transition-colors" />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Center Focus - The Result */}
                                        <div className="relative z-10 w-24 h-24 rounded-2xl border border-violet-500/50 bg-violet-900/30 flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent" />
                                            <Play weight="fill" className="w-10 h-10 text-violet-300 group-hover:text-white transition-colors relative z-10 drop-shadow-md" />

                                            {/* Pulse Ring */}
                                            <div className="absolute inset-0 border-2 border-violet-400/30 rounded-2xl opacity-0 group-hover:opacity-100" style={{ animation: 'pixel-breathe 2s infinite' }} />
                                        </div>

                                    </div>
                                </div>

                                {/* Text Content */}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                            <FilmStrip weight="fill" className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">Sprite Sheet to GIF</h3>
                                    </div>
                                    <p className="text-text-muted text-sm font-medium pl-14">Animate your sprites</p>
                                </div>
                            </MainCard>

                        </div>

                        {/* Templates Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-8">
                                <SquaresFour weight="fill" className="w-6 h-6 text-text-muted" />
                                <h2 className="text-xl font-bold text-white tracking-tight">Start with a Template</h2>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <TemplateCard
                                    title="Cyberpunk Street"
                                    type="Scene"
                                    colorClass="from-fuchsia-600 to-fuchsia-900"
                                />
                                <TemplateCard
                                    title="Retro Warrior"
                                    type="Sprite"
                                    colorClass="from-orange-500 to-red-700"
                                />
                                <TemplateCard
                                    title="Mystic Forest"
                                    type="Scene"
                                    colorClass="from-emerald-500 to-teal-800"
                                />
                                <TemplateCard
                                    title="Space Ship"
                                    type="Sprite"
                                    colorClass="from-blue-500 to-indigo-800"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
