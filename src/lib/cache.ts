"use server";

import { revalidateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/cache-constants";

type FeatureType =
  | "basic-info"
  | "pros-cons"
  | "overview"
  | "features"
  | "reviews"
  | "similar-products";

export async function clearScrapedContentCache() {
  revalidateTag(CACHE_TAGS.SCRAPED_CONTENT[0], "max");
}

export async function clearAllProductCache() {
  revalidateTag(CACHE_TAGS.PRODUCT_INFO[0], "max");
  revalidateTag(CACHE_TAGS.SCRAPED_CONTENT[0], "max");
}

export async function clearProductCache(productURL: string) {
  revalidateTag(`product-url:${productURL}`, "max");
}

export async function clearFeatureCache(feature: FeatureType) {
  revalidateTag(feature, "max");
}
