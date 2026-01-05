"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Upload, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { SpriteSheetConverter } from "@/components/generate/SpriteSheetConverter";
import { Card, CardContent } from "@/components/ui/card";

export default function GifConverterPage() {
    const searchParams = useSearchParams();
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-load asset from query param
    useEffect(() => {
        const assetUrl = searchParams.get('asset');
        if (assetUrl) {
            setSelectedFile(decodeURIComponent(assetUrl));
        }
    }, [searchParams]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedFile(url);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setSelectedFile(url);
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const handleReset = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            <Header title="Tools" subtitle="Sprite Sheet to GIF">
                {selectedFile && (
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-text-muted hover:text-primary">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                    </Button>
                )}
            </Header>

            <main className="flex-1 flex flex-col overflow-hidden relative">
                {!selectedFile ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
                        <div className="w-full max-w-md space-y-8">
                            <div className="space-y-2 text-center">
                                <h1 className="text-3xl font-bold tracking-tight">Sprite Sheet to GIF</h1>
                                <p className="text-text-muted">
                                    Upload your sprite sheet to convert it into an animated GIF.
                                </p>
                            </div>

                            <Card
                                className="border-dashed border-2 hover:border-primary/50 transition-all cursor-pointer bg-surface/50 group"
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-surface-highlight group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                                        <Upload className="w-10 h-10 text-text-muted group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                                        <p className="text-sm text-text-muted">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex justify-center">
                                <Link href="/home">
                                    <Button variant="ghost" size="sm" className="gap-2 text-text-muted hover:text-text">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to Home
                                    </Button>
                                </Link>
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                ) : (
                    // Full screen converter view
                    <div className="flex-1 w-full h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SpriteSheetConverter
                            spriteSheetUrl={selectedFile}
                            onSave={(gifUrl) => {
                                const link = document.createElement('a');
                                link.href = gifUrl;
                                link.download = 'animation.gif';
                                link.click();
                            }}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
