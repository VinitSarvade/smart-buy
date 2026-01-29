import { fetchProsCons } from "./api";
import { ProsConsComponent } from "./component";

export { ProsConsSkeleton } from "./skeleton";

interface ProsConsProps {
  productURL: string;
}

export async function ProsCons({ productURL }: ProsConsProps) {
  const data = await fetchProsCons(productURL);
  return <ProsConsComponent {...data} />;
}
