import { useState, useEffect, useRef } from "react";
import { Play, Pause, Save, Settings2, Grid3X3, Clock, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SpriteSheetConverterProps {
    spriteSheetUrl: string;
    onSave: (gifUrl: string) => void;
}

export function SpriteSheetConverter({ spriteSheetUrl, onSave }: SpriteSheetConverterProps) {
    // Settings
    const [rows, setRows] = useState(1);
    const [cols, setCols] = useState(6); // Default to typical strip
    const [delay, setDelay] = useState(100);
    const [offsetTop, setOffsetTop] = useState(0);
    const [offsetBottom, setOffsetBottom] = useState(0);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [offsetRight, setOffsetRight] = useState(0);

    // Playback State
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentFrame, setCurrentFrame] = useState(0);

    // Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationRef = useRef<number>();

    // Load Image
    useEffect(() => {
        const img = new Image();
        img.src = spriteSheetUrl;
        img.onload = () => {
            imageRef.current = img;
            drawGrid();
        };
    }, [spriteSheetUrl]);

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

        // Draw Grid
        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
        ctx.lineWidth = 1;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = offsetLeft + c * frameWidth;
                const y = offsetTop + r * frameHeight;
                ctx.strokeRect(x, y, frameWidth, frameHeight);
            }
        }
    };

    // Update Grid when settings change
    useEffect(() => {
        drawGrid();
    }, [rows, cols, offsetTop, offsetBottom, offsetLeft, offsetRight]);

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
        // Mock save - in real app, generate GIF blob here
        onSave("mock-gif-url");
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
                <div className="p-6 border-b border-primary/10">
                    <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                        <Settings2 className="w-4 h-4" />
                        Configuration
                    </h2>
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
                    <Button className="w-full" size="lg" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Animation
                    </Button>
                </div>
            </div>
        </div>
    );
}
