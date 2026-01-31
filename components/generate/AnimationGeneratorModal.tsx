"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";

interface AnimationPreset {
    id: string;
    name: string;
    description: string;
    style: string;
    width: number;
    height: number;
    frameCount: number;
    recommended: boolean;
}

interface AnimationGeneratePanelProps {
    assetId: string;
    assetUrl: string;
    projectId: string;
    onSuccess: (spritesheet: any) => void;
}

export function AnimationGeneratePanel({
    assetId,
    assetUrl,
    projectId,
    onSuccess
}: AnimationGeneratePanelProps) {
    const [presets, setPresets] = useState<AnimationPreset[]>([]);
    const [selectedPreset, setSelectedPreset] = useState<string>("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingPresets, setLoadingPresets] = useState(true);

    useEffect(() => {
        const fetchPresets = async () => {
            try {
                const result = await api.spritesheet.getPresets();
                if (result.success) {
                    setPresets(result.presets);
                    const recommended = result.presets.find((p: AnimationPreset) => p.recommended);
                    if (recommended) {
                        setSelectedPreset(recommended.id);
                    }
                }
            } catch (err: any) {
                console.error("Failed to fetch presets:", err);
            } finally {
                setLoadingPresets(false);
            }
        };
        fetchPresets();
    }, []);

    const handleGenerate = async () => {
        if (!selectedPreset) {
            setError("Please select an animation type");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            // Read BYOK key from localStorage
            const apiKey = localStorage.getItem("replicate_api_key");

            const result = await api.spritesheet.generate({
                assetId,
                projectId,
                animationPresetId: selectedPreset,
                customPrompt: customPrompt || undefined,
                apiKey: apiKey || undefined,
            });

            if (result.success) {
                onSuccess(result.spritesheet);
            } else {
                setError(result.error || "Failed to generate spritesheet");
            }
        } catch (err: any) {
            console.error("Generation error:", err);
            setError(err.message || "Failed to generate spritesheet");
        } finally {
            setIsGenerating(false);
        }
    };

    const selectedPresetData = presets.find(p => p.id === selectedPreset);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-border">
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Generate Animation</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Source Asset */}
                <div className="bg-background/50 rounded-lg border border-border p-3 flex items-center gap-3">
                    <img
                        src={assetUrl}
                        alt="Source"
                        className="w-12 h-12 object-contain pixelated rounded bg-surface"
                    />
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-text">Source Asset</p>
                        <p className="text-[10px] text-text-dim">Used as reference for animation</p>
                    </div>
                </div>

                {/* Preset Selection */}
                <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Animation Type</p>
                    {loadingPresets ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-4 h-4 animate-spin text-text-muted" />
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {presets.map((preset) => (
                                <button
                                    key={preset.id}
                                    onClick={() => setSelectedPreset(preset.id)}
                                    disabled={isGenerating}
                                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                                        selectedPreset === preset.id
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/30 bg-surface-highlight/50'
                                    } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-text">{preset.name}</span>
                                        {preset.recommended && (
                                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-semibold">
                                                REC
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-text-dim mt-1 leading-relaxed">{preset.description}</p>
                                    <div className="flex items-center gap-2 mt-1.5 text-[10px] text-text-muted">
                                        <span>{preset.width}&times;{preset.height}px</span>
                                        <span>&middot;</span>
                                        <span>{preset.frameCount} frames</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Custom Prompt */}
                <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                        Prompt <span className="text-text-dim font-normal normal-case">(optional)</span>
                    </p>
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g. knight with red cape, attack swing..."
                        disabled={isGenerating}
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-xs text-text placeholder:text-text-dim focus:outline-none focus:ring-1 focus:ring-primary resize-none disabled:opacity-50"
                        rows={2}
                    />
                    <p className="text-[9px] text-text-dim leading-relaxed">
                        Guides the animation model. Describe the character or action for better results.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[11px]">
                        {error}
                    </div>
                )}
            </div>

            {/* Generate Button */}
            <div className="p-4 border-t border-border">
                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !selectedPreset || !assetId}
                    className="w-full"
                    size="sm"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Animation
                        </>
                    )}
                </Button>
                {selectedPresetData && !isGenerating && (
                    <p className="text-[10px] text-text-dim text-center mt-2">
                        {selectedPresetData.width}&times;{selectedPresetData.height}px &middot; {selectedPresetData.frameCount} frames
                    </p>
                )}
            </div>
        </div>
    );
}
