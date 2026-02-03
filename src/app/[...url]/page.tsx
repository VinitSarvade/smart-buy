import { redirect } from "next/navigation";

import { parseProductURL, validateProductURL } from "@/lib/product-url";

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

export default async function URLPage({ params, searchParams }: PageProps) {
  const { url } = await params;
  const search = await searchParams;

  const searchParamsRecord =
    typeof search === "object" && !Array.isArray(search)
      ? (search as Record<string, string>)
      : undefined;

  const result = parseProductURL(url, searchParamsRecord).andThen(
    (productURL) => validateProductURL(productURL),
  );

  result.match(
    (validURL) => {
      const encodedURL = encodeURIComponent(validURL);
      redirect(`/product?url=${encodedURL}`);
    },
    () => {
      redirect("/");
    },
  );
}
