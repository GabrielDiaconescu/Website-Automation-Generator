"use client";

import { Button } from "@/components/ui/button";

// Server errors reach the client stripped of their detail in production; the
// digest is the only handle that ties a user report back to the server logs.
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-sm text-pretty text-muted-foreground">
        The page could not be loaded. Please try again.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground">
          Request ID: {error.digest}
        </p>
      )}
      <div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
