export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
    const dimensions = {
        small: { container: "w-8 h-8", svg: 20 },
        default: { container: "w-9 h-9", svg: 24 },
        large: { container: "w-10 h-10", svg: 28 }
    };

    const { container, svg } = dimensions[size];

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-emerald-400/40 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-200" />
            <div className={`relative ${container} rounded-xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20`}>
                <svg width={svg} height={svg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Pixelated Sword */}
                    {/* Handle */}
                    <rect x="10" y="18" width="4" height="2" fill="#020617" />
                    <rect x="9" y="20" width="6" height="2" fill="#020617" />

                    {/* Blade */}
                    <rect x="11" y="16" width="2" height="2" fill="#020617" />
                    <rect x="11" y="14" width="2" height="2" fill="#020617" />
                    <rect x="11" y="12" width="2" height="2" fill="#020617" />
                    <rect x="11" y="10" width="2" height="2" fill="#020617" />
                    <rect x="11" y="8" width="2" height="2" fill="#020617" />
                    <rect x="11" y="6" width="2" height="2" fill="#020617" />

                    {/* Blade tip */}
                    <rect x="10" y="4" width="4" height="2" fill="#020617" />
                    <rect x="11" y="2" width="2" height="2" fill="#020617" />

                    {/* Guard */}
                    <rect x="8" y="16" width="8" height="2" fill="#020617" />
                </svg>
            </div>
        </div>
    );
}
