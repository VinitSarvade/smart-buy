import Firecrawl from "@mendable/firecrawl-js";
import { tool } from "ai";
import { tavily } from "@tavily/core";
import { err, ok, Result, ResultAsync } from "neverthrow";
import { match } from "ts-pattern";
import z from "zod";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });
const tavilyClient = tavily({ apiKey: process.env.TAVILY_API_KEY! });

type ScraperError =
  | { type: "firecrawl_failed"; message: string }
  | { type: "tavily_failed"; message: string }
  | { type: "empty_content"; service: "firecrawl" | "tavily" }
  | { type: "all_services_failed"; errors: string[] };

export const scraper = tool({
  title: "scraper",
  description: "Scrape a website with automatic fallback",
  inputSchema: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    const result = await scraperFunction(url);
    return result.match(
      (content) => content,
      (error) => {
        throw new Error(formatScraperError(error));
      },
    );
  },
});

const tryFirecrawl = (url: string): ResultAsync<string, ScraperError> => {
  return ResultAsync.fromPromise(
    (async () => {
      console.log(`[Scraper] Attempting Firecrawl for: ${url}`);
      const result = await firecrawl.scrape(url, {
        onlyMainContent: true,
        removeBase64Images: true,
        formats: ["markdown"],
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      if (!result.markdown || result.markdown.trim().length === 0) {
        return err<string, ScraperError>({
          type: "empty_content",
          service: "firecrawl",
        });
      }

      console.log(
        `[Scraper] ✓ Firecrawl success (${result.markdown.length} chars)`,
      );
      return ok(result.markdown);
    })(),
    (error) => ({
      type: "firecrawl_failed" as const,
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  ).andThen((innerResult) => innerResult);
};

const tryTavily = (url: string): ResultAsync<string, ScraperError> => {
  return ResultAsync.fromPromise(
    (async () => {
      console.log(`[Scraper] Attempting Tavily extract for: ${url}`);
      const result = await tavilyClient.extract([url]);

      if (!result.results || result.results.length === 0) {
        return err<string, ScraperError>({
          type: "empty_content",
          service: "tavily",
        });
      }

      const content = result.results[0]?.rawContent || "";

      if (content.trim().length === 0) {
        return err<string, ScraperError>({
          type: "empty_content",
          service: "tavily",
        });
      }

      console.log(`[Scraper] ✓ Tavily success (${content.length} chars)`);
      return ok(content);
    })(),
    (error) => ({
      type: "tavily_failed" as const,
      message: error instanceof Error ? error.message : "Unknown error",
    }),
  ).andThen((innerResult) => innerResult);
};

export const scraperFunction = async (
  url: string,
): Promise<Result<string, ScraperError>> => {
  const firecrawlResult = await tryFirecrawl(url);

  return firecrawlResult.match(
    (content) => ok(content),
    async (firecrawlError) => {
      console.log(
        `[Scraper] Firecrawl failed: ${formatScraperError(firecrawlError)}`,
      );
      console.log("[Scraper] Falling back to Tavily extract...");

      const tavilyResult = await tryTavily(url);

      return tavilyResult.match(
        (content) => ok(content),
        (tavilyError) => {
          console.error(
            `[Scraper] Tavily failed: ${formatScraperError(tavilyError)}`,
          );
          return err<string, ScraperError>({
            type: "all_services_failed",
            errors: [
              formatScraperError(firecrawlError),
              formatScraperError(tavilyError),
            ],
          });
        },
      );
    },
  );
};

function formatScraperError(error: ScraperError): string {
  return match(error)
    .with({ type: "firecrawl_failed" }, (e) => `Firecrawl error: ${e.message}`)
    .with({ type: "tavily_failed" }, (e) => `Tavily error: ${e.message}`)
    .with(
      { type: "empty_content" },
      (e) => `${e.service} returned empty content`,
    )
    .with(
      { type: "all_services_failed" },
      (e) => `All scraping services failed:\n- ${e.errors.join("\n- ")}`,
    )
    .exhaustive();
}
