import { Segment } from "../types";

export interface GraphNode {
  id: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  segment: Segment;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function dijkstra(graph: Graph, start: string, goal: string) {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();

  graph.nodes.forEach((node) => {
    distances[node.id] = Number.POSITIVE_INFINITY;
    previous[node.id] = null;
  });

  distances[start] = 0;

  while (visited.size < graph.nodes.length) {
    const current = graph.nodes
      .filter((node) => !visited.has(node.id))
      .reduce((lowest, node) =>
        distances[node.id] < distances[lowest] ? node.id : lowest
      , graph.nodes[0].id);

    if (current === goal) {
      break;
    }

    visited.add(current);

    graph.edges
      .filter((edge) => edge.from === current)
      .forEach((edge) => {
        const alt = distances[current] + edge.weight;
        if (alt < distances[edge.to]) {
          distances[edge.to] = alt;
          previous[edge.to] = current;
        }
      });
  }

  const path: string[] = [];
  let current: string | null = goal;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, distance: distances[goal] };
}
