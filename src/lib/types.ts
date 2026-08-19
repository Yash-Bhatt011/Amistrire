export type OptionType =
  | "color"
  | "material"
  | "texture"
  | "finish"
  | "size"
  | "layerHeight"
  | "infill"
  | "orientation"
  | "personalization"
  | "engraving"
  | "textUpload"
  | "imageUpload";

export type ProductOptionChoice = {
  value: string;
  label: string;
  priceDelta?: number; // added to base price
  swatch?: string; // hex, for color options
};

export type ProductOption = {
  type: OptionType;
  label: string;
  required?: boolean;
  choices?: ProductOptionChoice[]; // omitted for free-text/upload options
};

export type ProductMedia = {
  images: string[]; // URLs or object URLs
  videoUrl?: string;
  modelUrl?: string; // GLB/GLTF preview
};

export type ProductSEO = {
  metaTitle?: string;
  metaDescription?: string;
  slug?: string; // overrides product.slug in URLs if set
  imageAlt?: string;
};

export type Product = {
  slug: string;
  categorySlug: string;
  name: string;
  tagline: string;
  description: string;
  basePrice: number; // INR
  currency: "INR";
  accent: "purple" | "cyan";
  badges?: ("bestseller" | "new" | "trending" | "limited")[];
  printTimeHrs: [number, number]; // range
  rating: number;
  reviewCount: number;
  inventory: "in-stock" | "made-to-order" | "low-stock";
  options: ProductOption[];
  media?: ProductMedia;
  specs?: { label: string; value: string }[];
  materialsUsed?: string[];
  seo?: ProductSEO;
  featured?: boolean;
  archived?: boolean;
  stockCount?: number;
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  icon: string; // lucide icon name
  isCollection?: boolean; // true for admin-created "collections" vs core categories
  seo?: ProductSEO;
  archived?: boolean;
  bannerImage?: string; // URL or object URL, shown on category cards/headers
  banner3DShape?: "torusKnot" | "icosahedron" | "stackedBoxes" | "torus" | "cone" | "octahedron" | "cylinderPair" | "dodecahedron";
};

export type CouponType = "percentage" | "fixed" | "free-shipping" | "bxgy";

export type Coupon = {
  code: string;
  type: CouponType;
  value: number; // percentage points or fixed INR amount, ignored for free-shipping
  description: string;
  minOrderValue?: number;
  usageLimit?: number;
  oneTimeUse?: boolean;
  expiresAt?: string; // ISO date
  firstOrderOnly?: boolean;
  stackable?: boolean;
};

export type Review = {
  id: string;
  productSlug?: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
};

export type CartLineOptions = Record<string, string>;

export type CartLine = {
  id: string; // unique per configuration
  productSlug: string;
  quantity: number;
  selectedOptions: CartLineOptions;
  unitPrice: number;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
};

export type Order = {
  id: string;
  date: string;
  status: "processing" | "in-production" | "shipped" | "delivered";
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  items: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  couponCode?: string;
  billingName?: string;
  billingAddress?: string;
  billingCity?: string;
  billingPincode?: string;
  billingPhone?: string;
  courier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
};
