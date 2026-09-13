import { describe, expect, it } from "vitest";

import { resolveDependencies } from "@/registry/dependencies";

const graph: Record<string, string[]> = {
  a: ["b"],
  b: ["c"],
  c: [],
  d: ["c"],
  standalone: [],
};

const dependenciesOf = (id: string) => graph[id] ?? [];

describe("resolveDependencies", () => {
  it("pulls in transitive dependencies", () => {
    const { resolved } = resolveDependencies(["a"], dependenciesOf);
    expect([...resolved].sort()).toEqual(["a", "b", "c"]);
  });

  it("reports what was added and what required it", () => {
    const { added } = resolveDependencies(["a"], dependenciesOf);
    expect(added).toEqual([
      { id: "b", requiredBy: "a" },
      { id: "c", requiredBy: "b" },
    ]);
  });

  it("does not report an explicitly selected entry as added", () => {
    const { added } = resolveDependencies(["a", "b", "c"], dependenciesOf);
    expect(added).toEqual([]);
  });

  it("reports a shared dependency once, attributed to the first requirer", () => {
    const { added } = resolveDependencies(["a", "d"], dependenciesOf);
    const cEntries = added.filter((entry) => entry.id === "c");
    expect(cEntries).toHaveLength(1);
  });

  it("deduplicates an entry selected twice", () => {
    const { resolved } = resolveDependencies(
      ["standalone", "standalone"],
      dependenciesOf,
    );
    expect(resolved).toEqual(["standalone"]);
  });

  it("terminates on a cycle", () => {
    const cyclic: Record<string, string[]> = {
      x: ["y"],
      y: ["z"],
      z: ["x"],
    };

    const { resolved } = resolveDependencies<string>(
      ["x"],
      (id) => cyclic[id] ?? [],
    );
    expect([...resolved].sort()).toEqual(["x", "y", "z"]);
  });

  it("returns an empty resolution for an empty selection", () => {
    expect(resolveDependencies([], dependenciesOf)).toEqual({
      resolved: [],
      added: [],
    });
  });
});
