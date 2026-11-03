import { CampusEdge, CampusNode } from '@/types/campus';
import { CampusGraph } from './graph';

export interface AStarResult {
  found: boolean;
  pathNodes: CampusNode[];
  pathEdges: CampusEdge[];
  totalDistance: number;
  visitedNodesCount: number;
  executionTimeMs: number;
}

export interface AStarOptions {
  requireAccessible?: boolean;
  excludedEdgeIds?: Set<string>;
}

// Admissible heuristic: Euclidean distance scaled so it never overestimates real path distance
function euclideanHeuristic(nodeA: CampusNode, nodeB: CampusNode): number {
  const dx = nodeA.x - nodeB.x;
  const dy = nodeA.y - nodeB.y;
  // Conservative scale factor so h(n) <= true distance
  return Math.hypot(dx, dy) * 0.3;
}

export function astarShortestPath(
  graph: CampusGraph,
  startNodeId: string,
  targetNodeId: string,
  options: AStarOptions = {}
): AStarResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

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

  const openSet = new Set<string>([startNodeId]);
  const closedSet = new Set<string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { nodeId: string; edge: CampusEdge }>();

  for (const nodeId of graph.nodes.keys()) {
    gScore.set(nodeId, Infinity);
    fScore.set(nodeId, Infinity);
  }

  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, euclideanHeuristic(startNode, targetNode));

  while (openSet.size > 0) {
    // Node in openSet with lowest fScore
    let currentId: string | null = null;
    let lowestF = Infinity;

    for (const nodeId of openSet) {
      const score = fScore.get(nodeId)!;
      if (score < lowestF) {
        lowestF = score;
        currentId = nodeId;
      }
    }

    if (currentId === null) break;

    if (currentId === targetNodeId) {
      // Destination reached
      break;
    }

    openSet.delete(currentId);
    closedSet.add(currentId);

    const currentNode = graph.getNode(currentId)!;
    const neighbors = graph.getNeighbors(currentId, options);

    for (const neighbor of neighbors) {
      if (closedSet.has(neighbor.nodeId)) continue;

      const tentativeG = gScore.get(currentId)! + neighbor.distance;

      if (tentativeG < gScore.get(neighbor.nodeId)!) {
        const neighborNode = graph.getNode(neighbor.nodeId)!;
        cameFrom.set(neighbor.nodeId, {
          nodeId: currentId,
          edge: neighbor.edge,
        });

        gScore.set(neighbor.nodeId, tentativeG);
        fScore.set(
          neighbor.nodeId,
          tentativeG + euclideanHeuristic(neighborNode, targetNode)
        );

        if (!openSet.has(neighbor.nodeId)) {
          openSet.add(neighbor.nodeId);
        }
      }
    }
  }

  if (!cameFrom.has(targetNodeId)) {
    return {
      found: false,
      pathNodes: [],
      pathEdges: [],
      totalDistance: 0,
      visitedNodesCount: closedSet.size,
      executionTimeMs: (typeof performance !== 'undefined' ? performance.now() : Date.now()) - startTime,
    };
  }

  // Reconstruct path
  const pathNodes: CampusNode[] = [];
  const pathEdges: CampusEdge[] = [];
  let curr = targetNodeId;
  let realDistance = 0;

  while (curr !== startNodeId) {
    const node = graph.getNode(curr);
    if (node) pathNodes.unshift(node);

    const prev = cameFrom.get(curr);
    if (!prev) break;

    pathEdges.unshift(prev.edge);
    realDistance += prev.edge.distance;
    curr = prev.nodeId;
  }

  pathNodes.unshift(startNode);

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  return {
    found: true,
    pathNodes,
    pathEdges,
    totalDistance: Math.round(realDistance),
    visitedNodesCount: closedSet.size,
    executionTimeMs: Math.max(0.1, Number((endTime - startTime).toFixed(2))),
  };
}

