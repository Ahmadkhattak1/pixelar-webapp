"use client";

import Image from "next/image";
import { Zap } from "lucide-react";
import { ProfileModal } from "@/components/profile-modal";

interface HeaderProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
    return (
        <header className="border-b border-primary/15 bg-surface/50 backdrop-blur-md px-6 py-3 z-50 sticky top-0">
            <div className="flex items-center justify-between gap-6">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logo.svg"
                            alt="Pixelar"
                            width={100}
                            height={32}
                            priority
                        />
                    </div>
                    {(title || subtitle) && (
                        <>
                            <div className="h-5 w-[1px] bg-primary/20" />
                            <div className="flex flex-col gap-0.5">
                                {title && <h2 className="text-sm font-semibold text-text">{title}</h2>}
                                {subtitle && <p className="text-xs text-text-muted">{subtitle}</p>}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {children}

                    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-highlight border border-primary/15">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-mono font-semibold text-text">450</span>
                        </div>
                        <div className="w-[1px] h-4 bg-primary/20" />
                        <span className="text-xs text-text-muted">Credits</span>
                    </div>

                    <ProfileModal>
                        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-surface-highlight rounded-lg border border-primary/15 cursor-pointer hover:bg-surface-highlight/80 transition-colors">
                            <div className="text-right">
                                <div className="text-xs font-medium text-text">Alex Design</div>
                                <div className="text-[10px] text-text-muted">Pro Plan</div>
                            </div>
                            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary p-[0.5px]">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="User"
                                    className="w-full h-full rounded-[3px] bg-black"
                                />
                            </div>
                        </div>
                    </ProfileModal>

                    <ProfileModal>
                        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary p-[1px] sm:hidden cursor-pointer hover:opacity-80 transition-opacity">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                alt="User"
                                className="w-full h-full rounded-[5px] bg-black"
                            />
                        </div>
                    </ProfileModal>
                </div>
            </div>
        </header>
    );
}
