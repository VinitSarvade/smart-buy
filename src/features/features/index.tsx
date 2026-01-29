import { fetchFeatures } from "./api";
import { FeaturesComponent } from "./component";

export { FeaturesSkeleton } from "./skeleton";

interface FeaturesProps {
  productURL: string;
}

export async function Features({ productURL }: FeaturesProps) {
  const data = await fetchFeatures(productURL);
  return <FeaturesComponent {...data} />;
}
