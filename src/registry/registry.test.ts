import { describe, expect, it } from "vitest";

import { AppError } from "@/lib/errors";
import { createRegistry } from "@/registry/registry";

type Thing = { id: string; label: string };

describe("createRegistry", () => {
  it("stores and returns entries in registration order", () => {
    const registry = createRegistry<Thing>("thing");
    registry.register({ id: "b", label: "B" });
    registry.register({ id: "a", label: "A" });

    expect(registry.ids()).toEqual(["b", "a"]);
    expect(registry.get("a")).toEqual({ id: "a", label: "A" });
    expect(registry.has("a")).toBe(true);
    expect(registry.has("missing")).toBe(false);
  });

  it("refuses a duplicate id instead of shadowing the first entry", () => {
    const registry = createRegistry<Thing>("thing");
    registry.register({ id: "a", label: "first" });

    expect(() => registry.register({ id: "a", label: "second" })).toThrow(
      "Duplicate thing registered: a",
    );
    expect(registry.require("a").label).toBe("first");
  });

  it("require throws a not_found AppError naming the kind and id", () => {
    const registry = createRegistry<Thing>("thing");

    try {
      registry.require("nope");
      expect.unreachable("require should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe("not_found");
      expect((error as AppError).context).toEqual({
        kind: "thing",
        id: "nope",
      });
    }
  });

  it("get returns undefined rather than throwing", () => {
    const registry = createRegistry<Thing>("thing");
    expect(registry.get("nope")).toBeUndefined();
  });
});
