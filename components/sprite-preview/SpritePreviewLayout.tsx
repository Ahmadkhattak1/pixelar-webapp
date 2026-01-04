import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { BYOKButton } from "@/components/home/BYOKButton";

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
                    <Link href="/home" className="flex items-center gap-3 group logo-container cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Image
                                src="/logo.svg"
                                alt="Pixelar Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white tracking-wide leading-none group-hover:text-primary transition-colors">Pixelar</span>
                            <span className="text-[10px] text-primary tracking-widest uppercase font-semibold mt-0.5">Studio</span>
                        </div>
                    </Link>

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
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col overflow-hidden relative z-10">
                {children}
            </main>
        </div>
    );
}
