import { twx } from "@/lib/twx";

export const SkeletonBox = twx.div`
  bg-gray-200 dark:bg-gray-800 rounded-full
`;

export const SkeletonContainer = twx.div`
  animate-pulse space-y-6
`;
