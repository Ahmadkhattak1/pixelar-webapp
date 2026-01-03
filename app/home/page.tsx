"use client";

import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, ArrowRight, Play, SquaresFour, Plus } from "@phosphor-icons/react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useState, useRef, useEffect } from "react";

// --- Enhanced Global Styles & Keyframes ---
const customStyles = `
@keyframes enter-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes scroll-bg {
  0% { background-position: 0 0; }
  100% { background-position: -100% 0; }
}
@keyframes slime-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px) scaleY(1.1); }
}
@keyframes drive-clouds {
  0% { transform: translateX(20px) translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateX(-40px) translateY(-5px); opacity: 0; }
}
@keyframes slide-strip {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes slide-grid {
  0% { background-position: 0 0; }
  100% { background-position: 20px 20px; }
}

/* Walk Cycle - Hard Steps */
@keyframes toggle-visibility {
    0%, 49.99% { opacity: 1; }
    50%, 100% { opacity: 0; }
}
@keyframes toggle-visibility-reverse {
    0%, 49.99% { opacity: 0; }
    50%, 100% { opacity: 1; }
}

@keyframes pan-bg {
  0% { transform: translateX(0) scale(0.9); }
  100% { transform: translateX(-10px) scale(0.9); }
}
@keyframes pan-fg {
  0% { transform: translateX(0) rotateX(12deg); }
  100% { transform: translateX(-15px) rotateX(12deg); }
}

.animate-enter-1 { animation: enter-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: 0.1s; }
.animate-enter-2 { animation: enter-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: 0.2s; }
.animate-enter-3 { animation: enter-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: 0.3s; }
.animate-enter-4 { animation: enter-up 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: 0.4s; }

.group:hover .animate-slide-strip { animation: slide-strip 6s linear infinite; }
.group:hover .animate-pan-bg { animation: pan-bg 4s ease-in-out infinite alternate; }
.group:hover .animate-pan-fg { animation: pan-fg 4s ease-in-out infinite alternate; }
.group:hover .animate-slime { animation: slime-bounce 1s ease-in-out infinite; }

/* Parallax Landscape Util Class */
.bg-scrolling {
    animation: scroll-bg linear infinite;
    background-repeat: repeat-x;
}
`;

// --- Crossfading Video Player (Reveal Strategy) ---
function RetroBackground() {
    const [videoError, setVideoError] = useState(false);
    const videoRef1 = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const [topIndex, setTopIndex] = useState<1 | 2>(1);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (videoError) return;
        const v1 = videoRef1.current;
        const v2 = videoRef2.current;
        if (!v1 || !v2) return;

        const FADE_DURATION = 3;
        const SAFETY_BUFFER = 0.5;
        const TRIGGER_OFFSET = FADE_DURATION + SAFETY_BUFFER;

        const handleTimeUpdate = () => {
            const topVideo = topIndex === 1 ? v1 : v2;
            const bottomVideo = topIndex === 1 ? v2 : v1;
            if (!topVideo.duration) return;

            const timeLeft = topVideo.duration - topVideo.currentTime;

            if (timeLeft <= TRIGGER_OFFSET && !isFadingOut) {
                setIsFadingOut(true);
                bottomVideo.currentTime = 0;
                bottomVideo.play().catch(e => console.error(e));
                setTimeout(() => {
                    setTopIndex(prev => prev === 1 ? 2 : 1);
                    setIsFadingOut(false);
                    topVideo.pause();
                }, FADE_DURATION * 1000);
            }
        };

        const activeEl = topIndex === 1 ? v1 : v2;
        activeEl.addEventListener('timeupdate', handleTimeUpdate);
        return () => { activeEl.removeEventListener('timeupdate', handleTimeUpdate); };
    }, [topIndex, isFadingOut, videoError]);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#1a1c2c]">
            {!videoError ? (
                <>
                    <video ref={videoRef1} muted playsInline autoPlay={true} className="absolute inset-0 w-full h-full object-cover transition-opacity ease-linear duration-[3000ms]" style={{ zIndex: topIndex === 1 ? 2 : 1, opacity: (topIndex === 1 && isFadingOut) ? 0 : 0.6 }} onError={() => setVideoError(true)}><source src="/pixel-landscape.mp4" type="video/mp4" /></video>
                    <video ref={videoRef2} muted playsInline className="absolute inset-0 w-full h-full object-cover transition-opacity ease-linear duration-[3000ms]" style={{ zIndex: topIndex === 2 ? 2 : 1, opacity: (topIndex === 2 && isFadingOut) ? 0 : 0.6 }}><source src="/pixel-landscape.mp4" type="video/mp4" /></video>
                </>
            ) : (
                /* Fallback */
                <>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#3b82f6] to-[#60a5fa] opacity-20" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-scrolling opacity-30" style={{ backgroundImage: 'linear-gradient(transparent 50%, #1e3a8a 100%), radial-gradient(circle at 50% 100%, #1e3a8a 0%, transparent 50%)', backgroundSize: '50% 100%', animationDuration: '60s' }} />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-scrolling opacity-40" style={{ backgroundImage: 'linear-gradient(transparent 60%, #065f46 100%), radial-gradient(circle at 20% 100%, #064e3b 0%, transparent 30%), radial-gradient(circle at 80% 100%, #064e3b 0%, transparent 40%)', backgroundSize: '30% 100%', animationDuration: '30s' }} />
                    <div className="absolute bottom-[-50px] left-0 right-0 h-[200px] bg-scrolling opacity-50 blur-[1px]" style={{ backgroundImage: 'radial-gradient(circle at 10% 0%, #10b981 0%, transparent 20%), radial-gradient(circle at 90% 10%, #10b981 0%, transparent 20%)', backgroundSize: '20% 100%', animationDuration: '15s' }} />
                </>
            )}
            <div className="absolute inset-0 bg-background/80 md:bg-[radial-gradient(circle_at_center,theme('colors.background')_0%,theme('colors.background')_100%)] opacity-90 mix-blend-multiply z-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
        </div>
    );
}

// --- MainCard with Mouse-Tracking Border Glow ---
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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <Link href={href} className="block h-full group isolate">
            <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={`relative h-full rounded-3xl transition-all duration-500 hover:-translate-y-1 ${className}`}
            // Using a transparent background for the container to let inner layers handle visuals
            >
                {/* 1. Dynamic Border Glow (Underneath) */}
                <div
                    className="absolute inset-0 rounded-3xl transition-opacity duration-300"
                    style={{
                        opacity: opacity,
                        background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, ${accentColor}, transparent 40%)`
                    }}
                />

                {/* 2. Main Card Surface (Inset by 1.5px to reveal border) */}
                <div className="absolute inset-[1.5px] rounded-[22px] bg-[#0f111a]/90 backdrop-blur-md overflow-hidden z-10 border border-white/[0.08] group-hover:border-transparent transition-colors">
                    {/* Inner content wrapper */}
                    <div className="relative h-full p-8 flex flex-col pointer-events-none">
                        {children}
                    </div>
                </div>

            </div>
        </Link>
    );
}

function TemplateCard({ title, type, colorClass, delay }: { title: string, type: string, colorClass: string, delay: string }) {
    return (
        <div
            className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer bg-[#0f111a]/80 backdrop-blur-md border border-white/[0.05] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1 animate-enter-4"
            style={{ animationDelay: delay }}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-10 group-hover:opacity-30 transition-opacity duration-500`} />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold text-white/70 bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:text-white transition-colors">
                        {type}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{title}</h3>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen w-full flex bg-background selection:bg-primary/30 overflow-hidden relative">
            <style jsx global>{customStyles}</style>

            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col relative z-20">
                <RetroBackground />

                <div className="flex-1 overflow-y-auto app-scroll px-6 md:px-12 relative z-30 custom-scrollbar">
                    <div className="max-w-7xl mx-auto pt-20 pb-20">

                        <div className="mb-12 animate-enter-1">
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3 drop-shadow-lg">
                                Studio
                            </h1>
                            <p className="text-white/70 text-base max-w-xl drop-shadow-md">
                                Create professional game assets with specialized AI engines.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 cursor-default">

                            {/* Card 1: New Sprite + Pet Companion */}
                            <div className="animate-enter-2 h-[28rem]">
                                <MainCard href="/sprites" accentColor="rgba(16, 185, 129, 0.8)">
                                    <div className="flex-1 flex items-center justify-center relative mb-8">
                                        <div className="relative w-48 h-48 transition-transform duration-700 ease-out group-hover:scale-105">
                                            <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                            {/* 10x10 Grid */}
                                            <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[3px] opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                                                <div className="absolute inset-0 border border-white/[0.05] rounded-xl z-0" />

                                                {[...Array(100)].map((_, i) => {
                                                    const row = Math.floor(i / 10);
                                                    const col = i % 10;

                                                    // Hero Logic
                                                    const isHead = (row === 2 && col >= 4 && col <= 5) || (row === 3 && col >= 4 && col <= 5);
                                                    const isTorso = (row >= 4 && row <= 6) && (col >= 3 && col <= 6);
                                                    const isLegsF1 = (row === 7 && (col === 2 || col === 7)) || (row === 8 && (col === 2 || col === 7));
                                                    const isLegsF2 = (row === 7 && (col === 4 || col === 5)) || (row === 8 && (col === 4 || col === 5));

                                                    // Pet Slime Logic
                                                    const isPet = (row >= 7 && row <= 8) && (col >= 8 && col <= 9);

                                                    let pixelClass = 'bg-white/[0.04]';
                                                    let style: React.CSSProperties = {};

                                                    if (isHead) pixelClass = 'bg-primary z-10';
                                                    else if (isTorso) pixelClass = 'bg-primary/80 z-10';
                                                    else if (isLegsF1) {
                                                        pixelClass = 'bg-primary/70 z-10';
                                                        // Explicitly separating animation definition from play state
                                                        style = {
                                                            animationName: 'toggle-visibility',
                                                            animationDuration: '0.8s',
                                                            animationTimingFunction: 'steps(1)',
                                                            animationIterationCount: 'infinite'
                                                        };
                                                    }
                                                    else if (isLegsF2) {
                                                        pixelClass = 'bg-primary/70 z-10';
                                                        style = {
                                                            opacity: 0,
                                                            animationName: 'toggle-visibility-reverse',
                                                            animationDuration: '0.8s',
                                                            animationTimingFunction: 'steps(1)',
                                                            animationIterationCount: 'infinite'
                                                        };
                                                    }

                                                    if (isPet) {
                                                        pixelClass = 'bg-emerald-300 z-10 animate-slime [animation-play-state:paused]';
                                                        style = {};
                                                    }

                                                    // Combine classes. 
                                                    // IMPORTANT: [animation-play-state:paused] MUST be in the class string, group-hover:[animation-play-state:running] resumes it.
                                                    // For legs, we apply styles. For pet, we use class.

                                                    const animStateClass = (isLegsF1 || isLegsF2)
                                                        ? '[animation-play-state:paused] group-hover:[animation-play-state:running]'
                                                        : (isPet ? '[animation-play-state:paused] group-hover:[animation-play-state:running]' : '');

                                                    return (
                                                        <div
                                                            key={i}
                                                            className={`rounded-[1px] transition-colors duration-200 ${pixelClass} ${animStateClass}`}
                                                            style={style}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

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
                            </div>

                            {/* Card 2: New Scene + Moving Clouds */}
                            <div className="animate-enter-3 h-[28rem]">
                                <MainCard href="/scenes" accentColor="rgba(52, 211, 153, 0.8)">
                                    <div className="flex-1 flex items-center justify-center relative mb-8">
                                        <div className="relative w-64 h-48 perspective-[1200px] transition-transform duration-700 ease-out">
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                            {/* Clouds Overlay */}
                                            <div className="absolute -top-10 -left-10 w-full h-full z-20 pointer-events-none">
                                                <div className="w-16 h-8 bg-white/10 blur-xl rounded-full absolute top-10 left-0 opacity-0 group-hover:[animation:drive-clouds_8s_linear_infinite]" />
                                                <div className="w-20 h-10 bg-white/5 blur-xl rounded-full absolute top-20 right-0 opacity-0 group-hover:[animation:drive-clouds_12s_linear_infinite_reverse]" style={{ animationDelay: '1s' }} />
                                            </div>

                                            <div className="absolute inset-x-8 top-0 bottom-16 bg-gradient-to-br from-emerald-900/40 to-transparent border border-emerald-500/10 rounded-xl transform rotate-x-12 translate-z-[-40px] scale-90 animate-pan-bg [animation-play-state:paused] group-hover:[animation-play-state:running]"></div>

                                            <div className="absolute inset-x-4 top-6 bottom-10 bg-gradient-to-br from-emerald-500/10 to-teal-900/40 border border-emerald-500/30 rounded-xl backdrop-blur-[2px] shadow-2xl shadow-emerald-900/30 overflow-hidden animate-pan-fg [animation-play-state:paused] group-hover:[animation-play-state:running]">
                                                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl" />
                                            </div>

                                            <div className="absolute bottom-6 right-12 w-16 h-20 bg-emerald-400/20 border border-emerald-400/40 rounded-lg transform rotate-x-12 translate-z-[30px] backdrop-blur-md transition-transform duration-500 group-hover:translate-x-[-10px] shadow-lg" />
                                            <div className="absolute bottom-10 left-12 w-12 h-14 bg-emerald-400/20 border border-emerald-400/40 rounded-lg transform rotate-x-12 translate-z-[15px] backdrop-blur-md transition-transform duration-500 group-hover:translate-x-[-5px]" />
                                        </div>
                                    </div>

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
                            </div>

                            {/* Card 3: Sprite Sheet to GIF + Moving Grid Background */}
                            <div className="animate-enter-3 h-[28rem] [animation-delay:0.3s]">
                                <MainCard href="/tools/gif-converter" accentColor="rgba(167, 139, 250, 0.8)">
                                    <div className="flex-1 flex items-center justify-center relative mb-8 overflow-hidden rounded-xl">
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                                            style={{
                                                backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
                                                backgroundSize: '20px 20px',
                                                animation: 'slide-grid 4s linear infinite paused'
                                            }}
                                            className="group-hover:[animation-play-state:running]"
                                        />

                                        <div className="relative w-full h-40 flex items-center justify-center group-hover:opacity-100 opacity-80 transition-opacity">
                                            <div className="absolute inset-y-0 left-0 flex gap-3 h-20 top-10 w-[200%] animate-slide-strip [animation-play-state:paused] group-hover:[animation-play-state:running] opacity-30 group-hover:opacity-50 transition-opacity">
                                                {[...Array(12)].map((_, i) => (
                                                    <div key={i} className="flex-1 border border-violet-400/20 bg-violet-400/5 rounded-md relative group/frame">
                                                        <div className="absolute bottom-2 left-2 w-4 h-4 bg-violet-400/20 rounded-sm group-hover/frame:bg-violet-400/40 transition-colors" />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="relative z-10 w-24 h-24 rounded-2xl border border-violet-500/50 bg-violet-900/30 flex items-center justify-center shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-110">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-transparent" />
                                                <Play weight="fill" className="w-10 h-10 text-violet-300 group-hover:text-white transition-colors relative z-10 drop-shadow-md" />
                                                <div className="absolute inset-0 border-2 border-violet-400/30 rounded-2xl opacity-0 group-hover:opacity-100" style={{ animation: 'pixel-breathe 2s infinite' }} />
                                            </div>
                                        </div>
                                    </div>

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

                        </div>

                        {/* Recent / Templates Section */}
                        <div className="animate-enter-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <SquaresFour weight="fill" className="w-6 h-6 text-text-muted" />
                                    <h2 className="text-xl font-bold text-white tracking-tight">Start with a Template</h2>
                                </div>
                                <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">
                                    View all
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <TemplateCard
                                    title="Cyberpunk Street"
                                    type="Scene"
                                    colorClass="from-fuchsia-600 to-fuchsia-900"
                                    delay="0.4s"
                                />
                                <TemplateCard
                                    title="Retro Warrior"
                                    type="Sprite"
                                    colorClass="from-orange-500 to-red-700"
                                    delay="0.45s"
                                />
                                <TemplateCard
                                    title="Mystic Forest"
                                    type="Scene"
                                    colorClass="from-emerald-500 to-teal-800"
                                    delay="0.5s"
                                />
                                <TemplateCard
                                    title="Space Ship"
                                    type="Sprite"
                                    colorClass="from-blue-500 to-indigo-800"
                                    delay="0.55s"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
