import { fetchOverview } from "./api";
import { OverviewComponent, SpecificationsComponent } from "./component";

export { OverviewSkeleton } from "./skeleton";

interface OverviewProps {
  productURL: string;
}

export async function Overview({ productURL }: OverviewProps) {
  const data = await fetchOverview(productURL);
  return <OverviewComponent overview={data.overview} />;
}

export async function Specifications({ productURL }: OverviewProps) {
  const data = await fetchOverview(productURL);
  return <SpecificationsComponent specifications={data.specifications} />;
}
