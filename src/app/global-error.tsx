"use client";

import "./globals.css";

// Replaces the root layout when it is the layout itself that threw, so it must
// render its own document shell and cannot rely on any provider above it.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-16">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            The application could not start. Please try again.
          </p>
          {error.digest && (
            <p className="font-mono text-xs text-muted-foreground">
              Request ID: {error.digest}
            </p>
          )}
          <div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground outline-none hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
