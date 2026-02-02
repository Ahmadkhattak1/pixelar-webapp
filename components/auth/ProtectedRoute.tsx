"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Wraps pages that require authentication
 * Redirects to /login if user is not authenticated
 */
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        // Only redirect after loading is complete and user is confirmed to be null
        if (!loading && !user) {
            console.warn("[Auth] User not authenticated, redirecting to login...");
            router.push("/login");
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
    if (loading) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-text-muted">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated
    if (!user) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-text-muted">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // User is authenticated, render children
    return <>{children}</>;
}
