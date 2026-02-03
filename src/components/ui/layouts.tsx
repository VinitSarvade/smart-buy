import { twx } from "@/lib/twx";

export const PageBackground = twx.div`
  min-h-screen bg-linear-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30
  dark:from-gray-950 dark:via-gray-900 dark:to-gray-950
`;

export const PageContainer = twx.div`
  max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16
`;
