
"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Upload,
  Zap,
  X,
  Check,
  Sparkles,
  Wand2,
  CheckCircle,
  Grid3x3,
  Palette,
  RotateCw,
  Film,
  ZoomIn,
  Maximize,
  Settings,
  Layers,
  Image as ImageIcon,
  Download,
  Share2,
  MousePointer2,
  Move,
  Undo2,
  Redo2,
  Command,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Viewpoint = "front" | "back" | "side" | "top_down" | "isometric";
type Style = "2d_flat" | "pixel_art";

export default function GenerateSpritePage() {
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [viewpoint, setViewpoint] = useState<Viewpoint>("front");
  const [style, setStyle] = useState<Style>("2d_flat");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(360);
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mainRef.current) return;

      const mainRect = mainRef.current.getBoundingClientRect();
      const newWidth = e.clientX - mainRect.left;
      const minWidth = 300;
      const maxWidth = 500;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddColor = () => {
    if (customColor && !colors.includes(customColor) && colors.length < 5) {
      setColors([...colors, customColor]);
      setCustomColor(""); // Clear input after adding
    }
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleGenerateSprite = () => {
    if (!prompt.trim()) {
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const mockImages = [
        `https://picsum.photos/seed/${Math.random()}/400/400`,
        `https://picsum.photos/seed/${Math.random()}/400/400`,
        `https://picsum.photos/seed/${Math.random()}/400/400`,
        `https://picsum.photos/seed/${Math.random()}/400/400`,
      ];
      setPreviewImages(mockImages);
      setIsGenerating(false);
    }, 2000);
  };

  const handleSelectPreview = (index: number) => {
    setSelectedPreview(index);
  };

  const handleCreateProject = () => {
    if (selectedPreview !== null) {
      window.location.href = "/projects";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text font-sans selection:bg-primary/30 overflow-hidden">
      {/* Header - Minimal Studio Bar */}
      <header className="h-14 border-b border-white/5 bg-surface/50 backdrop-blur-md flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="flex items-center justify-center w-8 h-8 hover:bg-white/5 rounded-md transition-colors text-text-muted hover:text-text"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-mono font-bold text-xs text-white">Px</span>
            </div>
            <span className="font-medium text-sm tracking-tight text-white/90">
              Untitled Sprite
            </span>
            <span className="text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              Draft
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/5">
            <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-mono text-text-muted">450</span>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md hover:bg-white/5 text-text-muted">
            <Settings className="w-4 h-4" />
          </Button>
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary p-[1px]">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="User"
              className="w-full h-full rounded-[5px] bg-black"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden" ref={mainRef}>
        {/* Left Panel - Tool Palette */}
        <div
          style={{ width: `${sidebarWidth}px` }}
          className="bg-surface border-r border-white/5 flex flex-col overflow-hidden transition-none relative z-10"
        >
          {/* Toolbar Header */}
          <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-surface-highlight/10">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted hover:text-primary">
                <MousePointer2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted hover:text-primary">
                <Move className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="h-3 w-[1px] bg-white/10 mx-1" />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted hover:text-primary">
                <Undo2 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted hover:text-primary">
                <Redo2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-4 space-y-8">

              {/* Section: Generation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                    Generation
                  </Label>
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-text-dim">
                      <span>Prompt</span>
                      <span className="font-mono text-[10px] opacity-70">{prompt.length}/500</span>
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your sprite..."
                      className="w-full h-32 p-3 text-xs bg-black/20 border border-white/10 rounded-lg resize-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-text-dim/50 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-text-dim">Reference</Label>
                    {referenceImage ? (
                      <div className="relative w-full h-24 rounded-lg border border-white/10 overflow-hidden group bg-black/40">
                        <img
                          src={referenceImage}
                          alt="Reference"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <button
                          onClick={() => setReferenceImage(null)}
                          className="absolute top-1 right-1 p-1 bg-black/80 hover:bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 w-full h-10 border border-dashed border-white/10 rounded-lg cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all group">
                        <Upload className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
                        <span className="text-xs text-text-muted group-hover:text-text transition-colors">Upload Image</span>
                        <input
                          type="file"
                          onChange={handleReferenceImageUpload}
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/5" />

              {/* Section: Properties */}
              <div className="space-y-5">
                <Label className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                  Properties
                </Label>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-text-dim">Style</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "2d_flat", label: "2D Flat", icon: Layers },
                        { value: "pixel_art", label: "Pixel Art", icon: Grid3x3 },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => setStyle(value as Style)}
                          className={`flex items-center justify-center gap-2 py-2 px-2 rounded-lg text-xs font-medium transition-all border ${style === value
                            ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                            : "bg-transparent border-white/5 text-text-muted hover:bg-white/5 hover:border-white/10 hover:text-text"
                            }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-text-dim">Viewpoint</Label>
                    <div className="relative">
                      <select
                        value={viewpoint}
                        onChange={(e) => setViewpoint(e.target.value as Viewpoint)}
                        className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-xs text-text focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer hover:bg-white/5"
                      >
                        <option value="front">Front View</option>
                        <option value="back">Back View</option>
                        <option value="side">Side View</option>
                        <option value="top_down">Top Down</option>
                        <option value="isometric">Isometric</option>
                      </select>
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-text-dim flex justify-between">
                    <span>Colors</span>
                    <span className="font-mono text-[10px] opacity-50">{colors.length}/5</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                      <div key={index} className="group relative">
                        <div
                          className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer hover:scale-105 transition-transform shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <button
                          onClick={() => handleRemoveColor(index)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-surface border border-white/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:border-red-500"
                        >
                          <X className="w-2.5 h-2.5 text-text hover:text-white" />
                        </button>
                      </div>
                    ))}
                    {colors.length < 5 && (
                      <div className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-lg border border-dashed border-white/20 hover:border-primary/50 transition-colors flex items-center justify-center cursor-pointer hover:bg-white/5 overflow-hidden">
                          <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer opacity-0"
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: customColor || 'transparent' }}>
                            {!customColor && <span className="text-xs text-text-muted">+</span>}
                          </div>
                        </div>
                        {customColor && (
                          <Button
                            onClick={handleAddColor}
                            size="sm"
                            variant="secondary"
                            className="h-8 px-3 text-[10px] font-bold"
                          >
                            ADD
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/5 bg-surface/50 backdrop-blur-sm">
            <Button
              onClick={handleGenerateSprite}
              disabled={!prompt.trim() || isGenerating}
              className="w-full h-10 text-xs font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" />
                  Generate
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className="w-px bg-white/5 hover:bg-primary/50 cursor-col-resize transition-colors active:bg-primary z-20 relative group"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-0.5 h-4 bg-text-muted/50 rounded-full" />
          </div>
        </div>

        {/* Right Panel - Viewport */}
        <div className="flex-1 bg-background relative flex flex-col overflow-hidden">
          {/* Viewport Header */}
          <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-surface/30">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Viewport</span>
              <div className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] font-mono text-text-dim">100%</div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted">
                <Grid3x3 className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 rounded hover:bg-white/5 text-text-muted">
                <Maximize className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-auto flex items-center justify-center relative bg-[#09090b]">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />

            {previewImages.length === 0 ? (
              <div className="text-center space-y-4 max-w-xs opacity-50">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto shadow-studio">
                  <Command className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-sm text-text-muted font-medium">Configure settings and generate to see results</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8 p-12 w-full max-w-4xl animate-in fade-in zoom-in duration-300">
                {previewImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectPreview(index)}
                    className={`group relative aspect-square bg-surface rounded-xl border transition-all duration-200 cursor-pointer ${selectedPreview === index
                      ? 'border-primary shadow-[0_0_0_1px_rgba(139,92,246,1)]'
                      : 'border-white/5 hover:border-white/20 hover:shadow-2xl'
                      }`}
                  >
                    {/* Technical Markers */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-lg m-2" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-lg m-2" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-lg m-2" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-lg m-2" />

                    <div className="absolute inset-4 flex items-center justify-center">
                      <img src={img} alt="Generated Sprite" className="w-full h-full object-contain pixelated" />
                    </div>

                    {/* Selection Indicator */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-all ${selectedPreview === index ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur rounded-lg p-1 border border-white/10">
                      <Button variant="ghost" size="icon" className="w-6 h-6 rounded hover:bg-white/10 text-white">
                        <ZoomIn className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-6 h-6 rounded hover:bg-white/10 text-white">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          {selectedPreview !== null && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface/90 backdrop-blur-md border border-white/10 rounded-full pl-4 pr-1.5 py-1.5 flex items-center gap-4 shadow-2xl animate-in slide-in-from-bottom-4">
              <span className="text-xs font-medium text-text">Variant {selectedPreview + 1} selected</span>
              <Button
                onClick={handleCreateProject}
                size="sm"
                className="h-7 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-xs px-4"
              >
                Create Project
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
