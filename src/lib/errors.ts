export type ErrorCode =
  | "validation_error"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "internal_error";

type ErrorDefinition = {
  status: number;
  userMessage: string;
};

// userMessage is the only part ever shown to an end user: no stack traces, no
// provider names, no identifiers of internal systems.
const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDefinition> = {
  validation_error: {
    status: 400,
    userMessage: "Some of the information provided is not valid.",
  },
  unauthorized: {
    status: 401,
    userMessage: "You need to sign in to continue.",
  },
  forbidden: {
    status: 403,
    userMessage: "You do not have access to this resource.",
  },
  not_found: {
    status: 404,
    userMessage: "We could not find what you were looking for.",
  },
  conflict: {
    status: 409,
    userMessage: "This action conflicts with the current state.",
  },
  rate_limited: {
    status: 429,
    userMessage: "Too many requests. Please wait a moment and try again.",
  },
  internal_error: {
    status: 500,
    userMessage: "Something went wrong. Please try again.",
  },
};

export type AppErrorOptions = {
  /** Developer-facing detail. Logged, never rendered. */
  message?: string;
  /** Overrides the default user-facing copy for this code. */
  userMessage?: string;
  /** Structured detail for logs, e.g. which field failed. */
  context?: Record<string, unknown>;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly userMessage: string;
  readonly context?: Record<string, unknown>;

  constructor(code: ErrorCode, options: AppErrorOptions = {}) {
    const definition = ERROR_DEFINITIONS[code];
    super(options.message ?? definition.userMessage, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = definition.status;
    this.userMessage = options.userMessage ?? definition.userMessage;
    this.context = options.context;
  }
}

export function isAppError(value: unknown): value is AppError {
  return value instanceof AppError;
}

/**
 * Normalizes anything thrown into an AppError. Unknown throws collapse to
 * internal_error so no upstream message leaks to the user by accident.
 */
export function toAppError(value: unknown): AppError {
  if (isAppError(value)) {
    return value;
  }

  if (value instanceof Error) {
    return new AppError("internal_error", {
      message: value.message,
      cause: value,
    });
  }

  return new AppError("internal_error", {
    message: "Non-error value thrown",
    context: { thrown: typeof value },
  });
}

export function newRequestId(): string {
  return crypto.randomUUID();
}
