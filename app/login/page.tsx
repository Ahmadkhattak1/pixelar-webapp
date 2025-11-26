"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      // Redirect to projects page
      router.push('/projects');
    } catch (err: any) {
      console.error("Authentication error:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/logo.svg"
            alt="Pixelar Logo"
            width={120}
            height={40}
            priority
          />
          <p className="text-base text-text-muted">
            Sign in to start creating game assets
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 mr-2 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                  Continue with Google
                </>
              )}
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <p className="text-xs text-text-muted text-center">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-text-muted">
            Firebase authentication ready. Add your Firebase credentials in{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted text-primary text-xs font-mono">
              .env.local
            </code>
          </p>
        </div>
      </div>
    </main>
  );
}
