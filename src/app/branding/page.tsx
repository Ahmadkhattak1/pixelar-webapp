import React from 'react';

export default function BrandingPage() {
    return (
        <div className="min-h-screen">
            <div className="container" style={{ paddingTop: '80px', paddingBottom: '80px' }}>

                {/* Header */}
                <header style={{ marginBottom: '80px', textAlign: 'center' }}>
                    <h1 className="text-display" style={{ marginBottom: '24px' }}>Pixelar.</h1>
                    <p className="text-h3 text-secondary" style={{ maxWidth: '700px', margin: '0 auto' }}>
                        A design studio crafting meaningful digital experiences.
                    </p>
                    <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <span className="badge badge-outline">v3.0</span>
                        <span className="badge badge-accent">Identity Defined</span>
                    </div>
                </header>

                <div className="grid-bento">

                    {/* Identity Statement */}
                    <div className="card col-span-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '64px' }}>
                        <h2 className="text-h2" style={{ marginBottom: '16px' }}>Unusual but Consistent.</h2>
                        <p className="text-body-lg" style={{ maxWidth: '600px' }}>
                            We embrace the contrast between the <strong>Soft</strong> (32px containers) and the <strong>Sharp</strong> (4px interactions).
                            We pair <strong>Humanist</strong> headings with <strong>Technical</strong> monospace details.
                            We add <strong>Grain</strong> to bring digital surfaces to life.
                        </p>
                    </div>

                    {/* Logo Section */}
                    <div className="card col-span-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '320px' }}>
                        <div style={{
                            width: '200px',
                            height: '200px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img src="/pixelar-logo.svg" alt="Pixelar Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <p className="text-mono" style={{ marginTop: '32px' }}>FIG_01: LOGOMARK</p>
                    </div>

                    {/* Typography Section */}
                    <div className="card col-span-8" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '32px', marginBottom: '32px' }}>
                            <h2 className="text-h2" style={{ marginBottom: '8px' }}>Ubuntu</h2>
                            <p className="text-mono-accent">// The Humanist Voice</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                            <div>
                                <h3 className="text-h3" style={{ marginBottom: '16px' }}>Hierarchy</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <span className="text-display-xl text-primary">Display</span>
                                    <span className="text-h1 text-secondary">Heading</span>
                                    <span className="text-h3 text-secondary">Subheading</span>
                                    <span className="text-mono">MONO_LABEL</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-h3" style={{ marginBottom: '16px' }}>Body Text</h3>
                                <p className="text-body">
                                    "Design is not just what it looks like and feels like. Design is how it works. Good design is obvious. Great design is transparent."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Components / Interactions */}
                    <div className="card col-span-6">
                        <h3 className="text-h3" style={{ marginBottom: '24px' }}>Technical Interactions</h3>
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                            <button className="btn btn-primary">Execute</button>
                            <button className="btn btn-secondary">Cancel</button>
                            <button className="btn btn-white">Auth</button>
                        </div>

                        <h4 className="text-mono" style={{ marginBottom: '16px' }}>STATUS_INDICATORS</h4>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <span className="badge badge-accent">LIVE</span>
                            <span className="badge badge-outline">BETA_V3</span>
                            <span className="badge badge-outline">DOCS</span>
                        </div>
                    </div>

                    {/* Inputs Section */}
                    <div className="card col-span-6">
                        <h3 className="text-h3" style={{ marginBottom: '24px' }}>Data Entry</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label className="text-mono" style={{ display: 'block', marginBottom: '8px' }}>USER_EMAIL</label>
                                <input type="email" className="input" placeholder="user@domain.com" />
                            </div>
                            <div>
                                <label className="text-mono" style={{ display: 'block', marginBottom: '8px' }}>PROJECT_ID</label>
                                <input type="text" className="input" placeholder="PXL-2024-001" />
                            </div>
                        </div>
                    </div>

                    {/* Colors Section */}
                    <div className="card col-span-12">
                        <h3 className="text-h3" style={{ marginBottom: '32px' }}>Palette Harmony</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>

                            <ColorCard
                                name="Surface"
                                hex="#38373D"
                                variable="--color-bg-surface"
                                bg="var(--color-bg-surface)"
                            />

                            <ColorCard
                                name="Accent"
                                hex="#FF715B"
                                variable="--color-accent"
                                bg="var(--color-accent)"
                            />

                            <ColorCard
                                name="Base"
                                hex="#2C2B30"
                                variable="--color-bg-base"
                                bg="var(--color-bg-base)"
                            />

                            <ColorCard
                                name="Subtle Surface"
                                hex="#323136"
                                variable="--color-bg-surface-subtle"
                                bg="var(--color-bg-surface-subtle)"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ColorCard({ name, hex, variable, bg, darkText = false }: { name: string; hex: string; variable: string; bg: string; darkText?: boolean }) {
    return (
        <div style={{ padding: '16px', borderRadius: 'var(--radius-element)', border: '1px solid var(--color-border)' }}>
            <div style={{
                height: '80px',
                backgroundColor: bg,
                borderRadius: '2px',
                marginBottom: '16px',
                border: '1px solid rgba(0,0,0,0.1)'
            }} />
            <h4 className="text-sm font-medium text-primary" style={{ marginBottom: '4px', fontFamily: 'var(--font-mono)', textTransform: 'none' }}>{name}</h4>
            <p className="text-mono">{hex}</p>
        </div>
    );
}
