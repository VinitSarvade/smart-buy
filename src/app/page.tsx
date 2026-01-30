import { ProductURLForm } from "@/components/product-url-form";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 via-violet-50/30 to-fuchsia-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <main className="w-full max-w-2xl px-6 py-12">
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Smart Product Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Enter any product URL to get detailed information, features, pros
              & cons
            </p>
          </div>

          <ProductURLForm />

          <div className="pt-8 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Supported platforms: Amazon, Flipkart, and more
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
