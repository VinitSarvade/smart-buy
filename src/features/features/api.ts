import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

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
  const content = await generateText({
    model: MODEL,
    prompt: `List the key features and capabilities of the product at ${productURL}`,
    output: Output.object({ schema: featuresSchema }),
  });

  return content.output;
}

export const fetchFeatures = unstable_cache(
  fetchFeaturesUncached,
  ["features"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "features"],
  },
);
