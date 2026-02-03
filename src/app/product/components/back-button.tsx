export function BackButton() {
  return (
    <div className="flex items-center gap-4">
      <a
        href="/"
        className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
      >
        ← Back to search
      </a>
    </div>
  );
}
