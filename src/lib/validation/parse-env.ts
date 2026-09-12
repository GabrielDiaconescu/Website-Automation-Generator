import type { z } from "zod";

export class EnvValidationError extends Error {
  constructor(
    readonly scope: string,
    readonly invalidKeys: string[],
    message: string,
  ) {
    super(message);
    this.name = "EnvValidationError";
  }
}

// Reports only variable names and Zod messages — never the values, which would
// leak secrets into logs and CI output.
export function parseEnv<T extends z.ZodType>(
  schema: T,
  raw: Record<string, string | undefined>,
  scope: "server" | "client",
): z.infer<T> {
  const result = schema.safeParse(raw);

  if (result.success) {
    return result.data;
  }

  const invalidKeys = [
    ...new Set(
      result.error.issues.map((issue) => String(issue.path[0] ?? "(root)")),
    ),
  ];
  const details = result.error.issues
    .map(
      (issue) => `  - ${String(issue.path[0] ?? "(root)")}: ${issue.message}`,
    )
    .join("\n");

  throw new EnvValidationError(
    scope,
    invalidKeys,
    `Invalid ${scope} environment variables:\n${details}\n\nCheck .env.example for the expected format.`,
  );
}
