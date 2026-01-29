import { ProductSection } from "@/components/product-section";
import { BasicInfo, BasicInfoSkeleton } from "@/features/basic-info";
import { Features, FeaturesSkeleton } from "@/features/features";
import { Overview, OverviewSkeleton } from "@/features/overview";

type SearchParams = Promise<
  string | string[][] | Record<string, string> | undefined
>;
type Params = Promise<{
  url: string[];
}>;

type PageProps = {
  params: Params;
  searchParams: SearchParams;
};

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }: PageProps) {
  const { url } = await params;
  const search = new URLSearchParams(await searchParams);

  const productURL = url.join("/") + "?" + search.toString();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 space-y-12 relative">
        {/* Basic Info */}
        <ProductSection fallback={<BasicInfoSkeleton />}>
          <BasicInfo productURL={productURL} />
        </ProductSection>

        {/* Product Details */}
        <ProductSection
          fallback={
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <OverviewSkeleton />
              </div>
              <hr className="border-t border-border md:hidden" />
              <div>
                <FeaturesSkeleton />
              </div>
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
          </div>
        </ProductSection>
      </div>
    </div>
  );
}
