"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  Upload,
  Zap,
  X,
  Check,
} from "lucide-react";
import {
  MdAutoAwesome,
  MdMagic,
  MdCheckCircle,
} from "react-icons/md";
import {
  BsStars,
  BsGear,
} from "react-icons/bs";
import {
  TbPaletteOff,
  TbRotate,
  TbMovie,
  TbZoom,
  TbDimensions,
  TbGrid3x3,
} from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";

type Pose = "front" | "back" | "side";
type CameraAngle = "front" | "top_down" | "isometric";
type SpriteSize = "64" | "128" | "256";
type Style = "2d_flat" | "pixel_art";

export default function GenerateSpritePage() {
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [pose, setPose] = useState<Pose>("front");
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>("front");
  const [spriteSize, setSpriteSize] = useState<SpriteSize>("128");
  const [style, setStyle] = useState<Style>("2d_flat");
  const [model, setModel] = useState("v2.0");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<number | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [isDragging, setIsDragging] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mainRef.current) return;

      const mainRect = mainRef.current.getBoundingClientRect();
      const newWidth = e.clientX - mainRect.left;
      const minWidth = 300;
      const maxWidth = mainRect.width - 400;

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

  const handleAddColor = (color: string) => {
    if (!colors.includes(color) && colors.length < 5) {
      setColors([...colors, color]);
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-surface/80 backdrop-blur-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects" className="flex items-center justify-center w-8 h-8 hover:bg-muted rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <Image src="/logo.svg" alt="Pixelar" width={120} height={40} priority />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-light text-primary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>450 credits</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium">Alex Design</div>
                <div className="text-xs text-text-muted">Pro Plan</div>
              </div>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-9 h-9 rounded-full border border-border" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden" ref={mainRef}>
        {/* Left Panel - Controls */}
        <div style={{ width: `${sidebarWidth}px` }} className="border-r border-border/40 bg-surface flex flex-col overflow-hidden transition-none">
          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title */}
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-1">
                <BsStars className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                Create Sprite
              </h2>
              <p className="text-xs text-text-muted/70">Describe and configure your sprite</p>
            </div>

            {/* Prompt */}
            <div className="space-y-3 bg-primary/5 p-4 rounded-lg border border-primary/10">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <MdAutoAwesome className="w-4 h-4 text-primary" />
                Describe your sprite
              </Label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A brave knight in golden armor with a red cape..."
                className="w-full h-24 p-3 text-sm bg-muted/50 border border-border/50 rounded-lg resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Reference Image */}
            <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/40">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Upload className="w-4 h-4 text-primary" />
                Reference Image
              </Label>
              {referenceImage ? (
                <div className="relative w-full h-24 rounded-lg border border-border/50 overflow-hidden group">
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setReferenceImage(null)}
                    className="absolute top-1 right-1 p-1 bg-black/40 hover:bg-black/60 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all block bg-muted/10">
                  <Upload className="w-5 h-5 mx-auto mb-1 text-text-muted/70" />
                  <p className="text-xs text-text-muted">Upload reference (optional)</p>
                  <input
                    type="file"
                    onChange={handleReferenceImageUpload}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border/40" />

            {/* Settings Section */}
            <div className="space-y-4">
              <div className="text-xs font-semibold text-text-muted uppercase tracking-wide px-1">Configuration</div>
              {/* Pose */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbRotate className="w-3.5 h-3.5" />
                  Pose
                </Label>
                <div className="flex gap-1.5">
                  {(
                    [
                      { value: "front" as const, label: "Front" },
                      { value: "back" as const, label: "Back" },
                      { value: "side" as const, label: "Side" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setPose(value)}
                      className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-all ${
                        pose === value
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted/50 border border-border/50 text-text hover:bg-muted/70"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbPaletteOff className="w-3.5 h-3.5" />
                  Style
                </Label>
                <div className="flex gap-1.5">
                  {(
                    [
                      { value: "2d_flat", label: "2D" },
                      { value: "pixel_art", label: "Pixel" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setStyle(value as Style)}
                      className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-all ${
                        style === value
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted/50 border border-border/50 text-text hover:bg-muted/70"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbMovie className="w-3.5 h-3.5" />
                  Camera
                </Label>
                <select
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value as CameraAngle)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="front">Front</option>
                  <option value="top_down">Top Down</option>
                  <option value="isometric">Isometric</option>
                </select>
              </div>

              {/* Size */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbDimensions className="w-3.5 h-3.5" />
                  Size
                </Label>
                <div className="flex gap-1.5">
                  {(
                    [
                      { value: "64" as const, label: "64x64" },
                      { value: "128" as const, label: "128x128" },
                      { value: "256" as const, label: "256x256" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setSpriteSize(value)}
                      className={`flex-1 py-2 px-2 rounded text-xs font-medium transition-all ${
                        spriteSize === value
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted/50 border border-border/50 text-text hover:bg-muted/70"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors Reference */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbZoom className="w-3.5 h-3.5" />
                  Color References
                </Label>
                <p className="text-xs text-text-muted/70 mb-2">Add colors as reference palette</p>
                <div className="space-y-2">
                  <div className="flex gap-1.5 items-center">
                    {colors.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="w-8 h-8 rounded border border-border/50 cursor-pointer hover:shadow-md transition-all"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                        <button
                          onClick={() => handleRemoveColor(index)}
                          className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {colors.length < 5 && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customColor || "#6366F1"}
                        onChange={(e) => setCustomColor(e.target.value)}
                        className="w-8 h-8 border border-border/50 rounded cursor-pointer"
                      />
                      <Button
                        onClick={() => {
                          if (customColor && customColor.match(/^#[0-9A-F]{6}$/i)) {
                            handleAddColor(customColor);
                            setCustomColor("");
                          }
                        }}
                        disabled={!customColor.match(/^#[0-9A-F]{6}$/i)}
                        size="sm"
                        className="flex-1 h-8 text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Model */}
              <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                <Label className="text-xs font-semibold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
                  <TbGrid3x3 className="w-3.5 h-3.5" />
                  Model
                </Label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border/50 rounded text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="v2.0">v2.0 (Recommended)</option>
                  <option value="v1.5">v1.5</option>
                  <option value="experimental">v3.0 Exp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button - Sticky Bottom */}
          <div className="border-t border-border/40 bg-muted/30 p-6 space-y-2">
            <Button
              onClick={handleGenerateSprite}
              disabled={!prompt.trim() || isGenerating}
              className="w-full h-10 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg flex items-center justify-center gap-2"
            >
              <MdMagic className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate Sprite"}
            </Button>
            <p className="text-xs text-text-muted/60 text-center">Ready to create? Click generate</p>
          </div>
        </div>

        {/* Resize Divider */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className="w-1 bg-border/40 hover:bg-primary/50 cursor-col-resize transition-colors active:bg-primary select-none"
        />

        {/* Right Panel - Canvas/Preview */}
        <div className="flex-1 bg-gradient-to-br from-muted/10 via-background to-muted/10 flex flex-col items-center justify-center overflow-auto p-8">
          {previewImages.length === 0 ? (
            <div className="text-center space-y-6 max-w-sm">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto animate-pulse">
                <BsStars className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text mb-2">Ready to create</h3>
                <p className="text-sm text-text-muted/70">Describe your sprite, configure settings, and generate amazing sprites</p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-primary font-bold mb-1">Step 1</div>
                  <p className="text-xs text-text-muted/70">Describe</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-primary font-bold mb-1">Step 2</div>
                  <p className="text-xs text-text-muted/70">Configure</p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-primary font-bold mb-1">Step 3</div>
                  <p className="text-xs text-text-muted/70">Generate</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-text mb-4">Select your favorite variant</h3>
                <div className="grid grid-cols-2 gap-4">
                  {previewImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPreview(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border-2 hover:shadow-xl group ${
                        selectedPreview === index
                          ? "border-primary ring-2 ring-primary/30 shadow-lg scale-105"
                          : "border-border/40 hover:border-primary/50"
                      }`}
                    >
                      <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        selectedPreview === index ? "bg-primary text-white" : "bg-black/20 text-white/0 group-hover:text-white/100"
                      }`}>
                        <Check className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedPreview !== null && (
                <Button onClick={handleCreateProject} className="w-full h-10 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg flex items-center justify-center gap-2">
                  <MdCheckCircle className="w-4 h-4" />
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
