import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { CACHE_CONFIG } from "@/lib/cache-constants";
import { getScrapedContent } from "@/lib/scraper-cache";

export const basicInfoSchema = z.object({
  isProduct: z
    .boolean()
    .describe(
      "true ONLY if this page is selling a product with a REAL MONETARY PRICE (not 'Free', not 'Open Source'). Must be an e-commerce product page where someone pays money to buy something. Examples: laptop for $999, phone for ₹25,000, book for $19.99. false for: free software, open-source libraries, icon sets, documentation, homepages, listings, services, tools, APIs, frameworks",
    ),
  name: z.string().describe("Name of the product"),
  price: z
    .string()
    .describe("Price of the product with currency or currency symbol"),
  summary: z
    .string()
    .describe("A brief summary of the product (2-3 sentences)"),
  category: z.string().describe("Product category (e.g., Electronics, Home)"),
  brand: z.string().optional().describe("Brand name if available"),
});

type BasicInfoWithFlag = z.infer<typeof basicInfoSchema>;
export type BasicInfo = Omit<BasicInfoWithFlag, "isProduct">;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchBasicInfoUncached(productURL: string): Promise<BasicInfo> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: basicInfoSchema }),
    system: `You are an expert product information analyzer specializing in e-commerce product data extraction.

Your task is to determine if a page is selling a product for money and extract its information.

CRITICAL: Is this a PRODUCT DETAIL PAGE (like Amazon/Flipkart product page) where you can buy ONE specific item?
- Set isProduct=true ONLY if ALL of these are true:
  * This is a DEDICATED product detail page (not homepage, not listing, not about page)
  * Shows ONE specific purchasable item (laptop model X, phone model Y)
  * Has a clear NUMERIC MONETARY PRICE visible (like $299, ₹15,999, €49.99) - NOT "Free", NOT "Try Free"
  * Has "Add to Cart", "Buy Now", or similar purchase button
  * Example VALID pages: Amazon laptop page, Flipkart phone page, online store product page

- Set isProduct=false for:
  * Homepages (even if they mention products)
  * Company/service pages (GitHub, React, Tailwind)
  * Free software/libraries/tools (price: Free, Open Source)
  * Category/listing pages showing multiple products
  * Documentation, blogs, tutorials
  * ANY page without clear "buy this specific item now" functionality

Guidelines when isProduct=true:
- Extract the exact product name as it appears on the page (official product title)
- Include the current price WITH currency symbol (e.g., "$299", "₹24,999", "€149.99")
- Write a concise 2-3 sentence summary highlighting the product's main purpose and key value proposition
- Identify the correct product category (e.g., "Smartphones", "Laptops", "Kitchen Appliances")
- Extract the brand name if clearly visible
- Be precise and factual - don't add information that isn't in the content
- If brand isn't found, omit it`,
    prompt: `Analyze this page:

URL: ${productURL}

Page Content:
${content}

FIRST: Determine isProduct - Is this a PRODUCT DETAIL PAGE (like Amazon/Flipkart) where you can buy ONE specific item with "Add to Cart"?
- If YES (has specific item, numeric price, buy button): set isProduct=true and extract details
- If NO (homepage, listing, free tool, documentation, company page): set isProduct=false (ignore other fields)

Then IF isProduct=true, extract: product name, current price with currency, brief summary, category, and brand (if available).`,
  });

  if (!result.output.isProduct) {
    throw new Error("No product found on this page");
  }

  const { isProduct, ...productInfo } = result.output;
  return productInfo;
}

export const fetchBasicInfo = unstable_cache(
  fetchBasicInfoUncached,
  CACHE_CONFIG.BASIC_INFO.key,
  CACHE_CONFIG.BASIC_INFO,
);
