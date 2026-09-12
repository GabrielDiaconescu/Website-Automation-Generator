import { describe, expect, it } from "vitest";

import { AppError, isAppError, toAppError } from "@/lib/errors";

describe("AppError", () => {
  it("maps a code to its status and user-facing copy", () => {
    const error = new AppError("not_found");

    expect(error.status).toBe(404);
    expect(error.userMessage).toBe(
      "We could not find what you were looking for.",
    );
  });

  it("keeps the developer message separate from the user message", () => {
    const error = new AppError("forbidden", {
      message: "organization_id mismatch for user 42",
      context: { organizationId: "org_1" },
    });

    expect(error.message).toBe("organization_id mismatch for user 42");
    expect(error.userMessage).toBe("You do not have access to this resource.");
    expect(error.context).toEqual({ organizationId: "org_1" });
  });
});

describe("toAppError", () => {
  it("passes AppError through unchanged", () => {
    const original = new AppError("rate_limited");
    expect(toAppError(original)).toBe(original);
  });

  it("collapses unknown errors to internal_error without leaking the message", () => {
    const converted = toAppError(new Error("connection string: postgres://x"));

    expect(isAppError(converted)).toBe(true);
    expect(converted.code).toBe("internal_error");
    expect(converted.userMessage).toBe(
      "Something went wrong. Please try again.",
    );
  });

  it("handles non-error throws", () => {
    const converted = toAppError("boom");

    expect(converted.code).toBe("internal_error");
    expect(converted.context).toEqual({ thrown: "string" });
  });
});
