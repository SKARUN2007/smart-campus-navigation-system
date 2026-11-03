import { CampusEdge, CampusNode, CampusLocationItem } from '@/types/campus';
import { defaultCampusGraph, CampusGraph } from './graph';
import { dijkstraShortestPath, DijkstraResult } from './dijkstra';
import { astarShortestPath, AStarResult } from './astar';
import { generateRouteInstructions, StepInstruction } from './routeInstructions';
import {
  calculateWalkingTimeSeconds,
  formatDistance,
  formatWalkingTime,
  estimateCaloriesBurned,
} from './routeMetrics';
import { CAMPUS_LOCATIONS } from '@/data/campusLocations';

export interface CalculatedRoute {
  id: string;
  name: string;
  type: 'SHORTEST' | 'ALTERNATIVE' | 'ACCESSIBLE';
  nodes: CampusNode[];
  edges: CampusEdge[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  formattedDistance: string;
  formattedDuration: string;
  caloriesBurned: number;
  turnsCount: number;
  isAccessible: boolean;
  instructions: StepInstruction[];
  summary: string;
}

export interface RouteSearchResponse {
  success: boolean;
  message?: string;
  error?: string;
  startLocation: CampusLocationItem | null;
  destinationLocation: CampusLocationItem | null;
  routes: CalculatedRoute[];
  activeRouteIndex: number;
  comparison?: {
    dijkstraDistance: number;
    dijkstraTimeMs: number;
    astarDistance: number;
    astarTimeMs: number;
    astarVisitedNodes: number;
    dijkstraVisitedNodes: number;
  };
}

export class RouteService {
  private graph: CampusGraph;

  constructor(graph: CampusGraph = defaultCampusGraph) {
    this.graph = graph;
  }

  public findRoutes(params: {
    startQuery: string;
    destinationQuery: string;
    preferAccessible?: boolean;
  }): RouteSearchResponse {
    const { startQuery, destinationQuery, preferAccessible = false } = params;

    // 1. Validation checks
    if (!startQuery?.trim() || !destinationQuery?.trim()) {
      return {
        success: false,
        error: 'Please choose both a starting location and a destination.',
        startLocation: null,
        destinationLocation: null,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    const startLoc = this.resolveLocation(startQuery);
    const destLoc = this.resolveLocation(destinationQuery);

    if (!startLoc) {
      return {
        success: false,
        error: `Could not identify starting location: "${startQuery}". Please select a valid campus location.`,
        startLocation: null,
        destinationLocation: null,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    if (!destLoc) {
      return {
        success: false,
        error: `Could not identify destination: "${destinationQuery}". Please select a valid campus location.`,
        startLocation: startLoc,
        destinationLocation: null,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    // 2. Same location check
    if (startLoc.id === destLoc.id) {
      return {
        success: false,
        error: 'Starting location and destination are the same. Please choose a different destination.',
        startLocation: startLoc,
        destinationLocation: destLoc,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    // 3. Resolve Graph Nodes
    const startNode = this.graph.resolveNodeForLocation(startLoc.id);
    const targetNode = this.graph.resolveNodeForLocation(destLoc.id);

    if (!startNode || !targetNode) {
      return {
        success: false,
        error: 'Campus navigation waypoints could not be determined for these locations.',
        startLocation: startLoc,
        destinationLocation: destLoc,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    // 4. Compute Route 1 — Shortest Route (Dijkstra)
    const shortestDijkstra = dijkstraShortestPath(
      this.graph,
      startNode.id,
      targetNode.id,
      { requireAccessible: preferAccessible }
    );

    // Run A* for validation and algorithm comparison
    const astarResult = astarShortestPath(
      this.graph,
      startNode.id,
      targetNode.id,
      { requireAccessible: preferAccessible }
    );

    if (!shortestDijkstra.found) {
      return {
        success: false,
        error: preferAccessible
          ? `No wheelchair-accessible walking route found between ${startLoc.name} and ${destLoc.name}.`
          : `No connected walking path found between ${startLoc.name} and ${destLoc.name}.`,
        startLocation: startLoc,
        destinationLocation: destLoc,
        routes: [],
        activeRouteIndex: 0,
      };
    }

    const shortestRoute = this.buildCalculatedRoute(
      'route-shortest',
      preferAccessible ? 'Wheelchair Accessible Route' : 'Shortest Route',
      preferAccessible ? 'ACCESSIBLE' : 'SHORTEST',
      shortestDijkstra,
      startLoc.name,
      destLoc.name
    );

    const routes: CalculatedRoute[] = [shortestRoute];

    // 5. Compute Route 2 — Alternative Route
    // Find alternative path by penalizing the primary edges from the shortest path
    if (shortestDijkstra.pathEdges.length > 1) {
      const penalizedEdges = new Map<string, number>();
      for (const e of shortestDijkstra.pathEdges) {
        penalizedEdges.set(e.id, 2.2); // 2.2x penalty to force diverse path exploration
      }

      const altDijkstra = dijkstraShortestPath(
        this.graph,
        startNode.id,
        targetNode.id,
        {
          requireAccessible: preferAccessible,
          penalizedEdgeIds: penalizedEdges,
        }
      );

      // Verify that the alternative route is physically distinct
      if (altDijkstra.found) {
        const isIdentical =
          altDijkstra.pathNodes.length === shortestDijkstra.pathNodes.length &&
          altDijkstra.pathNodes.every(
            (node, idx) => node.id === shortestDijkstra.pathNodes[idx].id
          );

        if (!isIdentical) {
          const altRoute = this.buildCalculatedRoute(
            'route-alternative',
            'Alternative Walking Route',
            'ALTERNATIVE',
            altDijkstra,
            startLoc.name,
            destLoc.name
          );
          routes.push(altRoute);
        }
      }
    }

    // 6. Compute Route 3 — Dedicated Accessible Route (if not already filtered)
    if (!preferAccessible) {
      const isShortestAccessible = shortestRoute.isAccessible;

      if (!isShortestAccessible) {
        const accessibleDijkstra = dijkstraShortestPath(
          this.graph,
          startNode.id,
          targetNode.id,
          { requireAccessible: true }
        );

        if (accessibleDijkstra.found) {
          const accessibleRoute = this.buildCalculatedRoute(
            'route-accessible',
            'Wheelchair-Friendly Route',
            'ACCESSIBLE',
            accessibleDijkstra,
            startLoc.name,
            destLoc.name
          );
          routes.push(accessibleRoute);
        }
      }
    }

    return {
      success: true,
      startLocation: startLoc,
      destinationLocation: destLoc,
      routes,
      activeRouteIndex: 0,
      comparison: {
        dijkstraDistance: shortestDijkstra.totalDistance,
        dijkstraTimeMs: shortestDijkstra.executionTimeMs,
        dijkstraVisitedNodes: shortestDijkstra.visitedNodesCount,
        astarDistance: astarResult.totalDistance,
        astarTimeMs: astarResult.executionTimeMs,
        astarVisitedNodes: astarResult.visitedNodesCount,
      },
    };
  }

  private buildCalculatedRoute(
    id: string,
    name: string,
    type: 'SHORTEST' | 'ALTERNATIVE' | 'ACCESSIBLE',
    result: DijkstraResult | AStarResult,
    startLocationName: string,
    destinationLocationName: string
  ): CalculatedRoute {
    const totalDist = result.totalDistance;
    const totalDuration = calculateWalkingTimeSeconds(totalDist);
    const instructions = generateRouteInstructions(
      result.pathNodes,
      result.pathEdges,
      startLocationName,
      destinationLocationName
    );

    const isAccessible = result.pathEdges.every((e) => e.accessible);
    const turnsCount = instructions.filter(
      (inst) => inst.action.includes('TURN') || inst.action.includes('SLIGHT')
    ).length;

    // Generate readable summary
    let summary = `Via ${result.pathNodes[1]?.name || 'campus pathway'}`;
    if (result.pathNodes.length > 3) {
      summary += ` and ${result.pathNodes[Math.floor(result.pathNodes.length / 2)].name}`;
    }

    return {
      id,
      name,
      type,
      nodes: result.pathNodes,
      edges: result.pathEdges,
      totalDistanceMeters: totalDist,
      totalDurationSeconds: totalDuration,
      formattedDistance: formatDistance(totalDist),
      formattedDuration: formatWalkingTime(totalDuration),
      caloriesBurned: estimateCaloriesBurned(totalDist),
      turnsCount,
      isAccessible,
      instructions,
      summary,
    };
  }

  private resolveLocation(query: string): CampusLocationItem | null {
    if (!query) return null;
    const q = query.trim().toLowerCase();

    // Exact ID
    const byId = CAMPUS_LOCATIONS.find((l) => l.id.toLowerCase() === q);
    if (byId) return byId;

    // Exact Code
    const byCode = CAMPUS_LOCATIONS.find((l) => l.code.toLowerCase() === q);
    if (byCode) return byCode;

    // Exact Name
    const byName = CAMPUS_LOCATIONS.find((l) => l.name.toLowerCase() === q);
    if (byName) return byName;

    // Substring Name match
    const partialName = CAMPUS_LOCATIONS.find((l) =>
      l.name.toLowerCase().includes(q)
    );
    if (partialName) return partialName;

    // Substring Tag match
    const tagMatch = CAMPUS_LOCATIONS.find((l) =>
      l.tags.some((t) => t.toLowerCase().includes(q))
    );
    if (tagMatch) return tagMatch;

    return null;
  }
}

export const defaultRouteService = new RouteService();
