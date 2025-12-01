"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap, Sparkles, Image as ImageIcon, Film, Layers, Home, FolderOpen } from "lucide-react";
import { BYOKButton } from "@/components/home/BYOKButton";
import { ProfileModal } from "@/components/profile-modal";

export default function HomePage() {
    return (
        <div className="min-h-screen w-full flex flex-col relative overflow-hidden">
            {/* Background Animation Layer */}
            <div className="bg-animation">
                <div className="grid-overlay"></div>
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
            </div>

            {/* Top Bar */}
            <header className="w-full h-20 px-8 flex items-center justify-between z-40 flex-shrink-0 relative">
                {/* New Brand/Logo */}
                <div className="flex items-center gap-3 group logo-container cursor-pointer">
                    {/* Custom Pixel Logo */}
                    <div className="w-10 h-10 bg-slate-800/50 rounded-lg border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:border-primary/50 transition-colors shadow-[0_0_15px_-3px_rgba(64,249,155,0.1)] group-hover:shadow-[0_0_20px_-3px_rgba(64,249,155,0.3)]">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
                            {/* Stem */}
                            <path d="M6 4H10V20H6V4Z" className="fill-primary" />
                            {/* Top Bar */}
                            <path d="M10 4H18V8H10V4Z" className="fill-white" />
                            {/* Right Bar */}
                            <path d="M14 8H18V12H14V8Z" className="fill-primary/80" />
                            {/* Middle Bar */}
                            <path d="M10 12H18V16H10V12Z" className="fill-white" />
                        </svg>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-wide leading-none group-hover:text-primary transition-colors">Pixelar</span>
                        <span className="text-[10px] text-primary tracking-widest uppercase font-semibold mt-0.5">Studio</span>
                    </div>
                </div>

                {/* Right Utilities */}
                <div className="flex items-center gap-4">
                    <BYOKButton />

                    <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-lg border border-amber-500/20 shadow-lg backdrop-blur-sm">
                        <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-100">450</span>
                        <span className="text-xs text-slate-500 font-medium ml-1">Credits</span>
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 overflow-y-auto app-scroll pb-36 px-4 md:px-12 relative z-10 custom-scrollbar">
                <div className="max-w-7xl mx-auto pt-8">

                    {/* Hero Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">What would you like to do?</h1>
                        <p className="text-slate-400 text-base">Choose a tool to start generating assets.</p>
                    </div>

                    {/* Main Tools Grid (3 Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                        {/* Card 1: Sprite Generator */}
                        <Link href="/sprites" className="tool-card rounded-2xl p-5 cursor-pointer group flex flex-col h-[380px] relative overflow-hidden block">
                            {/* Subtle gradient backing for icon */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-5 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-20"></div>

                            <div className="flex-1 w-full flex items-center justify-center relative z-10 p-2">
                                <div className="w-full h-full bg-white rounded-lg p-3 flex items-center justify-center">
                                    <Image
                                        src="/sprite-generation.webp"
                                        alt="Sprite Generator"
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 border-t border-slate-800 pt-4 z-20 bg-[#0f172a] relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Sprite Generator</h3>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2">Create unique pixel art characters and objects with AI precision.</p>
                            </div>
                        </Link>

                        {/* Card 2: Scene Builder */}
                        <Link href="/scenes" className="tool-card rounded-2xl p-5 cursor-pointer group flex flex-col h-[380px] relative overflow-hidden block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-20"></div>

                            <div className="flex-1 w-full flex items-center justify-center relative z-10 p-2">
                                <div className="w-full h-full bg-white rounded-lg p-3 flex items-center justify-center">
                                    <Image
                                        src="/scene-generation.webp"
                                        alt="Scene Builder"
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 border-t border-slate-800 pt-4 z-20 bg-[#0f172a]">
                                <div className="flex items-center gap-2 mb-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Scene Builder</h3>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2">Design immersive backgrounds and environments for your games.</p>
                            </div>
                        </Link>

                        {/* Card 3: Sheet to GIF */}
                        <Link href="/tools/gif-converter" className="tool-card rounded-2xl p-5 cursor-pointer group flex flex-col h-[380px] relative overflow-hidden block">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-20"></div>

                            <div className="flex-1 w-full flex items-center justify-center relative z-10 p-2">
                                <div className="w-full h-full bg-white rounded-lg p-3 flex items-center justify-center">
                                    <Image
                                        src="/sprite-sheet-to-gif.webp"
                                        alt="Sheet to GIF"
                                        width={400}
                                        height={400}
                                        className="w-full h-full object-contain drop-shadow-xl"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 border-t border-slate-800 pt-4 z-20 bg-[#0f172a]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Film className="w-5 h-5 text-primary" />
                                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Sheet to GIF</h3>
                                </div>
                                <p className="text-slate-400 text-sm line-clamp-2">Instantly convert your sprite sheets into animated GIFs.</p>
                            </div>
                        </Link>

                    </div>

                    {/* Templates Section */}
                    <div className="mb-24">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Layers className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-white">Use Templates</h2>
                            </div>
                            <button className="text-sm text-slate-500 hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Template 1 */}
                            <div className="template-card rounded-xl h-48 relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-900/80 to-purple-800/20 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h4 className="font-semibold text-white group-hover:translate-x-1 transition-transform">Cyberpunk Character</h4>
                                </div>
                            </div>
                            {/* Template 2 */}
                            <div className="template-card rounded-xl h-48 relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/80 to-teal-800/20 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h4 className="font-semibold text-white group-hover:translate-x-1 transition-transform">Fantasy Landscape</h4>
                                </div>
                            </div>
                            {/* Template 3 */}
                            <div className="template-card rounded-xl h-48 relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/80 to-indigo-800/20 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h4 className="font-semibold text-white group-hover:translate-x-1 transition-transform">Space Station</h4>
                                </div>
                            </div>
                            {/* Template 4 */}
                            <div className="template-card rounded-xl h-48 relative overflow-hidden group cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/80 to-red-800/20 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4">
                                    <h4 className="font-semibold text-white group-hover:translate-x-1 transition-transform">Dungeon Boss</h4>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* App Dock */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 w-auto max-w-[90vw]">
                <nav className="glass-dock px-2 py-2 rounded-full flex items-center gap-1.5 md:gap-2">

                    <Link
                        href="/home"
                        className="dock-item active h-11 px-6 rounded-full flex items-center gap-2 text-sm"
                    >
                        <Home className="w-4 h-4" />
                        <span>Home</span>
                    </Link>

                    <Link
                        href="/projects"
                        className="dock-item h-11 px-6 rounded-full flex items-center gap-2 text-slate-400 text-sm hover:text-white"
                    >
                        <FolderOpen className="w-4 h-4" />
                        <span className="hidden md:inline">Projects</span>
                    </Link>

                    {/* Divider */}
                    <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                    {/* User Profile (In Dock) */}
                    <ProfileModal>
                        <button className="dock-item h-11 pl-2 pr-5 rounded-full flex items-center gap-3 text-slate-400 text-sm ml-1 hover:text-white">
                            <div className="relative">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600" />
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-[#0b1324] rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-xs font-bold text-white">Alex Design</span>
                                <span className="text-[10px] text-primary">Pro Plan</span>
                            </div>
                        </button>
                    </ProfileModal>

                </nav>
            </div>
        </div>
    );
}
