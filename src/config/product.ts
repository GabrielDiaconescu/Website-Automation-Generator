export const product = {
  name: "Website + Automation Generator",
  tagline: "Website, AI, automations and CRM for local businesses.",
  description:
    "A multi-tenant SaaS platform that generates a business website, its content, lead capture, CRM, AI assistant and follow-up automations from a single configuration.",
} as const;

export type DeliveryStatus = "done" | "in_progress" | "blocked" | "planned";

export type DeliveryPhase = {
  id: string;
  name: string;
  status: DeliveryStatus;
  summary: string;
};

/**
 * Delivery state of the phased plan in MASTER_PROMPT.md. Kept in code so the
 * shell never claims a capability the codebase does not have yet.
 */
export const deliveryPhases: readonly DeliveryPhase[] = [
  {
    id: "faza-1",
    name: "Foundation",
    status: "done",
    summary:
      "Next.js, TypeScript strict, Tailwind, design system tokens, validated env, structured errors and logging.",
  },
  {
    id: "faza-2",
    name: "Database",
    status: "in_progress",
    summary:
      "Tenancy schema, row level security and seed data, verified against PostgreSQL; awaiting a Supabase project to apply to.",
  },
  {
    id: "faza-3",
    name: "Auth",
    status: "blocked",
    summary:
      "Sign up, sign in, sessions, protected routes. Needs Supabase credentials before it can be built or verified.",
  },
  {
    id: "faza-4",
    name: "Organizations",
    status: "blocked",
    summary:
      "Members, roles, permissions and tenant switching, on top of auth.",
  },
  {
    id: "faza-5",
    name: "Business types",
    status: "done",
    summary:
      "Registry of trades with categories and the feature set each one is configured with by default.",
  },
  {
    id: "faza-6",
    name: "Feature registry",
    status: "done",
    summary:
      "Features and their dependencies, with selection resolution that explains what each choice pulls in.",
  },
];
