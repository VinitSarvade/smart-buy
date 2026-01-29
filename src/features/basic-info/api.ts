import { gateway, generateText, Output } from "ai";
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
  const content = await scraperFunction(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: basicInfoSchema }),
    prompt: `Product URL: ${productURL}\n\n${content}`,
    system: `You are a product information analyzer. You are given a product URL and you need to analyze the product and provide basic information about it. The prompt will include the product URL and the website content.`,
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
