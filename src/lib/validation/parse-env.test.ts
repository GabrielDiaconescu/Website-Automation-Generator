import { describe, expect, it } from "vitest";
import { z } from "zod";

import { EnvValidationError, parseEnv } from "@/lib/validation/parse-env";

const schema = z.object({
  REQUIRED_URL: z.url(),
  WITH_DEFAULT: z.string().default("fallback"),
});

describe("parseEnv", () => {
  it("returns parsed values and applies defaults", () => {
    const result = parseEnv(
      schema,
      { REQUIRED_URL: "https://example.com", WITH_DEFAULT: undefined },
      "server",
    );

    expect(result.REQUIRED_URL).toBe("https://example.com");
    expect(result.WITH_DEFAULT).toBe("fallback");
  });

  it("throws listing every invalid key", () => {
    expect(() =>
      parseEnv(schema, { REQUIRED_URL: undefined }, "server"),
    ).toThrow(EnvValidationError);

    try {
      parseEnv(schema, { REQUIRED_URL: "not-a-url" }, "client");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      expect((error as EnvValidationError).scope).toBe("client");
      expect((error as EnvValidationError).invalidKeys).toEqual([
        "REQUIRED_URL",
      ]);
    }
  });

  it("never includes the offending value in the message", () => {
    try {
      parseEnv(
        z.object({ SECRET_TOKEN: z.url() }),
        { SECRET_TOKEN: "sk-live-should-not-leak" },
        "server",
      );
      expect.unreachable("parseEnv should have thrown");
    } catch (error) {
      expect((error as Error).message).not.toContain("sk-live-should-not-leak");
    }
  });
});
