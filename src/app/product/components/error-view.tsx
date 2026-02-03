import { PageBackground, PageContainer } from "@/components/ui/layouts";

export function ErrorView({ message }: { message: string }) {
  return (
    <PageBackground>
      <PageContainer>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
            Error
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 rounded-lg bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-all"
          >
            Try Another Product
          </a>
        </div>
      </PageContainer>
    </PageBackground>
  );
}
