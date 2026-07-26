/**
 * Run once, after applying supabase/schema.sql, to import your existing
 * catalog (products, categories, coupons, reviews) from the static seed
 * files into real Supabase tables.
 *
 *   npm run db:seed
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set (in
 * .env.local). Uses the service_role key deliberately — this script runs
 * only on your machine, never in the browser, and needs to bypass RLS to
 * bulk-write rows that aren't tied to a logged-in staff session.
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { CATEGORIES, PRODUCTS } from "../src/lib/product-data";
import { COUPONS, REVIEWS } from "../src/lib/promo-data";
import {
  productToRow,
  categoryToRow,
  couponToRow,
  reviewToRow,
} from "../src/lib/supabase/mappers";

// Minimal .env.local loader (no extra dependency needed).
function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (!process.env[key]) {
      process.env[key] = rawValue.trim().replace(/^"(.*)"$/, "$1");
    }
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local — add them and try again."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log(`Seeding ${CATEGORIES.length} categories...`);
  const { error: catError } = await supabase
    .from("categories")
    .upsert(CATEGORIES.map(categoryToRow), { onConflict: "slug" });
  if (catError) throw new Error(`categories: ${catError.message}`);

  console.log(`Seeding ${PRODUCTS.length} products...`);
  const { error: prodError } = await supabase
    .from("products")
    .upsert(PRODUCTS.map(productToRow), { onConflict: "slug" });
  if (prodError) throw new Error(`products: ${prodError.message}`);

  console.log(`Seeding ${COUPONS.length} coupons...`);
  const { error: couponError } = await supabase
    .from("coupons")
    .upsert(COUPONS.map(couponToRow), { onConflict: "code" });
  if (couponError) throw new Error(`coupons: ${couponError.message}`);

  console.log(`Seeding ${REVIEWS.length} reviews...`);
  const { error: reviewError } = await supabase.from("reviews").insert(REVIEWS.map(reviewToRow));
  if (reviewError) throw new Error(`reviews: ${reviewError.message}`);

  console.log("Done. Your Supabase catalog now matches src/lib/product-data.ts / promo-data.ts.");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
