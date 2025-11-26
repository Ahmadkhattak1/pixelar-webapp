import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/logo.svg"
            alt="Pixelar Logo"
            width={140}
            height={46}
            priority
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Create pixel-perfect 2D game assets
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Design and export professional game assets for Unity, Godot, Unreal Engine, and more.
            Built for game developers and pixel artists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </Link>
        </div>

        <div className="pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-text-muted">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            Demo pages available
          </div>
        </div>
      </div>
    </main>
  );
}
