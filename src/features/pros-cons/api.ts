import { unstable_cache } from "next/cache";
import { gateway, generateText, Output } from "ai";
import z from "zod";

export const prosConsSchema = z.object({
  pros: z.array(z.string()).describe("Positive aspects and advantages"),
  cons: z.array(z.string()).describe("Negative aspects and limitations"),
});

export type ProsCons = z.infer<typeof prosConsSchema>;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchProsConsUncached(productURL: string): Promise<ProsCons> {
  const content = await generateText({
    model: MODEL,
    prompt: `Analyze the pros and cons of the product at ${productURL}`,
    output: Output.object({ schema: prosConsSchema }),
  });

  return content.output;
}

export const fetchProsCons = unstable_cache(
  fetchProsConsUncached,
  ["pros-cons"],
  {
    revalidate: 60 * 60 * 72, // Cache for 72 hours
    tags: ["product-info", "pros-cons"],
  }
);
