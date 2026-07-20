import type { Category, Product, ProductOption } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "keychains", name: "Keychains", tagline: "Small, personal, everyday-carry", icon: "KeyRound" },
  { slug: "home-decor", name: "Home Decor", tagline: "Sculptural pieces for your space", icon: "Lamp" },
  { slug: "desk-accessories", name: "Desk Accessories", tagline: "Organized, minimal, precise", icon: "MonitorSmartphone" },
  { slug: "miniatures", name: "Miniatures", tagline: "Tabletop-ready detail", icon: "Dices" },
  { slug: "art-collectibles", name: "Art & Collectibles", tagline: "Limited-run display pieces", icon: "Gem" },
  { slug: "gaming-accessories", name: "Gaming Accessories", tagline: "Built for setups and sessions", icon: "Gamepad2" },
  { slug: "functional-prints", name: "Functional Prints", tagline: "Parts that solve real problems", icon: "Wrench" },
  { slug: "organizers", name: "Organizers", tagline: "For drawers, desks, and shelves", icon: "LayoutGrid" },
  { slug: "custom-orders", name: "Custom Orders", tagline: "Your file, your spec, our print", icon: "UploadCloud" },
  { slug: "business-products", name: "Business Products", tagline: "Branded runs at scale", icon: "Briefcase" },
];

const COLOR_CHOICES = [
  { value: "cyan", label: "Studio Blue", swatch: "#2997ff" },
  { value: "violet", label: "Studio Violet", swatch: "#bf5af2" },
  { value: "white", label: "Arctic White", swatch: "#f4f4f5" },
  { value: "black", label: "Matte Black", swatch: "#18181b" },
  { value: "orange", label: "Signal Orange", swatch: "#f97316" },
];

const MATERIAL_CHOICES = [
  { value: "pla", label: "PLA" },
  { value: "petg", label: "PETG", priceDelta: 80 },
  { value: "tpu", label: "TPU (Flexible)", priceDelta: 120 },
  { value: "silk-pla", label: "Silk PLA", priceDelta: 100 },
  { value: "carbon-pla", label: "Carbon Fiber PLA", priceDelta: 250 },
];

const FINISH_CHOICES = [
  { value: "standard", label: "Standard Layer Finish" },
  { value: "smoothed", label: "Vapor Smoothed", priceDelta: 150 },
  { value: "sanded", label: "Hand Sanded + Sealed", priceDelta: 200 },
];

function opts(list: ProductOption[]): ProductOption[] {
  return list;
}

export const PRODUCTS: Product[] = [
  {
    slug: "orbit-keychain",
    categorySlug: "keychains",
    name: "Orbit Keychain",
    tagline: "A gear-in-ring keychain that actually spins",
    description:
      "A precision keychain with a free-spinning gear centerpiece. Printed as a single interlocking piece — no assembly, no glue.",
    basePrice: 349,
    currency: "INR",
    accent: "cyan",
    badges: ["bestseller"],
    printTimeHrs: [1, 2],
    rating: 4.8,
    reviewCount: 214,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "material", label: "Material", required: true, choices: MATERIAL_CHOICES },
      { type: "engraving", label: "Engraving Text (optional)" },
    ]),
  },
  {
    slug: "nomad-keychain",
    categorySlug: "keychains",
    name: "Nomad Compass Keychain",
    tagline: "A working miniature compass housing",
    description: "Lightweight compass-shaped keychain with a magnetized needle insert.",
    basePrice: 399,
    currency: "INR",
    accent: "purple",
    badges: ["new"],
    printTimeHrs: [1, 2],
    rating: 4.6,
    reviewCount: 58,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "material", label: "Material", required: true, choices: MATERIAL_CHOICES },
    ]),
  },
  {
    slug: "amistrie-vase",
    categorySlug: "home-decor",
    name: "Amistrié Layer Vase",
    tagline: "Geological striations, printed in one continuous shell",
    description:
      "A vase that celebrates the layer lines most prints try to hide — each ring is a deliberate design element, not an artifact.",
    basePrice: 1299,
    currency: "INR",
    accent: "purple",
    badges: ["bestseller", "trending"],
    printTimeHrs: [8, 14],
    rating: 4.9,
    reviewCount: 132,
    inventory: "made-to-order",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "size", label: "Size", required: true, choices: [
        { value: "s", label: "Small — 15cm" },
        { value: "m", label: "Medium — 22cm", priceDelta: 350 },
        { value: "l", label: "Large — 30cm", priceDelta: 700 },
      ]},
      { type: "finish", label: "Finish", choices: FINISH_CHOICES },
    ]),
  },
  {
    slug: "hex-wall-panel",
    categorySlug: "home-decor",
    name: "Hex Wall Panel (Set of 6)",
    tagline: "Modular hexagonal wall art",
    description: "Interlocking hexagonal panels that tile into a larger geometric wall composition.",
    basePrice: 1899,
    currency: "INR",
    accent: "cyan",
    printTimeHrs: [10, 16],
    rating: 4.7,
    reviewCount: 41,
    inventory: "made-to-order",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "finish", label: "Finish", choices: FINISH_CHOICES },
    ]),
  },
  {
    slug: "cable-nest-organizer",
    categorySlug: "desk-accessories",
    name: "Cable Nest Organizer",
    tagline: "Keeps four cables tangle-free on your desk",
    description: "A weighted base with routed channels for keeping charging cables in place and accessible.",
    basePrice: 599,
    currency: "INR",
    accent: "cyan",
    badges: ["bestseller"],
    printTimeHrs: [2, 3],
    rating: 4.7,
    reviewCount: 176,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "material", label: "Material", required: true, choices: MATERIAL_CHOICES },
    ]),
  },
  {
    slug: "monitor-riser",
    categorySlug: "desk-accessories",
    name: "Modular Monitor Riser",
    tagline: "Raises your monitor, hides a drawer underneath",
    description: "A sturdy riser with a slide-out tray for a keyboard or notebook underneath.",
    basePrice: 2199,
    currency: "INR",
    accent: "purple",
    printTimeHrs: [14, 20],
    rating: 4.8,
    reviewCount: 63,
    inventory: "low-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "infill", label: "Infill Density", choices: [
        { value: "20", label: "20% — Standard" },
        { value: "40", label: "40% — Reinforced", priceDelta: 180 },
      ]},
    ]),
  },
  {
    slug: "dice-tower",
    categorySlug: "miniatures",
    name: "Cathedral Dice Tower",
    tagline: "A tabletop centerpiece that rolls your dice for you",
    description: "Gothic-inspired dice tower with an internal baffle system for a satisfying, random roll.",
    basePrice: 1499,
    currency: "INR",
    accent: "purple",
    badges: ["trending"],
    printTimeHrs: [9, 12],
    rating: 4.9,
    reviewCount: 97,
    inventory: "made-to-order",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "finish", label: "Finish", choices: FINISH_CHOICES },
    ]),
  },
  {
    slug: "wyrm-miniature",
    categorySlug: "miniatures",
    name: "Wyrm Tabletop Miniature (32mm)",
    tagline: "Pre-supported, tabletop-scaled dragon miniature",
    description: "A finely detailed 32mm-scale miniature, printed with pre-generated supports removed.",
    basePrice: 449,
    currency: "INR",
    accent: "cyan",
    printTimeHrs: [3, 5],
    rating: 4.6,
    reviewCount: 84,
    inventory: "in-stock",
    options: opts([
      { type: "material", label: "Material", required: true, choices: MATERIAL_CHOICES },
      { type: "size", label: "Base Size", choices: [
        { value: "25", label: "25mm base" },
        { value: "32", label: "32mm base", priceDelta: 40 },
      ]},
    ]),
  },
  {
    slug: "layered-relief-art",
    categorySlug: "art-collectibles",
    name: "Layered Relief Wall Art",
    tagline: "Depth-mapped relief art from a photo of your choice",
    description: "Upload a photo — we convert it into a multi-layer relief print with real physical depth.",
    basePrice: 2499,
    currency: "INR",
    accent: "purple",
    badges: ["limited"],
    printTimeHrs: [16, 24],
    rating: 4.9,
    reviewCount: 29,
    inventory: "made-to-order",
    options: opts([
      { type: "size", label: "Size", required: true, choices: [
        { value: "a4", label: "A4" },
        { value: "a3", label: "A3", priceDelta: 600 },
      ]},
      { type: "imageUpload", label: "Upload Photo", required: true },
    ]),
  },
  {
    slug: "controller-stand",
    categorySlug: "gaming-accessories",
    name: "Controller Display Stand",
    tagline: "A stand that doubles as a charging cradle",
    description: "Holds your controller upright with a routed channel for a USB-C cable.",
    basePrice: 799,
    currency: "INR",
    accent: "cyan",
    badges: ["new"],
    printTimeHrs: [3, 4],
    rating: 4.7,
    reviewCount: 45,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
    ]),
  },
  {
    slug: "headset-hook",
    categorySlug: "gaming-accessories",
    name: "Under-Desk Headset Hook",
    tagline: "Clamps to any desk edge up to 40mm",
    description: "No screws, no adhesive — a clamp-style hook engineered for standard desk edges.",
    basePrice: 349,
    currency: "INR",
    accent: "purple",
    printTimeHrs: [1, 2],
    rating: 4.5,
    reviewCount: 112,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "material", label: "Material", choices: MATERIAL_CHOICES },
    ]),
  },
  {
    slug: "hinge-bracket",
    categorySlug: "functional-prints",
    name: "Reinforced Hinge Bracket",
    tagline: "A load-rated replacement bracket, printed to spec",
    description: "Send us your measurements — we print a reinforced bracket rated for real load-bearing use.",
    basePrice: 249,
    currency: "INR",
    accent: "cyan",
    printTimeHrs: [1, 2],
    rating: 4.6,
    reviewCount: 38,
    inventory: "made-to-order",
    options: opts([
      { type: "material", label: "Material", required: true, choices: MATERIAL_CHOICES },
      { type: "infill", label: "Infill Density", choices: [
        { value: "40", label: "40%" },
        { value: "60", label: "60% — Max strength", priceDelta: 90 },
      ]},
    ]),
  },
  {
    slug: "modular-drawer-organizer",
    categorySlug: "organizers",
    name: "Modular Drawer Organizer Kit",
    tagline: "Snap-together grid cells, sized to your drawer",
    description: "A kit of interlocking cells you configure to your own drawer dimensions.",
    basePrice: 899,
    currency: "INR",
    accent: "purple",
    badges: ["bestseller"],
    printTimeHrs: [6, 10],
    rating: 4.8,
    reviewCount: 201,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "size", label: "Cell Count", choices: [
        { value: "6", label: "6 cells" },
        { value: "9", label: "9 cells", priceDelta: 250 },
        { value: "12", label: "12 cells", priceDelta: 500 },
      ]},
    ]),
  },
  {
    slug: "desk-inbox-tray",
    categorySlug: "organizers",
    name: "Stackable Desk Tray",
    tagline: "Stacks cleanly for a multi-tier inbox",
    description: "A simple, stackable paper and accessory tray with routed finger-pulls.",
    basePrice: 549,
    currency: "INR",
    accent: "cyan",
    printTimeHrs: [3, 5],
    rating: 4.5,
    reviewCount: 67,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
    ]),
  },
  {
    slug: "branded-badge-run",
    categorySlug: "business-products",
    name: "Branded Badge Run (Bulk)",
    tagline: "Custom logo badges, priced per unit at scale",
    description: "Upload your logo — we quote a per-unit price for runs of 50 or more.",
    basePrice: 89,
    currency: "INR",
    accent: "purple",
    printTimeHrs: [0.25, 0.5],
    rating: 4.7,
    reviewCount: 22,
    inventory: "made-to-order",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "imageUpload", label: "Upload Logo", required: true },
      { type: "personalization", label: "Notes for our team" },
    ]),
  },
  {
    slug: "custom-desk-nameplate",
    categorySlug: "custom-orders",
    name: "Custom Desk Nameplate",
    tagline: "Your name, your font, your finish",
    description: "A fully personalized nameplate — choose text, style, and finish.",
    basePrice: 449,
    currency: "INR",
    accent: "cyan",
    badges: ["trending"],
    printTimeHrs: [2, 3],
    rating: 4.8,
    reviewCount: 149,
    inventory: "in-stock",
    options: opts([
      { type: "color", label: "Color", required: true, choices: COLOR_CHOICES },
      { type: "personalization", label: "Name / Text", required: true },
      { type: "finish", label: "Finish", choices: FINISH_CHOICES },
    ]),
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.badges?.includes("bestseller")).slice(0, 4);
}

export function getTrending(): Product[] {
  return PRODUCTS.filter((p) => p.badges?.includes("trending"));
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.badges?.includes("new"));
}

export function getBestSellers(): Product[] {
  return PRODUCTS.filter((p) => p.badges?.includes("bestseller"));
}

export function getRelated(product: Product, count = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug
  ).slice(0, count);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.categorySlug.includes(q)
  );
}
