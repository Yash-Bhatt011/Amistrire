import type { Product, Category, Coupon, Review } from "@/lib/types";
import type { GalleryItem, GalleryItemKind } from "@/lib/store/gallery-store";

// ---------- Product ----------

export function rowToProduct(row: any): Product {
  return {
    slug: row.slug,
    categorySlug: row.category_slug ?? "",
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    basePrice: Number(row.base_price ?? 0),
    currency: "INR",
    accent: (row.accent as "purple" | "cyan") ?? "cyan",
    badges: row.badges ?? undefined,
    printTimeHrs: [Number(row.print_time_hrs_min ?? 0), Number(row.print_time_hrs_max ?? 0)],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    inventory: row.inventory ?? "in-stock",
    options: row.options ?? [],
    media: row.media ?? undefined,
    specs: row.specs ?? undefined,
    materialsUsed: row.materials_used ?? undefined,
    seo: row.seo ?? undefined,
    featured: row.featured ?? undefined,
    archived: row.archived ?? undefined,
    stockCount: row.stock_count ?? undefined,
  };
}

export function productToRow(p: Product) {
  return {
    slug: p.slug,
    category_slug: p.categorySlug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    base_price: p.basePrice,
    currency: p.currency ?? "INR",
    accent: p.accent,
    badges: p.badges ?? null,
    print_time_hrs_min: p.printTimeHrs?.[0] ?? null,
    print_time_hrs_max: p.printTimeHrs?.[1] ?? null,
    rating: p.rating ?? 0,
    review_count: p.reviewCount ?? 0,
    inventory: p.inventory ?? "in-stock",
    options: p.options ?? [],
    media: p.media ?? null,
    specs: p.specs ?? null,
    materials_used: p.materialsUsed ?? null,
    seo: p.seo ?? null,
    featured: p.featured ?? false,
    archived: p.archived ?? false,
    stock_count: p.stockCount ?? null,
  };
}

/** Partial patch → only the columns actually present in `patch` are included. */
export function productPatchToRow(patch: Partial<Product>) {
  const row: Record<string, unknown> = {};
  if ("categorySlug" in patch) row.category_slug = patch.categorySlug;
  if ("name" in patch) row.name = patch.name;
  if ("tagline" in patch) row.tagline = patch.tagline;
  if ("description" in patch) row.description = patch.description;
  if ("basePrice" in patch) row.base_price = patch.basePrice;
  if ("accent" in patch) row.accent = patch.accent;
  if ("badges" in patch) row.badges = patch.badges ?? null;
  if ("printTimeHrs" in patch) {
    row.print_time_hrs_min = patch.printTimeHrs?.[0] ?? null;
    row.print_time_hrs_max = patch.printTimeHrs?.[1] ?? null;
  }
  if ("rating" in patch) row.rating = patch.rating;
  if ("reviewCount" in patch) row.review_count = patch.reviewCount;
  if ("inventory" in patch) row.inventory = patch.inventory;
  if ("options" in patch) row.options = patch.options ?? [];
  if ("media" in patch) row.media = patch.media ?? null;
  if ("specs" in patch) row.specs = patch.specs ?? null;
  if ("materialsUsed" in patch) row.materials_used = patch.materialsUsed ?? null;
  if ("seo" in patch) row.seo = patch.seo ?? null;
  if ("featured" in patch) row.featured = patch.featured ?? false;
  if ("archived" in patch) row.archived = patch.archived ?? false;
  if ("stockCount" in patch) row.stock_count = patch.stockCount ?? null;
  return row;
}

// ---------- Category ----------

export function rowToCategory(row: any): Category {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    icon: row.icon ?? "Box",
    isCollection: row.is_collection ?? undefined,
    seo: row.seo ?? undefined,
    archived: row.archived ?? undefined,
    bannerImage: row.banner_image ?? undefined,
    banner3DShape: row.banner_3d_shape ?? undefined,
  };
}

export function categoryToRow(c: Category) {
  return {
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    icon: c.icon,
    is_collection: c.isCollection ?? false,
    seo: c.seo ?? null,
    archived: c.archived ?? false,
    banner_image: c.bannerImage ?? null,
    banner_3d_shape: c.banner3DShape ?? null,
  };
}

export function categoryPatchToRow(patch: Partial<Category>) {
  const row: Record<string, unknown> = {};
  if ("name" in patch) row.name = patch.name;
  if ("tagline" in patch) row.tagline = patch.tagline;
  if ("icon" in patch) row.icon = patch.icon;
  if ("isCollection" in patch) row.is_collection = patch.isCollection ?? false;
  if ("seo" in patch) row.seo = patch.seo ?? null;
  if ("archived" in patch) row.archived = patch.archived ?? false;
  if ("bannerImage" in patch) row.banner_image = patch.bannerImage ?? null;
  if ("banner3DShape" in patch) row.banner_3d_shape = patch.banner3DShape ?? null;
  return row;
}

// ---------- Coupon ----------

export function rowToCoupon(row: any): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: Number(row.value ?? 0),
    description: row.description ?? "",
    minOrderValue: row.min_order_value ?? undefined,
    usageLimit: row.usage_limit ?? undefined,
    oneTimeUse: row.one_time_use ?? undefined,
    expiresAt: row.expires_at ?? undefined,
    firstOrderOnly: row.first_order_only ?? undefined,
    stackable: row.stackable ?? undefined,
  };
}

export function couponToRow(c: Coupon) {
  return {
    code: c.code,
    type: c.type,
    value: c.value,
    description: c.description,
    min_order_value: c.minOrderValue ?? null,
    usage_limit: c.usageLimit ?? null,
    one_time_use: c.oneTimeUse ?? false,
    expires_at: c.expiresAt ?? null,
    first_order_only: c.firstOrderOnly ?? false,
    stackable: c.stackable ?? false,
  };
}

export function couponPatchToRow(patch: Partial<Coupon>) {
  const row: Record<string, unknown> = {};
  if ("type" in patch) row.type = patch.type;
  if ("value" in patch) row.value = patch.value;
  if ("description" in patch) row.description = patch.description;
  if ("minOrderValue" in patch) row.min_order_value = patch.minOrderValue ?? null;
  if ("usageLimit" in patch) row.usage_limit = patch.usageLimit ?? null;
  if ("oneTimeUse" in patch) row.one_time_use = patch.oneTimeUse ?? false;
  if ("expiresAt" in patch) row.expires_at = patch.expiresAt ?? null;
  if ("firstOrderOnly" in patch) row.first_order_only = patch.firstOrderOnly ?? false;
  if ("stackable" in patch) row.stackable = patch.stackable ?? false;
  return row;
}

// ---------- Gallery ----------

export function rowToGalleryItem(row: any): GalleryItem {
  return {
    id: row.id,
    kind: row.kind as GalleryItemKind,
    url: row.url,
    big: row.big ?? undefined,
  };
}

export function galleryItemToRow(item: Omit<GalleryItem, "id">, position: number) {
  return { kind: item.kind, url: item.url, big: item.big ?? false, position };
}

// ---------- Review ----------

export function rowToReview(row: any): Review {
  return {
    id: row.id,
    productSlug: row.product_slug ?? undefined,
    name: row.name,
    location: row.location ?? "",
    rating: Number(row.rating ?? 0),
    text: row.text ?? "",
    date: row.date,
  };
}

export function reviewToRow(r: Review) {
  return {
    product_slug: r.productSlug ?? null,
    name: r.name,
    location: r.location,
    rating: r.rating,
    text: r.text,
    date: r.date,
  };
}
