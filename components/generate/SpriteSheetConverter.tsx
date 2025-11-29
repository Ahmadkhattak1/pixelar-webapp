import { useState, useEffect, useRef } from "react";
import { Play, Pause, Save, Settings2, Grid3X3, Clock, Move, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import GIF from "gif.js";

interface SpriteSheetConverterProps {
    spriteSheetUrl: string;
    onSave: (gifUrl: string) => void;
}

export function SpriteSheetConverter({ spriteSheetUrl, onSave }: SpriteSheetConverterProps) {
    // Settings
    const [rows, setRows] = useState(1);
    const [cols, setCols] = useState(1);
    const [delay, setDelay] = useState(100);
    const [offsetTop, setOffsetTop] = useState(0);
    const [offsetBottom, setOffsetBottom] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetRight, setOffsetRight] = useState(0);

    // Playback State
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isExporting, setIsExporting] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationRef = useRef<number>();

    // Load Image & Auto Detect
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = spriteSheetUrl;
        img.onload = () => {
            imageRef.current = img;
            autoDetectGrid(img);
        };
    }, [spriteSheetUrl]);

    // Auto Detect Grid Logic
    const autoDetectGrid = (img: HTMLImageElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Helper to check if a pixel is empty (alpha < 10)
        const isEmpty = (x: number, y: number) => {
            const index = (y * canvas.width + x) * 4;
            return data[index + 3] < 10;
        };

        // Scan for content bounds
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
        let hasContent = false;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                if (!isEmpty(x, y)) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                    hasContent = true;
                }
            }
        }

        if (!hasContent) return;

        // Detect Rows (gaps in Y)
        let detectedRows = 0;
        let inRow = false;
        for (let y = minY; y <= maxY; y++) {
            let rowHasContent = false;
            for (let x = minX; x <= maxX; x++) {
                if (!isEmpty(x, y)) {
                    rowHasContent = true;
                    break;
                }
            }
            if (rowHasContent && !inRow) {
                detectedRows++;
                inRow = true;
            } else if (!rowHasContent && inRow) {
                inRow = false;
            }
        }

        // Detect Cols (gaps in X) - Simplified: Check first row
        let detectedCols = 0;
        let inCol = false;
        // Sample the middle of the content height to avoid noise
        const sampleY = Math.floor((minY + maxY) / 2);

        // Better approach: Scan X across the entire height to find vertical gaps
        for (let x = minX; x <= maxX; x++) {
            let colHasContent = false;
            for (let y = minY; y <= maxY; y++) {
                if (!isEmpty(x, y)) {
                    colHasContent = true;
                    break;
                }
            }

            if (colHasContent && !inCol) {
                detectedCols++;
                inCol = true;
            } else if (!colHasContent && inCol) {
                inCol = false;
            }
        }

        // Fallbacks
        setRows(Math.max(1, detectedRows));
        setCols(Math.max(1, detectedCols));

        // Set offsets based on content bounds
        // setOffsetTop(minY);
        // setOffsetBottom(canvas.height - maxY - 1);
        // setOffsetLeft(minX);
        // setOffsetRight(canvas.width - maxX - 1);

        // For now, keep offsets 0 as sprites are often packed tightly or user might want to adjust manually
        // But setting rows/cols is the biggest help.
    };

    // Draw Grid Overlay
    const drawGrid = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw Image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Calculate Frame Size
        const frameWidth = (img.width - offsetLeft - offsetRight) / cols;
        const frameHeight = (img.height - offsetTop - offsetBottom) / rows;

        // Draw Grid - Subtle but visible
        // 1. Dark outline for contrast
        ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            const y = offsetTop + r * frameHeight;
            ctx.moveTo(offsetLeft, y);
            ctx.lineTo(img.width - offsetRight, y);
        }
        for (let c = 0; c <= cols; c++) {
            const x = offsetLeft + c * frameWidth;
            ctx.moveTo(x, offsetTop);
            ctx.lineTo(x, img.height - offsetBottom);
        }
        ctx.stroke();

        // 2. Light inner line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let r = 0; r <= rows; r++) {
            const y = offsetTop + r * frameHeight;
            ctx.moveTo(offsetLeft, y);
            ctx.lineTo(img.width - offsetRight, y);
        }
        for (let c = 0; c <= cols; c++) {
            const x = offsetLeft + c * frameWidth;
            ctx.moveTo(x, offsetTop);
            ctx.lineTo(x, img.height - offsetBottom);
        }
        ctx.stroke();

        // Draw Mask for Offsets (semi-transparent overlay on ignored areas)
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        // Top
        if (offsetTop > 0) ctx.fillRect(0, 0, canvas.width, offsetTop);
        // Bottom
        if (offsetBottom > 0) ctx.fillRect(0, canvas.height - offsetBottom, canvas.width, offsetBottom);
        // Left
        if (offsetLeft > 0) ctx.fillRect(0, offsetTop, offsetLeft, canvas.height - offsetTop - offsetBottom);
        // Right
        if (offsetRight > 0) ctx.fillRect(canvas.width - offsetRight, offsetTop, offsetRight, canvas.height - offsetTop - offsetBottom);
    };

    // Update Grid when settings change
    useEffect(() => {
        drawGrid();
    }, [rows, cols, offsetTop, offsetBottom, offsetLeft, offsetRight, imageRef.current]);

    // Animation Loop
    useEffect(() => {
        if (!isPlaying || !imageRef.current) return;

        let lastTime = 0;
        const animate = (time: number) => {
            if (time - lastTime >= delay) {
                setCurrentFrame((prev) => (prev + 1) % (rows * cols));
                lastTime = time;
            }
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, rows, cols, delay]);

    // Render Preview Frame
    useEffect(() => {
        const canvas = previewCanvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const frameWidth = (img.width - offsetLeft - offsetRight) / cols;
        const frameHeight = (img.height - offsetTop - offsetBottom) / rows;

        canvas.width = frameWidth;
        canvas.height = frameHeight;

        // Calculate current frame position
        const row = Math.floor(currentFrame / cols);
        const col = currentFrame % cols;
        const sx = offsetLeft + col * frameWidth;
        const sy = offsetTop + row * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
    }, [currentFrame, rows, cols, offsetTop, offsetBottom, offsetLeft, offsetRight]);

    const handleSave = () => {
        const img = imageRef.current;
        if (!img) return;

        setIsExporting(true);

        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: 'https://unpkg.com/gif.js/dist/gif.worker.js'
        });

        const frameWidth = (img.width - offsetLeft - offsetRight) / cols;
        const frameHeight = (img.height - offsetTop - offsetBottom) / rows;

        // Add frames
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = frameWidth;
        tempCanvas.height = frameHeight;
        const ctx = tempCanvas.getContext("2d");

        if (ctx) {
            for (let i = 0; i < rows * cols; i++) {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const sx = offsetLeft + col * frameWidth;
                const sy = offsetTop + row * frameHeight;

                ctx.clearRect(0, 0, frameWidth, frameHeight);
                ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

                gif.addFrame(ctx, { copy: true, delay: delay });
            }
        }

        gif.on('finished', (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            onSave(url);
            setIsExporting(false);
        });

        gif.render();
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden">
            {/* Center: Canvas Viewer */}
            <div className="flex-1 bg-surface/10 p-8 flex items-center justify-center overflow-auto relative">
                <div className="bg-surface-highlight border border-primary/10 rounded-lg shadow-2xl overflow-hidden">
                    <canvas
                        ref={canvasRef}
                        className="max-w-full max-h-[80vh] object-contain image-pixelated"
                        style={{ imageRendering: "pixelated" }}
                    />
                </div>

                {/* Floating Preview */}
                <div className="absolute top-8 right-8 bg-surface/90 backdrop-blur-md border border-primary/20 p-4 rounded-xl shadow-xl flex flex-col items-center gap-3">
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Preview</h3>
                    <div className="w-24 h-24 bg-surface-highlight rounded-lg border border-primary/10 flex items-center justify-center overflow-hidden">
                        <canvas
                            ref={previewCanvasRef}
                            className="max-w-full max-h-full object-contain image-pixelated"
                            style={{ imageRendering: "pixelated" }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <span className="text-xs font-mono text-text-muted">
                            {currentFrame + 1} / {rows * cols}
                        </span>
                    </div>
                </div>
            </div>

            {/* Right: Settings Panel */}
            <div className="w-80 bg-surface/30 border-l border-primary/10 flex flex-col h-full">
                <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Configuration
                    </h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1.5"
                        onClick={() => imageRef.current && autoDetectGrid(imageRef.current)}
                    >
                        <Wand2 className="w-3 h-3" />
                        Auto
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Grid Settings */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-medium text-text flex items-center gap-2">
                            <Grid3X3 className="w-3.5 h-3.5 text-primary" />
                            Grid Layout
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Rows</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={rows}
                                    onChange={(e) => setRows(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Columns</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={cols}
                                    onChange={(e) => setCols(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Timing */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-medium text-text flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            Timing
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-xs text-text-muted">Frame Delay (ms)</Label>
                                <span className="text-xs font-mono text-primary">{delay}ms</span>
                            </div>
                            <input
                                type="range"
                                min={20}
                                max={500}
                                step={10}
                                value={delay}
                                onChange={(e) => setDelay(Number(e.target.value))}
                                className="w-full accent-primary h-1.5 bg-surface-highlight rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Offsets */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-medium text-text flex items-center gap-2">
                            <Move className="w-3.5 h-3.5 text-primary" />
                            Offsets (px)
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Top</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetTop}
                                    onChange={(e) => setOffsetTop(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Bottom</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetBottom}
                                    onChange={(e) => setOffsetBottom(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Left</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetLeft}
                                    onChange={(e) => setOffsetLeft(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs text-text-muted">Right</Label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={offsetRight}
                                    onChange={(e) => setOffsetRight(Number(e.target.value))}
                                    className="h-8"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-primary/10 bg-surface/50">
                    <Button className="w-full" size="lg" onClick={handleSave} disabled={isExporting}>
                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Rendering GIF...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Save Animation
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
