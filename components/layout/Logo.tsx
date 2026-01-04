import Image from "next/image";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
    const dimensions = {
        small: { container: "w-8 h-8", img: 32 },
        default: { container: "w-9 h-9", img: 36 },
        large: { container: "w-10 h-10", img: 40 }
    };

    const { container, img } = dimensions[size];

    return (
        <div className="relative group">
            {/* Subtle glow effect matching the logo's lime color */}
            <div className="absolute -inset-1 bg-[#9fde5a]/30 rounded-xl blur opacity-0 group-hover:opacity-50 transition duration-300" />
            <div className={`relative ${container} flex items-center justify-center`}>
                <Image
                    src="/logo.svg"
                    alt="Pixelar Logo"
                    width={img}
                    height={img}
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}
