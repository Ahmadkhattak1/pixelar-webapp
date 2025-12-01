"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface ActionCardProps {
    title: string;
    description: string;
    iconSrc: string;
    href: string;
    image: string;
    delay?: number;
}

export function ActionCard({ title, description, iconSrc, href, image, delay = 0 }: ActionCardProps) {
    return (
        <Link
            href={href}
            className="group block rounded-xl border-2 border-primary/15 bg-surface overflow-hidden transition-all duration-150 hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.3)] active:translate-y-0"
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Image Container */}
            <div className="relative aspect-[16/9] overflow-hidden bg-surface-highlight">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-150 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            {/* Content Below Image */}
            <div className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 transition-all duration-150 group-hover:bg-primary group-hover:border-primary group-hover:scale-110">
                        <div className="relative w-4 h-4">
                            {/* Default state - Primary color */}
                            <Image
                                src={iconSrc}
                                alt={title}
                                width={16}
                                height={16}
                                className="absolute inset-0 transition-all duration-150 opacity-60 group-hover:opacity-0"
                                style={{
                                    filter: 'invert(84%) sepia(35%) saturate(1000%) hue-rotate(95deg) brightness(103%) contrast(96%)'
                                }}
                            />
                            {/* Hover state - White */}
                            <Image
                                src={iconSrc}
                                alt={title}
                                width={16}
                                height={16}
                                className="absolute inset-0 transition-all duration-150 opacity-0 group-hover:opacity-100 invert brightness-200"
                            />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-text transition-colors duration-150 group-hover:text-primary">
                        {title}
                    </h3>
                </div>

                <p className="text-text-muted text-sm leading-relaxed">
                    {description}
                </p>
            </div>
        </Link>
    );
}
