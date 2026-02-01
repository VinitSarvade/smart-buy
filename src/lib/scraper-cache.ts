"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { match } from "ts-pattern";
import { scraperFunction } from "@/lib/tools/scraper";

async function getScrapedContentCached(url: string): Promise<string> {
  console.log(`[ScraperCache] Cache miss for: ${url}`);
  const result = await scraperFunction(url);

  return result.match(
    (content) => {
      console.log(`[ScraperCache] Success: ${url} (${content.length} chars)`);
      return content;
    },
    (error) => {
      const errorMessage = match(error)
        .with({ type: "firecrawl_failed" }, (e) => `Firecrawl: ${e.message}`)
        .with({ type: "tavily_failed" }, (e) => `Tavily: ${e.message}`)
        .with({ type: "empty_content" }, (e) => `${e.service} empty`)
        .with({ type: "all_services_failed" }, (e) => e.errors.join("; "))
        .exhaustive();

      throw new Error(`Scraping failed for ${url}: ${errorMessage}`);
    }
  );
}

const getScrapedContentPersistent = unstable_cache(
  getScrapedContentCached,
  ["scraped-content"],
  {
    revalidate: 60 * 60 * 72,
    tags: ["scraped-content"],
  }
);

// Deduplicates parallel scraping requests for the same URL
export const getScrapedContent = cache(async (url: string): Promise<string> => {
  console.log(`[ScraperCache] Request for: ${url}`);
  return getScrapedContentPersistent(url);
});
