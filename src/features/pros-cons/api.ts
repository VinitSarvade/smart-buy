import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { CACHE_CONFIG } from "@/lib/cache-constants";
import { getScrapedContent } from "@/lib/scraper-cache";

export const prosConsSchema = z.object({
  isProduct: z
    .boolean()
    .describe(
      "true ONLY if this page is selling a product with a REAL MONETARY PRICE (not Free). Must have someone paying money. false for: free software, open-source tools, icon sets, frameworks, documentation, homepages, listings",
    ),
  pros: z.array(z.string()).describe("Positive aspects and advantages"),
  cons: z.array(z.string()).describe("Negative aspects and limitations"),
});

type ProsConsWithFlag = z.infer<typeof prosConsSchema>;
export type ProsCons = Omit<ProsConsWithFlag, "isProduct">;

const MODEL = gateway("google/gemini-2.0-flash");

function validateProsCons(prosCons: ProsConsWithFlag): ProsConsWithFlag {
  // Simple validation - just check for basic quality
  if (prosCons.cons.length === 0) {
    throw new Error("Unable to generate meaningful product drawbacks");
  }

  // Check if cons are too short or generic (basic quality check)
  const validCons = prosCons.cons.filter(
    (con) =>
      con.trim().length > 10 &&
      !con.toLowerCase().includes("something went wrong") &&
      !con.toLowerCase().includes("error") &&
      !con.toLowerCase().includes("unable to access"),
  );

  if (validCons.length === 0) {
    throw new Error(
      "Insufficient product information available for proper analysis",
    );
  }

  return {
    ...prosCons,
    cons: validCons,
  };
}

async function fetchProsConsUncached(productURL: string): Promise<ProsCons> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: prosConsSchema }),
    system: `You are an expert product analyst specializing in balanced, objective product evaluation.

Your task is to determine if a page contains a specific purchasable product and identify its advantages and limitations.

CRITICAL: Set isProduct=true ONLY if someone PAYS MONEY for a specific product (has real price like $299, ₹15,999).
Set isProduct=false for: FREE software, open-source libraries, icon sets, frameworks, documentation, homepages, listings.

IMPORTANT GUARDRAILS for CONS:
- NEVER mention system errors, page errors, or technical issues
- NEVER mention lack of information or missing details
- NEVER mention presentation limitations (online viewing, colors, etc.)
- NEVER use subjective preferences (may not suit everyone, could be better)
- NEVER mention generic material types unless specifically discussing quality/durability
- Focus ONLY on actual product limitations, missing features, performance issues, or quality concerns

Guidelines when isProduct=true:
- Identify genuine advantages (pros) and limitations (cons) based on the product information provided

Guidelines for PROS:
- Focus on genuine strengths and advantages
- Consider: innovative features, build quality, performance, value for money, user experience
- Include customer satisfaction points and standout features
- Be specific (e.g., "120Hz AMOLED display" not just "good display")
- Aim for 4-6 well-articulated pros

Guidelines for CONS:
- Identify REAL product limitations and drawbacks only
- Consider: missing features, price concerns, durability issues, compatibility limitations
- Include common complaints or weak points about the actual product
- Be honest but fair - focus on significant concerns that affect product performance
- If you cannot identify at least 2 genuine product limitations, set isProduct=false
- Aim for 2-4 meaningful cons (quality over quantity)

Keep points concise (one clear sentence each) and factual based on the content.`,
    prompt: `Analyze this page and provide a balanced product evaluation:

URL: ${productURL}

Page Content:
${content}

First determine: Is this a product page with a specific purchasable product?
Then identify: 4-6 key advantages (pros) and 3-5 significant limitations (cons) based on the product information, features, specifications, and any reviews/ratings present.`,
  });

  if (!result.output.isProduct) {
    throw new Error("No product found on this page");
  }

  // Validate and filter the results
  const validatedResult = validateProsCons(result.output);

  const { isProduct, ...productProsCons } = validatedResult;
  return productProsCons;
}

export const fetchProsCons = (productURL: string) =>
  unstable_cache(
    fetchProsConsUncached,
    [...CACHE_CONFIG.PROS_CONS.key, productURL],
    {
      ...CACHE_CONFIG.PROS_CONS,
      tags: [...CACHE_CONFIG.PROS_CONS.tags, `product-url:${productURL}`],
    },
  )(productURL);
