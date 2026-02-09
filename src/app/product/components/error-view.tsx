export function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4">
        <svg
          className="h-10 w-10 text-red-500 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          No Product Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {message}
        </p>
      </div>
      <a
        href="/"
        className="inline-block px-6 py-2.5 rounded-lg bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-all"
      >
        Try Another Product
      </a>
    </div>
  );
}
