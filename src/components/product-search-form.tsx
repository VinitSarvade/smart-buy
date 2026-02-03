"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { validateProductURL } from "@/lib/product-url";

export function ProductSearchForm() {
  const [productURL, setProductURL] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    const validation = validateProductURL(productURL);

    validation.match(
      (validURL) => {
        router.push(`/product?url=${encodeURIComponent(validURL)}`);
      },
      (error) => {
        const errorMessages = {
          missing_url: "Please enter a product URL",
          relative_url: "Please enter a complete URL starting with https://",
          system_path: "Invalid URL",
          invalid_domain: "Invalid domain",
          invalid_protocol: "URL must use http:// or https://",
          invalid_format: "Invalid URL format",
        };
        setUrlError(errorMessages[error.type]);
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={productURL}
          onChange={(e) => setProductURL(e.target.value)}
          placeholder="Paste any product URL from online stores"
          className="flex-1 px-4 py-3 text-base rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoFocus
        />
        <button
          type="submit"
          disabled={!productURL.trim()}
          className="px-8 py-3 rounded-lg bg-linear-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap"
        >
          Analyze
        </button>
      </div>

      {urlError && (
        <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
      )}
    </form>
  );
}
