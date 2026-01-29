import { ProductSection } from "@/components/product-section";
import { BasicInfo, BasicInfoSkeleton } from "@/features/basic-info";

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
      </div>
    </div>
  );
}
