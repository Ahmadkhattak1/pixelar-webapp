"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Uncomment when Firebase is configured:
/*
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
*/

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Uncomment when Firebase is configured:
      /*
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Redirect to projects page after successful login
      router.push('/projects');
      */

      // For development without Firebase:
      // Simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to home page
      router.push('/home');
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md space-y-10">
          {/* Logo */}
          <div className="flex flex-col items-start space-y-3">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="font-mono font-bold text-2xl text-white">Px</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text tracking-tight">Pixelar</h1>
              <p className="text-sm text-text-muted mt-1">
                Create stunning game assets
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-text leading-tight">
              Design, animate,<br />export.
            </h2>
            <p className="text-base text-text-muted leading-relaxed">
              Pixel-perfect assets for Unity, Godot, Unreal, and more.
            </p>
          </div>

          {/* Sign In Button */}
          <div className="space-y-4">
            <Button
              className="w-full h-14 text-sm font-semibold bg-primary hover:bg-primary-600 text-primary-foreground shadow-lg shadow-primary/30"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <p className="text-xs text-text-dim text-center">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 bg-gradient-to-br from-surface via-surface-highlight to-surface relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />

        {/* Main Illustration */}
        <div className="relative w-full max-w-2xl aspect-square z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl animate-pulse-slow"></div>
          <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-surface/50 to-black/40 backdrop-blur-sm">
            <Image
              src="/login_sprite_illustration.png"
              alt="Game Asset Showcase"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Floating Asset 1 - Top Left */}
        <div className="absolute top-20 left-20 w-48 h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-sm animate-float">
          <Image
            src="/login_asset_characters.png"
            alt="Character Assets"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* Floating Asset 2 - Bottom Right */}
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-gradient-to-br from-secondary/10 to-transparent backdrop-blur-sm animate-float delay-1000">
          <Image
            src="/login_asset_ui_elements.png"
            alt="UI Elements"
            fill
            className="object-cover opacity-90"
          />
        </div>

        {/* Decorative Glows */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/15 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-secondary/15 blur-3xl animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-accent-pink/10 blur-2xl animate-pulse-slow delay-1000"></div>
      </div>
    </main>
  );
}
