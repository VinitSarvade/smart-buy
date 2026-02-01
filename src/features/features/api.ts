import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { getScrapedContent } from "@/lib/scraper-cache";

export const featuresSchema = z.object({
  features: z
    .array(z.string())
    .describe(
      "List of all unique key features and capabilities. No duplicates.",
    ),
});

export type Features = z.infer<typeof featuresSchema>;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchFeaturesUncached(productURL: string): Promise<Features> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: featuresSchema }),
    system: `You are a product feature extraction specialist focused on identifying the most important and distinctive capabilities.

Your task is to extract 5-6 key features that define this product and make it valuable to customers.

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
    prompt: `Extract the top 5-6 key features from this product:

URL: ${productURL}

Page Content:
${content}

Identify the most important, distinctive features that define this product. Focus on technical capabilities, unique selling points, and specifications that matter to customers.`,
  });

  return result.output;
}

export const fetchFeatures = unstable_cache(
  fetchFeaturesUncached,
  ["features"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "features"],
  },
);
