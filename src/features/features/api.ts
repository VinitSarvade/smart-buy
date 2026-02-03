import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { CACHE_CONFIG } from "@/lib/cache-constants";
import { getScrapedContent } from "@/lib/scraper-cache";

export const featuresSchema = z.object({
  isProduct: z
    .boolean()
    .describe(
      "true ONLY if this page is selling a product with a REAL MONETARY PRICE (not Free). Must have someone paying money. false for: free software, open-source tools, icon sets, frameworks, documentation, homepages, listings",
    ),
  features: z
    .array(z.string())
    .describe(
      "List of all unique key features and capabilities. No duplicates.",
    ),
});

type FeaturesWithFlag = z.infer<typeof featuresSchema>;
export type Features = Omit<FeaturesWithFlag, "isProduct">;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchFeaturesUncached(productURL: string): Promise<Features> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: featuresSchema }),
    system: `You are a product feature extraction specialist focused on identifying the most important and distinctive capabilities.

Your task is to determine if a page contains a specific purchasable product and extract its key features.

CRITICAL: Set isProduct=true ONLY if someone PAYS MONEY for a specific product (has real price like $299, ₹15,999).
Set isProduct=false for: FREE software, open-source libraries, icon sets, frameworks, documentation, homepages, listings.

Guidelines when isProduct=true:
- Extract 5-6 key features that define this product and make it valuable to customers

Selection Criteria:
- Prioritize UNIQUE or STANDOUT features that differentiate this product
- Include major technical specifications that matter (e.g., "5000mAh battery", "M3 Pro chip")
- Focus on customer-facing benefits and capabilities
- Avoid generic marketing fluff - be specific and technical
- Each feature should be clear and self-contained
- Absolutely NO duplicates

Format Guidelines:
- Keep each feature concise (one clear phrase or short sentence)
- Be specific with numbers/specs when relevant
- Focus on the "what" not the "why"
- Order by importance/prominence

Example good features:
- "6.7-inch Super Retina XDR display with ProMotion 120Hz"
- "Triple 48MP camera system with 5x optical zoom"
- "All-day battery life with 65W fast charging"`,
    prompt: `Analyze this page and extract key product features:

URL: ${productURL}

Page Content:
${content}

First determine: Is this a product page with a specific purchasable product?
Then extract: the top 5-6 key features. Focus on technical capabilities, unique selling points, and specifications that matter to customers.`,
  });

  if (!result.output.isProduct) {
    throw new Error("No product found on this page");
  }

  const { isProduct, ...productFeatures } = result.output;
  return productFeatures;
}

export const fetchFeatures = (productURL: string) =>
  unstable_cache(
    fetchFeaturesUncached,
    [...CACHE_CONFIG.FEATURES.key, productURL],
    {
      ...CACHE_CONFIG.FEATURES,
      tags: [...CACHE_CONFIG.FEATURES.tags, `product-url:${productURL}`],
    },
  )(productURL);
