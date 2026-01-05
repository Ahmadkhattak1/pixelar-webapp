"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkle, Image as ImageIcon, FilmStrip, Plus, Square, Clock, FolderOpen } from "@phosphor-icons/react";
import { Map } from "lucide-react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { ExpandableHorizon } from "@/components/home/ExpandableHorizon";
import { useAuth } from "@/hooks/useAuth";
import { api, Project } from "@/services/api";

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
@keyframes arm-swing {
    0% { transform: translateY(0); }
    100% { transform: translateY(-1px); }
}

/* Scene Animations */
@keyframes twinkle-star {
    0%, 100% { opacity: 0.9; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(0.8); }
}
@keyframes pulse-sun {
    0%, 100% { transform: scale(1); box-shadow: 0 0 12px rgba(251,191,36,0.8); }
    50% { transform: scale(1.15); box-shadow: 0 0 20px rgba(251,191,36,1); }
}
@keyframes float-cloud {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(3px); }
}
@keyframes sway-tree {
    0%, 100% { transform: skewX(0deg); }
    25% { transform: skewX(2deg); }
    75% { transform: skewX(-2deg); }
}
@keyframes wave-water {
    0%, 100% { opacity: 1; transform: translateY(0); }
    50% { opacity: 0.7; transform: translateY(-1px); }
}
@keyframes fly-bird {
    0% { left: -20px; }
    100% { left: calc(100% + 20px); }
}
@keyframes flap-wing {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-2px) rotate(-15deg); }
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

/* Floating Pixel Dust Animation */
@keyframes float-dust {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: var(--dust-opacity);
  }
  90% {
    opacity: var(--dust-opacity);
  }
  100% {
    transform: translateY(-100vh) translateX(var(--dust-drift));
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% { opacity: var(--dust-opacity); }
  50% { opacity: calc(var(--dust-opacity) * 0.3); }
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

/* Pixel Dust Particle */
.pixel-dust {
    position: absolute;
    image-rendering: pixelated;
    animation: float-dust var(--dust-duration) linear infinite, twinkle var(--twinkle-duration) ease-in-out infinite;
    animation-delay: var(--dust-delay);
}
`;

// Dust particle configuration - generates deterministic positions
const dustParticles = Array.from({ length: 50 }, (_, i) => {
    // Use index to create pseudo-random but consistent values
    const seed = (i * 7919) % 100; // Prime number for distribution
    const seed2 = (i * 6997) % 100;
    const seed3 = (i * 5449) % 100;

    return {
        id: i,
        left: `${seed}%`,
        bottom: `${-5 - (seed2 % 20)}%`, // Start below viewport
        size: 2 + (seed3 % 3), // 2-4px pixelated squares
        duration: 15 + (seed % 20), // 15-35 seconds to float up
        delay: (seed2 / 100) * 20, // 0-20s staggered start
        drift: ((seed3 % 40) - 20), // -20px to +20px horizontal drift
        opacity: 0.12 + (seed % 25) / 100, // 0.12-0.37 opacity (slightly more subtle)
        twinkleDuration: 2 + (seed % 4), // 2-6 seconds twinkle cycle
        // Grey-ish color palette for better harmony
        color: seed % 4 === 0
            ? 'rgba(148, 163, 184, VAR_OPACITY)' // Slate-400 (cool grey)
            : seed % 4 === 1
                ? 'rgba(203, 213, 225, VAR_OPACITY)' // Slate-300 (light grey)
                : seed % 4 === 2
                    ? 'rgba(100, 116, 139, VAR_OPACITY)' // Slate-500 (medium grey)
                    : 'rgba(226, 232, 240, VAR_OPACITY)', // Slate-200 (bright grey)
    };
});

// --- Floating Pixel Dust Background ---
function RetroBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Base dark background */}
            <div className="absolute inset-0 bg-[#0a0d11]" />

            {/* Solid dark background */}
            <div className="absolute inset-0 bg-[#0a0a0a]" />

            {/* Floating Pixel Dust Particles */}
            <div className="absolute inset-0">
                {dustParticles.map((particle) => (
                    <div
                        key={particle.id}
                        className="pixel-dust"
                        style={{
                            left: particle.left,
                            bottom: particle.bottom,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color.replace('VAR_OPACITY', particle.opacity.toString()),
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.color.replace('VAR_OPACITY', (particle.opacity * 0.5).toString())}`,
                            '--dust-duration': `${particle.duration}s`,
                            '--dust-delay': `${particle.delay}s`,
                            '--dust-drift': `${particle.drift}px`,
                            '--dust-opacity': particle.opacity,
                            '--twinkle-duration': `${particle.twinkleDuration}s`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Soft vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#0a0d11_100%)] opacity-60" />
        </div>
    );
}



function TemplateCard({ title, type, colorClass, delay }: { title: string, type: string, colorClass: string, delay: string }) {
    return (
        <div
            className="group relative h-40 rounded-2xl overflow-hidden cursor-pointer bg-[#0f111a]/80 backdrop-blur-md border border-white/[0.05] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1 animate-enter-4"
            style={{ animationDelay: delay }}
        >
            <div className={`absolute inset-0 ${colorClass.replace('from-', 'bg-').split(' ')[0]} opacity-10 group-hover:opacity-25 transition-opacity duration-500`} />
            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold text-white bg-white/10 border border-white/10 group-hover:bg-white/15 transition-colors">
                        {type}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0 duration-300">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                            <Plus className="w-3 h-3 text-white" />
                        </div>
                    </div>
                </div>
                <h3 className="text-lg font-bold text-white transition-colors">{title}</h3>
            </div>
        </div>
    );
}

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchRecentProjects = async () => {
                try {
                    const response = await api.projects.list({ limit: 6 });
                    if (response?.projects) {
                        setRecentProjects(response.projects.slice(0, 6));
                    }
                } catch (error) {
                    console.error("Failed to fetch recent projects:", error);
                } finally {
                    setLoadingProjects(false);
                }
            };
            fetchRecentProjects();
        } else {
            setLoadingProjects(false);
        }
    }, [user]);

    return (
        <div className="min-h-screen w-full flex bg-background selection:bg-primary/30 overflow-hidden relative">
            <style jsx global>{customStyles}</style>

            <Sidebar />

            <main className="flex-1 min-w-0 flex flex-col relative z-20">
                <RetroBackground />

                <div className="flex-1 overflow-y-auto app-scroll px-6 md:px-12 relative z-30 custom-scrollbar">
                    <div className="max-w-7xl mx-auto pt-8 pb-20">

                        <div className="mb-12 animate-enter-1">
                            <ExpandableHorizon />
                        </div>

                        {/* Recent Projects Section */}
                        {user && (
                            <div className="mb-16 animate-enter-3">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <Clock weight="fill" className="w-5 h-5 text-text-muted" />
                                        <h2 className="text-xl font-bold text-white tracking-tight">Recent Projects</h2>
                                    </div>
                                    <Link
                                        href="/projects"
                                        className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                                    >
                                        View all
                                    </Link>
                                </div>

                                {loadingProjects ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-32 rounded-xl bg-white/[0.02] border border-white/[0.05] animate-pulse"
                                            />
                                        ))}
                                    </div>
                                ) : recentProjects.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                        <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4">
                                            <FolderOpen className="w-6 h-6 text-text-muted" />
                                        </div>
                                        <p className="text-text-muted text-sm mb-4">No projects yet</p>
                                        <Link
                                            href="/projects"
                                            className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                                        >
                                            Create your first project
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {recentProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                onClick={() => router.push(`/projects/${project.id}`)}
                                                className="group relative h-32 rounded-xl overflow-hidden cursor-pointer bg-[#0f111a]/80 backdrop-blur-md border border-white/[0.05] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1"
                                            >
                                                {project.thumbnail_url ? (
                                                    <>
                                                        <img
                                                            src={project.thumbnail_url}
                                                            alt={project.title}
                                                            className="absolute inset-0 w-full h-full object-cover pixelated opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                                    </>
                                                ) : (
                                                    <div className={`absolute inset-0 ${project.color?.split(' ')[0] || 'bg-primary/10'} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                                                )}
                                                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                                    <div className="flex justify-between items-start">
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold text-white bg-white/10 border border-white/10">
                                                            {project.type}
                                                        </span>
                                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                                                            {project.type === "sprite" ? (
                                                                <ImageIcon className="w-3 h-3 text-white/70" />
                                                            ) : (
                                                                <Map className="w-3 h-3 text-white/70" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
                                                        <p className="text-[10px] text-white/50 mt-0.5">
                                                            {new Date(project.updated_at || project.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Templates Section */}
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
                                    colorClass="from-lime-400 to-green-700"
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
