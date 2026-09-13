import {
  resolveFeatureSelection,
  type FeatureId,
  type FeatureSelection,
} from "@/registry/features";
import { createRegistry } from "@/registry/registry";

// The full set from the product plan. Categories exist up front so adding a
// business type later is data, not a change to the engine (rule 3).
export const BUSINESS_CATEGORIES = [
  "auto",
  "medical",
  "professional",
  "beauty",
  "fitness",
  "hospitality",
  "property",
  "other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export type BusinessTypeDefinition = {
  readonly id: string;
  readonly name: string;
  readonly category: BusinessCategory;
  /**
   * What the configurator ticks by default for this trade. Dependencies are
   * not listed here; they are resolved through the feature registry.
   */
  readonly recommendedFeatures: readonly FeatureId[];
};

const registry = createRegistry<BusinessTypeDefinition>("business type");

export function registerBusinessType(definition: BusinessTypeDefinition): void {
  registry.register(definition);
}

registerBusinessType({
  id: "auto_service",
  name: "Auto service",
  category: "auto",
  recommendedFeatures: ["lead_form", "booking", "whatsapp", "crm", "chatbot"],
});

registerBusinessType({
  id: "car_wash",
  name: "Car wash",
  category: "auto",
  recommendedFeatures: ["lead_form", "booking", "whatsapp", "crm"],
});

registerBusinessType({
  id: "veterinary",
  name: "Veterinary clinic",
  category: "medical",
  recommendedFeatures: ["lead_form", "booking", "whatsapp", "crm", "chatbot"],
});

registerBusinessType({
  id: "lawyer",
  name: "Law firm",
  category: "professional",
  recommendedFeatures: ["lead_form", "booking", "crm", "email"],
});

registerBusinessType({
  id: "salon",
  name: "Beauty salon",
  category: "beauty",
  recommendedFeatures: ["lead_form", "booking", "whatsapp", "crm", "reviews"],
});

export const businessTypeRegistry = registry;

/**
 * The default feature set for a trade, already expanded over dependencies, so
 * the onboarding step can present something that would actually run.
 */
export function recommendedSelectionFor(
  businessTypeId: string,
): FeatureSelection {
  const businessType = registry.require(businessTypeId);
  return resolveFeatureSelection(businessType.recommendedFeatures);
}

export function businessTypesByCategory(): ReadonlyMap<
  BusinessCategory,
  readonly BusinessTypeDefinition[]
> {
  const grouped = new Map<BusinessCategory, BusinessTypeDefinition[]>();

  for (const businessType of registry.list()) {
    const bucket = grouped.get(businessType.category);
    if (bucket) {
      bucket.push(businessType);
    } else {
      grouped.set(businessType.category, [businessType]);
    }
  }

  return grouped;
}
