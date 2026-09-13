import { describe, expect, it } from "vitest";

import {
  BUSINESS_CATEGORIES,
  businessTypeRegistry,
  businessTypesByCategory,
  recommendedSelectionFor,
} from "@/registry/business-types";
import { featureRegistry } from "@/registry/features";

describe("business type registry", () => {
  it("seeds the trades the phase calls for", () => {
    expect([...businessTypeRegistry.ids()].sort()).toEqual([
      "auto_service",
      "car_wash",
      "lawyer",
      "salon",
      "veterinary",
    ]);
  });

  it("only recommends features that are registered", () => {
    for (const businessType of businessTypeRegistry.list()) {
      for (const feature of businessType.recommendedFeatures) {
        expect(
          featureRegistry.has(feature),
          `${businessType.id} recommends unregistered ${feature}`,
        ).toBe(true);
      }
    }
  });

  it("places every business type in a known category", () => {
    for (const businessType of businessTypeRegistry.list()) {
      expect(BUSINESS_CATEGORIES).toContain(businessType.category);
    }
  });

  it("recommends at least one way to capture a customer", () => {
    for (const businessType of businessTypeRegistry.list()) {
      const { enabled } = recommendedSelectionFor(businessType.id);
      expect(
        enabled.includes("lead_form") || enabled.includes("booking"),
        `${businessType.id} has no lead capture`,
      ).toBe(true);
    }
  });
});

describe("recommendedSelectionFor", () => {
  it("expands a recommendation over its dependencies", () => {
    const selection = recommendedSelectionFor("auto_service");

    // booking pulls calendar, chatbot pulls ai; neither is recommended directly.
    expect(selection.enabled).toContain("calendar");
    expect(selection.enabled).toContain("ai");
    expect(selection.added.map((entry) => entry.id).sort()).toEqual([
      "ai",
      "calendar",
    ]);
  });

  it("pulls automation in behind review requests for a salon", () => {
    const selection = recommendedSelectionFor("salon");
    expect(selection.enabled).toContain("automation");
  });

  it("rejects an unknown business type", () => {
    expect(() => recommendedSelectionFor("bakery")).toThrow(
      /Unknown business type/,
    );
  });
});

describe("businessTypesByCategory", () => {
  it("groups the two auto trades together", () => {
    const grouped = businessTypesByCategory();
    const auto = grouped.get("auto") ?? [];

    expect(auto.map((businessType) => businessType.id).sort()).toEqual([
      "auto_service",
      "car_wash",
    ]);
  });

  it("omits categories that have no business type yet", () => {
    const grouped = businessTypesByCategory();
    expect(grouped.has("fitness")).toBe(false);
  });
});
