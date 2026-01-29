"use server";

import { revalidateTag } from "next/cache";

/**
 * Clear all product information caches
 */
export async function clearAllProductCache() {
  revalidateTag("product-info", "max");
}

/**
 * Clear cache for a specific feature
 */
export async function clearFeatureCache(
  feature:
    | "basic-info"
    | "pros-cons"
    | "overview"
    | "features"
    | "reviews"
    | "similar-products",
) {
  revalidateTag(feature, "max");
}
