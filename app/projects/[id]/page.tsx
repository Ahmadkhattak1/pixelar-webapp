"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Download, Sparkles, Loader2, Play, Pause } from "lucide-react";
import { ArrowLeft, Trash } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api, Project, Asset } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ProfileModal } from "@/components/profile-modal";
import { AnimationGeneratePanel } from "@/components/generate/AnimationGeneratorModal";

/** Inline spritesheet animation preview using canvas — auto-detects columns from actual image */
function SpritesheetPreview({ src, frameWidth, frameHeight, totalFrames, fps = 8 }: {
    src: string;
    frameWidth: number;
    frameHeight: number;
    totalFrames: number;
    fps?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [columns, setColumns] = useState(totalFrames); // fallback to horizontal
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(false);
        setCurrentFrame(0);
        // Fetch image as blob to bypass CORS restrictions for canvas drawing
        fetch(src)
            .then(res => res.blob())
            .then(blob => {
                const objectUrl = URL.createObjectURL(blob);
                const img = new window.Image();
                img.src = objectUrl;
                img.onload = () => {
                    imgRef.current = img;
                    const cols = Math.max(1, Math.floor(img.naturalWidth / frameWidth));
                    setColumns(cols);
                    setReady(true);
                };
            })
            .catch(err => {
                console.error('Failed to load spritesheet for preview:', err);
                // Fallback: load directly without CORS (canvas will be tainted but drawImage still works)
                const img = new window.Image();
                img.src = src;
                img.onload = () => {
                    imgRef.current = img;
                    const cols = Math.max(1, Math.floor(img.naturalWidth / frameWidth));
                    setColumns(cols);
                    setReady(true);
                };
            });
    }, [src, frameWidth]);

    useEffect(() => {
        if (!isPlaying || !ready) return;

        const interval = setInterval(() => {
            setCurrentFrame(prev => (prev + 1) % totalFrames);
        }, 1000 / fps);

        return () => clearInterval(interval);
    }, [isPlaying, totalFrames, fps, ready]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const img = imgRef.current;
        if (!canvas || !img || !ready) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sx = (currentFrame % columns) * frameWidth;
        const sy = Math.floor(currentFrame / columns) * frameHeight;

        ctx.clearRect(0, 0, frameWidth, frameHeight);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    }, [currentFrame, frameWidth, frameHeight, columns, ready]);

    // Display size: scale up small pixel art so it's clearly visible
    const displayScale = Math.max(4, Math.floor(256 / Math.max(frameWidth, frameHeight)));
    const displayW = frameWidth * displayScale;
    const displayH = frameHeight * displayScale;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-surface/50 rounded-xl border border-border p-10 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={frameWidth}
                    height={frameHeight}
                    className="pixelated"
                    style={{ width: displayW, height: displayH, imageRendering: 'pixelated' }}
                />
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-surface-highlight transition-colors"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <span className="text-xs text-text-muted tabular-nums">
                    Frame {currentFrame + 1}/{totalFrames} &middot; {fps} FPS
                </span>
            </div>
        </div>
    );
}

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    const { user } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [spritesheets, setSpritesheets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'assets' | 'animations'>('assets');
    const [showTilePreview, setShowTilePreview] = useState(false);
    const [selectedSpritesheetId, setSelectedSpritesheetId] = useState<string | null>(null);

    // Read ?tab= query param to allow deep-linking
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get('tab');
        if (tab === 'animations') {
            setSelectedTab('animations');
        }
    }, []);

    // Fetch project and assets
    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await api.projects.get(projectId);
                if (result.success) {
                    setProject(result.project);
                    // Filter out spritesheets from assets — they belong in the animations tab
                    const allAssets: Asset[] = result.assets || [];
                    const regularAssets = allAssets.filter((a: Asset) => !a.metadata?.is_spritesheet);
                    setAssets(regularAssets);
                    // Select first asset by default
                    if (regularAssets.length > 0) {
                        setSelectedAssetId(regularAssets[0].id);
                    }

                    // Fetch spritesheets for sprite projects
                    if (result.project?.type === 'sprite') {
                        try {
                            const spritesheetResult = await api.spritesheet.listByProject(projectId);
                            if (spritesheetResult.success) {
                                setSpritesheets(spritesheetResult.spritesheets || []);
                            }
                        } catch (err) {
                            console.error("Failed to fetch spritesheets:", err);
                        }
                    }
                } else {
                    setError("Failed to load project");
                }
            } catch (err: any) {
                console.error("Error fetching project:", err);
                setError(err.message || "Failed to load project");
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

    const isScene = project?.type === 'scene';

    const handleGenerate = () => {
        if (isScene) {
            router.push(`/scenes?projectId=${projectId}`);
        } else {
            router.push(`/sprites?projectId=${projectId}`);
        }
    };

    const handleNewProject = () => {
        router.push("/home");
    };

    const downloadBlob = async (url: string, filename: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error('Download failed:', err);
            // Fallback: open direct link to allow manual save
            window.open(url, '_blank');
        }
    };

    const handleExport = () => {
        if (selectedAsset?.blob_url) {
            downloadBlob(selectedAsset.blob_url, `${selectedAsset.name || 'asset'}.png`);
        }
    };

    const handleExportSpritesheet = () => {
        const ss = spritesheets.find(s => s.id === selectedSpritesheetId);
        if (ss?.blob_url) {
            const animName = ss.metadata?.animation_name || ss.name || 'spritesheet';
            const fw = ss.metadata?.frame_width || ss.metadata?.frameWidth || 0;
            const fh = ss.metadata?.frame_height || ss.metadata?.frameHeight || 0;
            const fc = ss.metadata?.frame_count || ss.metadata?.frameCount || 0;
            // Name format game devs expect: descriptive_WxH_Nframes.png
            const filename = `${animName.replace(/\s+/g, '_').toLowerCase()}_${fw}x${fh}_${fc}frames.png`;
            downloadBlob(ss.blob_url, filename);
        }
    };

    const handleDeleteAsset = async (assetId: string) => {
        if (!confirm("Delete this asset?")) return;
        try {
            await api.assets.delete(assetId);
            setAssets(prev => prev.filter(a => a.id !== assetId));
            if (selectedAssetId === assetId) {
                const remaining = assets.filter(a => a.id !== assetId);
                setSelectedAssetId(remaining[0]?.id || null);
            }
        } catch (err) {
            console.error("Failed to delete asset:", err);
        }
    };

    const handleAnimationSuccess = (spritesheet: Asset) => {
        setSpritesheets(prev => [spritesheet, ...prev]);
        setSelectedSpritesheetId(spritesheet.id);
    };

    const handleDeleteSpritesheet = async (spritesheetId: string) => {
        if (!confirm("Delete this animation?")) return;
        try {
            await api.spritesheet.delete(spritesheetId);
            setSpritesheets(prev => prev.filter(s => s.id !== spritesheetId));
            if (selectedSpritesheetId === spritesheetId) {
                setSelectedSpritesheetId(null);
            }
        } catch (err) {
            console.error("Failed to delete spritesheet:", err);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm text-text-muted">Loading project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-sm text-red-400">{error || "Project not found"}</p>
                    <Button variant="outline" onClick={() => router.push("/projects")}>
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    // Get selected spritesheet data for preview
    const selectedSpritesheet = spritesheets.find(s => s.id === selectedSpritesheetId);

    return (
        <div className="h-screen flex flex-col bg-background text-text">
            {/* Header */}
            <header className="h-14 bg-background/80 backdrop-blur-md border-b border-white/[0.05] px-6 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-4">
                    <Link
                        href="/projects"
                        className="flex items-center justify-center w-9 h-9 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-200 text-text-muted hover:text-text group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </Link>

                    <div className="h-6 w-[1px] bg-white/[0.08]" />

                    <div className="flex items-center gap-2">
                        <Link href="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Image
                                src="/logo.svg"
                                alt="Pixelar Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </Link>
                        <span className="font-semibold text-sm tracking-tight text-white truncate max-w-[200px]">
                            {project.title}
                        </span>
                        <span className="text-xs text-text-muted capitalize px-2 py-0.5 rounded bg-surface border border-border">
                            {project.type}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleNewProject}
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        New Project
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={selectedTab === 'animations' && selectedSpritesheetId ? handleExportSpritesheet : handleExport}
                        disabled={selectedTab === 'animations' ? !selectedSpritesheetId : !selectedAsset}
                    >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        Export
                    </Button>

                    {/* Profile */}
                    <ProfileModal>
                        <div className="flex items-center gap-2 px-1 py-1 pl-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-full border border-white/[0.08] cursor-pointer transition-all">
                            <span className="text-xs font-bold text-white hidden md:block">{user?.displayName || "User"}</span>
                            <img
                                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                alt="Profile"
                                className="w-7 h-7 rounded-full border border-surface-highlight"
                            />
                        </div>
                    </ProfileModal>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar: Assets/Animations List */}
                <div className="w-64 border-r border-border bg-surface/30 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setSelectedTab('assets')}
                            className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${selectedTab === 'assets'
                                    ? 'text-text border-b-2 border-primary'
                                    : 'text-text-muted hover:text-text'
                                }`}
                        >
                            Assets ({assets.length})
                        </button>
                        {!isScene && (
                            <button
                                onClick={() => setSelectedTab('animations')}
                                className={`flex-1 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${selectedTab === 'animations'
                                        ? 'text-text border-b-2 border-primary'
                                        : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                Animations ({spritesheets.length})
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {selectedTab === 'assets' ? (
                            assets.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-xs text-text-dim">No assets yet</p>
                                    <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={handleGenerate}>
                                        <Sparkles className="w-3 h-3 mr-1" />
                                        Generate
                                    </Button>
                                </div>
                            ) : (
                                assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => setSelectedAssetId(asset.id)}
                                        className={`group relative aspect-square bg-background rounded-lg border cursor-pointer transition-all overflow-hidden ${selectedAssetId === asset.id
                                            ? 'border-primary ring-1 ring-primary/20'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <img
                                            src={asset.blob_url}
                                            alt={asset.name || 'Asset'}
                                            className="w-full h-full object-contain p-2 pixelated"
                                        />
                                        {/* Hover Delete */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteAsset(asset.id);
                                            }}
                                            className="absolute top-1 right-1 w-6 h-6 rounded bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )
                        ) : (
                            spritesheets.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-xs text-text-dim">No animations yet</p>
                                    <p className="text-[10px] text-text-dim mt-1">Use the panel on the right to generate</p>
                                </div>
                            ) : (
                                spritesheets.map((spritesheet) => (
                                    <div
                                        key={spritesheet.id}
                                        onClick={() => setSelectedSpritesheetId(spritesheet.id)}
                                        className={`group relative bg-background rounded-lg border cursor-pointer transition-all overflow-hidden ${selectedSpritesheetId === spritesheet.id
                                            ? 'border-primary ring-1 ring-primary/20'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="aspect-square">
                                            <img
                                                src={spritesheet.blob_url}
                                                alt={spritesheet.metadata?.animation_name || spritesheet.name || 'Animation'}
                                                className="w-full h-full object-contain p-2 pixelated"
                                            />
                                        </div>
                                        <div className="px-2 pb-2">
                                            <p className="text-[10px] font-medium text-text truncate">
                                                {spritesheet.metadata?.animation_name || spritesheet.name || 'Animation'}
                                            </p>
                                        </div>
                                        {/* Hover Delete */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteSpritesheet(spritesheet.id);
                                            }}
                                            className="absolute top-1 right-1 w-6 h-6 rounded bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* Center: Preview */}
                <div className="flex-1 flex flex-col items-center justify-center bg-[url('/grid-pattern.svg')] bg-center p-8 overflow-auto">
                    {/* Animation Preview */}
                    {selectedTab === 'animations' && selectedSpritesheet ? (() => {
                        const ss = selectedSpritesheet;
                        const fw = ss.metadata?.frame_width || ss.metadata?.frameWidth || 48;
                        const fh = ss.metadata?.frame_height || ss.metadata?.frameHeight || 48;
                        const fc = ss.metadata?.frame_count || ss.metadata?.frameCount || 8;
                        return (
                            <div className="flex flex-col items-center gap-6">
                                <SpritesheetPreview
                                    src={ss.blob_url}
                                    frameWidth={fw}
                                    frameHeight={fh}
                                    totalFrames={fc}
                                    fps={8}
                                />
                                {/* Also show the full spritesheet below */}
                                <div className="bg-surface/50 rounded-xl border border-border p-4">
                                    <p className="text-[10px] text-text-dim mb-2 text-center">Full Spritesheet</p>
                                    <img
                                        src={ss.blob_url}
                                        alt="Spritesheet"
                                        className="max-w-full max-h-48 object-contain pixelated"
                                    />
                                </div>
                            </div>
                        );
                    })() : selectedTab === 'animations' && !selectedSpritesheet ? (
                        /* When animations tab is active but no spritesheet selected, show the source asset as context */
                        selectedAsset ? (
                            <div className="flex flex-col items-center gap-4">
                                <div className="max-w-2xl max-h-full bg-surface/50 rounded-xl border border-border p-8 flex items-center justify-center">
                                    <img
                                        src={selectedAsset.blob_url}
                                        alt={selectedAsset.name || 'Asset'}
                                        className="max-w-full max-h-[60vh] object-contain pixelated"
                                    />
                                </div>
                                <p className="text-xs text-text-muted">Select an animation type in the panel to generate a spritesheet</p>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
                                    <Sparkles className="w-6 h-6 text-text-muted" />
                                </div>
                                <p className="text-sm text-text-muted">Add an asset first to generate animations</p>
                                <Button onClick={handleGenerate}>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Generate Asset
                                </Button>
                            </div>
                        )
                    ) : selectedAsset ? (
                        <div className="flex flex-col items-center gap-4">
                            {/* Tile Preview Toggle for scenes */}
                            {isScene && (
                                <div className="flex items-center gap-3 mb-2">
                                    <button
                                        onClick={() => setShowTilePreview(false)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!showTilePreview ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted hover:text-text'}`}
                                    >
                                        Single
                                    </button>
                                    <button
                                        onClick={() => setShowTilePreview(true)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${showTilePreview ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted hover:text-text'}`}
                                    >
                                        Tile Preview (3x3)
                                    </button>
                                </div>
                            )}

                            {showTilePreview && isScene ? (
                                <div className="bg-surface/50 rounded-xl border border-border p-4">
                                    <div className="grid grid-cols-3 gap-0 max-w-[600px]">
                                        {[...Array(9)].map((_, i) => (
                                            <img
                                                key={i}
                                                src={selectedAsset.blob_url}
                                                alt={`Tile ${i + 1}`}
                                                className="w-full h-auto object-contain pixelated"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-text-dim text-center mt-3">
                                        Seamless tile preview — this is how the asset tiles in a game engine
                                    </p>
                                </div>
                            ) : (
                                <div className="max-w-2xl max-h-full bg-surface/50 rounded-xl border border-border p-8 flex items-center justify-center">
                                    <img
                                        src={selectedAsset.blob_url}
                                        alt={selectedAsset.name || 'Asset'}
                                        className="max-w-full max-h-[60vh] object-contain pixelated"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto">
                                <Sparkles className="w-6 h-6 text-text-muted" />
                            </div>
                            <p className="text-sm text-text-muted">No assets in this project yet</p>
                            <Button onClick={handleGenerate}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Assets
                            </Button>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: Context-dependent */}
                <div className="w-80 border-l border-border bg-surface/30 flex flex-col">
                    {/* Animations tab: no spritesheet selected → show generation panel */}
                    {selectedTab === 'animations' && !selectedSpritesheetId && !isScene ? (
                        selectedAsset ? (
                            <AnimationGeneratePanel
                                assetId={selectedAsset.id}
                                assetUrl={selectedAsset.blob_url}
                                projectId={projectId}
                                onSuccess={handleAnimationSuccess}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                <Sparkles className="w-8 h-8 text-text-muted mb-3" />
                                <p className="text-xs text-text-muted">Generate or add an asset first</p>
                                <Button size="sm" className="mt-3" onClick={handleGenerate}>
                                    Generate Asset
                                </Button>
                            </div>
                        )
                    ) : selectedTab === 'animations' && selectedSpritesheet ? (
                        /* Animations tab: spritesheet selected → show details */
                        <>
                            <div className="p-4 border-b border-border">
                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                                    {selectedSpritesheet.metadata?.animation_name || 'Animation Details'}
                                </h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Spritesheet thumbnail */}
                                <div className="bg-background/50 rounded-lg border border-border p-3 flex items-center justify-center">
                                    <img
                                        src={selectedSpritesheet.blob_url}
                                        alt="Spritesheet"
                                        className="max-w-full max-h-40 object-contain pixelated"
                                    />
                                </div>

                                {/* Metadata */}
                                <div className="space-y-3">
                                    {selectedSpritesheet.metadata?.animation_name && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">Type</span>
                                            <span className="text-text">{selectedSpritesheet.metadata.animation_name}</span>
                                        </div>
                                    )}
                                    {(selectedSpritesheet.metadata?.frame_width || selectedSpritesheet.metadata?.frameWidth) && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">Frame Size</span>
                                            <span className="text-text">
                                                {selectedSpritesheet.metadata.frame_width || selectedSpritesheet.metadata.frameWidth}&times;{selectedSpritesheet.metadata.frame_height || selectedSpritesheet.metadata.frameHeight}px
                                            </span>
                                        </div>
                                    )}
                                    {(selectedSpritesheet.metadata?.frame_count || selectedSpritesheet.metadata?.frameCount) && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-text-muted">Frames</span>
                                            <span className="text-text">{selectedSpritesheet.metadata.frame_count || selectedSpritesheet.metadata.frameCount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-xs">
                                        <span className="text-text-muted">Created</span>
                                        <span className="text-text">
                                            {selectedSpritesheet.created_at
                                                ? new Date(selectedSpritesheet.created_at).toLocaleDateString()
                                                : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-border space-y-2">
                                <Button size="sm" className="w-full" onClick={handleExportSpritesheet}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Spritesheet
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="w-full text-xs text-text-muted"
                                    onClick={() => {
                                        const fw = selectedSpritesheet.metadata?.frame_width || selectedSpritesheet.metadata?.frameWidth || '';
                                        const fh = selectedSpritesheet.metadata?.frame_height || selectedSpritesheet.metadata?.frameHeight || '';
                                        const fc = selectedSpritesheet.metadata?.frame_count || selectedSpritesheet.metadata?.frameCount || '';
                                        const params = new URLSearchParams({
                                            asset: selectedSpritesheet.blob_url,
                                            ...(fw && { fw: String(fw) }),
                                            ...(fh && { fh: String(fh) }),
                                            ...(fc && { fc: String(fc) }),
                                        });
                                        router.push(`/tools/gif-converter?${params.toString()}`);
                                    }}
                                >
                                    Convert to GIF
                                </Button>
                            </div>
                        </>
                    ) : (
                        /* Assets tab → show asset details */
                        <>
                            <div className="p-4 border-b border-border">
                                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Details</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {selectedAsset && (
                                    <>
                                        {/* Metadata */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-text-muted">Type</span>
                                                <span className="text-text capitalize">{selectedAsset.asset_type}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-text-muted">Dimensions</span>
                                                <span className="text-text">{selectedAsset.metadata?.dimensions || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-text-muted">Style</span>
                                                <span className="text-text capitalize">{selectedAsset.metadata?.style || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-text-muted">Created</span>
                                                <span className="text-text">
                                                    {selectedAsset.created_at
                                                        ? new Date(selectedAsset.created_at).toLocaleDateString()
                                                        : 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Prompt */}
                                        {selectedAsset.metadata?.prompt && (
                                            <div className="space-y-2">
                                                <h4 className="text-xs font-semibold text-text-muted uppercase">Prompt</h4>
                                                <p className="text-xs text-text-dim leading-relaxed bg-background/50 p-3 rounded-lg border border-border">
                                                    {selectedAsset.metadata.prompt}
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="p-4 border-t border-border space-y-2">
                                <Button size="sm" className="w-full" onClick={handleExport} disabled={!selectedAsset}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PNG
                                </Button>

                                {/* Sprite projects: Switch to animations tab */}
                                {!isScene && selectedAsset && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            setSelectedTab('animations');
                                            setSelectedSpritesheetId(null);
                                        }}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Spritesheet
                                    </Button>
                                )}

                                {/* Scene projects: Tile preview hint */}
                                {isScene && selectedAsset && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full text-xs"
                                        onClick={() => setShowTilePreview(!showTilePreview)}
                                    >
                                        {showTilePreview ? 'Hide' : 'Show'} Tile Preview
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
