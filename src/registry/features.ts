import { resolveDependencies } from "@/registry/dependencies";
import { createRegistry } from "@/registry/registry";

export const FEATURE_IDS = [
  "lead_form",
  "crm",
  "email",
  "calendar",
  "booking",
  "whatsapp",
  "ai",
  "chatbot",
  "ai_whatsapp",
  "automation",
  "reviews",
] as const;

export type FeatureId = (typeof FEATURE_IDS)[number];

export type FeatureDefinition = {
  readonly id: FeatureId;
  readonly name: string;
  readonly description: string;
  /** Features that must be enabled for this one to work (rule 97). */
  readonly dependencies: readonly FeatureId[];
};

const registry = createRegistry<FeatureDefinition>("feature");

export function registerFeature(definition: FeatureDefinition): void {
  registry.register(definition);
}

// Platform UI copy stays English until i18n lands; the content of a generated
// website is written in that business's own locale instead.
registerFeature({
  id: "lead_form",
  name: "Lead form",
  description: "Capture enquiries from the website into a single inbox.",
  dependencies: [],
});

registerFeature({
  id: "crm",
  name: "CRM",
  description: "Track leads and customers through to a booked job.",
  dependencies: [],
});

registerFeature({
  id: "email",
  name: "Email",
  description: "Transactional email for confirmations and follow-ups.",
  dependencies: [],
});

registerFeature({
  id: "calendar",
  name: "Calendar",
  description: "Connect a calendar so availability reflects real bookings.",
  dependencies: [],
});

registerFeature({
  id: "booking",
  name: "Online booking",
  description: "Let customers pick a service and a slot without calling.",
  // Offering slots without a source of availability would double-book.
  dependencies: ["calendar"],
});

registerFeature({
  id: "whatsapp",
  name: "WhatsApp",
  description: "Receive and answer customer messages on WhatsApp.",
  dependencies: [],
});

registerFeature({
  id: "ai",
  name: "AI assistant",
  description:
    "Generate website content and answer questions about the business.",
  dependencies: [],
});

registerFeature({
  id: "chatbot",
  name: "Website chatbot",
  description: "An assistant on the website that answers from business data.",
  dependencies: ["ai"],
});

registerFeature({
  id: "ai_whatsapp",
  name: "AI on WhatsApp",
  description: "The assistant replies to WhatsApp messages automatically.",
  dependencies: ["ai", "whatsapp"],
});

registerFeature({
  id: "automation",
  name: "Automations",
  description: "Trigger follow-ups and reminders from what happens in the CRM.",
  // Every trigger fires off a lead, customer or appointment record.
  dependencies: ["crm"],
});

registerFeature({
  id: "reviews",
  name: "Review requests",
  description: "Ask for a review once a job is completed.",
  dependencies: ["automation"],
});

export const featureRegistry = registry;

export type FeatureSelection = {
  /** Everything that will be enabled, selection plus dependencies. */
  readonly enabled: readonly FeatureId[];
  /** Dependencies that were added on the user's behalf, and why. */
  readonly added: readonly { id: FeatureId; requiredBy: FeatureId }[];
};

/**
 * Expands a chosen set of features to one that can actually run.
 *
 * The configurator shows `added` so a user is never silently billed for or
 * surprised by something they did not tick (rule 97).
 */
export function resolveFeatureSelection(
  selected: readonly FeatureId[],
): FeatureSelection {
  const { resolved, added } = resolveDependencies(
    selected,
    (id) => registry.require(id).dependencies,
  );

  return { enabled: resolved, added };
}

/** One line per added dependency, ready to render. */
export function explainAddedFeatures(
  selection: FeatureSelection,
): readonly string[] {
  return selection.added.map(
    ({ id, requiredBy }) =>
      `${registry.require(requiredBy).name} requires ${registry.require(id).name}.`,
  );
}
