import { ReactNode } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface GenerateLayoutProps {
    children: ReactNode;
    projectId: string;
}

export function GenerateLayout({ children, projectId }: GenerateLayoutProps) {
    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Header */}
            <header className="border-b border-primary/15 bg-surface/50 backdrop-blur-md px-3 sm:px-6 py-3 z-50 h-[60px] sm:h-[65px] flex-none">
                <div className="flex items-center justify-between gap-2 sm:gap-6 h-full">
                    {/* Left Section */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <Link href={`/projects/${projectId}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>

                        <div className="hidden sm:block h-5 w-[1px] bg-primary/20 flex-shrink-0" />

                        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
                            <Image
                                src="/logo.svg"
                                alt="Pixelar"
                                width={100}
                                height={32}
                                priority
                            />
                        </div>

                        <div className="hidden sm:block h-5 w-[1px] bg-primary/20 flex-shrink-0" />

                        <div className="flex flex-col gap-0.5 min-w-0">
                            <h1 className="text-xs sm:text-sm font-semibold text-text truncate">Generate Animation</h1>
                            <p className="text-[10px] sm:text-xs text-text-muted truncate">Project #{projectId}</p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                        <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1.5 rounded-lg bg-surface-highlight border border-primary/15">
                            <div className="flex items-center gap-1 sm:gap-1.5">
                                <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-yellow-400 fill-yellow-400" />
                                <span className="text-[10px] sm:text-xs font-mono font-semibold text-text">450</span>
                            </div>
                            <div className="hidden sm:block w-[1px] h-4 bg-primary/20" />
                            <span className="hidden sm:inline text-xs text-text-muted">Credits</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col overflow-hidden">
                {children}
            </main>
        </div>
    );
}
