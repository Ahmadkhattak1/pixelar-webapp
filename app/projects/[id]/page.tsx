"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Plus, Download, Sparkles, Loader2, Upload } from "lucide-react";
import { ArrowLeft, Trash, PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { api, Project, Asset } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { ProfileModal } from "@/components/profile-modal";
import { ImportAssetModal } from "@/components/import/ImportAssetModal";

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;
    const { user } = useAuth();

    const [project, setProject] = useState<Project | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);

    // Fetch project and assets
    useEffect(() => {
        const fetchProjectData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await api.projects.get(projectId);
                if (result.success) {
                    setProject(result.project);
                    setAssets(result.assets || []);
                    // Select first asset by default
                    if (result.assets && result.assets.length > 0) {
                        setSelectedAssetId(result.assets[0].id);
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

    // Redirect to scene preview if it's a scene project
    useEffect(() => {
        if (project && project.type === "scene") {
            router.replace(`/scenes/preview?projectId=${projectId}`);
        }
    }, [project, projectId, router]);

    const selectedAsset = assets.find(a => a.id === selectedAssetId) || assets[0];

    const handleGenerate = () => {
        router.push(`/sprites?projectId=${projectId}`);
    };

    const handleNewProject = () => {
        router.push("/sprites");
    };

    const handleExport = () => {
        if (selectedAsset?.blob_url) {
            const link = document.createElement('a');
            link.href = selectedAsset.blob_url;
            link.download = `${selectedAsset.name || 'sprite'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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
                        New Project
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setIsImportOpen(true)}
                    >
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        Import
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={handleExport}
                        disabled={!selectedAsset}
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
                {/* Left Sidebar: Assets List */}
                <div className="w-64 border-r border-border bg-surface/30 flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Assets ({assets.length})</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {assets.length === 0 ? (
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
                        )}
                    </div>
                    {/* Add More Button */}
                    <div className="p-3 border-t border-border">
                        <Button size="sm" className="w-full text-xs" onClick={handleGenerate}>
                            <Sparkles className="w-3.5 h-3.5 mr-1" />
                            Generate More
                        </Button>
                    </div>
                </div>

                {/* Center: Preview */}
                <div className="flex-1 flex items-center justify-center bg-[url('/grid-pattern.svg')] bg-center p-8">
                    {selectedAsset ? (
                        <div className="max-w-2xl max-h-full bg-surface/50 rounded-xl border border-border p-8 flex items-center justify-center">
                            <img
                                src={selectedAsset.blob_url}
                                alt={selectedAsset.name || 'Asset'}
                                className="max-w-full max-h-[60vh] object-contain pixelated"
                            />
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

                {/* Right Sidebar: Details */}
                <div className="w-80 border-l border-border bg-surface/30 flex flex-col">
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

                        {/* Show GIF converter for animation assets */}
                        {selectedAsset?.asset_type === 'animation' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    // Open in GIF converter by passing the asset URL
                                    router.push(`/tools/gif-converter?asset=${encodeURIComponent(selectedAsset.blob_url!)}`);
                                }}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Open in GIF Converter
                            </Button>
                        )}

                        {/* Always show option to convert to GIF */}
                        {selectedAsset && selectedAsset.asset_type !== 'scene' && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full text-xs text-text-muted"
                                onClick={() => {
                                    router.push(`/tools/gif-converter?asset=${encodeURIComponent(selectedAsset.blob_url!)}`);
                                }}
                            >
                                Convert to GIF
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <ImportAssetModal
                open={isImportOpen}
                onOpenChange={setIsImportOpen}
                projectId={projectId}
                onSuccess={(newAsset) => {
                    // Check if newAsset is a string (legacy/error) or Asset object
                    if (typeof newAsset !== 'string') {
                        setAssets(prev => [newAsset as Asset, ...prev]);
                        setSelectedAssetId((newAsset as Asset).id);
                    }
                    setIsImportOpen(false);
                }}
            />
        </div>
    );
}
