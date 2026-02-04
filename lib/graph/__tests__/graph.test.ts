import { dijkstra } from "../graph";
import type { Graph } from "../graph";

const graph: Graph = {
  nodes: [{ id: "A" }, { id: "B" }, { id: "C" }],
  edges: [
    { from: "A", to: "B", weight: 5, segment: {} as never },
    { from: "B", to: "C", weight: 3, segment: {} as never },
    { from: "A", to: "C", weight: 12, segment: {} as never }
  ]
};

describe("dijkstra", () => {
  it("finds shortest path", () => {
    const result = dijkstra(graph, "A", "C");

    expect(result.path).toEqual(["A", "B", "C"]);
    expect(result.distance).toBe(8);
  });
});
