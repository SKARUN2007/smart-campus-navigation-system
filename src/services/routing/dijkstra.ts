import { CampusEdge, CampusNode } from '@/types/campus';
import { CampusGraph } from './graph';

export interface DijkstraResult {
  found: boolean;
  pathNodes: CampusNode[];
  pathEdges: CampusEdge[];
  totalDistance: number;
  visitedNodesCount: number;
  executionTimeMs: number;
}

export interface DijkstraOptions {
  requireAccessible?: boolean;
  excludedEdgeIds?: Set<string>;
  penalizedEdgeIds?: Map<string, number>;
}

export function dijkstraShortestPath(
  graph: CampusGraph,
  startNodeId: string,
  targetNodeId: string,
  options: DijkstraOptions = {}
): DijkstraResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // Validate start and end nodes
  const startNode = graph.getNode(startNodeId);
  const targetNode = graph.getNode(targetNodeId);

  if (!startNode || !targetNode) {
    return {
      found: false,
      pathNodes: [],
      pathEdges: [],
      totalDistance: 0,
      visitedNodesCount: 0,
      executionTimeMs: 0,
    };
  }

  // Trivial same node check
  if (startNodeId === targetNodeId) {
    return {
      found: true,
      pathNodes: [startNode],
      pathEdges: [],
      totalDistance: 0,
      visitedNodesCount: 1,
      executionTimeMs: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime,
    };
  }

  const distances = new Map<string, number>();
  const previous = new Map<string, { nodeId: string; edge: CampusEdge }>();
  const unvisited = new Set<string>();
  const visited = new Set<string>();

  // Initialize
  for (const nodeId of graph.nodes.keys()) {
    distances.set(nodeId, Infinity);
    unvisited.add(nodeId);
  }
  distances.set(startNodeId, 0);

  while (unvisited.size > 0) {
    // Pick unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const nodeId of unvisited) {
      const dist = distances.get(nodeId)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentId = nodeId;
      }
    }

    if (currentId === null || minDistance === Infinity) {
      // Remaining unvisited nodes are unreachable
      break;
    }

    // If destination reached
    if (currentId === targetNodeId) {
      break;
    }

    unvisited.delete(currentId);
    visited.add(currentId);

    // Examine neighbors
    const neighbors = graph.getNeighbors(currentId, options);
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.nodeId)) continue;

      const alt = distances.get(currentId)! + neighbor.distance;
      if (alt < distances.get(neighbor.nodeId)!) {
        distances.set(neighbor.nodeId, alt);
        previous.set(neighbor.nodeId, {
          nodeId: currentId,
          edge: neighbor.edge,
        });
      }
    }
  }

  // Reconstruct path
  if (!previous.has(targetNodeId)) {
    return {
      found: false,
      pathNodes: [],
      pathEdges: [],
      totalDistance: 0,
      visitedNodesCount: visited.size,
      executionTimeMs: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime,
    };
  }

  const pathNodes: CampusNode[] = [];
  const pathEdges: CampusEdge[] = [];
  let curr = targetNodeId;
  let accumulatedRealDistance = 0;

  while (curr !== startNodeId) {
    const node = graph.getNode(curr);
    if (node) pathNodes.unshift(node);

    const prevInfo = previous.get(curr);
    if (!prevInfo) break;

    pathEdges.unshift(prevInfo.edge);
    accumulatedRealDistance += prevInfo.edge.distance;
    curr = prevInfo.nodeId;
  }

  pathNodes.unshift(startNode);

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  return {
    found: true,
    pathNodes,
    pathEdges,
    totalDistance: Math.round(accumulatedRealDistance),
    visitedNodesCount: visited.size,
    executionTimeMs: Math.max(0.1, Number((endTime - startTime).toFixed(2))),
  };
}
