export function BackButton() {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-[42px] w-full items-center pointer-events-none">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <a
          href="/"
          className="pointer-events-auto text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          ← Back to search
        </a>
      </div>
    </div>
  );
}
