import { redirect } from "next/navigation";

import { ProductSection } from "@/components/product-section";
import { BasicInfo, BasicInfoSkeleton } from "@/features/basic-info";
import { Features, FeaturesSkeleton } from "@/features/features";
import {
  Overview,
  OverviewSkeleton,
  Specifications,
} from "@/features/overview";
import { ProsCons, ProsConsSkeleton } from "@/features/pros-cons";
import { validateProductURL } from "@/lib/product-url";

type SearchParams = Promise<
  string | string[][] | Record<string, string> | undefined
>;

type PageProps = {
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";

export default async function ProductPage({ searchParams }: PageProps) {
  const search = await searchParams;

  const urlParam =
    typeof search === "object" && !Array.isArray(search)
      ? (search as Record<string, string>).url
      : undefined;

  if (!urlParam) {
    redirect("/");
  }

  const validation = validateProductURL(urlParam);

  const productURL = validation.match(
    (validURL) => validURL,
    () => redirect("/"),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12 relative">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
          >
            ← Back to search
          </a>
        </div>

        {/* Basic Info */}
        <ProductSection fallback={<BasicInfoSkeleton />}>
          <BasicInfo productURL={productURL} />
        </ProductSection>

        {/* Product Details */}
        <ProductSection
          fallback={
            <div className="space-y-8">
              <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2">
                  <OverviewSkeleton />
                </div>
                <hr className="border-t border-border md:hidden" />
                <div>
                  <FeaturesSkeleton />
                </div>
              </div>
              <hr className="border-t border-border" />
              <ProsConsSkeleton />
            </div>
          }
        >
          <div className="space-y-8">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <Overview productURL={productURL} />
              </div>
              <hr className="border-t border-border md:hidden" />
              <div>
                <Features productURL={productURL} />
              </div>
            </div>
            <Specifications productURL={productURL} />
            <hr className="border-t border-border" />
            <ProsCons productURL={productURL} />
          </div>
        </ProductSection>
      </div>
    </div>
  );
}
