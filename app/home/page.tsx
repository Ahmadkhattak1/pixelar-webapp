"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Clock, FolderOpen } from "@phosphor-icons/react";
import { Map } from "lucide-react";
import { Sidebar } from "@/components/navigation/Sidebar";
import { ExpandableHorizon } from "@/components/home/ExpandableHorizon";
import BackgroundBeams from "@/components/ui/background-beams";
import { useAuth } from "@/hooks/useAuth";
import { api, Project } from "@/services/api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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

const homeEagerPrefetchRoutes = [
    "/projects",
    "/library",
    "/sprites",
    "/scenes",
    "/tools/gif-converter",
];

// --- Floating Pixel Dust Background ---
function RetroBackground() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#06090f]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_125%_80%_at_6%_-8%,rgba(159,222,90,0.14)_0%,transparent_58%),radial-gradient(ellipse_95%_70%_at_100%_0%,rgba(77,217,255,0.16)_0%,transparent_54%),linear-gradient(180deg,#070b13_0%,#05070d_100%)]" />
            <BackgroundBeams className="opacity-[0.84]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,7,12,0.16)_0%,rgba(5,7,12,0.58)_60%,rgba(5,7,12,0.88)_100%)]" />
        </div>
    );
}

function HomePageContent() {
    const router = useRouter();
    const { user } = useAuth();
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const queueIdlePrefetch = (callback: () => void) => {
        const ric = (window as Window & {
            requestIdleCallback?: (cb: IdleRequestCallback, options?: IdleRequestOptions) => number;
            cancelIdleCallback?: (id: number) => void;
        }).requestIdleCallback;
        const cic = (window as Window & {
            cancelIdleCallback?: (id: number) => void;
        }).cancelIdleCallback;

        if (ric) {
            const id = ric(() => callback(), { timeout: 2000 });
            return () => cic?.(id);
        }

        const timeoutId = window.setTimeout(callback, 1000);
        return () => window.clearTimeout(timeoutId);
    };

    const formatProjectDate = (value?: string) => {
        if (!value) return "No date";
        return new Date(value).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;

        return queueIdlePrefetch(() => {
            homeEagerPrefetchRoutes.forEach((route) => {
                router.prefetch(route);
            });
        });
    }, [router]);

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

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;
        if (recentProjects.length === 0) return;

        return queueIdlePrefetch(() => {
            recentProjects.slice(0, 3).forEach((project) => {
                router.prefetch(`/projects/${project.id}`);
            });
        });
    }, [recentProjects, router]);

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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="h-52 rounded-2xl bg-[#0d1320] border border-white/[0.08] animate-pulse"
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                                        {recentProjects.map((project) => (
                                            <div
                                                key={project.id}
                                                onClick={() => router.push(`/projects/${project.id}`)}
                                                onMouseEnter={() => router.prefetch(`/projects/${project.id}`)}
                                                className="group relative h-52 overflow-hidden rounded-2xl cursor-pointer border border-white/[0.1] bg-[#0b111c] shadow-[0_16px_36px_-24px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/45 hover:shadow-[0_24px_44px_-20px_rgba(159,222,90,0.28)]"
                                            >
                                                {project.thumbnail_url ? (
                                                    <img
                                                        src={project.thumbnail_url}
                                                        alt={project.title}
                                                        className="absolute inset-0 h-full w-full object-cover pixelated opacity-90 group-hover:scale-[1.04] transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-[linear-gradient(135deg,#101a2b_0%,#0a1322_62%,#0a111c_100%)]" />
                                                )}

                                                {!project.thumbnail_url && (
                                                    <>
                                                        <div className={`absolute inset-0 ${project.color?.split(' ')[0] || "bg-primary/20"} opacity-45`} />
                                                        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_15%,rgba(255,255,255,0.22)_0%,transparent_58%)]" />
                                                    </>
                                                )}

                                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.1)_0%,rgba(6,10,16,0.45)_44%,rgba(6,10,16,0.92)_100%)]" />

                                                <div className="absolute left-3 right-3 top-3 z-10 flex items-center justify-between">
                                                    <span className="inline-flex items-center rounded-full border border-white/20 bg-[#090f19]/92 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/90">
                                                        {project.type}
                                                    </span>
                                                    <div className="h-7 w-7 rounded-full border border-white/15 bg-[#0a101b]/95 flex items-center justify-center shadow-sm">
                                                        {project.type === "sprite" ? (
                                                            <ImageIcon className="h-3.5 w-3.5 text-white/80" />
                                                        ) : (
                                                            <Map className="h-3.5 w-3.5 text-white/80" />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="absolute inset-x-4 bottom-4 z-10">
                                                    <h3 className="text-[15px] leading-tight font-semibold tracking-tight text-white truncate">
                                                        {project.title}
                                                    </h3>
                                                    <div className="mt-2 flex items-center justify-between text-xs">
                                                        <span className="text-text-muted truncate">
                                                            Updated {formatProjectDate(project.updated_at || project.created_at)}
                                                        </span>
                                                        <span className="font-semibold text-primary transition-transform duration-200 group-hover:translate-x-0.5">
                                                            Open
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
}

export default function HomePage() {
    return (
        <ProtectedRoute>
            <HomePageContent />
        </ProtectedRoute>
    );
}
