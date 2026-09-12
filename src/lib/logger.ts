import { serverEnv } from "@/config/env.server";
import { isAppError, toAppError } from "@/lib/errors";

export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const REDACTED = "[redacted]";

// Matched against key names lowercased with separators stripped, so
// `stripeSecretKey` and `STRIPE_SECRET_KEY` normalize to the same string.
const SENSITIVE_KEY_PATTERNS = [
  "password",
  "secret",
  "token",
  "authorization",
  "cookie",
  "session",
  "credential",
  "signature",
];

function isSensitiveKey(key: string): boolean {
  const normalized = key.toLowerCase().replace(/[^a-z0-9]/g, "");
  // Any `*key` is redacted rather than enumerated: over-redacting a log line
  // costs nothing, while one unlisted credential name costs a leaked secret.
  return (
    normalized.endsWith("key") ||
    SENSITIVE_KEY_PATTERNS.some((pattern) => normalized.includes(pattern))
  );
}

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6 || value === null || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redact(item, depth + 1));
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => [
      key,
      isSensitiveKey(key) ? REDACTED : redact(entry, depth + 1),
    ]),
  );
}

export type LogContext = Record<string, unknown>;

export type LogRecord = {
  level: LogLevel;
  event: string;
  timestamp: string;
  [key: string]: unknown;
};

export type Logger = {
  debug(event: string, context?: LogContext): void;
  info(event: string, context?: LogContext): void;
  warn(event: string, context?: LogContext): void;
  error(event: string, error?: unknown, context?: LogContext): void;
  child(bindings: LogContext): Logger;
};

type LoggerOptions = {
  level: LogLevel;
  bindings?: LogContext;
  sink?: (record: LogRecord) => void;
};

function defaultSink(record: LogRecord): void {
  const line = JSON.stringify(record);
  if (record.level === "error" || record.level === "warn") {
    console.error(line);
    return;
  }
  console.log(line);
}

export function createLogger({
  level,
  bindings = {},
  sink = defaultSink,
}: LoggerOptions): Logger {
  const threshold = LEVEL_ORDER[level];

  function write(
    recordLevel: LogLevel,
    event: string,
    context?: LogContext,
  ): void {
    if (LEVEL_ORDER[recordLevel] < threshold) {
      return;
    }

    sink({
      level: recordLevel,
      event,
      timestamp: new Date().toISOString(),
      ...(redact({ ...bindings, ...context }) as LogContext),
    });
  }

  return {
    debug: (event, context) => write("debug", event, context),
    info: (event, context) => write("info", event, context),
    warn: (event, context) => write("warn", event, context),
    error: (event, error, context) => {
      const appError = error === undefined ? undefined : toAppError(error);
      write("error", event, {
        ...context,
        ...(appError && {
          errorCode: appError.code,
          errorMessage: appError.message,
          ...(isAppError(error) && error.context
            ? { errorContext: error.context }
            : {}),
          stack: appError.stack,
        }),
      });
    },
    child: (childBindings) =>
      createLogger({
        level,
        bindings: { ...bindings, ...childBindings },
        sink,
      }),
  };
}

export const logger = createLogger({ level: serverEnv.LOG_LEVEL });
