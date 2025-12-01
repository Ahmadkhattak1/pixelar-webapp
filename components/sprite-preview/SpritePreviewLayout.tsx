import { ReactNode } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BYOKButton } from "@/components/home/BYOKButton";
import { FloatingDock } from "@/components/navigation/FloatingDock";

interface SpritePreviewLayoutProps {
    children: ReactNode;
    title: string;
    projectId: string;
    backLink?: string;
    actions?: ReactNode;
}

export function SpritePreviewLayout({ children, title, projectId, backLink = "/projects", actions }: SpritePreviewLayoutProps) {
    return (
        <div className="h-screen w-full flex flex-col relative overflow-hidden">
            {/* Background Animation Layer - No Grid */}
            <div className="bg-animation">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            {/* Header */}
            <header className="w-full h-20 px-8 flex items-center justify-between z-40 flex-shrink-0 relative">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    <Link href={backLink}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-800/50">
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </Link>

                    <div className="h-5 w-[1px] bg-slate-700" />

                    {/* Logo */}
                    <div className="flex items-center gap-3 group logo-container cursor-pointer">
                        <div className="w-10 h-10 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:border-primary/50 transition-colors shadow-[0_0_15px_-3px_rgba(64,249,155,0.1)] group-hover:shadow-[0_0_20px_-3px_rgba(64,249,155,0.3)]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                                <path d="M6 4H10V20H6V4Z" className="fill-primary" />
                                <path d="M10 4H18V8H10V4Z" className="fill-white" />
                                <path d="M14 8H18V12H14V8Z" className="fill-primary/80" />
                                <path d="M10 12H18V16H10V12Z" className="fill-white" />
                            </svg>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white tracking-wide leading-none group-hover:text-primary transition-colors">Pixelar</span>
                            <span className="text-[10px] text-primary tracking-widest uppercase font-semibold mt-0.5">Studio</span>
                        </div>
                    </div>

                    <div className="h-5 w-[1px] bg-slate-700" />

                    {/* Project Info */}
                    <div className="flex flex-col gap-0.5">
                        <h1 className="text-sm font-semibold text-white">{title}</h1>
                        <p className="text-xs text-slate-400">Project #{projectId}</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {actions && (
                        <>
                            {actions}
                            <div className="h-5 w-[1px] bg-slate-700" />
                        </>
                    )}

                    <BYOKButton />

                    <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-amber-500/20 shadow-lg backdrop-blur-sm">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-100">450</span>
                        <span className="text-xs text-slate-500 font-medium ml-1">Credits</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col overflow-hidden relative z-10">
                {children}
            </main>

            {/* Navigation Dock */}
            <FloatingDock />
        </div>
    );
}
