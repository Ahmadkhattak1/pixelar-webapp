"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import {
    CaretLeft,
    Upload,
    X,
    Check,
    Sparkle,
    MagicWand,
    MagnifyingGlassPlus,
    Stack,
    Download,
    Command,
    Plus,
    FolderPlus,
    User,
    Cube,
    Trash,
    CaretDown,
    CaretRight,
    Sidebar,
    PersonSimple,
    Image as ImageIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ProfileModal } from "@/components/profile-modal";
import { BYOKButton } from "@/components/home/BYOKButton";
import { useAuth } from "@/hooks/useAuth";
import { api, Asset } from "@/services/api";

// Dynamically import PoseEditor to avoid SSR issues with Canvas
const PoseEditor = dynamic(() => import("@/components/pose-editor/PoseEditor"), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-text-muted">Loading 3D Editor...</div>
});

type SpriteType = "character" | "object" | "animation";
type Viewpoint = "front" | "back" | "side" | "top_down" | "isometric";
type Style =
    | "default"
    | "retro"
    | "watercolor"
    | "textured"
    | "cartoon"
    | "character_turnaround"
    | "isometric_asset"
    | "topdown_asset"
    | "classic"
    | "topdown_item"
    | "mc_item"
    | "skill_icon"
    | "pixel_art" // Legacy fallback
    | "2d_flat";  // Legacy fallback

export default function GenerateSpritePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get("projectId");
    const { user } = useAuth();

    // State
    const [spriteType, setSpriteType] = useState<SpriteType>("character");
    const [prompt, setPrompt] = useState("");
    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [colors, setColors] = useState<string[]>([]);
    const [customColor, setCustomColor] = useState("");
    const [viewpoint, setViewpoint] = useState<Viewpoint>("front");
    const [style, setStyle] = useState<Style>("default");
    const [dimensions, setDimensions] = useState("64x64");
    const [quantity, setQuantity] = useState(1);
    const [removeBg, setRemoveBg] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isEditingPose, setIsEditingPose] = useState(false);
    const [poseImage, setPoseImage] = useState<string | null>(null);
    const [showBYOKPrompt, setShowBYOKPrompt] = useState(false);
    const [generatedAssets, setGeneratedAssets] = useState<Asset[]>([]);
    const [animationStyle, setAnimationStyle] = useState<"four_angle_walking" | "walking_and_idle" | "small_sprites" | "vfx">("four_angle_walking");
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
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

    // Auto-set dimensions based on animation style
    useEffect(() => {
        if (spriteType === 'animation') {
            if (animationStyle === 'four_angle_walking' || animationStyle === 'walking_and_idle') {
                setDimensions("48x48");
            } else if (animationStyle === 'small_sprites') {
                setDimensions("32x32");
            }
        }
    }, [spriteType, animationStyle]);

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

    const handleGenerateSprite = async () => {
        if (!prompt.trim()) return;

        // Check for API key (BYOK)
        const apiKey = localStorage.getItem("replicate_api_key");

        setIsGenerating(true);
        setPreviewImages([]);
        setGeneratedAssets([]);
        setSelectedPreview(null);
        setGenerationError(null);
        setCreatedProjectId(null);

        try {
            let result;

            if (spriteType === "animation") {
                // Direct Animation Generation
                const [w, h] = dimensions.split('x').map(Number);
                result = await api.generation.generateDirectAnimation({
                    prompt,
                    style: animationStyle,
                    width: w || 48,
                    height: h || 48,
                    quantity,
                    projectId: projectId || undefined,
                    apiKey: apiKey || undefined,
                    return_spritesheet: true,
                    bypass_prompt_expansion: false
                });
            } else {
                // Standard Sprite Generation
                result = await api.generation.generateSprite({
                    prompt,
                    style,
                    viewpoint,
                    colors,
                    dimensions,
                    quantity,
                    referenceImage: referenceImages[0],
                    poseImage: poseImage || undefined,
                    projectId: projectId || undefined,
                    apiKey: apiKey || undefined,
                    removeBg,
                    spriteType
                });
            }

            console.log("Generation Result:", result); // DEBUG Log
            console.log("Images from result:", result.images);
            console.log("Assets from result:", result.assets);
            console.log("Project from result:", result.project, result.projectId);

            if (result.success) {
                // Get images from result, filtering out any empty/invalid URLs
                let imagesToShow = (result.images || []).filter((img: string) => img && img.trim() !== '');

                console.log("Filtered images:", imagesToShow);

                // Fallback to assets if images array is empty but assets exist
                if (imagesToShow.length === 0 && result.assets && result.assets.length > 0) {
                    console.log("Falling back to asset blob_urls");
                    imagesToShow = result.assets
                        .map((a: any) => a.blob_url)
                        .filter((url: string) => url && url.trim() !== '');
                    console.log("Asset blob_urls:", imagesToShow);
                }

                if (imagesToShow.length > 0) {
                    console.log("Setting preview images:", imagesToShow);
                    setPreviewImages(imagesToShow);
                    // Auto-select first image if none selected
                    setSelectedPreview(0);
                } else {
                    console.error("No valid images found in result");
                    setGenerationError("Generation completed but no images were returned. Please try again.");
                }

                if (result.assets && result.assets.length > 0) {
                    console.log("Setting generated assets:", result.assets);
                    setGeneratedAssets(result.assets);
                }

                // Store the auto-created project ID for navigation
                if (result.projectId) {
                    setCreatedProjectId(result.projectId);
                }
            } else {
                console.error("Generation failed:", result.error);
                setGenerationError(result.error || "Generation failed. Please try again.");
            }
        } catch (error: any) {
            console.error("Generation error:", error);
            const errorMessage = error?.message || error?.error || "An unexpected error occurred. Please try again.";

            if (errorMessage.includes("No API key configured") || errorMessage.includes("Invalid or expired token")) {
                setShowBYOKPrompt(true);
            } else {
                setGenerationError(errorMessage);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewProject = () => {
        // Navigate to the auto-created project
        const targetProjectId = createdProjectId || projectId;
        if (targetProjectId) {
            router.push(`/projects/${targetProjectId}`);
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

                            {/* Sprite Type Selector */}
                            <div className="p-4 rounded-xl bg-surface-highlight/40 space-y-3">
                                <Label className="studio-field-label">Sprite Type</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => setSpriteType("character")}
                                        className={`flex flex-col items-center justify-center gap-1.5 h-16 px-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${spriteType === "character"
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_-5px_theme('colors.primary.DEFAULT/0.2')]"
                                            : "bg-surface border-white/[0.08] text-text-muted hover:bg-surface-highlight hover:text-text hover:border-white/[0.15]"
                                            }`}
                                    >
                                        <User className={`w-5 h-5 ${spriteType === "character" ? "text-primary" : "text-text-muted"}`} weight={spriteType === "character" ? "fill" : "regular"} />
                                        Character
                                    </button>
                                    <button
                                        onClick={() => setSpriteType("object")}
                                        className={`flex flex-col items-center justify-center gap-1.5 h-16 px-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${spriteType === "object"
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_-5px_theme('colors.primary.DEFAULT/0.2')]"
                                            : "bg-surface border-white/[0.08] text-text-muted hover:bg-surface-highlight hover:text-text hover:border-white/[0.15]"
                                            }`}
                                    >
                                        <Cube className={`w-5 h-5 ${spriteType === "object" ? "text-primary" : "text-text-muted"}`} weight={spriteType === "object" ? "fill" : "regular"} />
                                        Object
                                    </button>
                                    <button
                                        onClick={() => setSpriteType("animation")}
                                        className={`flex flex-col items-center justify-center gap-1.5 h-16 px-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${spriteType === "animation"
                                            ? "bg-primary/10 border-primary/50 text-primary shadow-[0_0_20px_-5px_theme('colors.primary.DEFAULT/0.2')]"
                                            : "bg-surface border-white/[0.08] text-text-muted hover:bg-surface-highlight hover:text-text hover:border-white/[0.15]"
                                            }`}
                                    >
                                        <PersonSimple className={`w-5 h-5 ${spriteType === "animation" ? "text-primary" : "text-text-muted"}`} weight={spriteType === "animation" ? "fill" : "regular"} />
                                        Animation
                                    </button>
                                </div>
                            </div>


                            {/* Prompt Section */}
                            <div className="p-4 rounded-xl bg-surface-highlight/40 space-y-3">
                                <div className="relative">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder={spriteType === "character" ? "e.g. A brave knight with silver armor and a red cape..." : spriteType === "object" ? "e.g. A glowing health potion in a glass bottle..." : "e.g. A wizard casting spells with flowing robes..."}
                                        className="w-full h-64 px-4 py-3 text-sm bg-background/50 border border-white/[0.08] rounded-xl resize-none focus:border-primary/50 focus:outline-none transition-all placeholder:text-text-dim pb-14"
                                    />

                                    {/* Prompt Toolbar */}
                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                        <div className="flex items-center gap-1.5 p-1 bg-surface/90 rounded-md border border-border pointer-events-auto shadow-sm">
                                            {spriteType === "character" && (
                                                <button
                                                    onClick={() => setIsEditingPose(true)}
                                                    className="p-1.5 rounded-lg hover:bg-surface-highlight text-text-muted hover:text-primary transition-all active:scale-90"
                                                    title="Open Pose Editor"
                                                >
                                                    <PersonSimple className="w-4 h-4" />
                                                </button>
                                            )}
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
                                        <div className="flex items-center gap-1.5 ml-1">
                                            <Label className="text-[11px] font-medium text-text-muted">Dimensions</Label>
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={dimensions}
                                                onChange={(e) => setDimensions(e.target.value)}
                                                className="w-full h-9 px-3 bg-background/50 border border-white/[0.05] rounded-lg text-xs text-text focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                                disabled={spriteType === 'animation' && animationStyle !== 'vfx'}
                                            >
                                                {spriteType === 'animation' ? (
                                                    <>
                                                        <option value="32x32">32x32</option>
                                                        <option value="48x48">48x48</option>
                                                        <option value="64x64">64x64</option>
                                                        <option value="96x96">96x96</option>
                                                    </>
                                                ) : (
                                                    <>
                                                        <option value="32x32">32x32</option>
                                                        <option value="64x64">64x64</option>
                                                        <option value="128x128">128x128</option>
                                                        <option value="256x256">256x256</option>
                                                        <option value="384x384">384x384 (Max)</option>
                                                    </>
                                                )}
                                            </select>
                                            <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                                        </div>
                                    </div>

                                    {spriteType === "animation" ? (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <Label className="text-[11px] font-medium text-text-muted">Anim Style</Label>
                                            </div>
                                            <div className="relative">
                                                <select
                                                    value={animationStyle}
                                                    onChange={(e) => setAnimationStyle(e.target.value as any)}
                                                    className="w-full h-9 px-3 bg-background/50 border border-white/[0.05] rounded-lg text-xs text-text focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="four_angle_walking">4-Angle Walk</option>
                                                    <option value="walking_and_idle">Walk + Idle</option>
                                                    <option value="small_sprites">Small Sprites</option>
                                                    <option value="vfx">VFX</option>
                                                </select>
                                                <CaretDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <Label className="text-[11px] font-medium text-text-muted">Viewpoint</Label>
                                                <div className="group relative">
                                                    <div className="w-3 h-3 rounded-full border border-text-dim flex items-center justify-center cursor-help text-[8px] text-text-dim">?</div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover border border-border rounded-lg shadow-xl text-[10px] text-text-muted leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                        Perspective angle of the sprite (e.g., Side view for platformers, Top Down for RPGs).
                                                    </div>
                                                </div>
                                            </div>
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
                                    )}
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

                                {/* Advanced Options Toggle */}
                                {spriteType !== "animation" && (
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
                                )}

                                {/* Collapsible Content */}
                                {showAdvanced && spriteType !== "animation" && (
                                    <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        {/* Style */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1.5 ml-1">
                                                <Label className="text-[11px] text-text-muted">Style</Label>
                                                <div className="group relative">
                                                    <div className="w-3 h-3 rounded-full border border-text-dim flex items-center justify-center cursor-help text-[8px] text-text-dim">?</div>
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover border border-border rounded-lg shadow-xl text-[10px] text-text-muted leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                                        Artistic rendering style. 'Pixel Art' enforces strict grid alignment, while 'Retro' allows more organic shapes.
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                                    {[
                                                        { value: "default", label: "Default" },
                                                        { value: "pixel_art", label: "Pixel Art" },
                                                        { value: "2d_flat", label: "2D Flat" },
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

                                        {/* Remove Background Toggle */}
                                        <div className="flex items-center justify-between px-1">
                                            <Label className="text-[11px] text-text-muted">Remove Background</Label>
                                            <button
                                                onClick={() => setRemoveBg(!removeBg)}
                                                className={`w-8 h-4 rounded-full transition-colors relative ${removeBg ? "bg-primary" : "bg-surface-highlight border border-border"}`}
                                            >
                                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white transition-transform ${removeBg ? "translate-x-4" : "translate-x-0"}`} />
                                            </button>
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
                        onClick={handleGenerateSprite}
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
                                Generate Sprite
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
                            <span className="font-semibold text-sm tracking-tight text-white">Sprite Generator</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* BYOK Button */}
                        <BYOKButton open={showBYOKPrompt} onOpenChange={setShowBYOKPrompt} />

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
                    {isEditingPose ? (
                        <div className="flex-1 relative z-20 w-full h-full overflow-hidden">
                            <PoseEditor
                                onSave={(dataUrl: string) => {
                                    setPoseImage(dataUrl);
                                    setIsEditingPose(false);
                                }}
                                onCancel={() => setIsEditingPose(false)}
                            />
                        </div>
                    ) : (
                        <>
                            {/* Viewport Header */}
                            <div className="h-10 border-b border-border flex items-center px-4">
                                <span className="text-xs text-text-muted">Preview</span>
                            </div>

                            {/* Canvas Area */}
                            <div className="flex-1 overflow-auto flex items-center justify-center relative bg-[url('/grid-pattern.svg')] bg-center">
                                {/* Loading State */}
                                {isGenerating ? (
                                    <div className={`${quantity === 1
                                        ? 'flex items-center justify-center p-8 w-full'
                                        : 'grid grid-cols-2 gap-6 p-8 w-full max-w-3xl'
                                        } animate-in fade-in duration-500`}>
                                        {[...Array(quantity)].map((_, index) => (
                                            <div
                                                key={index}
                                                className={`aspect-square bg-surface/50 rounded-lg border border-border border-dashed flex flex-col items-center justify-center relative overflow-hidden ${quantity === 1 ? 'w-72 h-72' : 'min-w-[200px] w-full'
                                                    }`}
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
                                ) : generationError ? (
                                    <div className="text-center space-y-4 max-w-md p-8">
                                        <div className="w-16 h-16 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                                            <X className="w-6 h-6 text-red-400" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-red-400">Generation Failed</p>
                                            <p className="text-xs text-text-muted">{generationError}</p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setGenerationError(null)}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                ) : previewImages.length === 0 ? (
                                    <div className="text-center space-y-4 max-w-xs">
                                        <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
                                            <Command className="w-6 h-6 text-text-muted" />
                                        </div>
                                        <p className="text-sm text-text-muted">Configure settings and generate to see results</p>
                                    </div>
                                ) : (
                                    <div className={`p-8 mx-auto ${previewImages.length === 1
                                        ? 'flex items-center justify-center'
                                        : 'grid grid-cols-2 gap-6 max-w-3xl'
                                        }`}>
                                        {previewImages.map((img, index) => (
                                            <div
                                                key={index}
                                                onClick={() => setSelectedPreview(index)}
                                                className={`group relative aspect-square bg-surface rounded-lg border transition-colors cursor-pointer ${previewImages.length === 1 ? 'w-80 h-80' : 'min-w-[200px]'
                                                    } ${selectedPreview === index
                                                        ? 'border-primary ring-2 ring-primary/20'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="absolute inset-4 flex items-center justify-center">
                                                    {/* Loading placeholder */}
                                                    <div className="absolute inset-0 flex items-center justify-center bg-surface/50 image-loading-placeholder">
                                                        <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
                                                    </div>
                                                    <img
                                                        src={img}
                                                        alt={`Generated Sprite ${index + 1}`}
                                                        className="w-full h-full object-contain pixelated relative z-10"
                                                        onError={(e) => {
                                                            console.error(`Failed to load image ${index}:`, img);
                                                            const target = e.target as HTMLImageElement;
                                                            const parent = target.parentElement;
                                                            // Hide loading placeholder and show error
                                                            if (parent) {
                                                                const placeholder = parent.querySelector('.image-loading-placeholder');
                                                                if (placeholder) {
                                                                    placeholder.innerHTML = '<span class="text-xs text-red-400">Failed to load</span>';
                                                                }
                                                            }
                                                            target.style.display = 'none';
                                                        }}
                                                        onLoad={(e) => {
                                                            console.log(`Image ${index} loaded successfully`);
                                                            const target = e.target as HTMLImageElement;
                                                            const parent = target.parentElement;
                                                            // Hide loading placeholder
                                                            if (parent) {
                                                                const placeholder = parent.querySelector('.image-loading-placeholder');
                                                                if (placeholder) {
                                                                    (placeholder as HTMLElement).style.display = 'none';
                                                                }
                                                            }
                                                        }}
                                                    />
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
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-7 h-7"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Download the image
                                                            const link = document.createElement('a');
                                                            link.href = img;
                                                            link.download = `sprite_${index + 1}.png`;
                                                            link.target = '_blank';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        }}
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fixed Floating Action Button */}
                            {selectedPreview !== null && (createdProjectId || projectId) && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface border border-border rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-3 z-10">
                                    <span className="text-sm text-text">Variant {selectedPreview + 1} selected</span>
                                    <Button
                                        onClick={handleViewProject}
                                        size="sm"
                                        className="h-8 rounded-full px-4"
                                    >
                                        <FolderPlus className="w-4 h-4" />
                                        View Project
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
