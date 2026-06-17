import { Loader2 } from "lucide-react";

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-background border-r border-white/[0.05] hidden lg:block">
        <div className="h-20 border-b border-white/[0.05] px-8 flex items-center">
          <div className="w-32 h-6 bg-white/[0.05] rounded animate-pulse" />
        </div>
        <div className="p-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="lg:ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="h-8 w-48 bg-white/[0.05] rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white/[0.03] rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SimpleLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-text-muted">Loading...</p>
      </div>
    </div>
  );
}
