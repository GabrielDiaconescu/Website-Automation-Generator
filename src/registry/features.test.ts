import { describe, expect, it } from "vitest";

import {
  explainAddedFeatures,
  featureRegistry,
  resolveFeatureSelection,
  FEATURE_IDS,
} from "@/registry/features";

describe("feature registry", () => {
  it("registers every declared feature id exactly once", () => {
    expect([...featureRegistry.ids()].sort()).toEqual([...FEATURE_IDS].sort());
  });

  it("only declares dependencies that are themselves registered", () => {
    for (const feature of featureRegistry.list()) {
      for (const dependency of feature.dependencies) {
        expect(
          featureRegistry.has(dependency),
          `${feature.id} depends on unregistered ${dependency}`,
        ).toBe(true);
      }
    }
  });

  it("declares no feature that depends on itself", () => {
    for (const feature of featureRegistry.list()) {
      expect(feature.dependencies).not.toContain(feature.id);
    }
  });

  it("gives every feature a name and a description", () => {
    for (const feature of featureRegistry.list()) {
      expect(feature.name.length).toBeGreaterThan(0);
      expect(feature.description.length).toBeGreaterThan(0);
    }
  });
});

describe("resolveFeatureSelection", () => {
  it("pulls in both halves of AI on WhatsApp", () => {
    const selection = resolveFeatureSelection(["ai_whatsapp"]);

    expect([...selection.enabled].sort()).toEqual([
      "ai",
      "ai_whatsapp",
      "whatsapp",
    ]);
    expect(selection.added.map((entry) => entry.id).sort()).toEqual([
      "ai",
      "whatsapp",
    ]);
  });

  it("follows a dependency chain two levels deep", () => {
    const selection = resolveFeatureSelection(["reviews"]);

    expect([...selection.enabled].sort()).toEqual([
      "automation",
      "crm",
      "reviews",
    ]);
  });

  it("adds the calendar that online booking needs", () => {
    const selection = resolveFeatureSelection(["booking"]);

    expect(selection.enabled).toContain("calendar");
    expect(selection.added).toEqual([
      { id: "calendar", requiredBy: "booking" },
    ]);
  });

  it("adds nothing when the selection is already complete", () => {
    const selection = resolveFeatureSelection(["calendar", "booking"]);

    expect(selection.added).toEqual([]);
    expect([...selection.enabled].sort()).toEqual(["booking", "calendar"]);
  });

  it("rejects an unknown feature id", () => {
    expect(() =>
      // Only reachable from unvalidated input, which is why it must throw
      // rather than silently drop the value.
      resolveFeatureSelection(["not_a_feature" as never]),
    ).toThrow(/Unknown feature/);
  });

  it("explains each added dependency in product language", () => {
    const selection = resolveFeatureSelection(["ai_whatsapp"]);

    expect(explainAddedFeatures(selection)).toEqual([
      "AI on WhatsApp requires AI assistant.",
      "AI on WhatsApp requires WhatsApp.",
    ]);
  });
});
