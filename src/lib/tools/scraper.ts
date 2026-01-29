import Firecrawl from "@mendable/firecrawl-js";
import { tool } from "ai";
import z from "zod";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

export const scraper = tool({
  title: "scraper",
  description: "Scrape a website",
  inputSchema: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    return scraperFunction(url);
  },
});

export const scraperFunction = async (url: string) => {
  const result = await firecrawl.scrape(url, {
    onlyMainContent: true,
    removeBase64Images: true,
    formats: ["markdown"],
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return result.markdown;
};
