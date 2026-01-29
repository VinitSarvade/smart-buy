import { fetchBasicInfo } from "./api";
import { BasicInfoComponent } from "./component";

export { BasicInfoSkeleton } from "./skeleton";

interface BasicInfoProps {
  productURL: string;
}

export async function BasicInfo({ productURL }: BasicInfoProps) {
  const data = await fetchBasicInfo(productURL);
  return <BasicInfoComponent {...data} />;
}
