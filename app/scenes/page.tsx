"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
    CaretLeft,
    Upload,
    Lightning,
    X,
    Check,
    Sparkle,
    MagicWand,
    GridFour,
    MagnifyingGlassPlus,
    ArrowsOut,
    Stack,
    Download,
    Command,
    Plus,
    FolderPlus,
    CaretDown,
    CaretRight,
    Sidebar,
    Tree,
    Image as ImageIcon,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileModal } from "@/components/profile-modal";
import { BYOKButton } from "@/components/home/BYOKButton";
import { useAuth } from "@/hooks/useAuth";
import { api, Asset } from "@/services/api";

type SceneType = "indoor" | "outdoor";
type Viewpoint = "front" | "back" | "side" | "top_down" | "isometric";
type Style =
    | "environment"
    | "isometric"
    | "topdown_map"
    | "textured"
    | "watercolor"
    | "low_res"
    | "mc_texture"
    | "retro"
    | "default"
    | "pixel_art" // Legacy
    | "2d_flat";  // Legacy

export default function GenerateScenePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const { user } = useAuth();

    // State
    const [sceneType, setSceneType] = useState<SceneType>("outdoor");
    const [prompt, setPrompt] = useState("");
    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [customColor, setCustomColor] = useState("");
    const [viewpoint, setViewpoint] = useState<Viewpoint>("isometric");
    const [style, setStyle] = useState<Style>("environment");
    const [dimensions, setDimensions] = useState("256x256");
    const [quantity, setQuantity] = useState(1);
    const [tileX, setTileX] = useState(false);
    const [tileY, setTileY] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
    const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showBYOKPrompt, setShowBYOKPrompt] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const remainingSlots = 10 - referenceImages.length;
        const filesToProcess = files.slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImages(prev => [...prev, reader.result as string].slice(0, 10));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveReferenceImage = (index: number) => {
        setReferenceImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddColor = () => {
        if (customColor && !colors.includes(customColor) && colors.length < 5) {
            setColors([...colors, customColor]);
            setCustomColor("");
        }
    };

    const handleRemoveColor = (index: number) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleGenerateScene = async () => {
        if (!prompt.trim()) return;

        // Check for API key (BYOK)
        const apiKey = localStorage.getItem("replicate_api_key");
        // Backend handles credit deduction if no key.

        setIsGenerating(true);
        setPreviewImages([]);
        setGeneratedAssets([]);
        setSelectedPreview(null);

        try {
            const result = await api.generation.generateScene({
                prompt,
                style,
                viewpoint,
                colors,
                dimensions,
                quantity,
                referenceImage: referenceImages[0],
                projectId: projectId || undefined,
                apiKey: apiKey || undefined,
                tileX, // Passing new param
                tileY  // Passing new param
            });

            if (result.success) {
                setPreviewImages(result.images);
                if (result.assets) {
                    setGeneratedAssets(result.assets);
                }
            } else {
                console.error("Generation failed:", result.error);
                // TODO: Show toast
            }
        } catch (error) {
            console.error("Scene generation error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateProject = async () => {
        if (selectedPreview === null) return;

        try {
            let targetProjectId = projectId;

            // 1. Create project if needed
            if (!targetProjectId) {
                const title = "Untitled";

                const projectRes = await api.projects.create({
                    title,
                    type: 'scene',
                    description: prompt,
                    settings: {
                        style,
                        dimension: dimensions
                    }
                });

                if (projectRes.success && projectRes.project) {
                    targetProjectId = projectRes.project.id;
                } else {
                    console.error("Failed to create project");
                    return;
                }
            }

            // 2. Link Asset to Project
            if (targetProjectId && generatedAssets[selectedPreview]) {
                const assetId = generatedAssets[selectedPreview].id;
                await api.assets.update(assetId, {
                    project_id: targetProjectId
                });
            }

            // 3. Navigate
            router.push(`/projects/${targetProjectId}`);

        } catch (error) {
            console.error("Error creating project:", error);
        }
    };

    return (
        <div className="h-screen flex bg-background text-text font-sans selection:bg-primary/30 overflow-hidden">
            {/* Left Sidebar - Full Height */}
            <aside
                className={`bg-surface border-r border-border flex flex-col overflow-hidden transition-all duration-200 shrink-0 ${sidebarCollapsed ? 'w-12' : 'w-96'}`}
            >
                {/* Sidebar Header with Logo */}
                <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
                    {!sidebarCollapsed && (
                        <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Image
                                src="/logo.svg"
                                alt="Pixelar Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                            <span className="font-semibold text-sm text-white">Pixelar</span>
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-surface-highlight text-text-muted hover:text-text transition-colors"
                    >
                        <Sidebar className="w-4 h-4" />
                    </button>
                </div>

                {/* Sidebar Content */}
                {!sidebarCollapsed && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <div className="p-4 space-y-6">

                            {/* Scene Type Selector */}
                            <div className="p-4 rounded-xl bg-surface-highlight/40 space-y-3">
                                <Label className="studio-field-label">Scene Type</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => setSceneType("outdoor")}
                                        className={`flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border ${sceneType === "outdoor"
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_-5px_theme('colors.primary.DEFAULT/0.2')]"
                                            : "bg-surface border-white/[0.05] text-text-muted hover:bg-surface-highlight hover:text-text hover:border-white/[0.1]"
                                            }`}
                                    >
                                        <Tree className={`w-4 h-4 ${sceneType === "outdoor" ? "text-primary" : "text-text-muted"}`} />
                                        Outdoor
                                    </button>
                                    <button
                                        onClick={() => setSceneType("indoor")}
                                        className={`flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all duration-200 border ${sceneType === "indoor"
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_-5px_theme('colors.primary.DEFAULT/0.2')]"
                                            : "bg-surface border-white/[0.05] text-text-muted hover:bg-surface-highlight hover:text-text hover:border-white/[0.1]"
                                            }`}
                                    >
                                        <ImageIcon className={`w-4 h-4 ${sceneType === "indoor" ? "text-primary" : "text-text-muted"}`} />
                                        Indoor
                                    </button>
                                </div>
                            </div>

                            {/* Prompt Section */}
                            <div className="p-4 rounded-xl bg-surface-highlight/40 space-y-3">
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={sceneType === "outdoor" ? "Describe your outdoor scene..." : "Describe your indoor scene..."}
                                        className="w-full h-64 px-4 py-3 text-sm bg-background/50 border border-white/[0.05] rounded-xl resize-none focus:border-primary/50 focus:outline-none transition-all placeholder:text-text-muted pb-14 shadow-inner"
                                    />

                                    {/* Prompt Toolbar */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                        <div className="flex items-center gap-1.5 p-1 bg-surface/90 rounded-md border border-border pointer-events-auto shadow-sm">
                                            <label className="flex items-center justify-center p-1.5 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-primary cursor-pointer transition-all active:scale-90" title="Upload Reference">
                                                <ImageIcon className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    onChange={handleReferenceImageUpload}
                                                    accept="image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                    multiple
                                                />
                                            </label>
                                        </div>
                                        <div className="flex items-center pointer-events-auto">
                                            {prompt.length >= 9000 && (
                                                <span className="text-[10px] text-text-dim px-2 py-1.5 bg-surface/90 rounded-md border border-border shadow-sm tabular-nums scale-in-center animate-in fade-in duration-200">
                                                    {prompt.length.toLocaleString()}/10,000
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Multiple Reference Display */}
                                {referenceImages.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2 pt-1">
                                        {referenceImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-md border border-border overflow-hidden bg-surface-highlight group shadow-sm">
                                                <img src={img} alt="Ref" className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => handleRemoveReferenceImage(idx)}
                                                    className="absolute inset-x-0 bottom-0 top-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Properties Section */}
                            <div className="p-4 rounded-xl bg-surface-highlight/40 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-medium text-text-muted ml-1">Dimensions</Label>
                                        <div className="relative">
                                            <select
                                                value={dimensions}
                                                onChange={(e) => setDimensions(e.target.value)}
                                                className="w-full h-9 px-3 bg-background/50 border border-white/[0.05] rounded-lg text-xs text-text focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="128x128">128x128</option>
                                                <option value="256x256">256x256</option>
                                                <option value="384x384">384x384 (Max)</option>
                                            </select>
                                            <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-medium text-text-muted ml-1">Viewpoint</Label>
                                        <div className="relative">
                                            <select
                                                value={viewpoint}
                                                onChange={(e) => setViewpoint(e.target.value as Viewpoint)}
                                                className="w-full h-9 px-3 bg-background/50 border border-white/[0.05] rounded-lg text-xs text-text focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="front">Front</option>
                                                <option value="back">Back</option>
                                                <option value="side">Side</option>
                                                <option value="top_down">Top Down</option>
                                                <option value="isometric">Isometric</option>
                                            </select>
                                            <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[11px] font-medium text-text-muted ml-1">Quantity</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[1, 2, 3, 4].map((n) => (
                                                <button
                                                    key={n}
                                                    onClick={() => setQuantity(n)}
                                                    className={`h-9 rounded-lg text-xs font-semibold transition-all border ${quantity === n
                                                        ? "bg-primary text-white border-primary shadow-sm"
                                                        : "bg-surface border-white/[0.05] text-text-muted hover:bg-surface-highlight hover:text-text"
                                                        }`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Advanced Options Toggle */}
                                <div className="pt-1">
                                    <button
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="flex items-center gap-2.5 text-[11px] font-semibold text-text-muted hover:text-white transition-all group"
                                    >
                                        <div className="p-1 rounded-lg bg-background/50 border border-white/[0.05] group-hover:border-primary/30 transition-all shadow-sm group-active:scale-95">
                                            {showAdvanced ? (
                                                <CaretDown className="w-3 h-3" />
                                            ) : (
                                                <CaretRight className="w-3 h-3" />
                                            )}
                                        </div>
                                        Advanced Options
                                    </button>
                                </div>

                                {/* Collapsible Content */}
                                {showAdvanced && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {/* Style */}
                                        <div className="space-y-2">
                                            <Label className="text-[11px] text-text-muted ml-1">Style</Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                    {[
                                                        { value: "environment", label: "Environment" },
                                                        { value: "isometric", label: "Isometric" },
                                                        { value: "topdown_map", label: "Top-Down Map" },
                                                        { value: "textured", label: "Textured" },
                                                        { value: "watercolor", label: "Watercolor" },
                                                        { value: "low_res", label: "Low Res" },
                                                        { value: "mc_texture", label: "Minecraft Texture" },
                                                        { value: "retro", label: "Retro (PC98)" },
                                                    ].map(({ value, label }) => (
                                                        <button
                                                            key={value}
                                                            onClick={() => setStyle(value as Style)}
                                                            className={`flex items-center justify-center gap-2 h-8 px-2 rounded-lg text-[10px] font-semibold transition-all duration-200 border ${style === value
                                                                ? "bg-primary/10 border-primary/50 text-primary shadow-sm"
                                                                : "bg-background/40 border-white/[0.05] text-text-muted hover:bg-surface-highlight hover:text-text"
                                                                }`}
                                                        >
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tiling Toggles */}
                                        <div className="space-y-2 pt-2 border-t border-white/[0.05]">
                                            <Label className="text-[11px] text-text-muted ml-1">Seamless Tiling</Label>
                                            <div className="flex gap-4">
                                                <div className="flex items-center justify-between flex-1 px-1">
                                                    <Label className="text-[10px] text-text-dim">Horizontal (X)</Label>
                                                    <button
                                                        onClick={() => setTileX(!tileX)}
                                                        className={`w-8 h-4 rounded-full transition-colors relative ${tileX ? "bg-primary" : "bg-surface-highlight border border-border"}`}
                                                    >
                                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tileX ? "translate-x-4" : "translate-x-0"}`} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between flex-1 px-1">
                                                    <Label className="text-[10px] text-text-dim">Vertical (Y)</Label>
                                                    <button
                                                        onClick={() => setTileY(!tileY)}
                                                        className={`w-8 h-4 rounded-full transition-colors relative ${tileY ? "bg-primary" : "bg-surface-highlight border border-border"}`}
                                                    >
                                                        <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${tileY ? "translate-x-4" : "translate-x-0"}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Colors */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center px-1">
                                                <Label className="text-[11px] text-text-muted">Colors (Optional)</Label>
                                                <span className="text-[10px] text-text-dim tabular-nums">{colors.length}/5</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {colors.map((color, index) => (
                                                    <div key={index} className="group relative">
                                                        <div
                                                            className="w-7 h-7 rounded-md border border-border cursor-pointer transition-colors hover:border-primary shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveColor(index)}
                                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-surface border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-coral hover:border-accent-coral shadow-sm"
                                                        >
                                                            <X className="w-2 h-2 text-text hover:text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {colors.length < 5 && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative w-7 h-7 rounded-md border border-dashed border-border hover:border-primary transition-colors flex items-center justify-center cursor-pointer overflow-hidden bg-surface/30 shadow-sm">
                                                            <input
                                                                type="color"
                                                                value={customColor}
                                                                onChange={(e) => setCustomColor(e.target.value)}
                                                                className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer opacity-0"
                                                            />
                                                            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: customColor || 'transparent' }}>
                                                                {!customColor && <Plus className="w-3.5 h-3.5 text-text-muted" />}
                                                            </div>
                                                        </div>
                                                        {customColor && (
                                                            <Button
                                                                onClick={handleAddColor}
                                                                size="sm"
                                                                variant="secondary"
                                                                className="h-7 px-2 text-[10px] bg-surface/80"
                                                            >
                                                                Add
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-4 border-t border-white/[0.05] bg-background/50 backdrop-blur-sm">
                    <Button
                        onClick={handleGenerateScene}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full h-11 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <Sparkle className="w-4 h-4 animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <MagicWand className="w-4 h-4" />
                                Generate Scene
                            </span>
                        )}
                    </Button>
                </div>
            </aside>

            {/* Right Side - Header + Viewport */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 bg-background/80 backdrop-blur-md border-b border-white/[0.05] px-6 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link
                            href={projectId ? `/projects/${projectId}` : "/home"}
                            className="flex items-center justify-center w-9 h-9 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-200 text-text-muted hover:text-text group"
                        >
                            <CaretLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </Link>

                        <div className="h-6 w-[1px] bg-white/[0.08]" />

                        <div className="flex flex-col">
                            <span className="font-semibold text-sm tracking-tight text-white">Scene Generator</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* BYOK Button */}
                        <BYOKButton />


                        {/* Profile Section */}
                        <ProfileModal>
                            <div className="flex items-center gap-3 px-1 py-1 pl-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-full border border-white/[0.08] hover:border-white/[0.15] cursor-pointer transition-all duration-200 active:scale-[0.98]">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-xs font-bold text-white tracking-wide">{user?.displayName || "User"}</span>
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Free Plan</span>
                                </div>
                                <div className="relative">
                                    <img
                                        src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                        alt={user?.displayName || "User"}
                                        className="w-8 h-8 rounded-full border-2 border-surface-highlight bg-surface-highlight shadow-inner"
                                    />
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full shadow-sm" />
                                </div>
                            </div>
                        </ProfileModal>
                    </div>
                </header>

                {/* Viewport */}
                <div className="flex-1 bg-background relative flex flex-col overflow-hidden" ref={mainRef}>
                    {/* Viewport Header */}
                    <div className="h-10 border-b border-border flex items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-text-muted">Preview</span>
                            <div className="px-2 py-0.5 rounded bg-surface border border-border text-xs text-text-muted">100%</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <GridFour className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                                <ArrowsOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 overflow-auto flex items-center justify-center relative bg-[url('/grid-pattern.svg')] bg-center">
                        {isGenerating ? (
                            <div className="grid grid-cols-2 gap-6 p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
                                {[...Array(quantity)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="aspect-video bg-surface/50 rounded-lg border border-border border-dashed flex flex-col items-center justify-center relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ transform: 'skewX(-20deg) translateX(-150%)' }} />
                                        <div className="flex flex-col items-center gap-3 z-10">
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            <div className="space-y-1 text-center">
                                                <span className="text-xs font-semibold text-text-muted">Generating...</span>
                                                <span className="text-[10px] text-text-dim block">{dimensions}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : previewImages.length === 0 ? (
                            <div className="text-center space-y-4 max-w-xs">
                                <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
                                    <Command className="w-6 h-6 text-text-muted" />
                                </div>
                                <p className="text-sm text-text-muted">Configure settings and generate to see results</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-6 p-8 max-w-4xl mx-auto">
                                {previewImages.map((img, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedPreview(index)}
                                        className={`group relative aspect-video bg-surface rounded-lg border transition-colors cursor-pointer ${selectedPreview === index
                                            ? 'border-primary'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="absolute inset-4 flex items-center justify-center">
                                            <img src={img} alt="Generated Scene" className="w-full h-full object-cover rounded-md pixelated" />
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-opacity ${selectedPreview === index ? 'opacity-100' : 'opacity-0'
                                            }`}>
                                            <Check className="w-3 h-3 text-primary-foreground" weight="bold" />
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-border rounded-md p-1">
                                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                                <MagnifyingGlassPlus className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="w-7 h-7">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Fixed Floating Action Button */}
                    {selectedPreview !== null && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 z-10">
                            <span className="text-sm text-text">Variant {selectedPreview + 1} selected</span>
                            <Button
                                onClick={handleCreateProject}
                                size="sm"
                                className="h-8 rounded-full px-4"
                            >
                                {projectId ? (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Add to Project
                                    </>
                                ) : (
                                    <>
                                        <FolderPlus className="w-4 h-4" />
                                        Create Project
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
