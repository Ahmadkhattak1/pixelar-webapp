"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

interface ImportAssetModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId?: string; // Optional: if provided, import into this project
    onSuccess?: (result: string | any) => void; // string=projectId (legacy), object=asset
}

export function ImportAssetModal({ open, onOpenChange, projectId, onSuccess }: ImportAssetModalProps) {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState<"sprite" | "scene">("sprite");
    const [isUploading, setIsUploading] = useState(false);
    const [createProject, setCreateProject] = useState(!projectId); // Default to true unless projectId provided
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If projectId is provided, force createProject to false (we are adding to existing)
    // Actually simplicity: If projectId exists, we just upload asset and link it.
    // The createProject toggle is for "Create NEW Project from this asset" logic.
    const canCreateProject = !projectId;

    // Max file size: 5MB
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleFileSelect = useCallback((selectedFile: File) => {
        // Clear previous error
        setError(null);

        if (!selectedFile.type.startsWith("image/")) {
            setError("Please select an image file (PNG, JPG, GIF)");
            return;
        }

        if (selectedFile.size > MAX_FILE_SIZE) {
            setError(`Image is too large. Maximum size is 5MB (yours: ${(selectedFile.size / 1024 / 1024).toFixed(1)}MB)`);
            return;
        }

        setFile(selectedFile);
        // Generate preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);

        // Auto-generate name from filename
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setAssetName(nameWithoutExt);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFileSelect(droppedFile);
    }, [handleFileSelect]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFileSelect(selectedFile);
    };

    const handleSubmit = async () => {
        if (!file || !user) return;

        setIsUploading(true);
        setError(null);

        try {
            // Convert file to base64
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onload = (e) => resolve(e.target?.result as string);
            });
            reader.readAsDataURL(file);
            const base64Data = await base64Promise;

            // Upload asset via API
            const result = await api.assets.upload({
                name: assetName || file.name,
                type: assetType,
                image: base64Data,
                createProject: createProject && canCreateProject, // Only create if allowed
                projectId,
            });

            if (result.success) {
                // Reset form
                reset();
                onOpenChange(false);

                if (result.projectId && onSuccess) {
                    onSuccess(result.projectId);
                }
            } else {
                // Handle API error response
                setError(result.error || "Failed to upload asset. Please try again.");
            }
        } catch (err: any) {
            console.error("Upload failed:", err);
            // Extract error message from response
            const errorMessage = err?.message || err?.error || "Upload failed. Please check your connection and try again.";
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setAssetName("");
        setError(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        Import Asset
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Error Display */}
                    {error && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-medium">Upload Error</p>
                                <p className="text-xs mt-0.5 text-red-400/80">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-400/60 hover:text-red-400 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Drop Zone / Preview */}
                    {!preview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-surface/50 transition-all"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-surface-highlight flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6 text-text-muted" />
                                </div>
                                <div>
                                    <p className="font-medium">Drop image here</p>
                                    <p className="text-sm text-text-muted">or click to browse</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-48 object-contain rounded-lg bg-surface-highlight border border-border"
                                style={{ imageRendering: "pixelated" }}
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                                onClick={reset}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {/* Asset Name */}
                    <div className="space-y-2">
                        <Label className="text-xs text-text-muted">Asset Name</Label>
                        <Input
                            value={assetName}
                            onChange={(e) => setAssetName(e.target.value)}
                            placeholder="My Sprite"
                            disabled={!file}
                        />
                    </div>

                    {/* Asset Type */}
                    <div className="space-y-2">
                        <Label className="text-xs text-text-muted">Asset Type</Label>
                        <div className="flex gap-2">
                            <Button
                                variant={assetType === "sprite" ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setAssetType("sprite")}
                            >
                                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                                Sprite
                            </Button>
                            <Button
                                variant={assetType === "scene" ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => setAssetType("scene")}
                            >
                                <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
                                Scene
                            </Button>
                        </div>
                    </div>

                    {/* Create Project Toggle - Only show if not already in a project */}
                    {canCreateProject && (
                        <label className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border cursor-pointer hover:bg-surface transition-colors">
                            <span className="text-sm">Create project from this asset</span>
                            <button
                                type="button"
                                onClick={() => setCreateProject(!createProject)}
                                className={`w-10 h-5 rounded-full transition-colors relative ${createProject ? "bg-primary" : "bg-surface-highlight border border-border"
                                    }`}
                            >
                                <div
                                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${createProject ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </label>
                    )}

                    {/* Submit */}
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                {canCreateProject && createProject ? "Import & Create Project" : "Import Asset"}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
