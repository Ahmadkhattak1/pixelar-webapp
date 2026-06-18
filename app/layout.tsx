import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Import JetBrains Mono
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({ // Configure JetBrains Mono
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pixelar.ai"),
  title: "Pixelar - AI-Powered Pixel Art Generation for Game Developers",
  description:
    "Create game-ready sprites, scenes, and animations in minutes using AI. Generate pixel art characters, backgrounds, and animation-ready assets with simple text prompts.",
  keywords: [
    "pixel art",
    "AI sprite generation",
    "game assets",
    "2D game art",
    "pixel art generator",
    "indie game development",
    "character sprites",
    "scene generation",
    "asset animation",
  ],
  authors: [{ name: "Pixelar" }],
  creator: "Pixelar",
  openGraph: {
    title: "Pixelar - AI Pixel Art Generation",
    description: "Create game-ready pixel art sprites, scenes, and animations in minutes.",
    url: "https://pixelar.ai",
    siteName: "Pixelar",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixelar - AI Pixel Art Generation",
    description: "Create game-ready pixel art sprites, scenes, and animations in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-text font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
