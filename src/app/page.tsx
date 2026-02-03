import { ProductSearchForm } from "@/components/product-search-form";
import { PageBackground } from "@/components/ui/layouts";

export default function Home() {
  return (
    <PageBackground>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-2xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Smart Buy
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
              AI-powered product analysis
            </p>
          </div>

          <ProductSearchForm />

          <div className="pt-8 grid gap-6 md:grid-cols-3 text-left">
            <div className="space-y-2">
              <div className="text-3xl">⚡</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Lightning Fast
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Parallel AI analysis streams results as they're ready
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Comprehensive
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get specs, features, pros, cons, and expert insights
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🔗</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Works Everywhere
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Works with major online retailers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}
