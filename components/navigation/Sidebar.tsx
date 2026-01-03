import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, FolderOpen, List, X, Lightning } from "@phosphor-icons/react";
import { ProfileModal } from "@/components/profile-modal";
import { Logo } from "@/components/layout/Logo";
import { BYOKButton } from "@/components/home/BYOKButton";
import { useState, useEffect } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu when pathname changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navItems = [
        { href: "/home", label: "Home", icon: House },
        { href: "/projects", label: "Projects", icon: FolderOpen },
    ];

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 px-6 bg-background/80 backdrop-blur-md border-b border-white/[0.05] flex items-center justify-between z-[60]">
                <div className="flex items-center gap-3">
                    <Logo size="small" />
                    <span className="font-bold text-white tracking-tight">Pixelar</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] text-white"
                >
                    {isMobileMenuOpen ? <X size={20} /> : <List size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 bottom-0 z-[80]
                w-64 bg-background border-r border-white/[0.05]
                transition-transform duration-300 ease-in-out
                flex flex-col
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                {/* Logo Section */}
                <div className="h-20 flex items-center px-8 border-b border-white/[0.05]">
                    <div className="flex items-center gap-3">
                        <Logo />
                        <span className="text-xl font-bold text-white tracking-tight">Pixelar</span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-8 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = item.href === "/home"
                            ? pathname === "/home"
                            : pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? "text-primary"
                                        : "text-text-muted hover:text-white"}
                                `}
                            >
                                {/* Hover Indicator Rectangle */}
                                <div className={`
                                    absolute inset-0 bg-white/[0.03] rounded-xl transition-all duration-200
                                    ${isActive ? "opacity-100 border border-primary/20 shadow-[0_0_15px_-3px_theme('colors.primary.DEFAULT/0.1')]" : "opacity-0 group-hover:opacity-100 group-hover:bg-white/[0.05] border border-transparent group-hover:border-white/[0.08]"}
                                `} />

                                <Icon size={20} weight={isActive ? "fill" : "regular"} className="relative z-10" />
                                <span className="relative z-10 font-semibold tracking-wide">{item.label}</span>

                                {isActive && (
                                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_theme('colors.primary.DEFAULT')]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section: BYOK, Credits, Profile */}
                <div className="p-4 border-t border-white/[0.05] space-y-3">
                    {/* BYOK Button */}
                    <BYOKButton />

                    {/* Compact Credits Display - Only show if no API key */}
                    {typeof window !== 'undefined' && !localStorage.getItem('openai_api_key') && (
                        <div className="flex items-center justify-between px-3 py-2 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-amber-400/10 flex items-center justify-center">
                                    <Lightning size={12} weight="fill" className="text-amber-400" />
                                </div>
                                <span className="text-xs font-bold text-white">450</span>
                            </div>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Credits</span>
                        </div>
                    )}

                    <ProfileModal>
                        <button className="w-full flex items-center gap-3 p-2 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-200 group relative">
                            <div className="relative shrink-0">
                                <img
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                                    alt="User"
                                    className="w-10 h-10 rounded-xl bg-surface-highlight border border-white/[0.08]"
                                />
                                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-background rounded-full shadow-sm" />
                            </div>
                            <div className="flex flex-col items-start min-w-0">
                                <span className="text-sm font-bold text-white tracking-wide truncate w-full text-left">Alex Design</span>
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Pro Member</span>
                            </div>
                        </button>
                    </ProfileModal>
                </div>
            </aside>

            {/* Content Spacer for PC */}
            <div className="hidden lg:block w-64 shrink-0" />
            {/* Content Spacer for Mobile */}
            <div className="lg:hidden h-16 shrink-0" />
        </>
    );
}
