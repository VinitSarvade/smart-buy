export const CACHE_KEYS = {
  SCRAPED_CONTENT: ["scraped-content"],
  BASIC_INFO: ["basic-info"],
  OVERVIEW: ["overview"],
  FEATURES: ["features"],
  PROS_CONS: ["pros-cons"],
  REVIEWS: ["reviews"],
  PRODUCT_INFO: ["product-info"],
} as const;

export const CACHE_TAGS = {
  SCRAPED_CONTENT: ["scraped-content"],
  BASIC_INFO: ["product-info", "basic-info"],
  OVERVIEW: ["product-info", "overview"],
  FEATURES: ["product-info", "features"],
  PROS_CONS: ["product-info", "pros-cons"],
  REVIEWS: ["product-info", "reviews"],
  PRODUCT_INFO: ["product-info"],
} as const;

export const CACHE_DURATIONS = {
  SCRAPED_CONTENT: 60 * 60 * 72, // 72 hours
  PRODUCT_INFO: 60 * 60, // 1 hour
  LONG_TERM: 60 * 60 * 24 * 7, // 1 week
} as const;

export const CACHE_CONFIG = {
  SCRAPED_CONTENT: {
    key: ["scraped-content"] as string[],
    revalidate: CACHE_DURATIONS.SCRAPED_CONTENT,
    tags: ["scraped-content"] as string[],
  },
  BASIC_INFO: {
    key: ["basic-info"] as string[],
    revalidate: CACHE_DURATIONS.PRODUCT_INFO,
    tags: ["product-info", "basic-info"] as string[],
  },
  OVERVIEW: {
    key: ["overview"] as string[],
    revalidate: CACHE_DURATIONS.PRODUCT_INFO,
    tags: ["product-info", "overview"] as string[],
  },
  FEATURES: {
    key: ["features"] as string[],
    revalidate: CACHE_DURATIONS.PRODUCT_INFO,
    tags: ["product-info", "features"] as string[],
  },
  PROS_CONS: {
    key: ["pros-cons"] as string[],
    revalidate: CACHE_DURATIONS.PRODUCT_INFO,
    tags: ["product-info", "pros-cons"] as string[],
  },
  REVIEWS: {
    key: ["reviews"] as string[],
    revalidate: CACHE_DURATIONS.PRODUCT_INFO,
    tags: ["product-info", "reviews"] as string[],
  },
};

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS][number];
export type CacheDuration =
  (typeof CACHE_DURATIONS)[keyof typeof CACHE_DURATIONS];
