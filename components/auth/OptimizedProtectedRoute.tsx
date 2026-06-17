"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { SimpleLoadingSkeleton } from "@/components/loading/PageSkeleton";

interface OptimizedProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * OptimizedProtectedRoute Component
 * Non-blocking auth wrapper that shows loading skeleton instead of full-screen spinner
 * Uses router.replace() for cleaner history
 */
export function OptimizedProtectedRoute({
  children,
  fallback
}: OptimizedProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Non-blocking redirect - happens in background
    if (!loading && !user) {
      console.warn("[Auth] User not authenticated, redirecting to login...");
      router.replace("/login"); // Use replace for cleaner history
    }
  }, [user, loading, router]);

  // Show skeleton while auth loads (non-blocking)
  if (loading) {
    return fallback || <SimpleLoadingSkeleton />;
  }

  // If not authenticated, show loading while redirect happens
  if (!user) {
    return fallback || <SimpleLoadingSkeleton />;
  }

  // Render children immediately when authenticated
  return <>{children}</>;
}
