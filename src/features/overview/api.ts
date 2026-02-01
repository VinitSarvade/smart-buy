import { unstable_cache } from "next/cache";
import { gateway, generateText, Output } from "ai";
import z from "zod";

import { getScrapedContent } from "@/lib/scraper-cache";

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
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: overviewSchema }),
    system: `You are an expert product analyst specializing in comprehensive product evaluation and technical documentation.

Your task is to create a detailed product overview and extract complete technical specifications.

OVERVIEW Guidelines (write 4-6 sentences):
1. Opening: What is this product and its main purpose
2. Unique Value: What makes it stand out from competitors
3. Target Audience: Who should buy this (be specific - not just "everyone")
4. Key Strengths: 2-3 standout features or capabilities
5. Important Caveats: Any significant limitations or considerations
6. Keep it informative but concise - focus on decision-relevant information

SPECIFICATIONS Guidelines:
- Extract ALL technical and product specifications available
- Organize by category: Display, Performance, Camera, Battery, Connectivity, Physical, etc.
- Be comprehensive - include dimensions, weight, materials, colors, warranty, etc.
- Use exact values from the content (don't approximate)
- Format consistently (e.g., "6.1 inches" not "6.1 inch" or "6.1\"")
- NO duplicates - each spec should appear once
- If a specification category isn't mentioned, don't invent it

Example specifications:
- Display: "6.7-inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz ProMotion"
- Processor: "Apple A17 Pro chip with 6-core CPU"
- Storage: "256GB / 512GB / 1TB options"
- Weight: "221 grams"`,
    prompt: `Provide a comprehensive product overview and extract all technical specifications:

URL: ${productURL}

Page Content:
${content}

Create a detailed 4-6 sentence overview covering what the product is, what makes it unique, who it's for, key strengths, and caveats. Then extract every available technical specification organized by category.`,
  });

  return result.output;
}

export const fetchOverview = unstable_cache(
  fetchOverviewUncached,
  ["overview"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "overview"],
  }
);
