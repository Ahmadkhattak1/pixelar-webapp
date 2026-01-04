"use client";

import Link from "next/link";
import { Sparkle, Image as ImageIcon, FilmStrip, Plus, Square } from "@phosphor-icons/react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useState, useRef, useEffect } from "react";
import { ExpandableHorizon } from "@/components/home/ExpandableHorizon";

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

/* Scene Cloud Drift - Always Looping */
@keyframes scene-cloud-drift {
  0% { transform: translateX(0); opacity: 0.3; }
  50% { transform: translateX(80px); opacity: 0.6; }
  100% { transform: translateX(0); opacity: 0.3; }
}
@keyframes scene-cloud-drift-reverse {
  0% { transform: translateX(0); opacity: 0.2; }
  50% { transform: translateX(-80px); opacity: 0.5; }
  100% { transform: translateX(0); opacity: 0.2; }
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

                        <div className="mb-24 animate-enter-2">
                            <ExpandableHorizon />
                        </div>

                        {/* Recent / Templates Section */}
                        <div className="animate-enter-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Square weight="fill" className="w-6 h-6 text-text-muted" />
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
