import { unstable_cache } from "next/cache";
import { gateway, generateText, Output } from "ai";
import z from "zod";

export const overviewSchema = z.object({
  overview: z
    .string()
    .describe(
      "Detailed product description and what makes it unique. Clear recommendation on who this product is best suited for and what makes it standout and what are the caveats of this product. Keep the overview concise and to the point.",
    ),
  specifications: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .describe(
      "Comprehensive list of key technical or product specifications, not limited to basic information. It should cover all the specifications of the product. No duplicates.",
    ),
});

export type Overview = z.infer<typeof overviewSchema>;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchOverviewUncached(productURL: string): Promise<Overview> {
  const content = await generateText({
    model: MODEL,
    prompt: `Provide a detailed overview, recommendation, and key specifications for the product at ${productURL}`,
    output: Output.object({ schema: overviewSchema }),
  });

  return content.output;
}

export const fetchOverview = unstable_cache(
  fetchOverviewUncached,
  ["overview"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "overview"],
  }
);
