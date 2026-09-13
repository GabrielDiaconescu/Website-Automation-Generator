export type DependencyResolution<Id extends string> = {
  /** The selection plus everything it transitively requires. */
  resolved: readonly Id[];
  /** Entries that were not selected but had to be added, and what pulled them in. */
  added: readonly { id: Id; requiredBy: Id }[];
};

/**
 * Expands a selection over a dependency graph.
 *
 * Kept free of any registry so it can be exercised against synthetic graphs,
 * including cyclic ones: the visited set makes traversal terminate whatever
 * shape the graph has.
 */
export function resolveDependencies<Id extends string>(
  selected: readonly Id[],
  dependenciesOf: (id: Id) => readonly Id[],
): DependencyResolution<Id> {
  const selectedSet = new Set<Id>(selected);
  const resolved = new Set<Id>();
  const addedIds = new Set<Id>();
  const added: { id: Id; requiredBy: Id }[] = [];
  const queue: Id[] = [...selectedSet];

  while (queue.length > 0) {
    const current = queue.shift() as Id;
    if (resolved.has(current)) {
      continue;
    }
    resolved.add(current);

    for (const dependency of dependenciesOf(current)) {
      // Reported once, attributed to whatever pulled it in first: a list that
      // repeats the same entry reads as noise in the configurator.
      if (!selectedSet.has(dependency) && !addedIds.has(dependency)) {
        addedIds.add(dependency);
        added.push({ id: dependency, requiredBy: current });
      }
      queue.push(dependency);
    }
  }

  return { resolved: [...resolved], added };
}
