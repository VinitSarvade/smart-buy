"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { err, ok, Result } from "neverthrow";

export function ProductURLForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  type ValidationError =
    | { type: "empty" }
    | { type: "relative" }
    | { type: "invalid_domain" }
    | { type: "invalid_format" };

  const validateURL = (input: string): Result<string, ValidationError> => {
    if (!input.trim()) {
      return err({ type: "empty" });
    }

    if (input.startsWith("/") || input.startsWith(".")) {
      return err({ type: "relative" });
    }

    let urlToValidate = input;

    if (!input.startsWith("http://") && !input.startsWith("https://")) {
      urlToValidate = "https://" + input;
    }

    const urlResult = Result.fromThrowable(
      () => new URL(urlToValidate),
      () => ({ type: "invalid_format" as const }),
    )();

    return urlResult.andThen((urlObj) => {
      if (!urlObj.hostname.includes(".")) {
        return err({ type: "invalid_domain" });
      }
      return ok(urlToValidate);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = validateURL(url);

    validation.match(
      (validURL) => {
        setUrl(validURL);
        setIsLoading(true);
        const encodedURL = encodeURIComponent(validURL);
        router.push(`/product?url=${encodedURL}`);
      },
      (err) => {
        switch (err.type) {
          case "empty":
            setError("Please enter a URL");
            break;
          case "relative":
            setError("Please enter a full URL (e.g., https://example.com/product)");
            break;
          case "invalid_domain":
            setError("Please enter a valid domain (e.g., example.com)");
            break;
          case "invalid_format":
            setError("Please enter a valid URL");
            break;
        }
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="https://www.amazon.com/product/..."
          className="w-full px-6 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
          disabled={isLoading}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-left">
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-4 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Analyzing..." : "Analyze Product"}
      </button>
    </form>
  );
}
