"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
    CaretLeft,
    FolderPlus,
    Trash,
    Image as ImageIcon,
    Lightning,
    Check,
    MagnifyingGlass,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ProfileModal } from "@/components/profile-modal";
import { useAuth } from "@/hooks/useAuth";
import { api, Asset } from "@/services/api";

export default function LibraryPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [isCreatingProject, setIsCreatingProject] = useState(false);

    // Fetch unassigned assets on mount or when user becomes available
    useEffect(() => {
        const fetchAssets = async () => {
            if (authLoading) return; // Wait for auth to initialize
            if (!user) return; // Wait for user

            setIsLoading(true);
            try {
                const result = await api.assets.list({ unassigned: true });
                if (result.success) {
                    setAssets(result.assets);
                }
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchAssets();
        } else if (!authLoading && !user) {
            // Not logged in? maybe redirect or just show empty state
            setIsLoading(false);
        }
    }, [user, authLoading]);

    const handleCreateProject = async (asset: Asset) => {
        setIsCreatingProject(true);
        try {
            const projectRes = await api.projects.create({
                title: "Untitled",
                type: asset.asset_type === 'scene' ? 'scene' : 'sprite',
                description: asset.metadata?.prompt || '',
                settings: {
                    style: asset.metadata?.style,
                    dimension: asset.metadata?.dimensions,
                }
            });

            if (projectRes.success && projectRes.project) {
                // Link asset to project
                await api.assets.update(asset.id, {
                    project_id: projectRes.project.id
                });

                // Navigate to project
                router.push(`/projects/${projectRes.project.id}`);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsCreatingProject(false);
        }
    };

    const handleDeleteAsset = async (asset: Asset) => {
        if (!confirm("Are you sure you want to delete this asset?")) return;
        try {
            await api.assets.delete(asset.id);
            setAssets(prev => prev.filter(a => a.id !== asset.id));
            if (selectedAsset?.id === asset.id) {
                setSelectedAsset(null);
            }
        } catch (error) {
            console.error("Error deleting asset:", error);
        }
    };

    return (
        <div className="h-screen flex bg-background text-text font-sans selection:bg-primary/30 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-14 bg-background/80 backdrop-blur-md border-b border-white/[0.05] px-6 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/home"
                            className="flex items-center justify-center w-9 h-9 border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/[0.15] rounded-xl transition-all duration-200 text-text-muted hover:text-text group"
                        >
                            <CaretLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
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
                            <span className="font-semibold text-sm tracking-tight text-white">Asset Library</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Credits Badge */}
                        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-colors cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center shadow-sm">
                                <Lightning className="w-3 h-3 text-amber-400" weight="fill" />
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-sm font-bold text-white tracking-tight">Library</span>
                            </div>
                        </div>

                        <div className="h-6 w-[1px] bg-white/[0.08] hidden md:block" />

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

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="max-w-6xl mx-auto">
                        {/* Title */}
                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-white">Unassigned Assets</h1>
                            <p className="text-sm text-text-muted mt-1">
                                These are your generated sprites and scenes that haven't been added to a project yet.
                            </p>
                        </div>

                        {/* Loading */}
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : assets.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <div className="w-16 h-16 rounded-xl bg-surface border border-border flex items-center justify-center mb-4">
                                    <MagnifyingGlass className="w-6 h-6 text-text-muted" />
                                </div>
                                <p className="text-text-muted">No unassigned assets found.</p>
                                <p className="text-sm text-text-dim mt-1">Generate some sprites or scenes to see them here!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {assets.map((asset) => (
                                    <div
                                        key={asset.id}
                                        onClick={() => setSelectedAsset(asset)}
                                        className={`group relative aspect-square bg-surface rounded-xl border transition-all cursor-pointer overflow-hidden ${selectedAsset?.id === asset.id
                                            ? 'border-primary ring-2 ring-primary/20'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        {/* Image */}
                                        <img
                                            src={asset.blob_url}
                                            alt={asset.name || 'Asset'}
                                            className="w-full h-full object-contain p-4 pixelated"
                                        />

                                        {/* Selection Indicator */}
                                        <div className={`absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-opacity ${selectedAsset?.id === asset.id ? 'opacity-100' : 'opacity-0'
                                            }`}>
                                            <Check className="w-3 h-3 text-white" weight="bold" />
                                        </div>

                                        {/* Type Badge */}
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-surface/90 border border-border text-[10px] font-semibold text-text-muted capitalize">
                                            {asset.asset_type}
                                        </div>

                                        {/* Hover Actions */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                className="h-7 text-xs rounded-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCreateProject(asset);
                                                }}
                                                disabled={isCreatingProject}
                                            >
                                                <FolderPlus className="w-3.5 h-3.5 mr-1" />
                                                Create Project
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteAsset(asset);
                                                }}
                                            >
                                                <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Asset Panel */}
                {selectedAsset && (
                    <div className="border-t border-border bg-surface p-4">
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src={selectedAsset.blob_url}
                                    alt={selectedAsset.name || 'Asset'}
                                    className="w-12 h-12 rounded-lg object-contain bg-background border border-border pixelated"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-white capitalize">{selectedAsset.asset_type}</p>
                                    <p className="text-xs text-text-muted truncate max-w-xs">
                                        {selectedAsset.metadata?.prompt || 'No description'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleDeleteAsset(selectedAsset)}
                                >
                                    <Trash className="w-4 h-4 mr-1" />
                                    Delete
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-8"
                                    onClick={() => handleCreateProject(selectedAsset)}
                                    disabled={isCreatingProject}
                                >
                                    {isCreatingProject ? (
                                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                                    ) : (
                                        <FolderPlus className="w-4 h-4 mr-1" />
                                    )}
                                    Create Project
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
