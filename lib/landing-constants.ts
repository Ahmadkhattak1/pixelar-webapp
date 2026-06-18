export const SITE_CONFIG = {
  name: "Pixelar",
  description: "AI-powered pixel art generation for game developers",
  url: "https://pixelar.ai",
  ogImage: "/og-image.png",
};

export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#gallery", label: "Gallery" },
  { href: "#pricing", label: "Pricing" },
];

export const FEATURES = [
  {
    id: "sprite",
    title: "Sprite Generation",
    description: "Create characters, objects, items, and enemies with a simple text prompt.",
    credits: 5,
    icon: "zap",
    examples: ["Knight warrior", "Treasure chest", "Magic potion", "Forest goblin"],
  },
  {
    id: "scene",
    title: "Scene Generation",
    description: "Generate stunning backgrounds, environments, and tilesets for your game worlds.",
    credits: 8,
    icon: "mountain",
    examples: ["Dark forest", "Castle interior", "Space station", "Underwater cave"],
  },
  {
    id: "animation",
    title: "Animation",
    description: "Bring your sprites to life with walk cycles, attacks, and special effects.",
    credits: 10,
    icon: "film",
    examples: ["4-direction walk", "Attack combo", "Idle breathing", "Death animation"],
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: "Describe",
    description: "Tell AI what you want",
    icon: "pencil",
  },
  {
    step: 2,
    title: "Generate",
    description: "Get multiple variations instantly",
    icon: "sparkles",
  },
  {
    step: 3,
    title: "Animate",
    description: "Bring sprites to life",
    icon: "film",
  },
  {
    step: 4,
    title: "Export",
    description: "Download game-ready assets",
    icon: "download",
  },
];

export const PRICING_TIERS = [
  {
    id: "free",
    name: "Wanderer",
    price: "Free",
    description: "Perfect for trying out Pixelar",
    credits: 50,
    features: [
      "50 credits to start",
      "Basic styles",
      "Up to 64x64 resolution",
      "PNG export",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Knight",
    price: "$19",
    period: "/month",
    description: "For serious indie developers",
    credits: 500,
    features: [
      "500 credits/month",
      "All styles unlocked",
      "Up to 256x256 resolution",
      "All export formats",
      "Priority generation",
      "Email support",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    id: "byok",
    name: "BYOK",
    price: "Free",
    description: "Bring Your Own API Key",
    credits: "Pay as you go",
    features: [
      "Use your own AI API key",
      "No credit limits",
      "All styles unlocked",
      "All resolutions",
      "All export formats",
      "Community support",
    ],
    cta: "Connect API Key",
    popular: false,
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "Pixelar saved us weeks of work. We generated all our character sprites in an afternoon.",
    author: "Sarah Chen",
    role: "Indie Dev",
    company: "Moonlight Studios",
  },
  {
    id: 2,
    quote: "The quality of the pixel art is incredible. It's like having a dedicated artist on demand.",
    author: "Marcus Rodriguez",
    role: "Game Designer",
    company: "Pixel Dreams",
  },
  {
    id: 3,
    quote: "As a solo developer, Pixelar is a game-changer. I can finally prototype visually.",
    author: "Alex Kim",
    role: "Solo Developer",
    company: "Independent",
  },
  {
    id: 4,
    quote: "The animation presets are perfect. Walk cycles, attacks, everything just works.",
    author: "Jordan Taylor",
    role: "Lead Artist",
    company: "Retro Forge Games",
  },
];

export const GALLERY_ITEMS = [
  { id: 1, type: "sprite", title: "Knight Warrior", animated: true },
  { id: 2, type: "sprite", title: "Forest Goblin", animated: true },
  { id: 3, type: "scene", title: "Enchanted Forest", animated: false },
  { id: 4, type: "sprite", title: "Wizard Mage", animated: true },
  { id: 5, type: "animation", title: "Walk Cycle", animated: true },
  { id: 6, type: "scene", title: "Castle Dungeon", animated: false },
  { id: 7, type: "sprite", title: "Treasure Chest", animated: false },
  { id: 8, type: "sprite", title: "Slime Enemy", animated: true },
  { id: 9, type: "scene", title: "Space Station", animated: false },
  { id: 10, type: "animation", title: "Attack Combo", animated: true },
  { id: 11, type: "sprite", title: "Magic Potion", animated: false },
  { id: 12, type: "scene", title: "Desert Oasis", animated: false },
];

export const FOOTER_LINKS = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Gallery", href: "#gallery" },
    { label: "Changelog", href: "/changelog" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/api" },
    { label: "Support", href: "/support" },
    { label: "Community", href: "/community" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com/pixelar", icon: "twitter" },
  { label: "Discord", href: "https://discord.gg/pixelar", icon: "discord" },
  { label: "GitHub", href: "https://github.com/pixelar", icon: "github" },
];
