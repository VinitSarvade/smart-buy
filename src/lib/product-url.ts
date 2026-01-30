import { err, ok, Result } from "neverthrow";

/**
 * Helper functions for handling product URLs in routes
 *
 * Usage: Users can access products by prepending your domain to any product URL
 * Example: https://yourdomain.com/https://www.flipkart.com/product
 */

type ValidationError =
  | { type: "missing_url" }
  | { type: "relative_url" }
  | { type: "system_path" }
  | { type: "invalid_domain" }
  | { type: "invalid_protocol" }
  | { type: "invalid_format" };

export function validateProductURL(
  url: string,
): Result<string, ValidationError> {
  if (!url || typeof url !== "string") {
    return err({ type: "missing_url" });
  }

  const trimmedURL = url.trim();

  if (trimmedURL.startsWith("/") || trimmedURL.startsWith(".")) {
    return err({ type: "relative_url" });
  }

  const systemPaths = [
    ".well-known",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "apple-touch-icon",
    "manifest.json",
    "_next",
    "api",
  ];

  const lowerURL = trimmedURL.toLowerCase();
  if (systemPaths.some((path) => lowerURL.startsWith(path))) {
    return err({ type: "system_path" });
  }

  let normalizedURL = trimmedURL;

  if (!trimmedURL.startsWith("http://") && !trimmedURL.startsWith("https://")) {
    normalizedURL = "https://" + trimmedURL;
  }

  if (normalizedURL.startsWith("https:/") && !normalizedURL.startsWith("https://")) {
    normalizedURL = normalizedURL.replace("https:/", "https://");
  } else if (normalizedURL.startsWith("http:/") && !normalizedURL.startsWith("http://")) {
    normalizedURL = normalizedURL.replace("http:/", "http://");
  }

  const urlResult = Result.fromThrowable(
    () => new URL(normalizedURL),
    () => ({ type: "invalid_format" as const }),
  )();

  return urlResult.andThen((urlObj) => {
    if (!urlObj.hostname.includes(".")) {
      return err({ type: "invalid_domain" });
    }

    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return err({ type: "invalid_protocol" });
    }

    return ok(normalizedURL);
  });
}

/**
 * Checks if the URL segments represent a valid product URL
 * Filters out browser/system requests like .well-known, favicon, etc.
 */
export function isValidProductURL(urlSegments: string[]): boolean {
  if (!urlSegments || urlSegments.length === 0) {
    return false;
  }

  const firstSegment = decodeURIComponent(urlSegments[0]).toLowerCase();

  // Filter out system/browser paths
  const systemPaths = [
    ".well-known",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "apple-touch-icon",
    "manifest.json",
    "_next",
    "api",
  ];

  if (systemPaths.some((path) => firstSegment.startsWith(path))) {
    return false;
  }

  // Valid product URLs should start with http: or https: (possibly encoded)
  // or be a domain name
  return (
    firstSegment.startsWith("http") ||
    firstSegment.includes(".") // looks like a domain
  );
}

/**
 * Parses a product URL from route params (catch-all route)
 * Handles the issue where Next.js collapses https:// into https:/
 *
 * @param urlSegments - The URL segments from Next.js params (e.g., ['https:', 'www.flipkart.com', 'product'])
 * @param searchParams - The search params from Next.js
 * @returns The reconstructed product URL with proper protocol
 */
export function parseProductURL(
  urlSegments: string[],
  searchParams?: Record<string, string> | URLSearchParams,
): Result<string, { type: "no_segments" }> {
  if (!urlSegments || urlSegments.length === 0) {
    return err({ type: "no_segments" });
  }

  const decodedSegments = urlSegments.map((segment) =>
    decodeURIComponent(segment),
  );

  let productURL = decodedSegments.join("/");

  if (productURL.startsWith("https:/") && !productURL.startsWith("https://")) {
    productURL = productURL.replace("https:/", "https://");
  } else if (
    productURL.startsWith("http:/") &&
    !productURL.startsWith("http://")
  ) {
    productURL = productURL.replace("http:/", "http://");
  } else if (!productURL.startsWith("http")) {
    productURL = "https://" + productURL;
  }

  if (searchParams) {
    const searchString = new URLSearchParams(searchParams).toString();
    if (searchString) {
      productURL += "?" + searchString;
    }
  }

  return ok(productURL);
}
