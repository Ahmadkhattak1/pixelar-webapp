"use client";

import Image from "next/image";
import Link from "next/link";
import { ProfileModal } from "@/components/profile-modal";
import { useAuthContext } from "@/contexts/AuthContext";

interface HeaderProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
    const { user } = useAuthContext();

    return (
        <header className="border-b border-primary/15 bg-surface/50 backdrop-blur-md px-6 py-3 z-50 sticky top-0">
            <div className="flex items-center justify-between gap-6">
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1">
                    <Link href="/home" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/logo.svg"
                            alt="Pixelar"
                            width={80}
                            height={26}
                            priority
                        />
                    </Link>
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

                    <ProfileModal>
                        <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-surface-highlight rounded-lg border border-primary/15 cursor-pointer hover:bg-surface-highlight/80 transition-colors">
                            <div className="text-right">
                                <div className="text-xs font-medium text-text">{user?.displayName || "User"}</div>
                            </div>
                            <div className="w-6 h-6 rounded-md bg-primary p-[0.5px]">
                                <img
                                    src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                    alt={user?.displayName || "User"}
                                    className="w-full h-full rounded-[3px] bg-black object-cover"
                                />
                            </div>
                        </div>
                    </ProfileModal>

                    <ProfileModal>
                        <div className="w-8 h-8 rounded-md bg-primary p-[1px] sm:hidden cursor-pointer hover:opacity-80 transition-opacity">
                            <img
                                src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                                alt={user?.displayName || "User"}
                                className="w-full h-full rounded-[5px] bg-black object-cover"
                            />
                        </div>
                    </ProfileModal>
                </div>
            </div>
        </header>
    );
}
