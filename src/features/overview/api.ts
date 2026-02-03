import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { CACHE_CONFIG } from "@/lib/cache-constants";
import { getScrapedContent } from "@/lib/scraper-cache";

export const overviewSchema = z.object({
  isProduct: z
    .boolean()
    .describe(
      "true ONLY if this page is selling a product with a REAL MONETARY PRICE (not Free). Must have someone paying money. false for: free software, open-source tools, homepages, listings, documentation",
    ),
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

type OverviewWithFlag = z.infer<typeof overviewSchema>;
export type Overview = Omit<OverviewWithFlag, "isProduct">;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchOverviewUncached(productURL: string): Promise<Overview> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: overviewSchema }),
    system: `You are an expert product analyst specializing in comprehensive product evaluation and technical documentation.

Your task is to determine if this is an e-commerce product page, then create an overview.

CRITICAL: Set isProduct=true ONLY if someone PAYS MONEY for a specific product (has real price like $299, ₹15,999).
Set isProduct=false for: FREE software, open-source libraries, icon sets, frameworks, documentation, homepages, listings.

OVERVIEW Guidelines (write 4-6 sentences):
1. Opening: What is this product and its main purpose
2. Unique Value: What makes it stand out from competitors
3. Target Audience: Who should buy this (be specific - not just "everyone")
4. Key Strengths: 2-3 standout features or capabilities
5. Important Caveats: Any significant limitations or considerations
6. Keep it informative but concise - focus on decision-relevant information

SPECIFICATIONS Guidelines:
- Extract technical and product specifications ONLY (exclude basic info like name, price, brand, category)
- Focus on: Display, Performance, Camera, Battery, Connectivity, Physical specs, Materials, Colors, Warranty, etc.
- Be comprehensive but avoid duplicating information shown elsewhere
- Use exact values from the content (don't approximate)
- Format consistently (e.g., "6.1 inches" not "6.1 inch" or "6.1\"")
- NO duplicates - each spec should appear once with a unique label
- If a specification category isn't mentioned, don't invent it
- Skip generic info already covered in basic product details

Example specifications:
- Display: "6.7-inch Super Retina XDR OLED, 2796 x 1290 pixels, 120Hz ProMotion"
- Processor: "Apple A17 Pro chip with 6-core CPU"
- Storage: "256GB / 512GB / 1TB options"
- Weight: "221 grams"`,
    prompt: `Provide a comprehensive product overview and extract all technical specifications:

URL: ${productURL}

Page Content:
${content}

First determine if this is a product page. If yes, create a detailed 4-6 sentence overview covering what the product is, what makes it unique, who it's for, key strengths, and caveats. Then extract every available technical specification organized by category.`,
  });

  if (!result.output.isProduct) {
    throw new Error("No product found on this page");
  }

  const { isProduct, ...productInfo } = result.output;
  return productInfo;
}

export const fetchOverview = (productURL: string) =>
  unstable_cache(
    fetchOverviewUncached,
    [...CACHE_CONFIG.OVERVIEW.key, productURL],
    {
      ...CACHE_CONFIG.OVERVIEW,
      tags: [...CACHE_CONFIG.OVERVIEW.tags, `product-url:${productURL}`],
    },
  )(productURL);
