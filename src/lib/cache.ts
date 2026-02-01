"use server";

import { revalidateTag } from "next/cache";

export async function clearScrapedContentCache() {
  revalidateTag("scraped-content", "max");
}

export async function clearAllProductCache() {
  revalidateTag("product-info", "max");
  revalidateTag("scraped-content", "max");
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
