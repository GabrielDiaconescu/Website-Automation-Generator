import { describe, expect, it } from "vitest";

import { AppError } from "@/lib/errors";
import { createLogger, redact, type LogRecord } from "@/lib/logger";

function collect() {
  const records: LogRecord[] = [];
  return { records, sink: (record: LogRecord) => records.push(record) };
}

function only(records: LogRecord[]): LogRecord {
  expect(records).toHaveLength(1);
  const [record] = records;
  if (!record) {
    throw new Error("expected exactly one log record");
  }
  return record;
}

describe("redact", () => {
  it("masks sensitive keys regardless of casing or separators", () => {
    const result = redact({
      email: "user@example.com",
      password: "hunter2",
      SUPABASE_SERVICE_ROLE_KEY: "service-role",
      stripeSecretKey: "sk_live_1",
      anthropicApiKey: "sk-ant-1",
      nested: { authorization: "Bearer abc", plan: "starter" },
    }) as Record<string, unknown>;

    expect(result.email).toBe("user@example.com");
    expect(result.password).toBe("[redacted]");
    expect(result.SUPABASE_SERVICE_ROLE_KEY).toBe("[redacted]");
    expect(result.stripeSecretKey).toBe("[redacted]");
    expect(result.anthropicApiKey).toBe("[redacted]");
    expect(result.nested).toEqual({
      authorization: "[redacted]",
      plan: "starter",
    });
  });
});

describe("createLogger", () => {
  it("drops records below the configured level", () => {
    const { records, sink } = collect();
    const logger = createLogger({ level: "warn", sink });

    logger.debug("ignored");
    logger.info("ignored");
    logger.warn("kept");

    expect(records.map((record) => record.event)).toEqual(["kept"]);
  });

  it("emits structured records with bindings merged in", () => {
    const { records, sink } = collect();
    const logger = createLogger({ level: "info", sink }).child({
      organizationId: "org_1",
    });

    logger.info("lead_created", { leadId: "lead_1" });

    const record = only(records);
    expect(record).toMatchObject({
      level: "info",
      event: "lead_created",
      organizationId: "org_1",
      leadId: "lead_1",
    });
    expect(typeof record.timestamp).toBe("string");
  });

  it("records the error code and context when logging an AppError", () => {
    const { records, sink } = collect();
    const logger = createLogger({ level: "error", sink });

    logger.error(
      "publish_failed",
      new AppError("conflict", {
        message: "site already published",
        context: { siteId: "site_1" },
      }),
    );

    expect(only(records)).toMatchObject({
      errorCode: "conflict",
      errorMessage: "site already published",
      errorContext: { siteId: "site_1" },
    });
  });

  it("redacts sensitive context before it reaches the sink", () => {
    const { records, sink } = collect();
    const logger = createLogger({ level: "info", sink });

    logger.info("webhook_received", { signature: "t=1,v1=abc" });

    expect(only(records).signature).toBe("[redacted]");
  });
});
