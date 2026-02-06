import { gateway, generateText, Output } from "ai";
import z from "zod";
import { unstable_cache } from "next/cache";

import { CACHE_CONFIG } from "@/lib/cache-constants";
import { getScrapedContent } from "@/lib/scraper-cache";

export const reviewsSchema = z.object({
  isProduct: z
    .boolean()
    .describe(
      "true ONLY if this page is selling a product with a REAL MONETARY PRICE (not Free). Must have someone paying money. false for: free software, open-source tools, icon sets, frameworks, documentation, homepages, listings",
    ),
  sentiment: z
    .object({
      positive: z.number().describe("Percentage of positive reviews (0-100)"),
      neutral: z.number().describe("Percentage of neutral reviews (0-100)"),
      negative: z.number().describe("Percentage of negative reviews (0-100)"),
    })
    .transform((s) => {
      const sum = s.positive + s.neutral + s.negative;
      if (sum === 0) return { positive: 34, neutral: 33, negative: 33 };
      const scale = 100 / sum;
      return {
        positive: Math.round(s.positive * scale),
        neutral: Math.round(s.neutral * scale),
        negative: Math.round(s.negative * scale),
      };
    }),
  rating: z
    .number()
    .describe("Overall rating out of 5, based on review analysis"),
  totalReviews: z
    .string()
    .describe("Approximate number of reviews analyzed, e.g. '1,200+'"),
  verdict: z.string().describe("One-sentence overall verdict based on reviews"),
  highlights: z
    .array(z.string())
    .describe("Common praise themes from positive reviews"),
  concerns: z
    .array(z.string())
    .describe("Common complaint themes from negative reviews"),
});

type ReviewsWithFlag = z.infer<typeof reviewsSchema>;
export type Reviews = Omit<ReviewsWithFlag, "isProduct">;

const MODEL = gateway("google/gemini-2.0-flash");

async function fetchReviewsUncached(productURL: string): Promise<Reviews> {
  const content = await getScrapedContent(productURL);
  const result = await generateText({
    model: MODEL,
    output: Output.object({ schema: reviewsSchema }),
    system: `You are an expert product review analyst specializing in extracting and summarizing user reviews and ratings.

Your task is to determine if a page contains a specific purchasable product and analyze its reviews/ratings.

CRITICAL: Set isProduct=true ONLY if someone PAYS MONEY for a specific product (has real price like $299, $15,999).
Set isProduct=false for: FREE software, open-source libraries, icon sets, frameworks, documentation, homepages, listings.

IMPORTANT GUARDRAILS:
- NEVER fabricate reviews or ratings that don't exist on the page
- If review data is sparse, extrapolate conservatively from available signals (ratings, testimonials, product descriptions)
- Sentiment percentages must sum to 100
- Rating must be between 0 and 5
- Focus on genuine user feedback, not marketing copy

Guidelines when isProduct=true:

For SENTIMENT:
- Analyze the overall tone of reviews and ratings
- positive: percentage of reviews that are clearly favorable
- neutral: percentage of reviews that are mixed or moderate
- negative: percentage of reviews that express dissatisfaction
- Percentages must add up to 100

For RATING:
- If an explicit rating exists on the page, use it
- Otherwise, estimate based on review sentiment and content
- Scale of 0-5

For TOTAL REVIEWS:
- Use the actual count if displayed on the page
- Otherwise estimate based on visible reviews (e.g. "50+", "100+")

For VERDICT:
- One clear, balanced sentence summarizing the overall user sentiment
- Be honest and specific

For HIGHLIGHTS:
- Extract 3-5 common themes from positive reviews
- Be specific (e.g., "Battery lasts 2+ days on a single charge" not "good battery")

For CONCERNS:
- Extract 2-4 common themes from negative reviews
- Focus on recurring complaints, not one-off issues
- Be specific and factual`,
    prompt: `Analyze user reviews and ratings for this product:

URL: ${productURL}

Page Content:
${content}

Extract review sentiment, rating, common praise themes, and common concerns from the reviews and ratings on this page.`,
  });

  if (!result.output.isProduct) {
    throw new Error("No product found on this page");
  }

  const { isProduct, ...reviews } = result.output;
  return reviews;
}

export const fetchReviews = (productURL: string) =>
  unstable_cache(
    fetchReviewsUncached,
    [...CACHE_CONFIG.REVIEWS.key, productURL],
    {
      ...CACHE_CONFIG.REVIEWS,
      tags: [...CACHE_CONFIG.REVIEWS.tags, `product-url:${productURL}`],
    },
  )(productURL);
