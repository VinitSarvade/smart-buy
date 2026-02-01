import { unstable_cache } from "next/cache";
import { gateway, generateText, Output } from "ai";
import z from "zod";

import { getScrapedContent } from "@/lib/scraper-cache";

export const prosConsSchema = z.object({
  pros: z.array(z.string()).describe("Positive aspects and advantages"),
  cons: z.array(z.string()).describe("Negative aspects and limitations"),
});

export type ProsCons = z.infer<typeof prosConsSchema>;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchProsConsUncached(productURL: string): Promise<ProsCons> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: prosConsSchema }),
    system: `You are an expert product analyst specializing in balanced, objective product evaluation.

Your task is to identify genuine advantages (pros) and limitations (cons) based on the product information provided.

Guidelines for PROS:
- Focus on genuine strengths and advantages
- Consider: innovative features, build quality, performance, value for money, user experience
- Include customer satisfaction points and standout features
- Be specific (e.g., "120Hz AMOLED display" not just "good display")
- Aim for 4-6 well-articulated pros

Guidelines for CONS:
- Identify real limitations and drawbacks
- Consider: missing features, price concerns, durability issues, compatibility limitations
- Include common complaints or weak points
- Be honest but fair - focus on significant concerns
- Aim for 3-5 genuine cons

Keep points concise (one clear sentence each) and factual based on the content.`,
    prompt: `Analyze this product and provide a balanced list of pros and cons:

URL: ${productURL}

Page Content:
${content}

Identify 4-6 key advantages (pros) and 3-5 significant limitations (cons) based on the product information, features, specifications, and any reviews/ratings present.`,
  });

  return result.output;
}

export const fetchProsCons = unstable_cache(
  fetchProsConsUncached,
  ["pros-cons"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "pros-cons"],
  }
);
