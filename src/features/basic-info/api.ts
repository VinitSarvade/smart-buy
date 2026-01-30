import { gateway, generateText, Output } from "ai";
import { match } from "ts-pattern";
import z from "zod";
import { unstable_cache } from "next/cache";

import { scraperFunction } from "@/lib/tools/scraper";

export const basicInfoSchema = z.object({
  name: z.string().describe("Name of the product"),
  price: z
    .string()
    .describe("Price of the product with currency or currency symbol"),
  summary: z
    .string()
    .describe("A brief summary of the product (2-3 sentences)"),
  category: z.string().describe("Product category (e.g., Electronics, Home)"),
  brand: z.string().optional().describe("Brand name if available"),
  imageUrl: z
    .string()
    .optional()
    .describe("Main product image URL if available"),
});

export type BasicInfo = z.infer<typeof basicInfoSchema>;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchBasicInfoUncached(productURL: string): Promise<BasicInfo> {
  const scraperResult = await scraperFunction(productURL);

  const content = scraperResult.match(
    (data) => data,
    (error) => {
      const errorMessage = match(error)
        .with({ type: "firecrawl_failed" }, (e) =>
          `Firecrawl failed: ${e.message}`)
        .with({ type: "tavily_failed" }, (e) =>
          `Tavily failed: ${e.message}`)
        .with({ type: "empty_content" }, (e) =>
          `${e.service} returned no content`)
        .with({ type: "all_services_failed" }, (e) =>
          `All services failed: ${e.errors.join("; ")}`)
        .exhaustive();

      throw new Error(`Failed to scrape ${productURL}: ${errorMessage}`);
    },
  );
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: basicInfoSchema }),
    system: `You are an expert product information analyzer specializing in e-commerce product data extraction.

Your task is to extract accurate, structured product information from web content.

Guidelines:
- Extract the exact product name as it appears on the page (official product title)
- Include the current price WITH currency symbol (e.g., "$299", "₹24,999", "€149.99")
- Write a concise 2-3 sentence summary highlighting the product's main purpose and key value proposition
- Identify the correct product category (e.g., "Smartphones", "Laptops", "Kitchen Appliances")
- Extract the brand name if clearly visible
- Find the primary/hero product image URL if available
- Be precise and factual - don't add information that isn't in the content
- If optional fields (brand, imageUrl) aren't found, omit them`,
    prompt: `Analyze this product page and extract basic information:

URL: ${productURL}

Page Content:
${content}

Extract: product name, current price with currency, brief summary, category, brand (if available), and main image URL (if available).`,
  });

  return result.output;
}

export const fetchBasicInfo = unstable_cache(
  fetchBasicInfoUncached,
  ["basic-info"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "basic-info"],
  },
);
