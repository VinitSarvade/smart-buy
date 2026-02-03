import { err, ok, Result } from "neverthrow";

type ProductURLError =
  | { type: "not_ecommerce"; domain: string }
  | { type: "not_product_page"; reason: string }
  | { type: "invalid_url" };

const ECOMMERCE_DOMAINS = [
  // Amazon
  "amazon.com",
  "amazon.in",
  "amazon.co.uk",
  "amazon.ca",
  "amazon.de",
  "amazon.fr",
  "amazon.it",
  "amazon.es",
  "amazon.co.jp",
  "amazon.com.au",
  "amazon.com.mx",
  "amazon.com.br",

  // Flipkart
  "flipkart.com",

  // Other major e-commerce
  "myntra.com",
  "ajio.com",
  "snapdeal.com",
  "shopclues.com",
  "tatacliq.com",
  "nykaa.com",

  // Electronics
  "croma.com",
  "reliancedigital.in",
  "vijaysales.com",

  // International
  "ebay.com",
  "ebay.in",
  "walmart.com",
  "target.com",
  "bestbuy.com",
  "newegg.com",
  "aliexpress.com",
  "alibaba.com",
  "etsy.com",
];

const PRODUCT_URL_PATTERNS = [
  // Amazon product patterns
  /\/dp\/[A-Z0-9]{10}/i,           // /dp/B08N5WRWNW
  /\/gp\/product\/[A-Z0-9]{10}/i,  // /gp/product/B08N5WRWNW
  /\/product\/[A-Z0-9]+/i,         // /product/ABC123

  // Flipkart patterns
  /\/p\/itm[a-z0-9]+/i,            // /p/itm672bf7685863c
  /\?pid=[A-Z0-9]+/i,              // ?pid=MOBGTAGPAQNVFZZY

  // Generic product patterns
  /\/products?\/[^/]+/i,           // /product/item-name or /products/item-name
  /\/item\/[^/]+/i,                // /item/item-name
  /\/buy\/[^/]+/i,                 // /buy/item-name
  /\/pd\/[^/]+/i,                  // /pd/item-name (product detail)
];

function isEcommerceDomain(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase().replace(/^www\./, "");

  return ECOMMERCE_DOMAINS.some((domain) => {
    return normalizedHost === domain || normalizedHost.endsWith(`.${domain}`);
  });
}

function hasProductPattern(url: string): boolean {
  return PRODUCT_URL_PATTERNS.some((pattern) => pattern.test(url));
}

export function isProductURL(url: string): Result<true, ProductURLError> {
  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch {
    return err({ type: "invalid_url" });
  }

  const hostname = urlObj.hostname;
  const fullURL = urlObj.href;

  // Check if it's an e-commerce domain
  if (!isEcommerceDomain(hostname)) {
    return err({
      type: "not_ecommerce",
      domain: hostname,
    });
  }

  // Check if URL has product patterns
  if (!hasProductPattern(fullURL)) {
    return err({
      type: "not_product_page",
      reason: "URL doesn't match known product page patterns",
    });
  }

  return ok(true);
}

export function getProductURLErrorMessage(error: ProductURLError): string {
  switch (error.type) {
    case "not_ecommerce":
      return "Couldn't find a product at this URL. Please provide a direct link to a product from an online retailer.";
    case "not_product_page":
      return "Couldn't find a product at this URL. Please provide a direct link to a product page, not a homepage or category page.";
    case "invalid_url":
      return "Invalid URL format";
  }
}
