"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
    ChevronLeft,
    Zap,
    Download,
    ZoomIn,
    ZoomOut,
    Grid3x3,
    Maximize,
    Info,
    Palette,
    Image as ImageIcon,
    FileDown,
    Check,
    Plus,
    Calendar,
    Tag,
    Camera,
    Sparkles,
    Layers,
    ExternalLink,
    Copy,
    Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Scene = {
    id: string;
    name: string;
    thumbnail: string;
    prompt: string;
    createdAt: string;
};

type ExportFormat = "png" | "sprite_sheet" | "unity" | "godot";

export default function ScenePreviewPage() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId") || "project-123"; // Get projectId from URL

    const [zoom, setZoom] = useState(100);
    const [showGrid, setShowGrid] = useState(true);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedScene, setSelectedScene] = useState<string>("scene-1");
    const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
    const mainRef = useRef<HTMLDivElement>(null);

    // Project metadata (as per requirement 3.2)
    const projectMetadata = {
        prompt: "A heroic knight character in pixel art style with sword and shield",
        createdAt: "Nov 28, 2025",
        orientation: "Front View",
        style: "Pixel Art",
        model: "Pixelar-V2",
        dimensions: "128x128",
    };

    // Multiple scenes in one project
    const [scenes, setScenes] = useState<Scene[]>([
        {
            id: "scene-1",
            name: "Hero Knight - Original",
            thumbnail: "https://picsum.photos/seed/knight1/200/200",
            prompt: "A heroic knight character in pixel art style with sword and shield",
            createdAt: "Nov 28, 2025",
        },
        {
            id: "scene-2",
            name: "Hero Knight - Blue Armor",
            thumbnail: "https://picsum.photos/seed/knight2/200/200",
            prompt: "A heroic knight character in pixel art style with blue armor",
            createdAt: "Nov 28, 2025",
        },
        {
            id: "scene-3",
            name: "Hero Knight - Golden",
            thumbnail: "https://picsum.photos/seed/knight3/200/200",
            prompt: "A heroic knight character in pixel art style with golden equipment",
            createdAt: "Nov 27, 2025",
        },
    ]);

    const currentScene = scenes.find((s) => s.id === selectedScene) || scenes[0];

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 400));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 25));

    const duplicateScene = (sceneId: string) => {
        const scene = scenes.find((s) => s.id === sceneId);
        if (scene) {
            const newScene = {
                ...scene,
                id: `scene-${Date.now()}`,
                name: `${scene.name} (Copy)`,
            };
            setScenes([...scenes, newScene]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-text font-sans selection:bg-primary/30 overflow-hidden">
            {/* Header - Studio Bar */}
            <header className="border-b border-primary/15 bg-surface/50 backdrop-blur-md px-4 py-3 z-50">
                <div className="flex items-center justify-between gap-6">
                    {/* Left Section - Navigation & Title */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/projects"
                            className="flex items-center justify-center w-8 h-8 hover:bg-surface-highlight rounded-md transition-colors text-text-muted hover:text-primary"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Link>
                        <div className="h-5 w-[1px] bg-primary/20" />
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="font-mono font-bold text-xs text-primary-foreground">Px</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-sm tracking-tight text-text">
                                    {projectMetadata.prompt.substring(0, 30)}...
                                </span>
                                <span className="text-[10px] text-text-muted">
                                    {scenes.length} {scenes.length === 1 ? "Scene" : "Scenes"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center Section - Scene Info */}
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-highlight border border-primary/15">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-medium text-text">Scene Preview</span>
                    </div>

                    {/* Right Section - Credits & Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-highlight border border-primary/15">
                            <div className="flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-mono font-semibold text-text">450</span>
                            </div>
                            <div className="w-[1px] h-4 bg-primary/20" />
                            <span className="text-xs text-text-muted">Credits</span>
                        </div>

                        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-surface-highlight rounded-lg border border-primary/15">
                            <div className="text-right">
                                <div className="text-xs font-medium text-text">Alex Design</div>
                                <div className="text-[10px] text-text-muted">Pro Plan</div>
                            </div>
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary p-[0.5px]">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="User"
                                    className="w-full h-full rounded-[3px] bg-black"
                                />
                            </div>
                        </div>

                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary p-[1px] md:hidden">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User"
                                className="w-full h-full rounded-[5px] bg-black"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden" ref={mainRef}>
                {/* Left Panel - Scene Preview */}
                <div className="flex-1 bg-background relative flex flex-col overflow-hidden">
                    {/* Viewport Header */}
                    <div className="h-12 border-b border-primary/15 flex items-center justify-between px-4 bg-surface/30">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                                Scene Preview
                            </span>
                            <div className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[10px] font-mono text-green-500">
                                READ-ONLY
                            </div>
                            <div className="w-[1px] h-4 bg-primary/20" />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-highlight">
                                <span className="text-[10px] font-mono text-text">{zoom}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleZoomOut}
                                    className="w-7 h-7 rounded hover:bg-surface-highlight hover:text-primary text-text-muted transition-colors"
                                >
                                    <ZoomOut className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleZoomIn}
                                    className="w-7 h-7 rounded hover:bg-surface-highlight hover:text-primary text-text-muted transition-colors"
                                >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowGrid(!showGrid)}
                                className={`w-7 h-7 rounded transition-colors ${showGrid
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-surface-highlight hover:text-primary text-text-muted"
                                    }`}
                            >
                                <Grid3x3 className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 rounded hover:bg-surface-highlight hover:text-primary text-text-muted transition-colors"
                            >
                                <Maximize className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 overflow-auto flex items-center justify-center relative bg-[#09090b] p-8">
                        {/* Grid Background */}
                        {showGrid && (
                            <div
                                className="absolute inset-0 opacity-[0.05]"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                }}
                            />
                        )}

                        {/* Center Frame */}
                        <div className="relative w-[500px] h-[500px]" style={{ transform: `scale(${zoom / 100})` }}>
                            {/* Corner Markers */}
                            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary/50 rounded-tl" />
                            <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-primary/50 rounded-tr" />
                            <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-primary/50 rounded-bl" />
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary/50 rounded-br" />

                            {/* Main Canvas */}
                            <div className="absolute inset-0 bg-surface/10 border-2 border-primary/30 rounded-xl overflow-hidden shadow-2xl shadow-primary/30">
                                {/* Checkerboard pattern for transparency */}
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)",
                                        backgroundSize: "20px 20px",
                                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                                    }}
                                />

                                {/* Scene Preview */}
                                <div className="absolute inset-0 flex items-center justify-center p-12">
                                    <img
                                        src={currentScene.thumbnail}
                                        alt={currentScene.name}
                                        className="max-w-full max-h-full object-contain pixelated shadow-2xl"
                                        style={{
                                            imageRendering: "pixelated",
                                            filter: "contrast(1.05) saturate(1.05)",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Info Badges */}
                            <div className="absolute -top-10 left-0 right-0 flex items-center justify-between">
                                <div className="px-2 py-1 bg-surface/90 backdrop-blur-sm border border-primary/15 rounded text-[10px] font-mono text-text-muted">
                                    {projectMetadata.dimensions}
                                </div>
                                <div className="px-2 py-1 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded text-[10px] font-mono text-primary">
                                    {currentScene.name}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="border-t border-primary/15 bg-surface/50 backdrop-blur-sm px-6 py-4 flex items-center justify-center gap-3">
                        <Button
                            onClick={() => setShowExportModal(true)}
                            className="h-9 px-5 text-xs font-semibold bg-primary hover:bg-primary-600 text-primary-foreground shadow-lg shadow-primary/30 transition-all"
                        >
                            <Download className="w-3.5 h-3.5 mr-2" />
                            Export Scene
                        </Button>
                        <Link href={`/scenes?projectId=${projectId}`}>
                            <Button
                                variant="outline"
                                className="h-9 px-5 text-xs font-semibold border-primary/20 hover:bg-primary/10 hover:border-primary/30 hover:text-primary"
                            >
                                <Pencil className="w-3.5 h-3.5 mr-2" />
                                Edit Scene
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Right Panel - Metadata & Scenes */}
                <div className="w-[420px] bg-surface border-l border-primary/15 flex flex-col overflow-hidden">
                    {/* Metadata Section (Requirement 3.2) */}
                    <div className="border-b border-primary/15 bg-surface/50">
                        <div className="p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                                    <Info className="w-4 h-4 text-primary" />
                                    Scene Details
                                </h3>
                                <div className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-mono text-primary">
                                    {projectMetadata.style}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Prompt */}
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        Generation Prompt
                                    </Label>
                                    <div className="text-xs text-text leading-relaxed bg-surface-highlight/40 p-3 rounded-lg border border-primary/10 font-medium">
                                        {currentScene.prompt}
                                    </div>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Creation Date */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" />
                                            Created
                                        </Label>
                                        <div className="text-xs text-text font-mono bg-surface-highlight/40 p-2.5 rounded-lg border border-primary/10">
                                            {currentScene.createdAt}
                                        </div>
                                    </div>

                                    {/* Orientation */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                            <Camera className="w-3 h-3" />
                                            View
                                        </Label>
                                        <div className="text-xs text-text font-mono bg-surface-highlight/40 p-2.5 rounded-lg border border-primary/10">
                                            {projectMetadata.orientation}
                                        </div>
                                    </div>

                                    {/* Model */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            Model
                                        </Label>
                                        <div className="text-xs text-text font-mono bg-surface-highlight/40 p-2.5 rounded-lg border border-primary/10">
                                            {projectMetadata.model}
                                        </div>
                                    </div>

                                    {/* Dimensions */}
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-mono text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                            <ImageIcon className="w-3 h-3" />
                                            Size
                                        </Label>
                                        <div className="text-xs text-text font-mono bg-surface-highlight/40 p-2.5 rounded-lg border border-primary/10">
                                            {projectMetadata.dimensions}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scenes Section - Multiple scenes in one project */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-primary/15 flex items-center justify-between bg-surface/50">
                            <h3 className="text-sm font-semibold text-text flex items-center gap-2">
                                <Layers className="w-4 h-4 text-primary" />
                                Project Scenes
                                <span className="text-xs font-mono text-text-muted">({scenes.length})</span>
                            </h3>
                            {/* New Scene creates new variation in same project */}
                            <Link href={`/scenes?projectId=${projectId}`}>
                                <Button
                                    size="sm"
                                    className="h-7 px-3 text-xs font-semibold bg-primary hover:bg-primary-600 text-primary-foreground shadow-lg shadow-primary/30"
                                >
                                    <Plus className="w-3 h-3 mr-1.5" />
                                    New Scene
                                </Button>
                            </Link>
                        </div>

                        {/* Scenes List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-3 space-y-2">
                                {scenes.map((scene) => (
                                    <div
                                        key={scene.id}
                                        onClick={() => setSelectedScene(scene.id)}
                                        className={`group relative rounded-lg border transition-all cursor-pointer ${selectedScene === scene.id
                                            ? "border-primary/40 bg-primary/5 shadow-lg shadow-primary/10"
                                            : "border-primary/15 bg-surface-highlight/30 hover:border-primary/25 hover:bg-surface-highlight/50"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 p-3">
                                            {/* Scene Thumbnail */}
                                            <div className="relative w-20 h-20 rounded-lg border border-primary/20 overflow-hidden flex-shrink-0 bg-black">
                                                <img
                                                    src={scene.thumbnail}
                                                    alt={scene.name}
                                                    className="w-full h-full object-cover"
                                                    style={{ imageRendering: "pixelated" }}
                                                />
                                                {selectedScene === scene.id && (
                                                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                                        <Check className="w-3 h-3 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Scene Info */}
                                            <div className="flex-1 min-w-0 space-y-1">
                                                <h4 className="text-sm font-medium text-text truncate">{scene.name}</h4>
                                                <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">
                                                    {scene.prompt}
                                                </p>
                                                <div className="text-[10px] text-text-muted font-mono">{scene.createdAt}</div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="px-3 pb-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedScene(scene.id);
                                                    setShowExportModal(true);
                                                }}
                                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary"
                                            >
                                                <Download className="w-3 h-3 mr-1" />
                                                Export
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    duplicateScene(scene.id);
                                                }}
                                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary"
                                            >
                                                <Copy className="w-3 h-3 mr-1" />
                                                Duplicate
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="p-4 border-t border-primary/15 bg-surface/50 backdrop-blur-sm">
                        <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-text-muted leading-relaxed">
                                <span className="font-semibold text-blue-400">Edit Scene</span> creates a new visual
                                variation that appears as a new scene in this project.
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-surface border border-primary/20 rounded-2xl shadow-2xl shadow-black/40 w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-primary/15 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileDown className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-text">Export Scene</h2>
                                    <p className="text-xs text-text-muted">{currentScene.name}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowExportModal(false)}
                                className="w-8 h-8 rounded-lg hover:bg-surface-highlight hover:text-primary text-text-muted"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-xs text-text-dim">Export Format</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: "png", label: "PNG", icon: ImageIcon, desc: "Single image" },
                                        { value: "sprite_sheet", label: "Sprite Sheet", icon: Grid3x3, desc: "Grid layout" },
                                        { value: "unity", label: "Unity", icon: ExternalLink, desc: "Package" },
                                        { value: "godot", label: "Godot", icon: ExternalLink, desc: "Scene file" },
                                    ].map(({ value, label, icon: Icon, desc }) => (
                                        <button
                                            key={value}
                                            onClick={() => setExportFormat(value as ExportFormat)}
                                            className={`flex flex-col gap-1.5 py-3 px-3 rounded-lg text-xs font-medium transition-all border ${exportFormat === value
                                                ? "bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/20"
                                                : "bg-surface-highlight/50 border-primary/15 text-text-muted hover:bg-surface-highlight hover:border-primary/25 hover:text-primary"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <Icon className="w-4 h-4" />
                                                {exportFormat === value && <Check className="w-3.5 h-3.5" />}
                                            </div>
                                            <span className="text-left font-semibold">{label}</span>
                                            <span className="text-[10px] opacity-70 text-left">{desc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-text-dim">Resolution</Label>
                                <select className="w-full px-3 py-2.5 bg-surface-highlight/50 border border-primary/25 rounded-lg text-xs text-text focus:border-primary/60 focus:ring-2 focus:ring-primary/30 focus:outline-none transition-all cursor-pointer">
                                    <option>Original ({projectMetadata.dimensions})</option>
                                    <option>2x (256 × 256)</option>
                                    <option>4x (512 × 512)</option>
                                    <option>8x (1024 × 1024)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs text-text-dim flex items-center gap-2">
                                    <Info className="w-3 h-3" />
                                    Export Settings
                                </Label>
                                <div className="space-y-2.5 p-3 bg-surface-highlight/30 rounded-lg border border-primary/10">
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 rounded border-primary/30 bg-surface-highlight text-primary focus:ring-2 focus:ring-primary/30"
                                        />
                                        <span className="text-xs text-text group-hover:text-primary transition-colors">
                                            Preserve transparency
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-4 h-4 rounded border-primary/30 bg-surface-highlight text-primary focus:ring-2 focus:ring-primary/30"
                                        />
                                        <span className="text-xs text-text group-hover:text-primary transition-colors">
                                            Include metadata
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-primary/30 bg-surface-highlight text-primary focus:ring-2 focus:ring-primary/30"
                                        />
                                        <span className="text-xs text-text group-hover:text-primary transition-colors">
                                            Optimize for web
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-primary/15 flex items-center justify-between bg-surface/50">
                            <div className="text-xs text-text-muted">
                                <span className="font-mono">~1.2 MB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowExportModal(false)}
                                    className="h-8 px-4 text-xs hover:bg-surface-highlight"
                                >
                                    Cancel
                                </Button>
                                <Button className="h-8 px-4 text-xs font-semibold bg-primary hover:bg-primary-600 text-primary-foreground shadow-lg shadow-primary/30">
                                    <Download className="w-3 h-3 mr-1.5" />
                                    Export
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
