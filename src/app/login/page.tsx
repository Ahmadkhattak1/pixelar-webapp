import React from 'react';
import styles from './login.module.css';
import RotatingText from './RotatingText';

export default function LoginPage() {
    return (
        <div className={styles['login-container']}>
            {/* Logo - Top Left */}
            <div className={styles['login-logo']}>
                <img src="/pixelar-logo.svg" alt="Pixelar Logo" style={{ width: '48px', height: '48px' }} />
            </div>

            <div className={styles['login-content']}>
                {/* Hero Copy */}
                <div className={styles['login-copy']}>
                    <h1 className="text-h2" style={{ marginBottom: '16px', lineHeight: 'var(--line-height-snug)', color: 'rgba(255, 255, 255, 0.8)' }}>
                        Export-ready assets to<br />
                        game engines like <RotatingText words={['Unity', 'Unreal Engine', 'Godot']} />
                    </h1>
                </div>

                {/* Login Card */}
                <div className={styles['login-card']}>
                    <p className="text-mono" style={{ marginBottom: '24px' }}>AUTHENTICATE</p>

                    <button className="btn btn-white" style={{ width: '100%', gap: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4" />
                            <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853" />
                            <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05" />
                            <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>

                {/* Terms */}
                <p className="text-sm text-muted" style={{ marginTop: '24px', lineHeight: 'var(--line-height-normal)', textAlign: 'center', maxWidth: '400px' }}>
                    By signing in, you agree to our{' '}
                    <a href="/terms" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
