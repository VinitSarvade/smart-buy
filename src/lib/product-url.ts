/**
 * Helper functions for handling product URLs in routes
 *
 * Usage: Users can access products by prepending your domain to any product URL
 * Example: https://yourdomain.com/https://www.flipkart.com/product
 */

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
  searchParams?: Record<string, string> | URLSearchParams
): string {
  if (!urlSegments || urlSegments.length === 0) {
    throw new Error("No URL segments provided");
  }

  // Decode each segment (handles %3A -> :, etc.)
  const decodedSegments = urlSegments.map((segment) =>
    decodeURIComponent(segment)
  );

  // Join segments back together
  let productURL = decodedSegments.join("/");

  // Fix collapsed protocol: https:/ -> https:// or http:/ -> http://
  if (productURL.startsWith("https:/") && !productURL.startsWith("https://")) {
    productURL = productURL.replace("https:/", "https://");
  } else if (
    productURL.startsWith("http:/") &&
    !productURL.startsWith("http://")
  ) {
    productURL = productURL.replace("http:/", "http://");
  } else if (!productURL.startsWith("http")) {
    // If no protocol, assume https
    productURL = "https://" + productURL;
  }

  // Add search params if provided
  if (searchParams) {
    const searchString = new URLSearchParams(searchParams).toString();
    if (searchString) {
      productURL += "?" + searchString;
    }
  }

  return productURL;
}
