"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Download,
    Sparkles,
    Layers,
    Maximize,
    Check,
    Plus,
    Wand2,
    FileCode,
    MonitorPlay,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpritePreviewLayout } from "@/components/sprite-preview/SpritePreviewLayout";

// Mock Data Types
type SceneVariant = {
    id: string;
    imageUrl: string;
    timestamp: string;
};

type SceneProject = {
    id: string;
    name: string;
    createdAt: string;
    resolution: string;
    style: string;
    viewpoint: string;
    variants: SceneVariant[];
};

function ScenePreviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get("projectId");

    // State
    const [project, setProject] = useState<SceneProject | null>(null);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock Data Loading
    useEffect(() => {
        // Simulate fetching project data
        const mockProject: SceneProject = {
            id: projectId || "demo-123",
            name: "Mystic Forest Clearing",
            createdAt: new Date().toLocaleDateString(),
            resolution: "1024x1024",
            style: "Pixel Art",
            viewpoint: "Isometric",
            variants: [
                { id: "v1", imageUrl: `https://picsum.photos/seed/scene1/800/600`, timestamp: "10:23 AM" },
                { id: "v2", imageUrl: `https://picsum.photos/seed/scene2/800/600`, timestamp: "10:25 AM" },
                { id: "v3", imageUrl: `https://picsum.photos/seed/scene3/800/600`, timestamp: "10:28 AM" },
                { id: "v4", imageUrl: `https://picsum.photos/seed/scene4/800/600`, timestamp: "10:30 AM" },
            ],
        };

        setProject(mockProject);
        setSelectedVariantId(mockProject.variants[0].id);
    }, [projectId]);

    const selectedVariant = project?.variants.find((v) => v.id === selectedVariantId);

    const handleGenerateVariant = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        // Simulate generation
        setTimeout(() => {
            const newVariant: SceneVariant = {
                id: `v${Date.now()}`,
                imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setProject((prev) => prev ? {
                ...prev,
                variants: [newVariant, ...prev.variants]
            } : null);
            setSelectedVariantId(newVariant.id);
            setIsGenerating(false);
            setPrompt("");
        }, 2000);
    };

    const handleExport = () => {
        // Mock export functionality
        alert("Exporting scene to Game Engine format...");
    };

    if (!project) return <div className="min-h-screen bg-background flex items-center justify-center text-slate-400">Loading Project...</div>;

    const headerActions = (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-slate-700 hover:bg-slate-800/50 hover:text-primary gap-2 text-white"
                onClick={() => router.push("/scenes")}
            >
                <Plus className="w-3.5 h-3.5" />
                New Project
            </Button>
            <Button
                size="sm"
                className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary-600 gap-2 shadow-lg shadow-primary/20"
                onClick={handleExport}
            >
                <Download className="w-3.5 h-3.5" />
                Export Scene
            </Button>
        </div>
    );

    return (
        <SpritePreviewLayout
            title={project.name}
            projectId={project.id}
            backLink={projectId ? `/projects/${projectId}` : "/projects"}
            actions={headerActions}
        >
            <div className="flex flex-col lg:flex-row h-full overflow-hidden">
                {/* Left Sidebar: Variants List - Hidden on mobile, shown on large screens */}
                <div className="hidden lg:flex lg:w-64 border-r border-slate-700 bg-slate-900/50 flex-col backdrop-blur-sm">
                    <div className="p-4 border-b border-slate-700">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Layers className="w-3 h-3" />
                            Variants ({project.variants.length})
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                        <div className="space-y-3">
                            {project.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariantId(variant.id)}
                                    className={`relative w-full aspect-video rounded-lg overflow-hidden border-2 transition-all group ${selectedVariantId === variant.id
                                        ? "border-primary shadow-lg shadow-primary/20"
                                        : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                                        }`}
                                >
                                    <img
                                        src={variant.imageUrl}
                                        alt={`Variant ${variant.id}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {selectedVariantId === variant.id && (
                                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                <Check className="w-4 h-4" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-[10px] text-white py-1.5 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">Variant {variant.id}</span>
                                            <span className="text-white/70">{variant.timestamp}</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Center: Main Preview Stage */}
                <div className="flex-1 p-4 lg:p-8 flex items-center justify-center min-w-0 bg-background overflow-auto relative">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {selectedVariant ? (
                        <div className="relative z-10 max-w-full max-h-full group">
                            <img
                                src={selectedVariant.imageUrl}
                                alt="Scene Preview"
                                className="max-w-full max-h-full object-contain shadow-2xl shadow-black/50 rounded-lg"
                            />
                            {/* Overlay Actions */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-black/50 backdrop-blur text-white hover:bg-black/70 border border-white/10">
                                    <Maximize className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 text-slate-400 text-sm">Select a variant to preview</div>
                    )}
                </div>

                {/* Right Sidebar: Inspector - Collapsible on mobile */}
                <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-700 bg-slate-900/50 flex flex-col max-h-[40vh] lg:max-h-none backdrop-blur-sm">
                    <div className="p-4 lg:p-6 overflow-y-auto flex-1">
                        <div className="space-y-6 lg:space-y-8">
                            {/* Metadata Section */}
                            <div className="space-y-3 lg:space-y-4">
                                <h3 className="text-xs lg:text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <FileCode className="w-3 h-3" />
                                    Details
                                </h3>
                                <div className="p-3 lg:p-4 rounded-xl bg-slate-800/50 border border-slate-700 shadow-sm">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400">Resolution</span>
                                            <span className="text-xs font-mono text-white">{project.resolution}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400">Created</span>
                                            <span className="text-xs font-mono text-white">{project.createdAt}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400">Style</span>
                                            <span className="text-xs font-medium text-white">{project.style}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-400">Viewpoint</span>
                                            <span className="text-xs font-medium text-white">{project.viewpoint}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit / Generate Section */}
                            <div className="space-y-3 lg:space-y-4">
                                <h3 className="text-xs lg:text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    Edit Scene
                                </h3>
                                <div className="p-3 lg:p-4 rounded-xl bg-slate-800/50 border border-slate-700 shadow-sm">
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <textarea
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="Describe changes or new elements..."
                                                className="w-full h-24 p-3 text-xs bg-slate-800/50 border border-slate-700 text-white rounded-lg resize-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-slate-500 font-medium leading-relaxed"
                                            />
                                            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-mono opacity-60">
                                                {prompt.length}/500
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleGenerateVariant}
                                            disabled={!prompt.trim() || isGenerating}
                                            className="w-full h-9 text-xs font-semibold bg-primary hover:bg-primary-600 text-primary-foreground shadow-lg shadow-primary/30 transition-all"
                                        >
                                            {isGenerating ? (
                                                <span className="flex items-center gap-2">
                                                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                                                    Generating...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <Wand2 className="w-3.5 h-3.5" />
                                                    Generate Variant
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Export Options */}
                            <div className="space-y-3 lg:space-y-4">
                                <h3 className="text-xs lg:text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <MonitorPlay className="w-3 h-3" />
                                    Export
                                </h3>
                                <div className="p-3 lg:p-4 rounded-xl bg-slate-800/50 border border-slate-700 shadow-sm">
                                    <p className="text-xs text-slate-400 mb-3">
                                        Exports include PNG sequence and JSON metadata compatible with Unity and Godot.
                                    </p>
                                    <Button
                                        onClick={handleExport}
                                        className="w-full h-9 text-xs font-semibold"
                                        variant="outline"
                                    >
                                        <Download className="w-3.5 h-3.5 mr-2" />
                                        Export Scene
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Variants List */}
                            <div className="lg:hidden space-y-3">
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Layers className="w-3 h-3" />
                                    Variants ({project.variants.length})
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {project.variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() => setSelectedVariantId(variant.id)}
                                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${selectedVariantId === variant.id
                                                ? "border-primary shadow-lg shadow-primary/20"
                                                : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                                                }`}
                                        >
                                            <img
                                                src={variant.imageUrl}
                                                alt={`Variant ${variant.id}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedVariantId === variant.id && (
                                                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SpritePreviewLayout>
    );
}

export default function ScenePreviewPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-slate-400">Loading...</div>}>
            <ScenePreviewContent />
        </Suspense>
    );
}
