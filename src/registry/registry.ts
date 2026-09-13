import { AppError } from "@/lib/errors";

export type RegistryEntry = { readonly id: string };

export type Registry<T extends RegistryEntry> = {
  register(entry: T): void;
  get(id: string): T | undefined;
  require(id: string): T;
  has(id: string): boolean;
  list(): readonly T[];
  ids(): readonly string[];
};

/**
 * Backs the business type, feature and template registries (rules 44-46).
 * Registration happens at module load, so a duplicate id is a programming
 * error that must surface immediately rather than silently shadow an entry.
 */
export function createRegistry<T extends RegistryEntry>(
  kind: string,
): Registry<T> {
  const entries = new Map<string, T>();

  return {
    register(entry) {
      if (entries.has(entry.id)) {
        throw new Error(`Duplicate ${kind} registered: ${entry.id}`);
      }
      entries.set(entry.id, entry);
    },

    get(id) {
      return entries.get(id);
    },

    require(id) {
      const entry = entries.get(id);
      if (!entry) {
        throw new AppError("not_found", {
          message: `Unknown ${kind}: ${id}`,
          context: { kind, id },
        });
      }
      return entry;
    },

    has(id) {
      return entries.has(id);
    },

    // Insertion order, which is the order the definitions are written in.
    list() {
      return [...entries.values()];
    },

    ids() {
      return [...entries.keys()];
    },
  };
}
