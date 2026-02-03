import { err, ok, Result } from "neverthrow";

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

  const createURL = (): URL => new URL(normalizedURL);

  const urlResult: Result<URL, ValidationError> = Result.fromThrowable(
    createURL,
    (): ValidationError => ({ type: "invalid_format" }),
  )();

  return urlResult.andThen((urlObj): Result<string, ValidationError> => {
    if (!urlObj.hostname || urlObj.hostname.startsWith(".") || !urlObj.hostname.includes(".")) {
      return err({ type: "invalid_domain" });
    }

    if (!["http:", "https:"].includes(urlObj.protocol)) {
      return err({ type: "invalid_protocol" });
    }

    const hostnameWithoutPort = urlObj.hostname.split(":")[0];
    const domainParts = hostnameWithoutPort.split(".");

    if (domainParts.some(part => !part || part.length === 0)) {
      return err({ type: "invalid_domain" });
    }

    return ok(normalizedURL);
  });
}

export function isValidProductURL(urlSegments: string[]): boolean {
  if (!urlSegments || urlSegments.length === 0) {
    return false;
  }

  const firstSegment = decodeURIComponent(urlSegments[0]).toLowerCase();

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

  return (
    firstSegment.startsWith("http") ||
    firstSegment.includes(".")
  );
}

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
