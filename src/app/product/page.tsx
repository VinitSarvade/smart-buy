import { redirect } from "next/navigation";

import { validateProductURL } from "@/lib/product-url";
import { PageBackground, PageContainer } from "@/components/ui/layouts";

import { BackButton } from "./components/back-button";
import { ProductAnalysisClient } from "./product-analysis-client";

type PageProps = {
  searchParams: Promise<{ url?: string }>;
};

export default async function ProductPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const urlParam = params.url;

  if (!urlParam) {
    redirect("/?error=missing-url");
  }

  const validation = validateProductURL(urlParam);

  if (validation.isErr()) {
    const errorType = validation.error.type;
    redirect(`/?error=${errorType}`);
  }

  const validatedURL = validation.value;

  return (
    <PageBackground>
      <PageContainer className="space-y-12">
        <BackButton />
        <ProductAnalysisClient productURL={validatedURL} />
      </PageContainer>
    </PageBackground>
  );
}
